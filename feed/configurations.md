# RSSHub + FreshRSS 配置说明

## 架构说明

```
┌─────────────┐     内部访问      ┌─────────────┐
│  FreshRSS   │ ────────────────> │   RSSHub    │
│  :8080      │   http://rsshub:  │   :1200     │
└─────────────┘       1200        └─────────────┘
       │                               │
    暴露端口                        ┌─────────────┐
       │                        │ Browserless  │
       │                        │ (Puppeteer)  │
    用户访问                      └─────────────┘
```

**特点**：
- RSSHub 不暴露端口，仅供 FreshRSS 内部调用
- FreshRSS 作为唯一入口对外服务
- 不使用 Redis 缓存，RSSHub 使用内存缓存
- 集成 Catppuccin Mocha 主题

---

## 服务列表

| 服务 | 端口 | 用途 |
|------|------|------|
| **FreshRSS** | 8080 | RSS 阅读器，对外的唯一入口 |
| **RSSHub** | - | RSS 生成器，内部服务 |
| **Browserless** | - | Puppeteer 浏览器服务 |

## 快速启动

```bash
cd feed
docker compose up -d
```

## 访问地址

- **FreshRSS**: http://localhost:8080

---

## FreshRSS 中添加 RSSHub 源

在 FreshRSS 订阅管理中添加 RSSHub 源：

```
http://rsshub:1200/路由路径
```

**示例**：
- GitHub Trending: `http://rsshub:1200/github/trending/daily`
- B站热门: `http://rsshub:1200/bilibili/bangung/media/week`
- 微博热搜: `http://rsshub:1200/weibo/search/hot`

> 查看 [RSSHub 路由文档](https://docs.rsshub.app/routes/) 获取更多源

---

## Catppuccin 主题应用

主题文件已挂载到容器中：`/var/www/FreshRSS/themes/catppuccin-mocha.css`

### 手动应用步骤

1. 访问 http://localhost:8080 并登录
2. 进入 **设置 > 显示 > 主题**，选择 `Nord theme`
3. 进入 **设置 > 扩展**，启用 `Custom CSS` 扩展
4. 点击扩展旁边的**齿轮图标**
5. 粘贴 `feed/themes/catppuccin-mocha.css` 的内容
6. 点击提交，刷新页面

### 自动初始化脚本（可选）

```powershell
# Windows PowerShell
.\feed\init-theme.ps1
```

---

## RSSHub 配置项

| 环境变量 | 说明 | 默认值 |
|---------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `PUPPETEER_WS_ENDPOINT` | Puppeteer 服务地址 | `ws://browserless:3000` |
| `GITHUB_ACCESS_TOKEN` | GitHub Token（可选） | - |

### GITHUB_ACCESS_TOKEN 说明

**作用**：提高 GitHub 相关路由的请求限额

| 请求类型 | 每小时限制 |
|---------|-----------|
| 无 Token | 60 次 |
| 有 Token | 5000 次 |

**获取方式**：
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 勾选 `public_repo` 权限
3. 在 compose.yaml 中配置

---

## FreshRSS 配置项

| 环境变量 | 说明 | 默认值 | 建议 |
|---------|------|--------|------|
| `TZ` | 时区 | `UTC` | `Asia/Shanghai` |
| `CRON_MIN` | RSS 更新的 cron 分钟 | 禁用 | `3,33` |
| `TRUSTED_PROXY` | 可信代理 IP 段 | - | 反向代理时配置 |

### CRON 配置建议

```yaml
CRON_MIN: '3,33'   # 每小时第 3 和 33 分钟更新
# 或
CRON_MIN: '*/20'   # 每 20 分钟更新
```

---

## Puppeteer 说明

**支持的内容类型**：
- 动态渲染网站（Twitter、微博、小红书）
- 需要登录的内容
- 有反爬虫检测的网站

**资源消耗**：
- 内存: ~500MB+
- 磁盘: ~1GB+

**查看需要 Puppeteer 的路由**：在 [RSSHub 路由文档](https://docs.rsshub.app/routes/) 中查找标有 `puppeteer` 图标的路由

---

## 维护命令

```bash
# 查看日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f rsshub
docker compose logs -f freshrss

# 更新镜像
docker compose pull
docker compose up -d

# 停止服务
docker compose down

# 清理数据（谨慎！）
docker compose down -v
```

---

## 参考文档

- [RSSHub 官方文档](https://docs.rsshub.app/)
- [FreshRSS 官方文档](https://freshrss.github.io/FreshRSS/)
- [RSSHub 路由列表](https://docs.rsshub.app/routes/)
- [Catppuccin FreshRSS 主题](https://github.com/catppuccin/freshrss)
