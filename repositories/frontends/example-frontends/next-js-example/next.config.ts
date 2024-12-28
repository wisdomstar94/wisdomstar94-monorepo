import type { NextConfig } from 'next';

const config = {
  reactStrictMode: false,
  experimental: {
    dynamicIO: true,
    staleTimes: {
      dynamic: 0,
    },
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
} satisfies NextConfig;
export default config;
