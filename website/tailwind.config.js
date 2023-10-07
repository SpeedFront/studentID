module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    plugins: [require('daisyui'), require('tailwind-scrollbar')({ nocompatible: true })],
    daisyui: {
        themes: [
            {
                mythemedark: {
                    primary: '#641ae6',
                    secondary: '#d926a9',
                    accent: '#1fb2a6',
                    neutral: '#1d232a',
                    'base-100': '#000',
                    info: '#3abff8',
                    success: '#36d399',
                    warning: '#fbbd23',
                    error: 'red',
                },
                mythemelight: {
                    primary: '#641ae6',
                    secondary: '#d926a9',
                    accent: '#1fb2a6',
                    neutral: '#2a323c',
                    'base-100': '#fff',
                    info: '#3abff8',
                    success: '#36d399',
                    warning: '#fbbd23',
                    error: 'red',
                },
            },
        ],
        darkTheme: 'mythemedark',
    },
};
