using Avalonia;
using System;

namespace Aster.Runtime
{
    /// <summary>
    /// 程序入口
    /// </summary>
    internal class ApplicationEntry
    {

        [STAThread]
        public static void Main(string[] args) => BuildAvaloniaApp().SetupWithClassicDesktopLifetime(args);

        private static AppBuilder BuildAvaloniaApp()
        {
            var app = AppBuilder.Configure<App>();

            app.UsePlatformDetect()
                .WithDeveloperTools()
                .WithInterFont()
                .LogToTrace();

            return app;
        }
    }
}
