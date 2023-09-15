/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [
            'puppeteer-extra',
            'puppeteer-extra-plugin-stealth',
            'puppeteer-extra-plugin-recaptcha',
            'chrome-aws-lambda',
        ],
    },
};

module.exports = nextConfig;
