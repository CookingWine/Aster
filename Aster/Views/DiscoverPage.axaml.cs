using Avalonia.Controls;
using Avalonia.Interactivity;
using Avalonia.VisualTree;

namespace Aster.Views;

/// <summary>发现页：问候语 + 精选横幅 + 最近播放卡片。</summary>
public partial class DiscoverPage : UserControl
{
    public DiscoverPage()
    {
        InitializeComponent();
    }

    private void OnPlayPlaylist(object? sender, RoutedEventArgs e)
        => Navigation.Push(this, new NowPlayingWindow());

    private void OnOpenPlaylist(object? sender, RoutedEventArgs e)
        => this.FindAncestorOfType<MainWindow>()?.ShowPlaylist();
}
