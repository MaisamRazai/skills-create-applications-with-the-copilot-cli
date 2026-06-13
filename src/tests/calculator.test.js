const { expect } = require('chai');
const calc = require('../../src/calculator');

describe('Calculator - basic operations', () => {
  describe('Addition', () => {
    it('adds integers correctly (2 + 3 = 5)', () => {
      expect(calc.add(2, 3)).to.equal(5);
    });

    it('adds negative numbers and zeros', () => {
      expect(calc.add(-1, -1)).to.equal(-2);
      expect(calc.add(0, 5)).to.equal(5);
    });

    it('adds floating point numbers', () => {
      expect(calc.add(1.5, 2.25)).to.be.closeTo(3.75, 1e-12);
    });
  });

  describe('Subtraction', () => {
    it('subtracts integers correctly (10 - 4 = 6)', () => {
      expect(calc.subtract(10, 4)).to.equal(6);
    });

    it('handles negative results', () => {
      expect(calc.subtract(3, 10)).to.equal(-7);
    });

    it('subtracts floating point numbers', () => {
      expect(calc.subtract(5.5, 2.2)).to.be.closeTo(3.3, 1e-12);
    });
  });

  describe('Multiplication', () => {
    it('multiplies integers correctly (45 * 2 = 90)', () => {
      expect(calc.multiply(45, 2)).to.equal(90);
    });

    it('multiplies by zero', () => {
      expect(calc.multiply(123, 0)).to.equal(0);
    });

    it('multiplies negative numbers', () => {
      expect(calc.multiply(-4, 6)).to.equal(-24);
    });
  });

  describe('Division', () => {
    it('divides integers correctly (20 / 5 = 4)', () => {
      expect(calc.divide(20, 5)).to.equal(4);
    });

    it('divides to produce floating point results', () => {
      expect(calc.divide(7, 2)).to.be.closeTo(3.5, 1e-12);
    });

    it('handles negative divisors/results', () => {
      expect(calc.divide(-8, 2)).to.equal(-4);
      expect(calc.divide(8, -2)).to.equal(-4);
    });

    it('throws on division by zero', () => {
      expect(() => calc.divide(1, 0)).to.throw(/Division by zero/);
    });
  });

  describe('Edge cases & robustness', () => {
    it('works with very large numbers', () => {
      const a = Number.MAX_SAFE_INTEGER;
      expect(calc.add(a, 1)).to.equal(a + 1);
    });

    it('works with decimal precision within tolerance', () => {
      // check a known floating point case
      expect(calc.add(0.1, 0.2)).to.be.closeTo(0.30000000000000004, 1e-12);
    });
  });

  describe('Extended operations', () => {
    it('modulo: 5 % 2 = 1', () => {
      expect(calc.modulo(5, 2)).to.equal(1);
    });

    it('modulo throws on division by zero', () => {
      expect(() => calc.modulo(1, 0)).to.throw(/Division by zero/);
    });

    it('power: 2 ^ 3 = 8', () => {
      expect(calc.power(2, 3)).to.equal(8);
    });

    it('power with fractional exponent (4 ^ 0.5 = 2)', () => {
      expect(calc.power(4, 0.5)).to.be.closeTo(2, 1e-12);
    });

    it('squareRoot: sqrt(16) = 4', () => {
      expect(calc.squareRoot(16)).to.equal(4);
    });

    it('squareRoot throws on negative input', () => {
      expect(() => calc.squareRoot(-9)).to.throw(/Square root of negative number/);
    });
  });
});
