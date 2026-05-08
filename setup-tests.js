/**
 * setup-tests.js
 *
 * Creates the canonical src/tests/ directory structure and installs Vitest
 * dev dependencies.
 *
 * Usage: node setup-tests.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;

// ── 1. Create directories ────────────────────────────────────────────────

const dirs = [
  'src/tests',
  'src/tests/unit',
  'src/tests/api',
];

for (const dir of dirs) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
    console.log('  created  ' + dir);
  } else {
    console.log('  exists   ' + dir);
  }
}

// ── 2. Create src/tests/setup.ts ─────────────────────────────────────────

const setupTs = path.join(ROOT, 'src/tests/setup.ts');
if (!fs.existsSync(setupTs)) {
  fs.writeFileSync(setupTs, "import '@testing-library/jest-dom';\n");
  console.log('  created  src/tests/setup.ts');
}

// ── 3. Copy co-located test files to canonical paths ─────────────────────

const copies = [
  [
    'src/lib/exercise-generator.test.ts',
    'src/tests/unit/exercise-generator.test.ts',
  ],
  ['src/lib/validators.test.ts', 'src/tests/unit/validators.test.ts'],
  ['src/lib/premium.test.ts', 'src/tests/unit/premium.test.ts'],
  ['src/app/api/auth/auth.test.ts', 'src/tests/api/auth.test.ts'],
  ['src/app/api/chapters/chapters.test.ts', 'src/tests/api/chapters.test.ts'],
];

for (const [src, dst] of copies) {
  const srcFull = path.join(ROOT, src);
  const dstFull = path.join(ROOT, dst);
  if (fs.existsSync(srcFull)) {
    fs.copyFileSync(srcFull, dstFull);
    fs.unlinkSync(srcFull);
    console.log('  moved    ' + src + ' -> ' + dst);
  } else {
    console.warn('  MISSING  ' + src + ' (source file not found)');
  }
}

// ── 4. Install npm devDependencies ───────────────────────────────────────

console.log('\n📦  Installing test devDependencies...\n');
execSync(
  'npm install --save-dev vitest @vitest/ui @vitejs/plugin-react ' +
    '@testing-library/react @testing-library/jest-dom jsdom ' +
    '@testing-library/user-event',
  { cwd: ROOT, stdio: 'inherit' }
);

console.log('\n✅  Setup complete. Run: npm test\n');
