using Avalonia.Controls;
using Avalonia.Interactivity;
using Aster.Controls;

namespace Aster.Views;

/// <summary>主窗口：顶栏 + 侧边栏 + 内容页 + 播放条。</summary>
public partial class MainWindow : Window
{
    private readonly DiscoverPage _discover = new();
    private readonly PlaylistPage _playlist = new();
    private bool _playing;

    public MainWindow()
    {
        InitializeComponent();
        WindowDrag.Attach(TitleBar);
        PageHost.Content = _discover;
    }

    /// <summary>切到歌单页（供发现页卡片调用）。</summary>
    public void ShowPlaylist() => Navigate(_playlist, NavLibrary);

    private void Navigate(Control page, AsterButton active)
    {
        PageHost.Content = page;

        foreach (var item in new[] { NavDiscover, NavLibrary, NavFavorites, NavRecent })
            item.Classes.Set("active", ReferenceEquals(item, active));
    }

    private void OnNavDiscover(object? sender, RoutedEventArgs e) => Navigate(_discover, NavDiscover);

    private void OnNavLibrary(object? sender, RoutedEventArgs e) => Navigate(_playlist, NavLibrary);

    private void OnOpenSettings(object? sender, RoutedEventArgs e)
        => Navigation.Push(this, new SettingsWindow());

    private void OnOpenNowPlaying(object? sender, RoutedEventArgs e)
        => Navigation.Push(this, new NowPlayingWindow());

    private void OnTogglePlay(object? sender, RoutedEventArgs e)
    {
        _playing = !_playing;
        PlayIcon.IsVisible = !_playing;
        PauseIcon.IsVisible = _playing;
    }

    private void OnNext(object? sender, RoutedEventArgs e)
    {
        if (!_playing)
            OnTogglePlay(sender, e);
    }

    private void OnToggleLike(object? sender, RoutedEventArgs e)
    {
        if (sender is not AsterButton button)
            return;

        button.Classes.Set("liked", !button.Classes.Contains("liked"));
    }

    private void OnToggleQueue(object? sender, RoutedEventArgs e)
    {
        QueuePopup.IsVisible = !QueuePopup.IsVisible;
        QueueToggle.Classes.Set("active", QueuePopup.IsVisible);
    }
}
