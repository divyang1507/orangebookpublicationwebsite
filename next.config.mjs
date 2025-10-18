// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;




  const nextConfig = {
    images: {
      domains: [
        'img.freepik.com',
      ],
        remotePatterns: [
      {
        protocol: 'https',
        hostname: 'horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wcydrkiosxuthczhxcma.supabase.co', // Your Supabase project hostname
        pathname: '/storage/v1/object/public/bookimages/**', // Be specific if possible, or use '/**' to allow all paths
      },
    ],
    
    },
  };
  
  export default nextConfig;
  
