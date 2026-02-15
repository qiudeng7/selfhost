import * as k8s from "@pulumi/kubernetes";
import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";

export interface GarageJobConfig {
  namespace: string;
  image: string;
  commands: string[];
  args?: string[];
  env?: Record<string, string>;
  restartPolicy?: "OnFailure" | "Never";
}

export class GarageInitJob extends ComponentResource {
  readonly job: k8s.batch.v1.Job;

  constructor(name: string, config: GarageJobConfig, opts?: ComponentResourceOptions) {
    super("selfhost:jobs:GarageInit", name, {}, opts);

    const env = config.env
      ? Object.entries(config.env).map(([name, value]) => ({ name, value }))
      : [];

    this.job = new k8s.batch.v1.Job(
      name,
      {
        metadata: {
          name: name,
          namespace: config.namespace,
        },
        spec: {
          backoffLimit: 3,
          template: {
            spec: {
              containers: [
                {
                  name: "garage-cli",
                  image: config.image,
                  command: config.commands,
                  args: config.args,
                  env: env.length > 0 ? env : undefined,
                },
              ],
              restartPolicy: config.restartPolicy || "OnFailure",
            },
          },
        },
      },
      { ...opts, parent: this },
    );
  }
}
