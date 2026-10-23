using Avalonia.Controls;
using Avalonia.Interactivity;
using Aster.Controls;

namespace Aster.Views;

/// <summary>正在播放：封面 + 歌词 + 播放队列。</summary>
public partial class NowPlayingWindow : Window
{
    private bool _playing;

    public NowPlayingWindow()
    {
        InitializeComponent();
        WindowDrag.Attach(Header);
    }

    private void OnBack(object? sender, RoutedEventArgs e) => Close();

    private void OnTogglePlay(object? sender, RoutedEventArgs e)
    {
        _playing = !_playing;
        PlayIcon.IsVisible = !_playing;
        PauseIcon.IsVisible = _playing;
    }

    private void OnToggleLike(object? sender, RoutedEventArgs e)
    {
        if (sender is AsterButton button)
            button.Classes.Set("liked", !button.Classes.Contains("liked"));
    }
}
