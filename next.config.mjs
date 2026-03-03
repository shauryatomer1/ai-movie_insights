/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "m.media-amazon.com",
            },
            {
                protocol: "https",
                hostname: "ia.media-imdb.com",
            },
        ],
    },
};

export default nextConfig;
