/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',                // Gör att Next.js kör `next export` och genererar statiska filer
    basePath: '/demo-repository',    // Viktigt! Sätter rätt "path" under organisationen
    assetPrefix: '/demo-repository/',// Gör att script och CSS laddas från rätt path
  };
  
  export default nextConfig;
  