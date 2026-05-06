/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/validator", "@workspace/ui", "@workspace/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-ed50815cb6224b8d8c84f55474767c07.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.febriardiansyah.my.id",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://portofolio-monorepo-production.up.railway.app/api/:path*",
      },
    ]
  },
}

export default nextConfig
