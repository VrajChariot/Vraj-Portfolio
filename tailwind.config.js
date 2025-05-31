/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./*.html",                     // Watches HTML files in the root directory
    "./src/**/*.html",              // Watches HTML files in the 'src' directory and its subdirectories
    "./src/**/*.ejs",               // Watches .ejs files in the 'src' directory and its subdirectories
    "./views/**/*.ejs",             // Watches .ejs files in a 'views' directory (at the project root) and its subdirectories
  ],
  theme: {
    extend: {
      backgroundColor: {
        'menu-bg': 'rgba(18, 18, 18, 0.95)'
      },
      colors: {
        'primary-bg': '#131712',
        'accent': '#00ff84',
        'content': '#ffffff',
        'content-secondary': '#a0a0a0',
        'glass-bg': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'accent-darker': '#00e676',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(120deg)' },
          '66%': { transform: 'translateY(10px) rotate(240deg)' },
        },
        gridMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
        heroFadeIn: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        typewriter: {
          'to': { width: '100%' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceInPlace: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        skillAppear: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'grid-move': 'gridMove 20s linear infinite',
        'hero-fade-in': 'heroFadeIn 2s ease-out 0.5s forwards',
        'typewriter': 'typewriter 3s steps(11) 1s forwards',
        'slide-up-slow': 'slideUp 1s ease-out 2s backwards',
        'slide-up-slower': 'slideUp 1s ease-out 2.5s backwards',
        'slide-up-slowest': 'slideUp 1s ease-out 3s backwards',
        'bounce-custom': 'bounceInPlace 2s infinite',
        'skill-appear': 'skillAppear 0.6s ease-out forwards',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(0,255,132,0.03)_1px,transparent_1px), linear-gradient(90deg,rgba(0,255,132,0.03)_1px,transparent_1px)",
      },
      backgroundSize: {
        'grid-size': '50px 50px',
      },
      boxShadow: {
        'accent': '0 0 30px rgba(0, 255, 132, 0.5)',
        'accent-md': '0 0 20px rgba(0, 255, 132, 0.4)',
        'accent-lg': '0 0 30px rgba(0, 255, 132, 0.6)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'project-card': '0 10px 40px rgba(0,0,0,0.3)',
        'project-card-hover': '0 30px 60px rgba(0, 255, 132, 0.15), 0 0 0 1px rgba(0, 255, 132, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'experience-card-hover': '0 20px 40px rgba(0, 255, 132, 0.15)',
        'input-focus': '0 0 20px rgba(0, 255, 132, 0.2)',
      }
    },
  },
  plugins: [],
}; // <<--- Your existing config ends here

// Add this line for debugging:
console.log('tailwind.config.js EXECUTION CHECKPOINT. Custom colors:', JSON.stringify(config.theme.extend.colors, null, 2));

module.exports = config; // This was already here