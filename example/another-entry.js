console.log(`Inside another-entry.js`);

const dependency = require('./dependency.js');

console.log(`another-entry says: hello ${dependency.hello}`);
