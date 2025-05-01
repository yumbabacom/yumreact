/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "bjorn66.com",
      "6ammart-test.6amdev.xyz",
      "192.168.50.168",
      "6ammart-dev.6amdev.xyz",
    ],
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
