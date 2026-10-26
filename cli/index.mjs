#!/usr/bin/env node
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
import pc from 'picocolors'
import { intro, outro, select, multiselect, confirm, isCancel, cancel, log, spinner } from '@clack/prompts'
import { banner } from './lib/banner.mjs'
import {
  CORE,
  AGENTS,
  skillSourceDir,
  resolveTargets,
  detectAgents,
  detectConflicts,
  detectDuplicateReads,
  detectPluginDoors,
  installSkills,
  installedVersion,
  updateAll,
  updatePointers,
  VERSION,
  DESIGN_PRESETS,
} from './lib/install.mjs'

const EXTRA_SKILLS = [
  { value: 'slop-ai-indo-ui', label: 'slop-ai-indo-ui', hint: 'Desain visual, warna, dan tata letak kanvas terang' },
  { value: 'slop-ai-indo-copywriting', label: 'slop-ai-indo-copywriting', hint: 'Copywriting, judul, anti kata klise AI, dan tone' },
  { value: 'slop-ai-indo-human', label: 'slop-ai-indo-human', hint: 'Aksesibilitas WCAG AA dan alat pemeriksa kontras' },
  { value: 'slop-ai-indo-layoutmobile', label: 'slop-ai-indo-layoutmobile', hint: 'Responsivitas mobile, breakpoint, dan area sentuh' },
  { value: 'slop-ai-indo-code', label: 'slop-ai-indo-code', hint: 'Higienitas komentar kode dan pencegahan boilerplate' },
  { value: 'slop-ai-indo-security', label: 'slop-ai-indo-security', hint: 'Audit keamanan komprehensif dan review kerentanan' },
  { value: 'slop-ai-indo-docs', label: 'slop-ai-indo-docs', hint: 'Dokumentasi teknis, PRD, dan panduan API jujur' },
  { value: 'slop-ai-indo-identity', label: 'slop-ai-indo-identity', hint: 'Identitas produk, branding unik, dan anti penjiplakan' },
  { value: 'slop-ai-indo-backend', label: 'slop-ai-indo-backend', hint: 'Arsitektur backend, REST API, dan query database' },
  { value: 'slop-ai-indo-test', label: 'slop-ai-indo-test', hint: 'Pengujian otomatis, unit test, dan anti mock palsu' },
]

function stop(message) {
  cancel(message)
  process.exit(0)
}

// Menampilkan folder target pemasangan
function displayDir(agent, location) {
  return location === 'global' ? `~/${agent.globalDir ?? agent.dir}` : agent.dir
}

// Menampilkan daftar plugin door yang ditemukan
function printPluginDoors(found) {
  if (found.length === 0) return
  console.log('\nTerpasang sebagai plugin (memiliki salinan tersendiri, pembaruan dijalankan terpisah):')
  for (const p of found) {
    console.log(`  ${p.door.label}${p.version ? ` ${p.version}` : ''}`)
    console.log(`    ${p.door.update}`)
  }
}

