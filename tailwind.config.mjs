/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        spacing: Array.from({ length: 1000 }).reduce((map, _, index) => {
            map[index] = `${index}px`;
            return map;
        }, {}),
        extend: {
            fontFamily: { sans: 'HarmonyOS Sans SC' },
            fontSize: ({ theme }) => ({ ...theme('spacing') }),
            gridTemplateRows: {
                24: 'repeat(24, minmax(0, 1fr))'
            }
        }
    },
    plugins: []
};
