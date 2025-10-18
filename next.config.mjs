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
    ],
    },
  };
  
  export default nextConfig;
  
