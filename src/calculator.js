#!/usr/bin/env node
'use strict';

/**
 * Simple Node.js CLI Calculator
 *
 * Supported operations:
 *  - Addition:       +
 *  - Subtraction:    -
 *  - Multiplication: * or x (×)
 *  - Division:       / or ÷
 *  - Modulo:         % or mod
 *  - Exponentiation: ^ or pow
 *  - Square root:    sqrt (unary)
 *
 * This file exports functions for the four basic operations and also
 * provides a CLI entry point that accepts either:
 *   node src/calculator.js 4 + 2
 * or:
 *   node src/calculator.js --a 4 --op + --b 2
 *
 * Error handling:
 *  - Invalid/missing numbers or operator => exit code 2
 *  - Division by zero => exit code 3
 */

// Arithmetic functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    const err = new Error('Division by zero');
    err.code = 'DIV_BY_ZERO';
    throw err;
  }
  return a / b;
}

function modulo(a, b) {
  // modulo: remainder of a divided by b
  if (b === 0) {
    const err = new Error('Division by zero');
    err.code = 'DIV_BY_ZERO';
    throw err;
  }
  return a % b;
}

function power(base, exponent) {
  // exponentiation: base ** exponent
  return Math.pow(base, exponent);
}

function squareRoot(n) {
  // squareRoot: returns sqrt(n); error on negative inputs
  if (n < 0) {
    const err = new Error('Square root of negative number');
    err.code = 'NEG_SQRT';
    throw err;
  }
  return Math.sqrt(n);
}

// Export functions for programmatic use
module.exports = {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  power,
  squareRoot,
};

// ----- CLI handling -----
function printUsage() {
  console.error('Usage: node src/calculator.js <number> <operator> <number>');
  console.error('       node src/calculator.js --a <number> --op <operator> --b <number>');
  console.error('Operators: +  -  *  x  /  ÷  %  ^  sqrt');
}

function parseNumber(raw) {
  if (raw === undefined) return NaN;
  const n = Number(raw);
  return Number.isFinite(n) ? n : NaN;
}

function normalizeOperator(op) {
  if (!op) return null;
  op = String(op).trim();
  if (op === 'x' || op === 'X' || op === '×') return '*';
  if (op === '÷') return '/';
  if (op === '%' || op.toLowerCase() === 'mod') return '%';
  if (op === '^' || op.toLowerCase() === 'pow') return '^';
  if (op.toLowerCase() === 'sqrt' || op === '√') return 'sqrt';
  return op;
}

function compute(a, op, b) {
  switch (op) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    case '%':
      return modulo(a, b);
    case '^':
      return power(a, b);
    case 'sqrt':
      return squareRoot(a);
    default:
      throw new Error('Unsupported operator: ' + op);
  }
}

if (require.main === module) {
  const argv = process.argv.slice(2);

  // support flag style: --a 4 --op + --b 2
  let aArg, opArg, bArg;
  if (argv.length === 0) {
    printUsage();
    process.exit(2);
  }

  if (argv.length === 3) {
    // positional: <a> <op> <b>
    [aArg, opArg, bArg] = argv;
  } else if (argv.length === 2) {
    // support unary positional like: sqrt 9  OR 9 sqrt
    if (normalizeOperator(argv[0]) === 'sqrt') {
      opArg = argv[0];
      aArg = argv[1];
    } else if (normalizeOperator(argv[1]) === 'sqrt') {
      aArg = argv[0];
      opArg = argv[1];
    } else {
      // fall back to flag parsing for other 2-arg cases
    }
  } else {
    // parse flags
    for (let i = 0; i < argv.length; i++) {
      const v = argv[i];
      if (v === '--a' && i + 1 < argv.length) {
        aArg = argv[++i];
      } else if (v === '--b' && i + 1 < argv.length) {
        bArg = argv[++i];
      } else if (v === '--op' && i + 1 < argv.length) {
        opArg = argv[++i];
      } else if (v === '-h' || v === '--help') {
        printUsage();
        process.exit(0);
      } else {
        // unknown token - skip (could be additional flags)
      }
    }
  }

  const a = parseNumber(aArg);
  const b = parseNumber(bArg);
  const op = normalizeOperator(opArg);

  if (!Number.isFinite(a) || !Number.isFinite(b) || !op) {
    console.error('Invalid input.');
    printUsage();
    process.exit(2);
  }

  try {
    const result = compute(a, op, b);
    // Print only the result for easy scripting
    console.log(result);
    process.exit(0);
  } catch (err) {
    if (err && err.code === 'DIV_BY_ZERO') {
      console.error('Error: division by zero');
      process.exit(3);
    }
    console.error('Error:', err.message || err);
    process.exit(2);
  }
}
