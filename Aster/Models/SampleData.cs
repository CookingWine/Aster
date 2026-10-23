using System.Collections.Generic;
using Avalonia;
using Avalonia.Media;

namespace Aster.Models;

/// <summary>封面：一层线性渐变 + 一层径向高光，对应设计稿里的两层 background-image。</summary>
public sealed class CoverArt
{
    public CoverArt(string from, string to, string glow, double glowX = 0.5, double glowY = 0.5)
    {
        var glowColor = Color.Parse(glow);
        var transparent = Color.FromArgb(0, glowColor.R, glowColor.G, glowColor.B);

        Fill = new LinearGradientBrush
        {
            StartPoint = new RelativePoint(0, 0, RelativeUnit.Relative),
            EndPoint = new RelativePoint(1, 1, RelativeUnit.Relative),
            GradientStops =
            {
                new GradientStop(Color.Parse(from), 0),
                new GradientStop(Color.Parse(to), 1),
            },
        };

        Glow = new RadialGradientBrush
        {
            Center = new RelativePoint(glowX, glowY, RelativeUnit.Relative),
            GradientOrigin = new RelativePoint(glowX, glowY, RelativeUnit.Relative),
            RadiusX = new RelativeScalar(0.62, RelativeUnit.Relative),
            RadiusY = new RelativeScalar(0.62, RelativeUnit.Relative),
            GradientStops =
            {
                new GradientStop(glowColor, 0),
                new GradientStop(transparent, 1),
            },
        };
    }

    public IBrush Fill { get; }

    public IBrush Glow { get; }
}

public sealed record AlbumCard(string Title, string Meta, string From, string To, string Glow,
    double GlowX = 0.5, double GlowY = 0.5)
{
    public CoverArt Art { get; } = new(From, To, Glow, GlowX, GlowY);
}

public sealed record Track(string Number, string Title, string Album, string Duration,
    string From, string To, bool IsActive = false)
{
    public CoverArt Art { get; } = new(From, To, "#33FF96AF", 0.45, 0.42);
}

public sealed record QueueItem(string Title, string Artist, string Duration, string From, string To)
{
    public CoverArt Art { get; } = new(From, To, "#33FF96AF", 0.45, 0.42);
}

public sealed record PlaylistLink(string Name, string From, string To, bool IsCurrent = false)
{
    public IBrush Fill { get; } = new LinearGradientBrush
    {
        StartPoint = new RelativePoint(0, 0, RelativeUnit.Relative),
        EndPoint = new RelativePoint(1, 1, RelativeUnit.Relative),
        GradientStops =
        {
            new GradientStop(Color.Parse(From), 0),
            new GradientStop(Color.Parse(To), 1),
        },
    };
}

/// <summary>设计稿里的示例内容。</summary>
public static class SampleData
{
    public static IReadOnlyList<PlaylistLink> Playlists { get; } = new[]
    {
        new PlaylistLink("深夜紫调", "#3A1A6B", "#8B2D6B"),
        new PlaylistLink("山茶与雨", "#241046", "#C33C71", true),
        new PlaylistLink("只放给凌晨", "#141033", "#4B2A8F"),
        new PlaylistLink("Lo-Fi 房间", "#2B0E2A", "#E0617F"),
    };

    public static IReadOnlyList<AlbumCard> RecentCards { get; } = new[]
    {
        new AlbumCard("山茶夜语", "Aster Studio", "#241040", "#5C214A", "#66FF789B", 0.78, 0.82),
        new AlbumCard("紫夜电台", "24 首 · 1 小时 42 分", "#14080F", "#6B2157", "#4DD8B4FE", 0.12, 0.08),
        new AlbumCard("雨落窗台", "12 首 · 48 分", "#0D0821", "#361E6B", "#6B8C5AFF", 0.55, 0.88),
        new AlbumCard("午夜钢琴", "慢速钢琴 · 无人声", "#1C081C", "#75335C", "#47FF96A5", 0.22, 0.55),
        new AlbumCard("深紫回声", "夜间精选", "#0D0824", "#4F2985", "#5CBE96FF", 0.6, 0.12),
    };

    public static IReadOnlyList<Track> PlaylistTracks { get; } = new[]
    {
        new Track("1", "山茶夜语", "精选集", "4:38", "#3A0F3F", "#6B1A46", true),
        new Track("2", "紫色霓虹", "深夜电台", "3:52", "#14080F", "#6B2157"),
        new Track("3", "雨落窗台", "城市噪音", "4:12", "#0D0821", "#361E6B"),
        new Track("4", "低频心跳", "Aster Studio", "3:26", "#1C081C", "#75335C"),
        new Track("5", "花瓣与霓虹", "夜晚合辑", "5:04", "#1E0C38", "#4D1949"),
        new Track("6", "只放给凌晨", "Nox", "3:47", "#0E0820", "#4F2985"),
        new Track("7", "山茶花开在别处", "现场录音", "4:21", "#0D0824", "#4F2985"),
    };

    public static IReadOnlyList<QueueItem> UpNext { get; } = new[]
    {
        new QueueItem("紫色霓虹", "深夜电台", "3:24", "#241040", "#5C214A"),
        new QueueItem("雨落窗台", "城市噪音", "4:02", "#0D0821", "#361E6B"),
        new QueueItem("只放给凌晨", "Nox", "3:47", "#1C081C", "#75335C"),
    };
}
