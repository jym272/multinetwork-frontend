const path = require('path');

const buildEslintCommand = filenames =>
    `next lint --fix --file ${filenames.map(f => path.relative(process.cwd(), f)).join(' --file ')}`;

const prettierCommand = filenames => `prettier --write ${filenames.join(' ')}`;

module.exports = {
    // Type check TypeScript files
    '**/*.(ts|tsx)': () => 'yarn tsc --noEmit --pretty',

    // Lint & Prettify TS and JS files
    // '**/*.(ts|tsx|js)': filenames => [`yarn lint ${filenames.join(' ')}`, `yarn prettier --write ${filenames.join(' ')}`],
    '*.{js,jsx,ts,tsx}': [buildEslintCommand, prettierCommand],

    // Prettify only Markdown and JSON files
    '**/*.(md|json)': filenames => `yarn prettier --write ${filenames.join(' ')}`
};
