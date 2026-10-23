using Aster.Runtime.Configuration;
using Avalonia;
using System;

namespace Aster.Runtime
{
    /// <summary>
    /// 程序入口。
    /// <para>执行顺序：加载本地配置 → 构造 AppBuilder → 启动 Avalonia（App.Initialize → 主窗口）。</para>
    /// </summary>
    internal static class ApplicationEntry
    {
        [STAThread]
        public static int Main(string[] args)
        {
            // 1. 在 Avalonia 初始化之前加载本地配置，App.Initialize / 主窗口里都能直接读到
            try
            {
                App.Configuration = AppConfigurationLoader.Load(args);
            }
            catch (Exception ex)
            {
                StartupDiagnostics.ReportFatal("加载本地配置失败", ex);
                return 1;
            }

            // 2. 启动 Avalonia
            try
            {
                return BuildAvaloniaApp().StartWithClassicDesktopLifetime(args);
            }
            catch (Exception ex)
            {
                StartupDiagnostics.ReportFatal("应用程序启动失败", ex);
                return 1;
            }
        }

        private static AppBuilder BuildAvaloniaApp()
        {
            var app = AppBuilder.Configure<App>();

            app.UsePlatformDetect()
                .WithInterFont()
                .LogToTrace();

            // DiagnosticsSupport 只在 Debug 配置里引用（见 Aster.csproj），Release 下不能调用
#if DEBUG
            app.WithDeveloperTools();
#endif

            return app;
        }
    }
}
