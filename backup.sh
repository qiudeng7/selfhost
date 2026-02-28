# 导出所有数据卷到 backups 目录

# 创建备份目录
mkdir -p ./backups

# 循环导出所有卷
for volume in $(docker compose volumes -q); do
    echo "正在备份卷: $volume ..."
    docker run --rm \
      -v $volume:/source:ro \
      -v $(pwd)/backups:/backup \
      alpine tar czf /backup/${volume}.tar.gz -C /source .
done

echo "备份完成！文件存放在 ./backups 目录。"