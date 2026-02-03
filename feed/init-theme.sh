#!/bin/sh
# FreshRSS Catppuccin 主题自动应用脚本
# 此脚本在 FreshRSS 首次安装后自动配置 Catppuccin Mocha 主题

set -e

echo "等待 FreshRSS 启动..."
sleep 10

# 检查是否已安装
if docker exec freshrss test -f /var/www/FreshRSS/data/config.php; then
    echo "FreshRSS 已安装，跳过初始化"
    exit 0
fi

echo "开始初始化 FreshRSS..."

# 通过 CLI 执行安装并应用主题
docker exec --user www-data freshrss php ./cli/do-install.php \
    --base-url "http://localhost:8080" \
    --default-user "admin" \
    --password "admin" \
    --language "zh_CN" \
    --title "FreshRSS" || true

# 等待安装完成
sleep 5

# 启用 Custom CSS 扩展
docker exec --user www-data freshrss php ./cli/enable-extension.php --user admin --extension "Custom CSS" || true

echo "FreshRSS 初始化完成！"
echo ""
echo "接下来请手动应用 Catppuccin 主题："
echo "1. 访问 http://localhost:8080"
echo "2. 登录 (用户名: admin, 密码: admin)"
echo "3. 进入 设置 > 显示"
echo "4. 主题选择 'Nord theme'"
echo "5. 进入 设置 > 扩展"
echo "6. 启用 'Custom CSS' 扩展"
echo "7. 点击齿轮图标，粘贴以下内容："
echo ""
echo "=== 请复制下面的 CSS ==="
cat /var/www/FreshRSS/themes/catppuccin-mocha.css
echo "=== CSS 结束 ==="
