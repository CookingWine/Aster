using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using Aster.Runtime.Configuration;

namespace Aster;

public partial class App : Application
{
    /// <summary>
    /// 本地配置。在 AppBuilder 构建之前由 <see cref="Runtime.ApplicationEntry"/> 赋值，
    /// 因此 <see cref="Initialize"/> 和主窗口里都可以直接使用。
    /// 设计器预览时没有走 Main，这里的初始值保证不会为 null。
    /// </summary>
    public static AppConfiguration Configuration { get; internal set; } = new();

    public override void Initialize()
    {
        AvaloniaXamlLoader.Load(this);
    }

    public override void OnFrameworkInitializationCompleted()
    {
        if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        {
            desktop.MainWindow = new MainWindow();
        }

        base.OnFrameworkInitializationCompleted();
    }
}
