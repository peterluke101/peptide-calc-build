#!/usr/bin/env node
/**
 * Peptide Calc Pro — Access Code Generator
 * Usage: node generate-codes.js [count]
 * Default: generates 100 unique codes
 * Output: codes.txt (one per line) + codes-hashed.json (for embedding in app)
 */

const crypto = require('crypto');
const fs = require('fs');

const count = parseInt(process.argv[2] || '100', 10);
const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 0, 1 (confusing)

function randomCode() {
  let code = 'PCPRO-';
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

function hashCode(code) {
  return crypto.createHash('sha256').update(code.trim().toUpperCase()).digest('hex').slice(0, 16);
}

const codes = new Set();
while (codes.size < count) {
  codes.add(randomCode());
}

const codeArray = [...codes];
const hashes = codeArray.map(hashCode);

// Write plain codes (for Gumroad upload + Pete's records)
fs.writeFileSync('codes.txt', codeArray.join('\n'), 'utf8');

// Write hashes (embed in app source — safe to ship publicly)
fs.writeFileSync('codes-hashed.json', JSON.stringify({ hashes, generated: new Date().toISOString(), count }, null, 2), 'utf8');

console.log(`✅ Generated ${count} codes`);
console.log(`   codes.txt → upload to Gumroad (Unique product keys)`);
console.log(`   codes-hashed.json → embed in peptide-calc app`);
console.log(`\nSample codes:`);
codeArray.slice(0, 5).forEach(c => console.log(`  ${c}`));
