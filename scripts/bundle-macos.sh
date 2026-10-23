#!/usr/bin/env bash
#
# 把 Aster 打包成 macOS .app，让 Dock / Finder 显示 Assets/aster.icns。
# 用法：./scripts/bundle-macos.sh [Debug|Release]
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG="${1:-Release}"
OUT="$ROOT/artifacts"
APP="$OUT/Aster.app"

# dotnet 可能装在 ~/.dotnet 而没进 PATH
if ! command -v dotnet >/dev/null 2>&1; then
    if [ -x "$HOME/.dotnet/dotnet" ]; then
        export PATH="$HOME/.dotnet:$PATH"
    else
        echo "找不到 dotnet，请先安装 .NET 10 SDK" >&2
        exit 1
    fi
fi

dotnet publish "$ROOT/Aster/Aster.csproj" -c "$CONFIG" -o "$OUT/publish" --nologo

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp -R "$OUT/publish/." "$APP/Contents/MacOS/"
cp "$ROOT/Aster/Assets/aster.icns" "$APP/Contents/Resources/aster.icns"

cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>Aster</string>
    <key>CFBundleDisplayName</key>
    <string>Aster</string>
    <key>CFBundleIdentifier</key>
    <string>com.aster.player</string>
    <key>CFBundleExecutable</key>
    <string>Aster</string>
    <key>CFBundleIconFile</key>
    <string>aster</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>11.0</string>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.music</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
PLIST

chmod +x "$APP/Contents/MacOS/Aster"
echo "built: $APP"
