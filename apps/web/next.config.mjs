/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-ed50815cb6224b8d8c84f55474767c07.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
