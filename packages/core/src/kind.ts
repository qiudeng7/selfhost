import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface KindClusterInfo {
  name: string;
}

export interface CreateClusterOptions {
  name?: string;
  config?: string;
  image?: string;
  kubeconfig?: string;
  wait?: string;
  retain?: boolean;
}

export interface DeleteClusterOptions {
  name?: string;
  kubeconfig?: string;
}

/**
 * 获取所有 kind 集群列表
 */
export async function getClusters(): Promise<string[]> {
  try {
    const { stdout } = await execAsync("kind get clusters");
    return stdout.trim().split("\n").filter(Boolean);
  } catch (error) {
    return [];
  }
}

/**
 * 检查指定集群是否存在
 */
export async function clusterExists(name: string): Promise<boolean> {
  const clusters = await getClusters();
  return clusters.includes(name);
}

/**
 * 创建 kind 集群
 */
export async function createCluster(options: CreateClusterOptions = {}): Promise<void> {
  const args: string[] = [];

  if (options.name) {
    args.push(`--name ${options.name}`);
  }
  if (options.config) {
    args.push(`--config ${options.config}`);
  }
  if (options.image) {
    args.push(`--image ${options.image}`);
  }
  if (options.kubeconfig) {
    args.push(`--kubeconfig ${options.kubeconfig}`);
  }
  if (options.wait) {
    args.push(`--wait ${options.wait}`);
  }
  if (options.retain) {
    args.push("--retain");
  }

  const cmd = `kind create cluster ${args.join(" ")}`;
  console.log(`Running: ${cmd}`);

  const { stdout, stderr } = await execAsync(cmd);
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
}

/**
 * 删除 kind 集群
 */
export async function deleteCluster(options: DeleteClusterOptions = {}): Promise<void> {
  const args: string[] = [];

  if (options.name) {
    args.push(`--name ${options.name}`);
  }
  if (options.kubeconfig) {
    args.push(`--kubeconfig ${options.kubeconfig}`);
  }

  const cmd = `kind delete cluster ${args.join(" ")}`;
  console.log(`Running: ${cmd}`);

  const { stdout, stderr } = await execAsync(cmd);
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
}

/**
 * 获取集群的 kubeconfig
 */
export async function getKubeconfig(options: { name?: string; internal?: boolean } = {}): Promise<string> {
  const args: string[] = [];

  if (options.name) {
    args.push(`--name ${options.name}`);
  }
  if (options.internal) {
    args.push("--internal");
  }

  const { stdout } = await execAsync(`kind get kubeconfig ${args.join(" ")}`);
  return stdout;
}

/**
 * 导出集群的 kubeconfig 到文件
 */
export async function exportKubeconfig(options: { name?: string; kubeconfig?: string } = {}): Promise<void> {
  const args: string[] = [];

  if (options.name) {
    args.push(`--name ${options.name}`);
  }
  if (options.kubeconfig) {
    args.push(`--kubeconfig ${options.kubeconfig}`);
  }

  const cmd = `kind export kubeconfig ${args.join(" ")}`;
  console.log(`Running: ${cmd}`);

  const { stdout, stderr } = await execAsync(cmd);
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
}
