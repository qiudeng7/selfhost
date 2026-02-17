#!/bin/bash

export zone="main" # 地区
export capacity="10G" # 容量

set -e

alias garage="docker exec -it garage /garage"

export node_id=$(garage status | sed -n '$p' | cut -d' ' -f1)

garage layout assign --zone ${zone} --capacity ${capacity} ${node_id}

garage layout apply --version 1