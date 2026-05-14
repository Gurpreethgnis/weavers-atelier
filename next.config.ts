import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/custom-shirts",
        destination: "/shop/shirts",
        permanent: true,
      },
      {
        source: "/trousers",
        destination: "/shop/trousers",
        permanent: true,
      },
      {
        source: "/denim",
        destination: "/shop/denim",
        permanent: true,
      },
      {
        source: "/instagram-looks",
        destination: "/lookbook",
        permanent: true,
      },
      {
        source: "/book-consultation",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/book-consultation/:type*",
        destination: "/shop",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
