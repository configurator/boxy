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
