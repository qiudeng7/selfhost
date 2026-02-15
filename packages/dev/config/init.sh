#!/bin/sh

# 启动服务器（后台运行）
/garage server &

# 等待服务器就绪
echo "Waiting for garage to start..."
while ! /garage status >/dev/null 2>&1; do
    sleep 1
done
echo "Garage is ready"

# 获取 node_id
node_id=$(/garage status | sed -n '$p' | cut -d' ' -f1)

# 分配layout
/garage layout assign --zone main --capacity 10G ${node_id}

# 应用layout
/garage layout apply --version 1

echo "Layout configured, keeping garage running..."

# 等待后台进程
wait