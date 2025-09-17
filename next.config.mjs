const isProd = process.env.NODE_ENV === 'production';
const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Använd basePath och assetPrefix för GitHub Pages deployment
  basePath: isGithubPages ? '/fuelpool-portal-demo' : '',
  assetPrefix: isGithubPages ? '/fuelpool-portal-demo/' : '',
};

export default nextConfig;
