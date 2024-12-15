import type { NextConfig } from 'next';
import { load } from 'dotenv-mono';
load();

const config = {
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
} satisfies NextConfig;
export default config;
