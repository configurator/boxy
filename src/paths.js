const path = require('path');
const fs = require('fs-extra');

const dirname = path.dirname;
const extension = file => path.extname(file).replace(/^\./, '');

const cwd = process.cwd();

const resolve = async (context, request) => {
	let result;

	const pathParts = request.split('/');
	if (pathParts[0] === '.' || pathParts[0] === '..') {
		result = path.resolve(context, request);
	} else {
		throw new Error(`Non-relative paths (${request}) are not yet supported`);
	}

	let stat = await fs.stat(result);
	if (stat.isDirectory()) {
		result = path.join(result, 'index.js');
		stat = await fs.stat(result);
	}

	if (!stat.isFile()) {
		throw new Error(`${result} is not a regular file, and cannot be required`);
	}

	return result;
};

const relative = async request => './' + path.relative(cwd, request);

module.exports = {
	cwd,
	dirname,
	extension,
	resolve,
	relative,
};
