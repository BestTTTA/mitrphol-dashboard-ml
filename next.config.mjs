/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/', 
          destination: '/zone/sb', 
          permanent: true, 
        },
      ];
    },
    
    staticPageGenerationTimeout: 6000,
  };
  
  export default nextConfig;
  