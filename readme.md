# selfhost

自托管仓库，遵循 infra as code。

## Trade-offs & Principles 设计取舍

1. 使用 k8s 管理部署而不是docker compose，用来练习生产环境的部署。
2. 在DX和折腾之间选择折腾，比如选择selfhost而不是saas，选择 obsidian 而不是 appflowy。

## Structure 文件结构

- deprecated/ 暂时不开启
- feed/ 订阅源相关, 自托管 folo + rsshub
- object-storage/ 对象存储, 用于 obsidian 同步、多仓库部署。


## todo 待办

1. 需要数据备份
2. 需要转k3s