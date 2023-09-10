//prettier.config.js

/** @type {import('prettier').Config} */
module.exports = {
    trailingComma: 'all',
    arrowParens: 'avoid',
    singleQuote: true,
    printWidth: 120,
    tabWidth: 4,
    semi: true,
    plugins: [import('prettier-plugin-tailwindcss')],
    tailwindConfig: './tailwind.config.js',
    tailwindAttributes: ['modalStyles', 'titleStyles', 'subtitleStyles', 'iconStyles'],
    tailwindFunctions: ['clsx', 'cn'],
};
