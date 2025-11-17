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
        // Custom color palette
        cream: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5F2ED',
          300: '#EBE6DD',
        },
        'dark-slate': {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        },
        accent: {
          DEFAULT: '#374151',
          hover: '#1F2937',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#6B5B4F",
          "secondary": "#9CA3AF",
          "accent": "#8B7355",
          "neutral": "#3E342C",
          "base-100": "#E8DFD0",
          "base-200": "#D9CDB8",
          "base-300": "#C4B5A0",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
        dark: {
          "primary": "#374151",
          "secondary": "#6B7280",
          "accent": "#9CA3AF",
          "neutral": "#F3F4F6",
          "base-100": "#0F172A",
          "base-200": "#1E293B",
          "base-300": "#334155",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
}
