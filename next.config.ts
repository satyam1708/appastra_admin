/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tridentastrafiles.s3.us-east-1.amazonaws.com', // ✅ Correct hostname added
        port: '',
        pathname: '/public/**', // ✅ Allows images from the 'public' folder
      },
    ],
  },
};

module.exports = nextConfig;