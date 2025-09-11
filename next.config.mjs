/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "duyt4h9nfnj50.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
