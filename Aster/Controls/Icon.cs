using System;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Media;

namespace Aster.Controls;

/// <summary>
/// 矢量图标。数据源为 <c>Styles/Icons.axaml</c> 里的 StreamGeometry（由 Design/sprite.js 生成）：
/// 优先取 <c>Ico{Kind}</c> 作为填充，再叠加 <c>Ico{Kind}Stroke</c> 作为描边，
/// 两种都按 <see cref="Tint"/> 着色，随控件尺寸等比缩放。
/// </summary>
public sealed class Icon : Control
{
    public static readonly StyledProperty<string?> KindProperty =
        AvaloniaProperty.Register<Icon, string?>(nameof(Kind));

    public static readonly StyledProperty<IBrush?> TintProperty =
        AvaloniaProperty.Register<Icon, IBrush?>(nameof(Tint), Brushes.White);

    public static readonly StyledProperty<double> WeightProperty =
        AvaloniaProperty.Register<Icon, double>(nameof(Weight), 1.7);

    private Geometry? _fill;
    private Geometry? _stroke;
    private string? _loadedKind;

    static Icon()
    {
        AffectsRender<Icon>(KindProperty, TintProperty, WeightProperty);
    }

    public Icon()
    {
        Width = 16;
        Height = 16;
        IsHitTestVisible = false;
    }

    public string? Kind
    {
        get => GetValue(KindProperty);
        set => SetValue(KindProperty, value);
    }

    public IBrush? Tint
    {
        get => GetValue(TintProperty);
        set => SetValue(TintProperty, value);
    }

    /// <summary>描边宽度，单位是 24×24 图标坐标系。</summary>
    public double Weight
    {
        get => GetValue(WeightProperty);
        set => SetValue(WeightProperty, value);
    }

    public override void Render(DrawingContext context)
    {
        EnsureGeometry();
        if (_fill is null && _stroke is null)
            return;

        var target = Bounds;
        if (target.Width <= 0 || target.Height <= 0)
            return;

        var source = _stroke?.Bounds ?? _fill!.Bounds;
        if (_fill is not null && _stroke is not null)
            source = source.Union(_fill.Bounds);
        if (source.Width <= 0 || source.Height <= 0)
            return;

        var scale = Math.Min(target.Width / source.Width, target.Height / source.Height);
        var offsetX = (target.Width - source.Width * scale) / 2 - source.X * scale;
        var offsetY = (target.Height - source.Height * scale) / 2 - source.Y * scale;

        using var _ = context.PushTransform(
            Matrix.CreateScale(scale, scale) * Matrix.CreateTranslation(offsetX, offsetY));

        if (_fill is not null)
            context.DrawGeometry(Tint, null, _fill);
        if (_stroke is not null)
            context.DrawGeometry(null, new Pen(Tint, Weight), _stroke);
    }

    private void EnsureGeometry()
    {
        var kind = Kind;
        if (kind == _loadedKind)
            return;

        _loadedKind = kind;
        _fill = null;
        _stroke = null;

        if (string.IsNullOrWhiteSpace(kind))
            return;

        _fill = Lookup("Ico" + kind);
        _stroke = Lookup("Ico" + kind + "Stroke");
    }

    private Geometry? Lookup(string key)
    {
        return ResourceNodeExtensions.TryFindResource(this, key, out var value)
            ? value as Geometry
            : null;
    }
}
