import * as fs from "fs";
import * as path from "path";
import { GarageComponent, TraefikComponent, IngressComponent, GarageInitJob } from "@qiudeng-selfhost/core";

// 读取 garage.toml 配置
const garageConfigPath = path.join(__dirname, "config", "garage.toml");
const garageConfigToml = fs.readFileSync(garageConfigPath, "utf-8");

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

// 3. garage init job - create initial bucket
export const garageInitJob = new GarageInitJob("garage-init-bucket", {
  namespace: garageNamespace,
  image: "dxflrs/garage:v2.2.0",
  commands: ["garage-cli"],
  args: ["bucket", "create", "my-bucket"],
}, { dependsOn: [garage.deployment] });