async function main() {
  if (process.argv[2] === 'lint' || process.argv.includes('--lint')) {
    const { spawnSync } = await import('node:child_process')
    const lintBin = path.join(__dirname, 'bin', 'slop-lint.mjs')
    const lintArgs = process.argv.slice(2).filter((a) => a !== 'lint' && a !== '--lint')
    const res = spawnSync(process.execPath, [lintBin, ...lintArgs], { stdio: 'inherit' })
    process.exit(res.status ?? 0)
  }

  if (process.argv[2] === 'mcp' || process.argv.includes('--mcp')) {
    const { spawnSync } = await import('node:child_process')
    const mcpBin = path.join(__dirname, 'bin', 'slop-mcp.mjs')
    const res = spawnSync(process.execPath, [mcpBin], { stdio: 'inherit' })
    process.exit(res.status ?? 0)
  }

  if (process.argv[2] === 'hook' || process.argv.includes('--hook')) {
    const { installGitHook, runPreCommitHook } = await import('./lib/hook.mjs')
    if (process.argv.includes('--run')) {
      const exitCode = runPreCommitHook()
      process.exit(exitCode)
    } else {
      try {
        const file = installGitHook(process.cwd())
        console.log(pc.green('✔ Git pre-commit hook berhasil dipasang: ') + pc.dim(file))
        console.log(pc.cyan('Setiap kali Anda menjalankan `git commit`, slop-lint akan otomatis memvalidasi staged files.'))
        process.exit(0)
      } catch (err) {
        console.error(pc.red(`Gagal memasang hook: ${err.message}`))
        process.exit(1)
      }
    }
  }

  if (process.argv.includes('--version') || process.argv.includes('-v')) {
    console.log(`slop-ai-indo v${VERSION}`)
    return
  }

  // Jalur pembaruan otomatis tanpa interaksi (--update)
  if (process.argv.includes('--update')) {
    const { results, pointers } = updateAll()
    if (results.length === 0) {
      console.log(`slop-ai-indo v${VERSION}: tidak ada folder skill terpasang yang ditemukan. Tidak ada yang diperbarui.`)
    } else {
      for (const r of results) {
        const from = r.from ? `slop-ai-indo ${r.from}` : 'versi lama tanpa penanda versi'
        console.log(`${r.path}`)
        console.log(`  ${from} -> slop-ai-indo v${VERSION} (${r.skills.length} skill untuk ${r.agents.join(', ')})`)
      }
      console.log(`\nBerhasil memperbarui ${results.length} folder ke slop-ai-indo v${VERSION}.`)
      if (pointers.length > 0) {
        console.log(`Pointer konteks diperbarui di: ${pointers.map((p) => path.basename(p)).join(', ')}.`)
      }
      console.log('Mulai sesi agen baru agar aturan terkini dimuat.')
    }
    printPluginDoors(detectPluginDoors())
    return
  }

  // Validasi terminal interaktif
  if (!process.stdin.isTTY) {
    console.error('slop-ai-indo: Pemasang ini memerlukan terminal interaktif. Jalankan di shell interaktif.')
    process.exit(1)
  }

  console.log(banner())
  intro('Pasang slop-ai-indo ke dalam lingkungan agen AI Anda')

  if (!skillSourceDir()) {
    stop('Direktori sumber skill slop-ai-indo tidak ditemukan. Pasang ulang paket slop-ai-indo.')
  }

  log.step('Pilih Skill')
  console.log(`  ${pc.green('●')} ${pc.bold(CORE)}  ${pc.dim('filter inti 38 aturan, selalu aktif')}`)

  const extra = await multiselect({
    message: 'Pilih skill tambahan yang ingin dipasang:',
    options: EXTRA_SKILLS,
    required: false,
  })
  if (isCancel(extra)) stop('Pemasangan dibatalkan.')
  const skills = [CORE, ...(extra ?? [])]

  log.step('Pilih Lokasi Target')
  const location = await select({
    message: 'Tentukan lokasi pemasangan skill:',
    options: [
      { value: 'project', label: 'Proyek ini saja (Rekomendasi)', hint: 'hanya disimpan di folder proyek saat ini' },
      { value: 'global', label: 'Global (Seluruh komputer)', hint: 'berlaku untuk seluruh proyek di profil pengguna' },
    ],
  })
  if (isCancel(location)) stop('Pemasangan dibatalkan.')

  let chosenPreset = 'enterprise'
  if (location === 'project') {
    log.step('Pilih Preset Desain (DESIGN.md)')
    const preset = await select({
      message: 'Pilih arah visual dan standar estetika untuk proyek ini:',
      options: DESIGN_PRESETS,
      initialValue: 'enterprise',
    })
    if (isCancel(preset)) stop('Pemasangan dibatalkan.')
    chosenPreset = preset
  }

  log.step('Pilih Agen Coding')
  const detected = detectAgents(location)
  const chosen = await multiselect({
    message: 'Agen coding mana yang ingin dipasangi slop-ai-indo?',
    options: AGENTS.map((a) => ({
      value: a.id,
      label: a.label,
      hint: detected.includes(a.id) ? `ditemukan (${displayDir(a, location)})` : `akan membuat ${displayDir(a, location)}`,
    })),
    required: 'Pilih minimal satu agen coding.',
    initialValues: detected,
  })
  if (isCancel(chosen)) stop('Pemasangan dibatalkan.')

  const targets = resolveTargets(location, chosen)
  await log.message(
    'Memasang ke folder:\n' + targets.map((t) => '  ' + t.path).join('\n'),
    { symbol: pc.cyan('│') }
  )

  const conflicts = detectConflicts({ skills, targets })
  let overwrite = false
  if (conflicts.length > 0) {
    const found = [...new Set(targets.map((t) => installedVersion(t.path)).filter(Boolean))]
    const have = found.length > 0 ? `slop-ai-indo ${found.join(' dan ')}` : 'versi lama yang belum memiliki penanda'
    log.warn(`Sudah terpasang sebelumnya: ${have}. Pemasang saat ini membawa v${VERSION}.`)

    const answer = await select({
      message: `${conflicts.length} folder skill sudah ada. Apa yang ingin dilakukan?`,
      options: [
        { value: 'overwrite', label: 'Timpa dengan versi baru', hint: `perbarui ke v${VERSION}` },
        { value: 'keep', label: 'Pertahankan yang sudah ada', hint: 'tetap di versi yang terpasang' },
      ],
    })
    if (isCancel(answer)) stop('Pemasangan dibatalkan.')
    overwrite = answer === 'overwrite'
  }

  const proceed = await confirm({
    message: `Pasang ${skills.length} skill sekarang?`,
    initialValue: true,
  })
  if (isCancel(proceed) || proceed === false) stop('Pemasangan dibatalkan.')

  const spin = spinner()
  spin.start('Menyalin berkas skill...')
  const written = installSkills({ skills, targets, overwrite })
  const pointers = location === 'project' ? updatePointers({ targets, skills, designPreset: chosenPreset }) : []
  spin.stop('Penyalinan selesai.')

  if (pointers.length > 0) {
    log.step('Pointer konteks ditulis ke: ' + pointers.map((p) => path.basename(p)).join(', '))
  }

  const agentCount = new Set(written.flatMap((w) => w.agents)).size
  if (written.length > 0) {
    outro(`Berhasil memasang ${written.length} skill ke dalam ${agentCount} folder agen.`)
    console.log(pc.dim('slop-ai-indo siap digunakan. Sesi agen berikutnya akan otomatis memuat aturan ini.'))
  } else {
    outro('Tidak ada skill baru yang disalin. Salinan yang ada dipertahankan.')
    console.log(pc.dim('Jika ingin memperbarui ke versi terbaru, jalankan kembali dan pilih "Timpa dengan versi baru".'))
  }

  // Peringatan trust khusus Hermes
  if (location === 'project' && targets.some((t) => t.agents.some((a) => a.id === 'hermes'))) {
    log.warn('Hermes memerlukan satu langkah tambahan: jalankan `hermes skills trust` di proyek ini.')
  }

  // Deteksi duplikasi pembacaan folder
  for (const dup of detectDuplicateReads({ targets, location })) {
    log.warn(
      `${dup.agent.label} membaca kedua folder ${dup.paths.join(' dan ')}, dan slop-ai-indo kini ada di keduanya. ` +
        'Agen dapat memuat salah satu salinan secara acak. Hapus salah satunya untuk konsistensi.'
    )
  }

  printPluginDoors(detectPluginDoors())
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
