#!/usr/bin/env node
import path from 'node:path'
import pc from 'picocolors'
import { lintPath } from '../lib/linter.mjs'

const args = process.argv.slice(2)
const isJson = args.includes('--json')
const isQuiet = args.includes('--quiet')
const tierArg = args.find((a) => a.startsWith('--tier='))
const tier = tierArg ? tierArg.split('=')[1] : 'all'

const targetArg = args.find((a) => !a.startsWith('--')) || '.'
const targetPath = path.resolve(process.cwd(), targetArg)

try {
  const result = lintPath(targetPath, { tier })

  if (isJson) {
    console.log(JSON.stringify(result, null, 2))
    process.exit(result.passed ? 0 : 1)
  }

  if (!isQuiet) {
    console.log(pc.bold(pc.cyan('\n🔍 slop-lint: Mesin Linter Deterministik Slop AI Indo')))
    console.log(pc.dim(`Memeriksa: ${targetPath}\n`))
  }

  if (result.findings.length === 0) {
    if (!isQuiet) {
      console.log(pc.green('✔ BERSIH:') + pc.dim(` ${result.scannedFiles} file diperiksa, nol slop terdeteksi.`))
      console.log(pc.bold(pc.green('Status: PASSED (Lolos Delivery Gate)\n')))
    }
    process.exit(0)
  }

  // Group findings by file
  const byFile = new Map()
  for (const f of result.findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, [])
    byFile.get(f.file).push(f)
  }

  for (const [file, items] of byFile.entries()) {
    const relFile = path.relative(process.cwd(), file)
    console.log(pc.bold(pc.underline(relFile)))
    for (const item of items) {
      const isHard = item.tier === 'Hard Gate'
      const tierBadge = isHard ? pc.red(`[${item.tier}]`) : pc.yellow(`[${item.tier}]`)
      const ruleCode = pc.bold(item.ruleId)
      console.log(`  ${pc.dim(`baris ${item.line}`)} ${tierBadge} ${ruleCode} ${pc.bold(item.name)}`)
      console.log(`    ${pc.dim('Kode:')} ${pc.italic(item.snippet)}`)
      console.log(`    ${pc.cyan('Solusi:')} ${item.fix}\n`)
    }
  }

  console.log(pc.dim('─'.repeat(60)))
  console.log(
    `Total diperiksa: ${pc.bold(result.scannedFiles)} file | Ditemukan: ${pc.bold(result.counts.total)} temuan ` +
    `(${pc.red(`${result.counts.hardGate} Hard Gate`)}, ${pc.yellow(`${result.counts.qualityLocks} Quality Lock`)})`
  )

  if (result.passed) {
    console.log(pc.bold(pc.yellow('Status: WARNING (Peringatan Kualitas, Hard Gate lolos)\n')))
    process.exit(0)
  } else {
    console.log(pc.bold(pc.red('Status: FAILED (Gagal Hard Gate, perbaiki sebelum serah terima)\n')))
    process.exit(1)
  }
} catch (err) {
  console.error(pc.red(`Error: ${err.message}`))
  process.exit(1)
}
