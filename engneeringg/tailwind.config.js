export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#070707',
        charcoal: '#121212',
        gold: 'rgb(255 190 0)',
        'gold-2': 'rgb(255 214 92)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,190,0,0.35), 0 8px 30px rgba(255,190,0,0.12)',
        'glow-strong': '0 0 0 1px rgba(255,190,0,0.55), 0 12px 45px rgba(255,190,0,0.18)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
