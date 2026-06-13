const assert = require('assert');
const calc = require('../src/calculator');

console.log('Running calculator unit tests...');

// Addition
assert.strictEqual(calc.add(2, 3), 5, '2 + 3 should equal 5');

// Subtraction
assert.strictEqual(calc.subtract(10, 4), 6, '10 - 4 should equal 6');

// Multiplication
assert.strictEqual(calc.multiply(45, 2), 90, '45 * 2 should equal 90');

// Division
assert.strictEqual(calc.divide(20, 5), 4, '20 / 5 should equal 4');

// Division by zero should throw
assert.throws(() => calc.divide(1, 0), /Division by zero/, 'divide(1,0) should throw Division by zero');

console.log('All tests passed.');
