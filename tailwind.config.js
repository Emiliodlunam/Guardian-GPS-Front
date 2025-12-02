/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2B7FBF',
          dark: '#1B5989',
          light: '#5BA3D9'
        },
        secondary: {
          DEFAULT: '#D99C50',
          dark: '#B97D30',
          light: '#E8B87A'
        },
        danger: '#E85A5A',
        success: '#5AE88A',
        dark: {
          DEFAULT: '#1E3A5F',
          light: '#2E4A6F'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
