import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import pc from 'picocolors'
import { lintContent } from '../lib/linter.mjs'

/**
 * Memeriksa apakah path berkas harus dikecualikan dari audit hook.
 */
function shouldIgnoreHookFile(filePath) {
  const norm = filePath.replace(/\\/g, '/')
  const base = path.basename(norm)

  // Abaikan folder dependensi, konfigurasi agen, artefak build, dan internal dev tools
  if (/(?:^|\/)(node_modules|\.git|\.agents|\.claude|\.cursor|\.codex|\.opencode|\.cline|\.gemini|\.omp|\.deepseek|vendor|coverage|\.next|\.nuxt|dist|build|scripts|presets|skills)(?:\/|$)/i.test(norm)) {
    return true
  }

  // Abaikan berkas test fixtures
  if (/\.(?:test|spec)\.[a-z0-9]+$/i.test(base) || /^test-[^/]+\.(?:mjs|js|ts)$/i.test(base)) {
    return true
  }

  // Abaikan berkas dokumentasi internal repositori aturan itu sendiri
  if (['README.md', 'PRD.md', 'GUIDE.md', 'WORKFLOW.md', 'ROADMAP.md', 'DESIGN.md', 'slop-ai-indo.md'].includes(base)) {
    return true
  }

  return false
}

/**
 * Memasang git pre-commit hook ke dalam repositori target.
 */
export function installGitHook(targetDir = process.cwd()) {
  const gitDir = path.join(targetDir, '.git')
  if (!fs.existsSync(gitDir) || !fs.statSync(gitDir).isDirectory()) {
    throw new Error(`Direktori "${targetDir}" bukan repositori Git (.git tidak ditemukan).`)
  }

  const hooksDir = path.join(gitDir, 'hooks')
  fs.mkdirSync(hooksDir, { recursive: true })

  const hookFile = path.join(hooksDir, 'pre-commit')
  const hookScript = `#!/bin/sh
# Slop AI Indo - Git Pre-commit Hook
# Memverifikasi staged files sebelum commit diizinkan.

if [ "$SLOP_SKIP_HOOK" = "1" ]; then
  exit 0
fi

# Prioritaskan binary lokal repositori agar instan tanpa download
if [ -f "./cli/index.mjs" ]; then
  node ./cli/index.mjs hook --run
elif [ -f "./node_modules/slop-ai-indo/index.mjs" ]; then
  node ./node_modules/slop-ai-indo/index.mjs hook --run
else
  npx slop-ai-indo hook --run
fi
exit $?
`

  fs.writeFileSync(hookFile, hookScript, { mode: 0o755 })
  return hookFile
}

/**
 * Menjalankan inspeksi linter terhadap berkas yang sedang di-stage (git index).
 */
export function runPreCommitHook() {
  let staged = []
  try {
    const raw = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
    staged = raw.split(/\r?\n/).map((f) => f.trim()).filter(Boolean)
  } catch {
    // Bukan lingkungan git atau git command tidak ditemukan
    return 0
  }

  if (staged.length === 0) {
    return 0
  }

  const filesToCheck = staged.filter((file) => !shouldIgnoreHookFile(file))

  if (filesToCheck.length === 0) {
    return 0
  }

  console.log(pc.cyan(`🔍 [slop-hook] Memeriksa ${filesToCheck.length} staged file(s) sebelum commit...`))

  let hardGateCount = 0
  const findings = []

  for (const file of filesToCheck) {
    const fullPath = path.resolve(process.cwd(), file)
    if (!fs.existsSync(fullPath)) continue
    try {
      const content = fs.readFileSync(fullPath, 'utf8')
      const fileFindings = lintContent(content, fullPath)
      const hardGates = fileFindings.filter((f) => f.tier === 'Hard Gate')
      if (hardGates.length > 0) {
        hardGateCount += hardGates.length
        findings.push({ file, hardGates })
      }
    } catch {
      // Abaikan berkas biner tak terbaca
    }
  }

  if (hardGateCount > 0) {
    console.error(pc.bold(pc.red(`\n❌ [slop-hook] Commit Ditolak! Ditemukan ${hardGateCount} pelanggaran Hard Gate:`)))
    for (const f of findings) {
      console.error(pc.bold(pc.underline(`\n${f.file}`)))
      for (const item of f.hardGates) {
        console.error(`  baris ${item.line} ${pc.red(`[${item.ruleId}]`)} ${item.name}`)
        console.error(`    Kode: ${pc.dim(item.snippet)}`)
        console.error(`    Solusi: ${pc.cyan(item.fix)}`)
      }
    }
    console.error(pc.dim('\nPerbaiki pelanggaran di atas sebelum commit, atau gunakan `git commit --no-verify` jika darurat.\n'))
    return 1
  }

  console.log(pc.green(`✔ [slop-hook] ${filesToCheck.length} staged file(s) bersih dari slop. Commit diizinkan.\n`))
  return 0
}
