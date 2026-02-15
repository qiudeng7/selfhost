import * as fs from "fs";
import * as path from "path";
import { GarageComponent, TraefikComponent, IngressComponent } from "@qiudeng-selfhost/core";

// 读取 garage.toml 配置
const garageConfigPath = path.join(__dirname, "config", "garage.toml");
const garageConfigToml = fs.readFileSync(garageConfigPath, "utf-8");

// 读取 garage 初始化脚本
const garageInitScriptPath = path.join(__dirname, "config", "init.sh");
const garageInitScript = fs.readFileSync(garageInitScriptPath, "utf-8");

// 1. traefik ingress
export const traefik = new TraefikComponent("traefik-dev", {
  namespace: "kube-system",
  hostNetworkEnabled: true,
  dnsPolicy: "ClusterFirstWithHostNet",
  serviceType: "ClusterIP",
  nodeSelector: {
    "ingress-ready": "true",
  },
});


// 2. garage
export const garageNamespace = "garage"

export const garage = new GarageComponent("garage-dev", {
  namespace: garageNamespace,
  replicaCount: 1,
  configToml: garageConfigToml,
  storageSize: "10G",
  image: "dxflrs/garage:v2.2.0",
  initScript: garageInitScript,
});

export const garageIngress = new IngressComponent("garage-s3-ingress", {
  namespace: garageNamespace,
  className: "traefik",
  rules: [
    {
      host: "s3.localhost",
      serviceNamespace: "garage",
      serviceName: "garage",
      servicePort: 3900,
    },
  ],
});