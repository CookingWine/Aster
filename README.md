# Aster

山茶 · 只属于你的音乐空间。

`Design/` 里的 HTML 设计稿已经转换成 Avalonia XAML 窗口，可直接运行查看界面。

## 技术栈

- .NET 10
- Avalonia 12.1.2（Fluent 深色主题 + Inter 字体）
- 配置：`Aster/Runtime/Configuration`（程序目录 → 用户目录 → 环境变量 → 命令行，逐层覆盖）

## 运行

```bash
dotnet run --project Aster/Aster.csproj
```

> 需要在有图形会话的终端里运行（SSH / 无 WindowServer 权限的环境会报 `RenderTimer` 错误）。

macOS 上想要 Dock / Finder 里显示应用图标，需要打成 .app：

```bash
./scripts/bundle-macos.sh          # 产物：artifacts/Aster.app
```

`dotnet run` 直接跑时进程没有 bundle，Dock 只能显示 dotnet 的默认图标。

## 应用图标

<img src="docs/screenshots/icon.png" width="120" alt="Aster 应用图标">

图标就是设计稿里的山茶花（`Design/sprite.js` 的 `app-icon`），由 `BrandMark` 控件渲染成 1024 的 PNG，再派生出各平台格式：

| 文件 | 用途 |
| --- | --- |
| `Aster/Assets/aster-1024.png` | 源图，改图标后从这里重新导出 |
| `Aster/Assets/aster-256.png` | 运行时 `Window.Icon`（Avalonia 不解码 .ico，统一用 PNG） |
| `Aster/Assets/aster.ico` | Windows 可执行文件图标（16/32/48/64/128/256 六种尺寸） |
| `Aster/Assets/aster.icns` | macOS 应用包图标（`CFBundleIconFile`） |

`Aster.csproj` 里通过 `<ApplicationIcon>Assets/aster.ico</ApplicationIcon>` 嵌入到 exe，五个窗口各自用 `Icon="/Assets/aster-256.png"` 设置窗口图标。

## 目录

```
Aster/
├── App.axaml(.cs)              应用入口，合并样式资源
├── Styles/
│   ├── Palette.axaml           配色、渐变、圆角
│   ├── Icons.axaml             图标几何（由 Design/sprite.js 生成）
│   ├── ControlThemes.axaml     按钮/复选/单选的 ControlTheme
│   └── Styles.axaml            AsterButton 类样式（icon/play/pill/nav/setbtn/tab…）
├── Controls/
│   ├── Icon.cs                 按 Kind 取 StreamGeometry，支持 Tint 着色
│   ├── BrandMark.axaml         山茶花标（5+5 花瓣合并几何）
│   ├── TrafficLights.axaml     红黄绿窗口按钮
│   ├── AsterButton.cs          去默认外观的按钮基类
│   └── WindowDrag.cs           标题栏拖动
├── Views/
│   ├── LaunchWindow            启动画面
│   ├── LoginWindow             登录
│   ├── MainWindow              外壳：顶栏 + 侧边栏 + 播放条
│   ├── DiscoverPage            发现页
│   ├── PlaylistPage            歌单详情页
│   ├── NowPlayingWindow        正在播放
│   ├── SettingsWindow          设置
│   └── Navigation.cs           窗口间切换
├── Models/SampleData.cs        示例数据与封面渐变
├── Assets/                     应用图标（png / ico / icns）
└── Runtime/                    启动与配置（原有）

scripts/bundle-macos.sh         打包 macOS .app
```

## 设计稿对照

| 设计稿 | 实现 |
| --- | --- |
| `launch.html` | `Views/LaunchWindow.axaml` |
| `login.html` | `Views/LoginWindow.axaml` |
| `index.html` | `Views/DiscoverPage.axaml`（在 `MainWindow` 内） |
| `playlist.html` | `Views/PlaylistPage.axaml`（在 `MainWindow` 内） |
| `now-playing.html` | `Views/NowPlayingWindow.axaml` |
| `settings.html` | `Views/SettingsWindow.axaml` |
| `brand.html`、`components.html` | 设计规范文档，未做成窗口 |

截图见 `docs/screenshots/`。

## 实现要点

- **图标**：`Design/sprite.js` 的 `<symbol>` 全部转成 `StreamGeometry`（圆形、矩形、旋转花瓣都在转换时展开），运行时由 `Icon` 按 `Kind` 查找 `Ico{Kind}`（填充）与 `Ico{Kind}Stroke`（描边），颜色由 `Tint` 控制。
- **封面**：设计稿是「线性渐变 + 径向高光」两层 `background-image`，这里用两个 `Border` 叠出同样的效果，数据在 `SampleData` 里。
- **窗口**：`WindowDecorations="BorderOnly"`（无标题栏、保留系统边框与阴影），标题栏自绘，右上角红黄绿按钮走 `TrafficLights`，拖动由 `WindowDrag` 处理。
- **按钮**：所有可点元素是 `AsterButton`，外观完全由类样式决定，不继承 Fluent 默认装饰。

## 已有交互

- 启动画面进度条 2.3s，2.4s 后进入登录，点击任意处可跳过
- 登录页签「手机号 / 邮箱」切换，登录进入主窗口
- 侧边栏切换「发现 / 音乐库」，发现页卡片点击进入歌单页
- 播放条播放/暂停、喜欢、播放队列浮层
- 「正在播放」「设置」以独立窗口打开，返回后主窗口恢复
- 设置页签点击滚动到对应分区

## 尚未实现

- 真实音频播放、账号体系、歌词滚动、下拉选择（当前是静态外观）
- 部分细节动效：图标 hover 变色、卡片上浮、页面切换过渡
