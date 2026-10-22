using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;

namespace Aster.Runtime;

/// <summary>
/// 启动阶段诊断。
/// 此时 Avalonia 还没初始化，没有窗口可用：日志写入文件，Windows 上额外弹一个原生对话框，
/// 避免 WinExe 在无控制台的情况下"闪退无提示"。
/// </summary>
internal static class StartupDiagnostics
{
    private const string LogFileName = "startup.log";

    /// <summary>记录致命错误并返回日志文件路径。</summary>
    public static string ReportFatal(string title, Exception exception, bool showDialog = true)
    {
        var logPath = WriteLog(title, exception);

        try
        {
            Console.Error.WriteLine($"[{title}] {exception}");
        }
        catch
        {
            // 无控制台，忽略
        }

        if (showDialog && OperatingSystem.IsWindows())
            ShowNativeMessageBox($"启动失败：{title}\n\n{exception.Message}\n\n详细日志：{logPath}", "Aster");

        return logPath;
    }

    /// <summary>把异常追加写入 %AppData%\Aster\logs\startup.log（跨平台对应目录）。</summary>
    public static string WriteLog(string title, Exception exception)
    {
        var path = Path.Combine(Configuration.AppConfigurationLoader.GetUserDirectory(), "logs", LogFileName);
        var text = $"[{DateTimeOffset.Now:yyyy-MM-dd HH:mm:ss.fff zzz}] {title}{Environment.NewLine}{exception}{Environment.NewLine}{new string('-', 80)}{Environment.NewLine}";

        try
        {
            Directory.CreateDirectory(Path.GetDirectoryName(path)!);
            File.AppendAllText(path, text);
        }
        catch
        {
            // 日志写不进去也不能掩盖原始问题
            Debug.WriteLine(text);
        }

        return path;
    }

    [DllImport("user32.dll", CharSet = CharSet.Unicode, EntryPoint = "MessageBoxW")]
    private static extern int MessageBox(IntPtr hWnd, string text, string caption, uint type);

    private static void ShowNativeMessageBox(string text, string caption)
    {
        const uint mbOk = 0x0;
        const uint mbIconError = 0x10;
        const uint mbTopMost = 0x40000;

        try
        {
            MessageBox(IntPtr.Zero, text, caption, mbOk | mbIconError | mbTopMost);
        }
        catch
        {
            // 忽略弹窗失败
        }
    }
}
