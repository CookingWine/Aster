using Avalonia.Controls;
using Avalonia.Interactivity;

namespace Aster.Views;

/// <summary>歌单详情页：封面信息 + 曲目列表。</summary>
public partial class PlaylistPage : UserControl
{
    public PlaylistPage()
    {
        InitializeComponent();
    }

    private void OnPlay(object? sender, RoutedEventArgs e)
        => Navigation.Push(this, new NowPlayingWindow());
}
