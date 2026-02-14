import * as k8s from "@pulumi/kubernetes";
import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";

export interface TraefikConfig {
  namespace?: string;
  hostNetworkEnabled?: boolean;
  dnsPolicy?: string;
  serviceType?: string;
  nodeSelector?: Record<string, string>;
}

export interface TraefikOutputs {
  namespace: k8s.core.v1.Namespace;
  release: k8s.helm.v3.Release;
}

export class TraefikComponent extends ComponentResource implements TraefikOutputs {
  readonly namespace: k8s.core.v1.Namespace;
  readonly release: k8s.helm.v3.Release;

  constructor(name: string, config: TraefikConfig = {}, opts?: ComponentResourceOptions) {
    super("selfhost:applications:Traefik", name, {}, opts);

    const ns = config.namespace || "kube-system";
    const dnsPolicy = config.dnsPolicy || (config.hostNetworkEnabled ? "ClusterFirstWithHostNet" : "ClusterFirst");

    // Namespace
    this.namespace = new k8s.core.v1.Namespace(`${name}-ns`, {
      metadata: { name: ns },
    }, { ...opts, parent: this });

    // Traefik Helm Release
    this.release = new k8s.helm.v3.Release(`${name}-helm`, {
      name: "traefik",
      namespace: ns,
      chart: "traefik",
      repositoryOpts: {
        repo: "https://traefik.github.io/charts",
      },
      values: {
        hostNetwork: {
          enabled: config.hostNetworkEnabled,
        },
        dnsPolicy: dnsPolicy,
        service: {
          enabled: true,
          type: config.serviceType || "ClusterIP",
        },
        nodeSelector: config.nodeSelector || { "ingress-ready": "true" },
      },
    }, { ...opts, parent: this });
  }
}
