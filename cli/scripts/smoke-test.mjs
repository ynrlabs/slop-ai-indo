#!/usr/bin/env node
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { CORE } from '../lib/install.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const worker = path.join(__dirname, 'smoke-worker.mjs')

function tree(dir, prefix = '') {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(prefix + entry.name + '/')
      out.push(...tree(p, prefix + '  '))
    } else {
      out.push(prefix + entry.name)
    }
  }
  return out
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'slop-ai-indo-smoke-'))
const result = spawnSync(process.execPath, [worker], { cwd: tmp, encoding: 'utf8' })
console.log('--- output worker ---')
console.log(result.stdout.trim())
if (result.status !== 0) console.error('stderr worker:', result.stderr)

console.log('\n--- berkas yang ditulis ke proyek sementara ---')
console.log(tree(tmp).join('\n'))

for (const name of ['CLAUDE.md', 'AGENTS.md', 'GEMINI.md']) {
  const entry = path.join(tmp, name)
  if (!fs.existsSync(entry)) continue
  console.log(`\n--- ${name} ---`)
  console.log(fs.readFileSync(entry, 'utf8'))
}

const coreSkill = path.join(tmp, '.claude', 'skills', CORE, 'SKILL.md')
const coreInstalled = fs.existsSync(coreSkill)
console.log('\nSKILL.md inti terpasang:', coreInstalled)

// Semua kegagalan dicatat di sini sebelum pembersihan direktori sementara,
// sehingga jika terjadi kegagalan, folder sementara tetap dibersihkan dengan rapi.
const reasons = []
if (result.status !== 0) reasons.push(`worker berhenti dengan kode ${result.status}`)
if (!coreInstalled) reasons.push('SKILL.md inti tidak terpasang')

// Wizard interaktif memerlukan terminal. Jika stdin ditutup, wizard menolak jalan.
const cliDeps = fs.existsSync(path.join(__dirname, '..', 'node_modules', '@clack'))
if (cliDeps) {
  const noTty = spawnSync(process.execPath, [path.join(__dirname, '..', 'index.mjs')], {
    cwd: tmp,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const refused = noTty.status === 1 && /(?:memerlukan terminal|needs a terminal)/.test(noTty.stderr)
  console.log('eksekusi tanpa terminal: status', noTty.status, '| ditolak secara benar:', refused)
  if (!refused) reasons.push(`eksekusi tanpa terminal harus keluar kode 1 dan menjelaskan alasannya, didapat ${noTty.status}`)
} else {
  console.log('eksekusi tanpa terminal: dilewati, dependensi cli belum terinstal')
}

fs.rmSync(tmp, { recursive: true, force: true })
console.log('\ndirektori proyek sementara berhasil dibersihkan.')

if (reasons.length > 0) {
  console.error('\nsmoke test gagal: ' + reasons.join('; '))
  process.exit(1)
}
console.log('smoke test lulus sempurna.')
