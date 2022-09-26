/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    KEY: process.env.PRIVATE_KEY,
    KEY_POAP: process.env.PRIVATE_KEY_MAIN //AWS,
  }
}

module.exports = nextConfig
