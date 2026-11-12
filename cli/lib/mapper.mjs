import fs from 'node:fs'
import path from 'node:path'

export const DEFAULT_IGNORE_DIRS = [
  'node_modules',
  'vendor',
  '.git',
  '.svn',
  '.hg',
  '.next',
  '.nuxt',
  'dist',
  'build',
  'out',
  'coverage',
  '.turbo',
  '.output',
  '.svelte-kit',
  'venv',
  '.venv',
  'env',
  '__pycache__',
  '.pytest_cache',
  '.mypy_cache',
  'target',
  'bin',
  'obj',
  '.idea',
  '.vscode',
  '.cache',
  'tmp',
  'temp',
  'system',
]

export const DEFAULT_IGNORE_EXTS = [
  '.pyc',
  '.pyo',
  '.pyd',
  '.class',
  '.exe',
  '.dll',
  '.so',
  '.dylib',
  '.DS_Store',
  'Thumbs.db',
]

/**
 * Memindai direktori secara rekursif tanpa dependensi eksternal,
 * mengabaikan folder dependensi berat, dan menghasilkan daftar berkas relatif.
 */
export function scanProjectFiles(dir, baseDir = dir, ignoreDirs = DEFAULT_IGNORE_DIRS) {
  const results = []
  let dirCount = 0

  function scan(currentDir) {
    let entries = []
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        if (ignoreDirs.includes(entry.name)) continue
        dirCount++
        scan(fullPath)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (DEFAULT_IGNORE_EXTS.includes(ext) || DEFAULT_IGNORE_EXTS.includes(entry.name)) {
          continue
        }
        const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/')
        results.push(relPath)
      }
    }
  }

  scan(dir)
  results.sort()
  return { files: results, dirCount }
}

/**
 * Menghasilkan berkas PROJECT_MAP.json di root direktori proyek.
 */
export function generateProjectMap(rootDir = process.cwd(), filename = 'PROJECT_MAP.json') {
  const resolvedRoot = path.resolve(rootDir)
  const { files, dirCount } = scanProjectFiles(resolvedRoot, resolvedRoot)
  const mapData = {
    generated_at: new Date().toISOString(),
    project_name: path.basename(resolvedRoot),
    stats: {
      total_files: files.length,
      total_directories: dirCount,
    },
    files,
  }

  const outputPath = path.join(resolvedRoot, filename)
  fs.writeFileSync(outputPath, JSON.stringify(mapData, null, 2) + '\n', 'utf8')
  return {
    outputPath,
    totalFiles: files.length,
    totalDirectories: dirCount,
  }
}

