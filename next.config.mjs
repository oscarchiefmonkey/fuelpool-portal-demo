const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Använd basePath och assetPrefix endast för production (GitHub Pages)
  ...(isDev ? {} : {
    basePath: '/fuelpool-portal-demo',
    assetPrefix: '/fuelpool-portal-demo/',
  }),
};

export default nextConfig;
