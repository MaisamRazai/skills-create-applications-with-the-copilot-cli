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

// Export functions for programmatic use
module.exports = {
  add,
  subtract,
  multiply,
  divide,
};

// ----- CLI handling -----
function printUsage() {
  console.error('Usage: node src/calculator.js <number> <operator> <number>');
  console.error('       node src/calculator.js --a <number> --op <operator> --b <number>');
  console.error('Operators: +  -  *  x  /  ÷');
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
