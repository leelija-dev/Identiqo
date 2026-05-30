/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    autoPrerender: false,
    buildActivity: false,
    buildActivityPosition: 'bottom-right', // but we are disabling it anyway
  },
};

export default nextConfig;