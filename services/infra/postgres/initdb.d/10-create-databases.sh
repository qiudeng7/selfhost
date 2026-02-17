#!/usr/bin/env bash
# 自动创建多个数据库
# 通过 POSTGRES_DATABASES 环境变量指定，用逗号分隔
# 例如: POSTGRES_DATABASES=miniflux,nextcloud,authelia

if [ -n "$POSTGRES_DATABASES" ]; then
    echo "Creating databases: $POSTGRES_DATABASES"

    # 将逗号分隔的字符串转换为数组
    IFS=',' read -ra DB_ARRAY <<< "$POSTGRES_DATABASES"

    for db in "${DB_ARRAY[@]}"; do
        # 去除空格
        db=$(echo "$db" | xargs)

        if [ -n "$db" ]; then
            echo "Creating database: $db"
            # 直接通过 psql 执行 CREATE DATABASE，忽略已存在的错误
            psql --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" <<EOF | grep -v "^CREATE\|^GRANT" || true
SELECT 'CREATE DATABASE $db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$db')\\gexec
GRANT ALL PRIVILEGES ON DATABASE $db TO $POSTGRES_USER;
EOF
            echo "Database $db ready"
        fi
    done
    echo "All databases created successfully"
else
    echo "POSTGRES_DATABASES not set, skipping additional database creation"
fi
