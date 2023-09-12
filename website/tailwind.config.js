module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#FFC0CB', // Pink
                secondary: '#FFFFFF', // White
            },
            backgroundColor: {
                primary: 'var(--color-primary)', // Pink background
                secondary: 'var(--color-secondary)', // White background
            },
            textColor: {
                primary: 'var(--color-primary)', // Pink text
                secondary: 'var(--color-secondary)', // White text
            },
        },
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['light', 'dark'],
        darkTheme: 'dark',
    },
};
