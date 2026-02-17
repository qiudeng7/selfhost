#!/usr/bin/env bash
set -e

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

            psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
                -- 创建数据库（如果不存在）
                SELECT 'CREATE DATABASE $db'
                WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$db')\gexec

                -- 授予权限
                GRANT ALL PRIVILEGES ON DATABASE $db TO $POSTGRES_USER;
EOSQL
        fi
    done
else
    echo "POSTGRES_DATABASES not set, skipping additional database creation"
fi
