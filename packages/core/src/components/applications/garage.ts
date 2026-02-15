import * as k8s from "@pulumi/kubernetes";
import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";

export interface GarageConfig {
  namespace?: string;
  replicaCount?: number;
  configToml: string;
  storageSize: string;
  image?: string;
  initScript?: string;
}

export interface GarageOutputs {
  namespace: k8s.core.v1.Namespace;
  configMap: k8s.core.v1.ConfigMap;
  metaPvc: k8s.core.v1.PersistentVolumeClaim;
  dataPvc: k8s.core.v1.PersistentVolumeClaim;
  deployment: k8s.apps.v1.Deployment;
  service: k8s.core.v1.Service;
}

export class GarageComponent extends ComponentResource implements GarageOutputs {
  readonly namespace: k8s.core.v1.Namespace;
  readonly configMap: k8s.core.v1.ConfigMap;
  readonly metaPvc: k8s.core.v1.PersistentVolumeClaim;
  readonly dataPvc: k8s.core.v1.PersistentVolumeClaim;
  readonly deployment: k8s.apps.v1.Deployment;
  readonly service: k8s.core.v1.Service;

  constructor(name: string, config: GarageConfig, opts?: ComponentResourceOptions) {
    // 定义组件类型
    super("selfhost:applications:Garage", name, {}, opts);

    const ns = config.namespace || "garage";

    // Namespace
    this.namespace = new k8s.core.v1.Namespace(`${name}-ns`, {
      metadata: { name: ns },
    }, { ...opts, parent: this });

    // ConfigMap
    this.configMap = new k8s.core.v1.ConfigMap(`${name}-config`, {
      metadata: {
        name: "garage-config",
        namespace: ns,
      },
      data: {
        "garage.toml": config.configToml,
        ...(config.initScript ? { "init.sh": config.initScript } : {}),
      },
    }, { ...opts, parent: this });

    // PVC for metadata
    this.metaPvc = new k8s.core.v1.PersistentVolumeClaim(`${name}-meta-pvc`, {
      metadata: {
        name: "garage-meta",
        namespace: ns,
      },
      spec: {
        accessModes: ["ReadWriteOnce"],
        resources: {
          requests: {
            storage: config.storageSize,
          },
        },
      },
    }, { ...opts, parent: this });

    // PVC for data
    this.dataPvc = new k8s.core.v1.PersistentVolumeClaim(`${name}-data-pvc`, {
      metadata: {
        name: "garage-data",
        namespace: ns,
      },
      spec: {
        accessModes: ["ReadWriteOnce"],
        resources: {
          requests: {
            storage: config.storageSize,
          },
        },
      },
    }, { ...opts, parent: this });

    // Deployment
    this.deployment = new k8s.apps.v1.Deployment(name, {
      metadata: {
        name: "garage",
        namespace: ns,
        labels: {
          app: "garage",
          "app.kubernetes.io/name": "garage",
          "app.kubernetes.io/component": "object-storage",
        },
      },
      spec: {
        replicas: config.replicaCount || 1,
        selector: {
          matchLabels: {
            app: "garage",
          },
        },
        template: {
          metadata: {
            labels: {
              app: "garage",
            },
          },
          spec: {
            volumes: [
              {
                name: "config",
                configMap: {
                  name: "garage-config",
                },
              },
              ...(config.initScript ? [{
                name: "scripts",
                configMap: {
                  name: "garage-config",
                },
              }] : []),
              {
                name: "garage-meta",
                persistentVolumeClaim: {
                  claimName: "garage-meta",
                },
              },
              {
                name: "garage-data",
                persistentVolumeClaim: {
                  claimName: "garage-data",
                },
              },
            ],
            containers: [
              {
                name: "garage",
                image: config.image || "dxflrs/garage:v2.2.0",
                command: config.initScript ? ["/bin/sh", "/scripts/init.sh"] : undefined,
                ports: [
                  { containerPort: 3900, name: "s3-endpoint" },
                  { containerPort: 3901, name: "rpc" },
                  { containerPort: 3902, name: "s3-web" },
                  { containerPort: 3903, name: "admin" },
                ],
                volumeMounts: [
                  {
                    name: "config",
                    mountPath: "/etc/garage.toml",
                    subPath: "garage.toml",
                  },
                  ...(config.initScript ? [{
                    name: "scripts",
                    mountPath: "/scripts/init.sh",
                    subPath: "init.sh",
                  }] : []),
                  {
                    name: "garage-meta",
                    mountPath: "/garage-meta",
                  },
                  {
                    name: "garage-data",
                    mountPath: "/garage-data",
                  },
                ],
              },
            ],
          },
        },
      },
    }, { ...opts, parent: this });

    // Service
    this.service = new k8s.core.v1.Service(`${name}-svc`, {
      metadata: {
        name: "garage",
        namespace: ns,
      },
      spec: {
        type: "ClusterIP",
        selector: {
          app: "garage",
        },
        ports: [
          { port: 3900, targetPort: 3900, name: "s3-endpoint", protocol: "TCP" },
          { port: 3901, targetPort: 3901, name: "rpc", protocol: "TCP" },
          { port: 3902, targetPort: 3902, name: "s3-web", protocol: "TCP" },
          { port: 3903, targetPort: 3903, name: "admin", protocol: "TCP" },
        ],
      },
    }, { ...opts, parent: this });
  }
}
