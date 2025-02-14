/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["localhost", "blue-parental-mackerel-801.mypinata.cloud"], // ✅ Allow external images from GitHub
      },
};

export default nextConfig;
