/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/tasks',
                permanent: true
            }
        ];
    },
    reactStrictMode: true,
    output: 'standalone',
    compiler: {
        styledComponents: true
    }
};

module.exports = nextConfig;
