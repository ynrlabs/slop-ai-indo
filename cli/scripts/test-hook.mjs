import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { installGitHook } from '../lib/hook.mjs'

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    console.log(`✔ [LULUS] ${message}`)
    passed++
  } else {
    console.error(`✖ [GAGAL] ${message}`)
    failed++
  }
}

// 1. Pengujian pemasangan hook ke dalam repositori git
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-hook-test-'))
fs.mkdirSync(path.join(tempDir, '.git'), { recursive: true })

try {
  const hookPath = installGitHook(tempDir)
  assert(fs.existsSync(hookPath), 'Berkas hook .git/hooks/pre-commit berhasil dibuat')
  
  const content = fs.readFileSync(hookPath, 'utf8')
  assert(content.includes('npx slop-ai-indo hook --run'), 'Skrip hook memuat perintah eksekusi npx runner')
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true })
}

// 2. Pengujian penolakan direktori non-git
const nonGitDir = fs.mkdtempSync(path.join(os.tmpdir(), 'non-git-test-'))
let threw = false
try {
  installGitHook(nonGitDir)
} catch (err) {
  threw = true
  assert(err.message.includes('.git tidak ditemukan'), 'Menampilkan pesan kesalahan yang jelas jika bukan folder git')
} finally {
  fs.rmSync(nonGitDir, { recursive: true, force: true })
}
assert(threw, 'Berhasil menolak pemasangan pada direktori non-git')

console.log(`\nHasil Pengujian Git Hook: ${passed} lolos, ${failed} gagal.`)
if (failed > 0) process.exit(1)
