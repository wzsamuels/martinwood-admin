/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'martinwoodworks.s3.amazonaws.com',
        port: '',
      },
    ],
  },
};
