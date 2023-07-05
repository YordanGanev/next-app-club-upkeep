/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: {
            ssr: true,
        },
    },
};

module.exports = nextConfig;

module.exports = {
    images: {
        remotePatterns: [{
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "s.gravatar.com",
                port: "",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "i0.wp.com",
                port: "",
                pathname: "**",
            },
        ],
    },
}