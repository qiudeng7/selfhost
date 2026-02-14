import * as k8s from "@pulumi/kubernetes";
import { ComponentResource, ComponentResourceOptions, Output } from "@pulumi/pulumi";

export interface IngressRuleConfig {
  host: string;
  serviceNamespace: string;
  serviceName: string;
  servicePort: number;
}

export interface IngressConfig {
  namespace?: string;
  className?: string;
  rules: IngressRuleConfig[];
}

export class IngressComponent extends ComponentResource {
  readonly ingress: k8s.networking.v1.Ingress;

  constructor(
    name: string,
    config: IngressConfig,
    opts?: ComponentResourceOptions,
  ) {
    super("selfhost:applications:Ingress", name, {}, opts);

    const ns = config.namespace || "default";

    this.ingress = new k8s.networking.v1.Ingress(
      name,
      {
        metadata: {
          name: name,
          namespace: ns,
          annotations: {
            "traefik.ingress.kubernetes.io/router.entrypoints": "web",
          },
        },
        spec: {
          ingressClassName: config.className || "traefik",
          rules: config.rules.map((rule) => ({
            host: rule.host,
            http: {
              paths: [
                {
                  path: "/",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: rule.serviceName,
                      port: {
                        number: rule.servicePort,
                      },
                    },
                  },
                },
              ],
            },
          })),
        },
      },
      { ...opts, parent: this },
    );
  }
}
