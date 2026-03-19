/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true
  }
};

const withCloudflare = require("@opennextjs/cloudflare");
module.exports = withCloudflare(nextConfig);
