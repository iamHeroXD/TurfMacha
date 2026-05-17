declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "next-pwa" {
  import type { NextConfig } from "next";
  interface PWAOptions {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    buildExcludes?: RegExp[];
    fallbacks?: { document?: string; image?: string; font?: string };
    [key: string]: unknown;
  }
  function withPWAInit(options: PWAOptions): (config: NextConfig) => NextConfig;
  export default withPWAInit;
}
