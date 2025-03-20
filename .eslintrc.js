const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    globals: {
        cy: 'readonly',
        Cypress: 'readonly',
    },
    rules: {
        'import/extensions': [2, 'ignorePackages'],
    },
    overrides: [
        {
            files: ['*.test.js'],
            rules: {
                'no-unused-vars': 'off',
            },
        },
    ],
}
