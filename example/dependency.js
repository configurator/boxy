console.log(`Inside dependency.js`);

class Thing {
	hello = 'world';
}

module.exports = new Thing();
