console.log();

console.log(`${__filename} loaded`);
console.log();

console.log(`Loading ./test-deps.js`);
const test = require('./test-deps.js');
console.log(`Result: ${JSON.stringify(test)}`);
console.log();

console.log(`Loading ././test-deps.js`);
const test2 = require('././test-deps.js');
console.log(`Result: ${JSON.stringify(test2)}`);

console.log();

class Test {
	hello = 'world';
}

console.log(`Hello ${new Test().hello}!`);
console.log();
