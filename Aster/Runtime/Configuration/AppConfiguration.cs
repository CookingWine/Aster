using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Aster.Runtime.Configuration;

/// <summary>
/// 应用配置根节点。
/// 需要新的配置项时，在这里补充对应属性（或新增一个 Section 类）即可。
/// </summary>
public sealed class AppConfiguration
{
    /// <summary>应用名称。</summary>
    public string ApplicationName { get; set; } = "Aster";

    /// <summary>当前运行环境（Development / Production 等）。</summary>
    public string? Environment { get; set; }

    /// <summary>日志配置。</summary>
    public LoggingOptions Logging { get; set; } = new();

    /// <summary>
    /// 没有在强类型模型里声明的配置项会原样落在这里，避免"配置文件里写了但代码读不到"。
    /// </summary>
    [JsonExtensionData]
    public Dictionary<string, object?> AdditionalSettings { get; set; } = new();

    /// <summary>本次启动实际读取并合并的配置文件（按加载顺序）。仅用于诊断。</summary>
    [JsonIgnore]
    public List<string> SourceFiles { get; } = new();

    internal void AddSource(string path) => SourceFiles.Add(path);

    /// <summary>
    /// 配置加载完成后做一次基本校验，把问题尽量暴露在启动阶段。
    /// </summary>
    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(ApplicationName))
            throw new ConfigurationException("配置项 ApplicationName 不能为空。");

        if (string.IsNullOrWhiteSpace(Logging.MinimumLevel))
            throw new ConfigurationException("配置项 Logging:MinimumLevel 不能为空。");
    }
}

/// <summary>日志相关配置。</summary>
public sealed class LoggingOptions
{
    /// <summary>最低日志级别：Trace / Debug / Information / Warning / Error / Critical。</summary>
    public string MinimumLevel { get; set; } = "Information";

    /// <summary>是否写入文件。</summary>
    public bool WriteToFile { get; set; } = true;

    /// <summary>日志文件路径，相对路径以程序目录为基准。</summary>
    public string FilePath { get; set; } = "logs/aster.log";
}
