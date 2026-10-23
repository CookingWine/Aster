using Avalonia.Controls;

namespace Aster.Views;

/// <summary>在窗口之间切换：新窗口显示后把当前窗口藏起来，新窗口关闭时原窗口回来。</summary>
public static class Navigation
{
    public static void Push(Control from, Window next)
    {
        var owner = TopLevel.GetTopLevel(from) as Window;
        if (owner is null)
        {
            next.Show();
            return;
        }

        next.Show();
        owner.Hide();
        next.Closed += (_, _) => owner.Show();
    }
}
