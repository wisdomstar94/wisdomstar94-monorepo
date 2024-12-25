import type { NextConfig } from 'next';
import { load } from 'dotenv-mono';
load({
  depth: 8,
});

const config = {
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
} satisfies NextConfig;
export default config;
