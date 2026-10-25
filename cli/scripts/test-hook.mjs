import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { installGitHook } from '../lib/hook.mjs'

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    console.log(`✔ [PASS] ${message}`)
    passed++
  } else {
    console.error(`✖ [FAIL] ${message}`)
    failed++
  }
}

// 1. Test installing hook into git repo
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-hook-test-'))
fs.mkdirSync(path.join(tempDir, '.git'), { recursive: true })

try {
  const hookPath = installGitHook(tempDir)
  assert(fs.existsSync(hookPath), 'Hook file .git/hooks/pre-commit was created')
  
  const content = fs.readFileSync(hookPath, 'utf8')
  assert(content.includes('npx slop-ai-indo hook --run'), 'Hook script contains npx runner command')
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true })
}

// 2. Test refusing non-git directory
const nonGitDir = fs.mkdtempSync(path.join(os.tmpdir(), 'non-git-test-'))
let threw = false
try {
  installGitHook(nonGitDir)
} catch (err) {
  threw = true
  assert(err.message.includes('.git tidak ditemukan'), 'Throws meaningful error on non-git directory')
} finally {
  fs.rmSync(nonGitDir, { recursive: true, force: true })
}
assert(threw, 'Refused non-git directory')

console.log(`\nGit Hook Tests: ${passed} passed, ${failed} failed.`)
if (failed > 0) process.exit(1)
