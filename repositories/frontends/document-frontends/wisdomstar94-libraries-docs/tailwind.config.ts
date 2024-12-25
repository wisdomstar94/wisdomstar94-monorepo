import type { Config } from 'tailwindcss';
import type { PluginCreator } from 'tailwindcss/types/config';

const staticVariantPlugin: PluginCreator = ({ addVariant }) => {
  addVariant('sidebar-opend', ['.sidebar-opend &', '.sidebar-opend&']);
  addVariant('sidebar-collapsed', ['.sidebar-collapsed &', '.sidebar-collapsed&']);
};

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'paperlogy-100-thin': 'Paperlogy-Thin, sans-serif',
        'paperlogy-200-extra-light': 'Paperlogy-ExtraLight, sans-serif',
        'paperlogy-300-light': 'Paperlogy-Light, sans-serif',
        'paperlogy-400-regular': 'Paperlogy-Regular, sans-serif',
        'paperlogy-500-medium': 'Paperlogy-Medium, sans-serif',
        'paperlogy-600-semi-bold': 'Paperlogy-SemiBold, sans-serif',
        'paperlogy-700-bold': 'Paperlogy-Bold, sans-serif',
        'paperlogy-800-extra-bold': 'Paperlogy-ExtraBold, sans-serif',
        'paperlogy-900-black': 'Paperlogy-Black, sans-serif',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      width: {
        'layout-sidebar-width': `var(--layout-sidebar-width)`,
        'layout-sidebar-width-m': `var(--layout-sidebar-width-m)`,
        'layout-topbar-width': `var(--layout-topbar-width)`,
        'layout-topbar-width-m': `var(--layout-topbar-width-m)`,
        'layout-contentbar-width': `var(--layout-contentbar-width)`,
        'layout-contentbar-width-m': `var(--layout-contentbar-width-m)`,
      },
      maxWidth: {
        'layout-sidebar-max-width': `var(--layout-sidebar-max-width)`,
        'layout-sidebar-max-width-m': `var(--layout-sidebar-max-width-m)`,
      },
      height: {
        'layout-sidebar-height': `var(--layout-sidebar-height)`,
        'layout-sidebar-height-m': `var(--layout-sidebar-height-m)`,
        'layout-topbar-height': `var(--layout-topbar-height)`,
        'layout-topbar-height-m': `var(--layout-topbar-height-m)`,
        'layout-contentbar-height': `var(--layout-contentbar-height)`,
        'layout-contentbar-height-m': `var(--layout-contentbar-height-m)`,
      },
      inset: {
        'layout-sidebar-top': `var(--layout-sidebar-top)`,
        'layout-sidebar-top-m': `var(--layout-sidebar-top-m)`,
        'layout-sidebar-left': `var(--layout-sidebar-left)`,
        'layout-sidebar-left-m': `var(--layout-sidebar-left-m)`,
        'layout-topbar-top': `var(--layout-topbar-top)`,
        'layout-topbar-top-m': `var(--layout-topbar-top-m)`,
        'layout-topbar-left': `var(--layout-topbar-left)`,
        'layout-topbar-left-m': `var(--layout-topbar-left-m)`,
        'layout-contentbar-top': `var(--layout-contentbar-top)`,
        'layout-contentbar-top-m': `var(--layout-contentbar-top-m)`,
        'layout-contentbar-left': `var(--layout-contentbar-left)`,
        'layout-contentbar-left-m': `var(--layout-contentbar-left-m)`,
      },
      keyframes: {
        appear: {
          '0%': {
            width: '100%',
            height: '100%',
            opacity: '0',
          },
          '1%': {
            width: '100%',
            height: '100%',
            opacity: '0',
          },
          '100%': {
            width: '100%',
            height: '100%',
            opacity: '1',
          },
        },
        dissapear: {
          '0%': {
            width: '100%',
            height: '100%',
            opacity: '1',
          },
          '99%': {
            width: '100%',
            height: '100%',
            opacity: '0',
          },
          '100%': {
            width: '0px',
            height: '0px',
            opacity: '0',
          },
        },
      },
      animation: {
        appear: 'appear 0.3s ease-out both',
        dissapear: 'dissapear 0.3s ease-out both',
      },
    },
  },
  plugins: [staticVariantPlugin],
} satisfies Config;
