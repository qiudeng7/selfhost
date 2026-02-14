# selfhost

我的自托管应用，开发中，计划支持订阅源、git托管、obsidian同步、自动备份。

1. 为什么不用 docker compose
   1. 因为想练习使用k8s，而且容器多了用compose可读性很差
2. 为什么用 kind 而不是 k3s
   1. 因为不知道为什么我的wsl安装k3s失败，暂时先用kind顶替，后续会封装k8s的部署。
3. 网络规划
   1. Gateway很新而且符合k8s官方推荐，但是资源占用太重了，不符合selfhost的需求
   2. 可以在集群外部搭建反向代理但是多改一些配置文件会增加运维负担，另一方面偏离了练习使用k8s的目的。
   3. 最终决定使用 loadbalancer + Ingress Controller
   4. 


## todo 待办

1. 需要数据备份
2. 通过 pulumi 封装manifests，暴露出配置接口
3. 自动部署自动删除仓库中不存在的资源