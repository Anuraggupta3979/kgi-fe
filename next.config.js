/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
const withPWA = require("next-pwa")({
  dest: "public", // Service worker and manifest will be generated here
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
});
// module.exports = nextConfig;
