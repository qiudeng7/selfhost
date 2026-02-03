# FreshRSS Catppuccin 主题自动应用脚本 (Windows PowerShell)
# 此脚本在 FreshRSS 首次安装后自动配置 Catppuccin Mocha 主题

Write-Host "等待 FreshRSS 启动..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# 检查是否已安装
$result = docker exec freshrss test -f /var/www/FreshRSS/data/config.php 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "FreshRSS 已安装" -ForegroundColor Green
    Write-Host ""
    Write-Host "请手动应用 Catppuccin 主题：" -ForegroundColor Yellow
    Write-Host "1. 访问 http://localhost:8080"
    Write-Host "2. 进入 设置 > 显示"
    Write-Host "3. 主题选择 'Nord theme'"
    Write-Host "4. 进入 设置 > 扩展"
    Write-Host "5. 启用 'Custom CSS' 扩展"
    Write-Host "6. 点击齿轮图标，粘贴 feed/themes/catppuccin-mocha.css 的内容"
    exit 0
}

Write-Host "开始初始化 FreshRSS..." -ForegroundColor Green

# 通过 CLI 执行安装
docker exec --user www-data freshrss php ./cli/do-install.php `
    --base-url "http://localhost:8080" `
    --default-user "admin" `
    --password "admin" `
    --language "zh_CN" `
    --title "FreshRSS"

# 启用 Custom CSS 扩展
docker exec --user www-data freshrss php ./cli/enable-extension.php --user admin --extension "Custom CSS"

Write-Host "FreshRSS 初始化完成！" -ForegroundColor Green
Write-Host ""
Write-Host "请手动应用 Catppuccin 主题：" -ForegroundColor Yellow
Write-Host "1. 访问 http://localhost:8080 (用户名: admin, 密码: admin)"
Write-Host "2. 进入 设置 > 显示 > 主题选择 'Nord theme'"
Write-Host "3. 进入 设置 > 扩展 > 启用 'Custom CSS'"
Write-Host "4. 点击齿轮图标，粘贴 feed/themes/catppuccin-mocha.css 的内容"
