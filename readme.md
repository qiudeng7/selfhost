# selfhost

我的自托管应用，开发中，计划支持订阅源、git托管、obsidian同步、自动备份。

## 进度

目前可以通过 `docker compose down -v && docker compose up -d` 一键删除数据卷和重启全部服务。

设置hosts来访问服务:
```hosts
127.0.0.1 rsshub.selfhost.local
127.0.0.1 miniflux.selfhost.local
127.0.0.1 nextflux.selfhost.local

127.0.0.1 s3.selfhost.local
127.0.0.1 garage-web.selfhost.local
127.0.0.1 garage-admin.selfhost.local
127.0.0.1 garage-ui.selfhost.local
```

接下来：
1. 自动设置 hosts
2. 收集metrics
3. 声明订阅源
4. 创建 homepage


## garage 对象存储

对象存储用于：
1. obsidian 同步
2. 网站静态部署
