# 创建集群并部署应用
kind delete clusters selfhost && \ 
kind create cluster --config manifests/kind.yaml --name selfhost && \
kubectl apply -k manifests/

# todo
# 部署集群外反向代理
# 初始化 garage layout