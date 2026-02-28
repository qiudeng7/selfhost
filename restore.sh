# 假设备份文件在 backups 目录下
BACKUP_DIR="./backups"

for backup_file in $BACKUP_DIR/*.tar.gz; do
    # 从文件名提取卷名 (例如 selfhost_postgres-data)
    volume_name=$(basename "$backup_file" .tar.gz)
    
    echo "正在恢复卷: $volume_name ..."
    
    docker run --rm \
      -v $volume_name:/dest \
      -v $(realpath $BACKUP_DIR):/backup \
      alpine sh -c "rm -rf /dest/* && tar xzf /backup/$volume_name.tar.gz -C /dest"
done