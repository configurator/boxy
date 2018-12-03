# boxy

Boxy bundler is a webpack-like bundler, built for demonstrations.

Supported features:

-   bundling
-   multiple entry points
-   loaders - with a limited api (only standard loaders, no `pitch` phase, no plugins)
-   only relative module resolution is supported

### Installation

    npm install boxy-bundler

### Usage

    boxy-bundler [config-file]

If no config file is specified, no attempt is made to load a default filename - instead, a default configuration is assumed.

`config-file` looks like the following:

    module.exports = {
        entry: ['./index.js', './another-entry.js'],
        output: { filename: 'bundle.js' },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', { modules: false }],
                                    '@babel/preset-react',
                                ],
                                plugins: [
                                    '@babel/plugin-syntax-dynamic-import',
                                    '@babel/plugin-proposal-object-rest-spread',
                                    ['@babel/plugin-proposal-decorators', { legacy: true }],
                                    ['@babel/plugin-proposal-class-properties', { loose: true }],
                                ],
                            },
                        },
                    ],
                },
            ],
        },
    };

-   `entry` (required) - an array of strings pointing to entry points
-   `output.filename` (required) - a string
-   `module.rules` (required)
    -   each rule:
        -   `test` (required) - regex
        -   `use` - an array of loader definitions
            -   each loader:
                -   `loader` (required) - the name of the loader to `require`
                -   options (optional) - loader options, available to the loader via `this.query`
