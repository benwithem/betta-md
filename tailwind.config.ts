import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'mantine-primary': 'var(--mantine-primary-color)',
        'mantine-text': 'var(--mantine-color-text)',
        'mantine-body': 'var(--mantine-color-body)',
        aqua: {
          50: 'var(--mantine-color-blue-0)',
          100: 'var(--mantine-color-blue-1)',
          200: 'var(--mantine-color-blue-2)',
          300: 'var(--mantine-color-blue-3)',
          400: 'var(--mantine-color-blue-4)',
          500: 'var(--mantine-color-blue-5)',
          600: 'var(--mantine-color-blue-6)',
          700: 'var(--mantine-color-blue-7)',
          800: 'var(--mantine-color-blue-8)',
          900: 'var(--mantine-color-blue-9)',
        },
      },
      spacing: {
        'mantine-xs': 'var(--mantine-spacing-xs)',
        'mantine-sm': 'var(--mantine-spacing-sm)',
        'mantine-md': 'var(--mantine-spacing-md)',
        'mantine-lg': 'var(--mantine-spacing-lg)',
        'mantine-xl': 'var(--mantine-spacing-xl)',
      },
      borderRadius: {
        'mantine-sm': 'var(--mantine-radius-sm)',
        'mantine-md': 'var(--mantine-radius-md)',
        'mantine-lg': 'var(--mantine-radius-lg)',
      },
    },
  },
  plugins: [],
  important: false,
};

export default config;
