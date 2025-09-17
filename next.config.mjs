const nextConfig = {
  // Ta bort output: 'export' för Vercel
  // output: 'export', // Kommenterad ut för Vercel
  images: {
    unoptimized: false, // Vercel kan optimera bilder
  },
  // Ta bort basePath och assetPrefix för Vercel
  // basePath: '/fuelpool-portal-demo',
  // assetPrefix: '/fuelpool-portal-demo/',
};

export default nextConfig;
