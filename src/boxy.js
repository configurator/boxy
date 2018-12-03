#!/usr/bin/env node

const fs = require('fs-extra');
const config = require('./config');
const paths = require('./paths');
const { applyLoaders } = require('./loaders');
const { findDependencies } = require('./find-dependencies');

const loadModule = async absolute => {
	const module = {
		absolute,
		relative: await paths.relative(absolute),
		type: await paths.extension(absolute),
		moduleDir: await paths.dirname(absolute),
	};

	const source = await fs.readFile(absolute, 'utf-8');
	const compiled = await applyLoaders(source, module);
	const dependencies = await findDependencies(compiled);

	return {
		...module,

		source,
		compiled,

		dependencies,
	};
};

const createBundle = async (modules, entryModules) => `
const boxy = {
	bundle: {${Object.values(modules)
		.map(
			module => `
		'${module.id}': {
/******************** ${module.relative} ********************/
			id: ${module.id},
			absolute: ${JSON.stringify(module.absolute)},
			relative: ${JSON.stringify(module.relative)},
			moduleDir: ${JSON.stringify(module.moduleDir)},
			exports: {},
			dependencies: ${JSON.stringify(module.dependencies)},
			exec: function (require, module) {
				return (function (exports, __filename, __dirname) {
${module.compiled}
				})(module.exports, module.absolute, module.moduleDir);
			}
/******************** end ${module.relative} ********************/
		}`,
		)
		.join(',')}
	},
	require: function (id) {
		const module = boxy.bundle[id];
		if (!module) {
			throw new Error('Invalid module id: ' + id);
		}

		if (!module.loaded) {
			module.loaded = true;
			module.require = function (dependencyPath) {
				const id = module.dependencies[dependencyPath];
				if (!id) {
					throw new Error('Invalid module path: ' + dependencyPath);
				}
				return boxy.require(id);
			};
			module.exec(module.require, module);
		}

		return module.exports;
	}
};

${entryModules.map(module => `boxy.require(${module.id});`).join('\n')}
`;

const bundle = async () => {
	try {
		const startTime = Date.now();

		const modules = {};
		let maxModuleId = 0;

		const collectModule = async (request, contextDirectory) => {
			const absolute = await paths.resolve(contextDirectory, request);
			if (modules[absolute]) {
				return modules[absolute];
			}

			const module = await loadModule(absolute);
			module.id = maxModuleId++;
			modules[absolute] = module; // This must happen before dependencies to avoid infinite loops

			for (const path of Object.keys(module.dependencies)) {
				const resolvedModule = await collectModule(path, module.moduleDir);
				module.dependencies[path] = resolvedModule.id;
			}

			return module;
		};

		// Collect the primary entry point, and everything it leads to
		const entryModules = [];
		for (const entry of config.entry) {
			entryModules.push(await collectModule(entry, paths.cwd));
		}

		// Create a bundle
		const bundle = await createBundle(modules, entryModules);

		await fs.writeFile(config.output.filename, bundle);
		console.log(`Build finished in ${Date.now() - startTime}ms - ${config.output.filename}`);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
};

bundle();
