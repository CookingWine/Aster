using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Aster.Runtime.Configuration;

/// <summary>
/// 本地配置加载器。
/// <para>加载顺序（后加载的覆盖先加载的）：</para>
/// <list type="number">
///   <item>程序目录下的 appsettings.json</item>
///   <item>用户目录下的 appsettings.json（%AppData%\Aster\appsettings.json 等）</item>
///   <item>环境变量（ASTER_ 前缀，双下划线表示层级，如 ASTER_Logging__MinimumLevel=Debug）</item>
///   <item>命令行参数（--Logging:MinimumLevel=Debug 或 --Logging:MinimumLevel Debug）</item>
/// </list>
/// 只依赖 System.Text.Json（框架自带），不需要额外 NuGet 包。
/// </summary>
public static class AppConfigurationLoader
{
    /// <summary>配置文件名。</summary>
    public const string FileName = "appsettings.json";

    /// <summary>环境变量前缀。</summary>
    public const string EnvironmentVariablePrefix = "ASTER_";

    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        ReadCommentHandling = JsonCommentHandling.Skip,
        AllowTrailingCommas = true,
    };

    private static readonly JsonDocumentOptions DocumentOptions = new()
    {
        CommentHandling = JsonCommentHandling.Skip,
        AllowTrailingCommas = true,
    };

    /// <summary>
    /// 加载并合并所有配置源。
    /// </summary>
    /// <param name="args">命令行参数，可传 null。</param>
    /// <exception cref="ConfigurationException">文件缺失（必需时）、JSON 格式错误或校验失败。</exception>
    public static AppConfiguration Load(string[]? args = null)
    {
        var root = new JsonObject();
        var sources = new List<string>();

        foreach (var path in EnumerateFiles())
        {
            if (!File.Exists(path))
                continue;

            Merge(root, ParseFile(path), path);
            sources.Add(path);
        }

        ApplyEnvironmentOverrides(root);
        ApplyCommandLineOverrides(root, args);

        AppConfiguration configuration;
        try
        {
            configuration = root.Deserialize<AppConfiguration>(SerializerOptions) ?? new AppConfiguration();
        }
        catch (JsonException ex)
        {
            throw new ConfigurationException($"配置内容无法绑定到 AppConfiguration：{ex.Message}", ex);
        }

        foreach (var source in sources)
            configuration.AddSource(source);

        configuration.Validate();
        return configuration;
    }

    /// <summary>按优先级从低到高返回候选配置文件路径。</summary>
    private static IEnumerable<string> EnumerateFiles()
    {
        yield return Path.Combine(AppContext.BaseDirectory, FileName);
        yield return Path.Combine(GetUserDirectory(), FileName);
    }

    /// <summary>用户级配置目录：Windows 用 %AppData%，macOS 用 ~/Library/Application Support，其余用 XDG。</summary>
    public static string GetUserDirectory()
    {
        if (OperatingSystem.IsWindows())
            return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "Aster");

        if (OperatingSystem.IsMacOS())
            return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Library", "Application Support", "Aster");

        var configHome = Environment.GetEnvironmentVariable("XDG_CONFIG_HOME");
        if (string.IsNullOrWhiteSpace(configHome))
        {
            configHome = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".config");
        }

        return Path.Combine(configHome, "Aster");
    }

    private static JsonObject ParseFile(string path)
    {
        string text;
        try
        {
            // File.ReadAllText 会自动识别并去掉 BOM
            text = File.ReadAllText(path);
        }
        catch (Exception ex) when (ex is IOException or UnauthorizedAccessException)
        {
            throw new ConfigurationException($"读取配置文件失败：{path}（{ex.Message}）", ex);
        }

        try
        {
            return JsonNode.Parse(text, documentOptions: DocumentOptions) as JsonObject ?? throw new ConfigurationException($"配置文件根节点必须是 JSON 对象：{path}");
        }
        catch (JsonException ex)
        {
            throw new ConfigurationException($"配置文件格式错误：{path}（第 {ex.LineNumber + 1} 行，第 {ex.BytePositionInLine + 1} 字节）：{ex.Message}", ex);
        }
    }

    /// <summary>深合并：对象递归合并，数组和标量整体覆盖。</summary>
    private static void Merge(JsonObject target, JsonObject source, string sourceName)
    {
        foreach (var (key, value) in source)
        {
            if (value is JsonObject childObject && target[key] is JsonObject existingObject)
            {
                Merge(existingObject, childObject, sourceName);
            }
            else
            {
                // JsonNode 只能挂在一个父节点下，必须克隆
                target[key] = value?.DeepClone();
            }
        }
    }

    private static void ApplyEnvironmentOverrides(JsonObject root)
    {
        foreach (var entry in Environment.GetEnvironmentVariables())
        {
            if (entry is not System.Collections.DictionaryEntry pair || pair.Key is not string key || pair.Value is not string value)
            {
                continue;
            }

            if (!key.StartsWith(EnvironmentVariablePrefix, StringComparison.OrdinalIgnoreCase))
                continue;

            var path = key[EnvironmentVariablePrefix.Length..].Replace("__", ":", StringComparison.Ordinal);
            if (path.Length == 0)
                continue;

            SetValue(root, path, value);
        }
    }

    private static void ApplyCommandLineOverrides(JsonObject root, string[]? args)
    {
        if (args is null)
            return;

        for (var i = 0; i < args.Length; i++)
        {
            var arg = args[i];
            if (!arg.StartsWith("--", StringComparison.Ordinal) || arg.Length <= 2)
                continue;

            var body = arg[2..];
            var separator = body.IndexOf('=');
            string path;
            string value;

            if (separator > 0)
            {
                path = body[..separator];
                value = body[(separator + 1)..];
            }
            else if (i + 1 < args.Length && !args[i + 1].StartsWith("--", StringComparison.Ordinal))
            {
                path = body;
                value = args[++i];
            }
            else
            {
                continue;
            }

            if (path.Length == 0)
                continue;

            SetValue(root, path, value);
        }
    }

    /// <summary>按 "A:B:C" 路径写入值，缺失的中间节点自动创建。</summary>
    private static void SetValue(JsonObject root, string path, string rawValue)
    {
        var segments = path.Split(':', StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length == 0)
            return;

        var current = root;
        for (var i = 0; i < segments.Length - 1; i++)
        {
            if (current[segments[i]] is JsonObject next)
            {
                current = next;
            }
            else
            {
                var created = new JsonObject();
                current[segments[i]] = created;
                current = created;
            }
        }

        current[segments[^1]] = ToJsonValue(rawValue);
    }

    private static JsonNode? ToJsonValue(string rawValue)
    {
        if (bool.TryParse(rawValue, out var boolValue))
            return JsonValue.Create(boolValue);

        if (long.TryParse(rawValue, out var longValue))
            return JsonValue.Create(longValue);

        if (double.TryParse(rawValue, System.Globalization.NumberStyles.Float,
                System.Globalization.CultureInfo.InvariantCulture, out var doubleValue))
        {
            return JsonValue.Create(doubleValue);
        }

        if (string.Equals(rawValue, "null", StringComparison.OrdinalIgnoreCase))
            return null;

        return JsonValue.Create(rawValue);
    }
}
