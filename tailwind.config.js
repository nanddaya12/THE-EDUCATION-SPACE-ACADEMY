/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Logo-Aligned Education Space Color Tokens
        primary: {
          DEFAULT: "#ea580c",
          light: "#f97316",
          hover: "#c2410c",
          fixed: "#ffedd5",
          container: "#ea580c",
          dark: "#9a3412",
          "fixed-dim": "#fdba74"
        },
        "primary-container": "#ea580c",
        "primary-fixed": "#ffedd5",
        "primary-fixed-dim": "#fdba74",
        "on-primary": "#ffffff",
        "on-primary-container": "#ffffff",
        "on-primary-fixed": "#431407",
        "on-primary-fixed-variant": "#9a3412",

        surface: {
          DEFAULT: "#f8f9ff",
          dim: "#cbdbf5",
          bright: "#f8f9ff",
          variant: "#d3e4fe",
          tint: "#9f4216",
          lowest: "#ffffff",
          low: "#eff4ff",
          container: "#e5eeff",
          high: "#dce9ff",
          highest: "#d3e4fe"
        },
        "surface-dim": "#cbdbf5",
        "surface-bright": "#f8f9ff",
        "surface-variant": "#d3e4fe",
        "surface-tint": "#9f4216",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        background: "#f8f9ff",

        "on-surface": "#0b1c30",
        "on-surface-variant": "#56423b",
        "on-background": "#0b1c30",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "inverse-primary": "#ffb598",

        "admin-sidebar": "#0b1c30",

        secondary: {
          DEFAULT: "#5f5e5e",
          container: "#e2dfde"
        },
        "secondary-container": "#e2dfde",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#636262",
        "secondary-fixed": "#e5e2e1",
        "secondary-fixed-dim": "#c8c6c5",
        "on-secondary-fixed": "#1c1b1b",
        "on-secondary-fixed-variant": "#474746",

        tertiary: {
          DEFAULT: "#5a5c5d",
          container: "#737576"
        },
        "tertiary-container": "#737576",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fcfdfe",
        "tertiary-fixed": "#e1e3e4",
        "tertiary-fixed-dim": "#c5c7c8",
        "on-tertiary-fixed": "#191c1d",
        "on-tertiary-fixed-variant": "#454748",

        outline: "#897269",
        "outline-variant": "#ddc1b7",

        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6"
        },
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a"
      },
      fontFamily: {
        display: ['"Hanken Grotesk"', 'sans-serif'],
        headline: ['"Hanken Grotesk"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'sans-serif'],
        code: ['"JetBrains Mono"', 'monospace']
      },
      borderRadius: {
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1.25rem',
        'full': '9999px'
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(11,28,48,0.06)',
        'float': '0 12px 36px rgba(155,63,20,0.14)',
        'card': '0 2px 12px rgba(11,28,48,0.04)'
      },
      spacing: {
        'sidebar-width': '260px',
        'gutter': '24px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '32px',
        'margin-mobile': '16px',
        'margin-desktop': '40px',
        'container-max': '1440px'
      },
      maxWidth: {
        'container-max': '1440px'
      }
    },
  },
  plugins: [],
}
