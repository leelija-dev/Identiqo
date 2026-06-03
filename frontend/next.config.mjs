import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: projectRoot,
  },
  devIndicators: {
    autoPrerender: false,
    buildActivity: false,
    buildActivityPosition: 'bottom-right', // but we are disabling it anyway
  },
};

export default nextConfig;
