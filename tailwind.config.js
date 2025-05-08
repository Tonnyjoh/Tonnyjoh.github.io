/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  darkMode: 'class',
    theme: {
        extend: {
            colors: {
                trueblack: '#0A0A0A',
                darkgray: '#121212',
            },
            fontFamily: {
                'mono': ['IBM Plex Mono', 'monospace'],
            },
            animation: {
                'typewriter': 'typing 3.5s steps(40, end)',
                'blink-caret': 'blink-caret 0.75s step-end infinite',
                'rocket-launch': 'launch 2s ease-in-out',
                'rocket-float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                typing: {
                    from: { width: '0' },
                    to: { width: '100%' }
                },
                'blink-caret': {
                    'from, to': { 'border-color': 'transparent' },
                    '50%': { 'border-color': 'currentColor' }
                },
                launch: {
                    '0%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-10px) rotate(3deg)' },
                    '100%': { transform: 'translateY(-20px) rotate(0deg)' }
                },
                float: {
                    '0%': { transform: 'translateY(-20px)' },
                    '50%': { transform: 'translateY(-28px)' },
                    '100%': { transform: 'translateY(-20px)' }
                }
            }
        }
    },
  plugins: [],
}

