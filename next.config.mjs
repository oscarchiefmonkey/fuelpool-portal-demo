const isProd = process.env.NODE_ENV === 'production';
const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Använd basePath och assetPrefix endast för GitHub Pages deployment
  ...(isGithubPages && {
    basePath: '/fuelpool-portal-demo',
    assetPrefix: '/fuelpool-portal-demo/',
  }),
};

export default nextConfig;
