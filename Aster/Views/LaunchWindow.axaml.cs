using System;
using System.Diagnostics;
using Avalonia;
using Avalonia.Animation;
using Avalonia.Controls;
using Avalonia.Input;
using Avalonia.Media;
using Avalonia.Styling;
using Avalonia.Threading;

namespace Aster.Views;

/// <summary>启动画面：进度条 2.3 秒走完，2.4 秒后进入登录；点击任意处可跳过。</summary>
public partial class LaunchWindow : Window
{
    private const double BarWidth = 180;
    private static readonly TimeSpan BarDuration = TimeSpan.FromSeconds(2.3);
    private static readonly TimeSpan HoldDuration = TimeSpan.FromMilliseconds(2400);

    private readonly Stopwatch _clock = Stopwatch.StartNew();
    private readonly DispatcherTimer _ticker;
    private readonly DispatcherTimer _advance;
    private bool _leaving;

    public LaunchWindow()
    {
        InitializeComponent();

        _ticker = new DispatcherTimer(TimeSpan.FromMilliseconds(16), DispatcherPriority.Render, OnTick);
        _ticker.Start();

        _advance = new DispatcherTimer(HoldDuration, DispatcherPriority.Normal, (_, _) => Leave());
        _advance.Stop();

        PointerPressed += (_, _) => Leave();
    }

    protected override void OnOpened(EventArgs e)
    {
        base.OnOpened(e);
        _advance.Start();
    }

    private void OnTick(object? sender, EventArgs e)
    {
        var t = Math.Clamp(_clock.Elapsed.TotalSeconds / BarDuration.TotalSeconds, 0, 1);

        // 贴近 cubic-bezier(.4,0,.2,1)：前 55% 抵达 68%，其余补齐
        var progress = t < 0.55
            ? 0.68 * EaseInOut(t / 0.55)
            : 0.68 + 0.32 * EaseInOut((t - 0.55) / 0.45);

        BarFill.Width = BarWidth * progress;

        if (t >= 1)
            _ticker.Stop();
    }

    private static double EaseInOut(double x) => x * x * (3 - 2 * x);

    private async void Leave()
    {
        if (_leaving)
            return;

        _leaving = true;
        _ticker.Stop();
        _advance.Stop();

        var fade = new Animation
        {
            Duration = TimeSpan.FromMilliseconds(320),
            Children =
            {
                new KeyFrame
                {
                    Cue = new Cue(1),
                    Setters = { new Setter(OpacityProperty, 0d) },
                },
            },
        };

        await fade.RunAsync(Root);

        var login = new LoginWindow();
        login.Show();
        Close();
    }
}
