using Avalonia.Controls;
using Avalonia.Input;

namespace Aster.Controls;

/// <summary>让无边框窗口的标题栏区域可以拖动窗口。</summary>
public static class WindowDrag
{
    public static void Attach(Control area)
    {
        area.PointerPressed += (_, e) =>
        {
            if (!e.GetCurrentPoint(area).Properties.IsLeftButtonPressed)
                return;

            if (TopLevel.GetTopLevel(area) is Window window)
                window.BeginMoveDrag(e);
        };
    }
}
