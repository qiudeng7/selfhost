# selfhost

我的自托管应用，开发中。

## 快速开始

```bash
# 复制env文件并编辑，这些env将会替换compose文件中的变量
cp .env.example .env

# 启动全部服务
docker compose up -d

# 删除全部服务及数据卷: docker compose down -v
```

设置 hosts 来访问服务(如果你想修改hosts，记得同时也要修改nginx配置):
```hosts
127.0.0.1 rsshub.selfhost.local
127.0.0.1 miniflux.selfhost.local
127.0.0.1 nextflux.selfhost.local

127.0.0.1 s3.selfhost.local
127.0.0.1 garage-web.selfhost.local
127.0.0.1 garage-admin.selfhost.local
127.0.0.1 garage-ui.selfhost.local
```

### feed

feed总体上包括如下三个部分，使用之前必须配置.env中的 MINIFLUX_ADMIN_USERNAME 和 MINIFLUX_ADMIN_PASSWORD。

1. 访问原始的miniflux，能够聚合订阅源: http://miniflux.selfhost.local 
2. 这是miniflux的一个现代化前端界面: http://nextflux.selfhost.local
3. 访问rsshub，这是一个强大的订阅源: http://rsshub.selfhost.local
   1. 在miniflux中订阅rsshub需要使用 `rsshub:1200` 作为地址，他们通过compose中的selfhost网络直接访问。
   2. rsshub抓取社交平台内容有许多风控问题，需要配置自己的账号信息，参考rsshub的[配置文档](https://docs.rsshub.app/zh/deploy/config#route-specific-configurations)


### 基建设施

目前基建设施包括 garage 对象存储和postgres数据库。

garage 目前用于 obsidian 数据同步、obsidian 页面发布、gitea 代码库。

postgres 暂时用于存储 miniflux 和 gitea 的用户数据。

#### garage 对象存储

使用 garage 之前，哪怕是单节点garage也需要先分配集群布局，否则 garage-ui 中 status 会显示为 unhealthy。可以在 garage-ui 中对节点进行 assign，最后 apply assignment，即可开始使用存储桶。

1. 访问 garage 对象存储的现代化前端界面 : http://garage-ui.selfhost.local
2. 访问 garage 的对象存储 API : http://s3.selfhost.local
3. 通过 admin API 访问garage : http://garage-admin.selfhost.local
4. 访问 garage 上的静态部署页面 : http://garage-web.selfhost.local


#### postgres

我对 postgres:18 镜像稍做了一些修改，编辑.env中的POSTGRES_DATABASES，值为逗号分隔的数据库名，比如`miniflux,gitea`，每次重启服务都会尝试创建这些数据库。


## Todo

1. gitea
2. 数据备份
3. 监控资源占用