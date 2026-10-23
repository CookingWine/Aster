using Avalonia.Controls;
using Avalonia.Interactivity;
using Aster.Controls;

namespace Aster.Views;

/// <summary>登录窗：手机号 / 邮箱两种模式，登录后进入主窗口。</summary>
public partial class LoginWindow : Window
{
    public LoginWindow()
    {
        InitializeComponent();
        WindowDrag.Attach(Stage);
    }

    private void OnPhoneTab(object? sender, RoutedEventArgs e) => SetMode(phone: true);

    private void OnMailTab(object? sender, RoutedEventArgs e) => SetMode(phone: false);

    private void SetMode(bool phone)
    {
        PhoneTab.Classes.Set("active", phone);
        MailTab.Classes.Set("active", !phone);

        AccountLabel.Text = phone ? "手机号" : "邮箱";
        AccountBox.PlaceholderText = phone ? "请输入手机号" : "请输入邮箱地址";
        AccountBox.Text = string.Empty;
        AccountBox.Focus();
    }

    private void OnLogin(object? sender, RoutedEventArgs e)
    {
        var main = new MainWindow();
        main.Show();
        Close();
    }
}
