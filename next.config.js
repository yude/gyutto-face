/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack: (config) => {
        config.externals = [...config.externals, "canvas", "jsdom"];
        return config
    }
}

module.exports = nextConfig
