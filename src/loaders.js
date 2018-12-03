const { defer } = require('bluebird');
const {
	module: { rules },
} = require('./config');

const applyLoader = async (source, loader, options) => {
	let isAsync = false;
	let asyncDeferred;

	const context = {
		query: options,
		async: () => {
			isAsync = true;
			asyncDeferred = defer();
			return (err, result) => {
				if (err) {
					asyncDeferred.reject(err);
				} else {
					asyncDeferred.resolve(result);
				}
			};
		},
		cacheable: () => {},
	};

	let result = await loader.call(context, source);
	if (isAsync) {
		result = await asyncDeferred.promise;
	}
	return result;
};

const findMatchingRule = absolute => {
	for (const rule of rules) {
		if (rule.test.test(absolute)) {
			return rule.use;
		}
	}
	return [];
};

const applyLoaders = async (source, { absolute }) => {
	const loaders = findMatchingRule(absolute);

	for (const { loader, options } of loaders.reverse()) {
		const result = await applyLoader(source, require(loader), options);
		if (typeof result === 'string') {
			source = result;
		} else {
			console.log(result);
			throw new Error(`Invalid result type ${typeof result}`);
		}
	}

	return source;
};

module.exports = {
	applyLoaders,
};
