/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // wildcard'lı tanım
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
