const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const findDependencies = async compiled => {
	const ast = await parse(compiled);

	const dependencies = {};
	await traverse(ast, {
		CallExpression: ({ node }) => {
			if (node.callee.type === 'Identifier' && node.callee.name === 'require') {
				if (node.arguments.length !== 1) {
					throw new Error(
						`require called with ${node.arguments.length} parameters, expected 1`,
					);
				}
				if (node.arguments[0].type !== 'StringLiteral') {
					throw new Error(`require must be called with a fixed string literal`);
				}
				dependencies[node.arguments[0].value] = true;
			}
		},
	});

	return dependencies;
};

module.exports = { findDependencies };
