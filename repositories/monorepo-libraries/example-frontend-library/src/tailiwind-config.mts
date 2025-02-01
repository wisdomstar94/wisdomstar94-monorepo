import type { Config } from 'tailwindcss';

export function getTailwindConfig(overrideConfig?: Partial<Config>): Config {
  const config: Config = {
    ...overrideConfig,
    content: overrideConfig?.content ?? ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
      ...overrideConfig?.theme,
      extend: {
        ...overrideConfig?.theme?.extend,
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          ...overrideConfig?.theme?.extend?.backgroundImage,
        },
      },
    },
    plugins: overrideConfig?.plugins,
  };
  return config;
}
