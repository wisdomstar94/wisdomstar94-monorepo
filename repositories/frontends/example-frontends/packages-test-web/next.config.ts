import type { NextConfig } from 'next';
import { load } from 'dotenv-mono';
load({
  depth: 8,
});

const config = {} satisfies NextConfig;
export default config;
