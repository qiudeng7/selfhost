import * as fs from "fs";
import * as path from "path";
import { GarageComponent } from "@qiudeng-selfhost/core";

// 读取 garage.toml 配置
const garageConfigPath = path.join(__dirname, "config", "garage.toml");
const garageConfigToml = fs.readFileSync(garageConfigPath, "utf-8");

// 创建 Garage 组件
export const garage = new GarageComponent("garage-dev", {
  namespace: "garage",
  replicaCount: 1,
  configToml: garageConfigToml,
  storageSize: "10G",
  image: "dxflrs/garage:v2.2.0",
  nodePorts: {
    s3: 30390,
    rpc: 30391,
    web: 30392,
    admin: 30393,
  },
});

// 导出 stack outputs
export const garageServiceName = garage.service.metadata.name;
export const garageNamespace = garage.namespace.metadata.name;

