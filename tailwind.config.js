/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: '#1C3D35',
        'forest-mid': '#2D5A4D',
        'forest-light': '#3D7A6A',
        cream: '#F8F4EE',
        'cream-dark': '#EFE7D8',
        orange: '#E8632A',
        magenta: '#D63384',
        purple: '#7B4FBF',
        gold: '#F5C518',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
