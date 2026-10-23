using Avalonia.Controls;
using Avalonia.Input;
using Avalonia.Interactivity;

namespace Aster.Controls;

/// <summary>右上角窗口控制按钮（绿 = 全屏 / 黄 = 最小化 / 红 = 关闭），作用于所在窗口。</summary>
public partial class TrafficLights : UserControl
{
    public TrafficLights()
    {
        InitializeComponent();
    }

    private Window? Host => TopLevel.GetTopLevel(this) as Window;

    private void OnToggleFullScreen(object? sender, RoutedEventArgs e)
    {
        if (Host is not { } window)
            return;

        window.WindowState = window.WindowState == WindowState.FullScreen
            ? WindowState.Normal
            : WindowState.FullScreen;
    }

    private void OnMinimize(object? sender, RoutedEventArgs e)
    {
        if (Host is { } window)
            window.WindowState = WindowState.Minimized;
    }

    private void OnClose(object? sender, RoutedEventArgs e) => Host?.Close();
}
