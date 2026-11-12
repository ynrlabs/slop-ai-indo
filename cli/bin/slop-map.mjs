#!/usr/bin/env node
import path from 'node:path'
import pc from 'picocolors'
import { generateProjectMap } from '../lib/mapper.mjs'

const targetDir = process.argv[2] && !process.argv[2].startsWith('-')
  ? path.resolve(process.argv[2])
  : process.cwd()

try {
  const result = generateProjectMap(targetDir)
  console.log(pc.green('✔ Berhasil menghasilkan PROJECT_MAP.json'))
  console.log(pc.dim(`  Lokasi: ${result.outputPath}`))
  console.log(pc.dim(`  Statistik: ${result.totalFiles} berkas dipetakan (${result.totalDirectories} direktori).`))
} catch (err) {
  console.error(pc.red(`Gagal menghasilkan PROJECT_MAP.json: ${err.message}`))
  process.exit(1)
}

