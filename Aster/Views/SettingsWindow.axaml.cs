using System;
using System.Linq;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Interactivity;
using Aster.Controls;

namespace Aster.Views;

/// <summary>设置窗：左侧分区标题 + 右侧选项，页签点击滚动到对应分区。</summary>
public partial class SettingsWindow : Window
{
    public SettingsWindow()
    {
        InitializeComponent();
        WindowDrag.Attach(Header);
    }

    private void OnBack(object? sender, RoutedEventArgs e) => Close();

    private void OnTab(object? sender, RoutedEventArgs e)
    {
        if (sender is not AsterButton button || button.Tag is not string tag)
            return;

        foreach (var tab in Tabs.Children.OfType<AsterButton>())
            tab.Classes.Set("active", ReferenceEquals(tab, button));

        if (this.FindControl<Control>(tag) is not { } section)
            return;

        var position = section.TranslatePoint(new Point(0, 0), Scroller);
        if (position is { } point)
            Scroller.Offset = new Vector(0, Math.Max(0, Scroller.Offset.Y + point.Y - 12));
    }
}
