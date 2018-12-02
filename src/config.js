const path = require('path');

const defaultConfig = {
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

const loadConfig = () => {
	switch (process.argv.length) {
		case 2:
			return defaultConfig;

		case 3:
			return require(path.resolve(process.argv[2]));

		default:
			throw new Error('Expected 0 or 1 commandline parameters');
	}
};

module.exports = loadConfig();
