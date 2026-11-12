#!/usr/bin/env node
/**
 * Universal Project Map Generator (Node.js)
 * Standar Slop AI Indo - Human-Crafted Zero-Slop Performance
 *
 * Penggunaan:
 *   node generate-map.js
 *   node generate-map.js /path/to/project
 */
const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = [
  'node_modules', 'vendor', '.git', '.svn', '.hg',
  '.next', '.nuxt', 'dist', 'build', 'out', 'coverage',
  '.turbo', '.output', '.svelte-kit', 'venv', '.venv',
  'env', '__pycache__', '.pytest_cache', '.mypy_cache',
  'target', 'bin', 'obj', '.cache', 'tmp', 'temp', 'system'
];

const IGNORE_EXTS = ['.pyc', '.pyo', '.pyd', '.class', '.exe', '.dll', '.DS_Store', 'Thumbs.db'];

function scanDir(dir, baseDir = dir) {
  let results = [];
  let list = [];
  try {
    list = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return results;
  }

  for (const entry of list) {
    if (entry.name === 'PROJECT_MAP.json') continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.includes(entry.name)) continue;
      results = results.concat(scanDir(fullPath, baseDir));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (IGNORE_EXTS.includes(ext) || IGNORE_EXTS.includes(entry.name)) continue;
      results.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'));
    }
  }
  return results;
}

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const files = scanDir(targetDir).sort();
const mapData = {
  generated_at: new Date().toISOString(),
  project_name: path.basename(targetDir),
  stats: {
    total_files: files.length,
  },
  files,
};

fs.writeFileSync(path.join(targetDir, 'PROJECT_MAP.json'), JSON.stringify(mapData, null, 2) + '\n', 'utf8');
console.log(`[SUKSES] PROJECT_MAP.json berhasil dibuat (${files.length} berkas dipetakan).`);
