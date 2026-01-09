/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                accent: '#ee5599', // Rose Pink
                calm: {
                    bg: '#fdfbf7',   // Warm/Off-white
                    text: '#4a4a4a', // Soft Dark Gray
                    subtext: '#78716c', // Warm Gray
                },
                tufs: {
                    navy: '#5c5470', // Replaced Navy with a softer purple/gray for legacy support, or keep it as brand? 
                    // User asked for "calm color scheme". The hard navy #002D56 is very strong.
                    // Let's make tufs-navy a bit softer or just rely on the new palette.
                    // If I change tufs-navy to something else, it updates everywhere.
                    // Let's try a softer dark blue-gray.
                    text: '#4a4a4a',
                    bg: '#fdfbf7',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                rounded: ['"M PLUS Rounded 1c"', 'sans-serif'],
            },
        }
    },
    plugins: [],
}
