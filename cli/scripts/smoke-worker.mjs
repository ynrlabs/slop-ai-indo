import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  AGENTS,
  CORE,
  PLUGIN_DOORS,
  skillSourceDir,
  resolveTargets,
  detectAgents,
  detectConflicts,
  detectDuplicateReads,
  installSkills,
  installedVersion,
  updateAll,
  updatePointers,
  VERSION,
} from '../lib/install.mjs'

const skills = [CORE, 'slop-ai-indo-ui']

const failures = []

/**
 * Mencetak baris pemeriksaan dan mencatat hasilnya.
 * Seluruh pemeriksaan dijalankan hingga selesai untuk mengumpulkan semua error.
 */
const check = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  console.log(ok ? `ok   ${label}:` : `FAIL ${label}:`, actual, ok ? '' : `(diharapkan ${JSON.stringify(expected)})`)
  if (!ok) failures.push(label)
}

// Kondisi awal (fresh project): belum ada agen terdeteksi, target bawaan mencakup semua agen.
const fresh = detectAgents('project')
check('A terdeteksi (proyek baru)', fresh, [])
const defaultTargets = resolveTargets('project')
console.log('A target bawaan:', defaultTargets.map((t) => `${t.agents.map((a) => a.id).join('+')}@${t.path} exists=${t.exists}`).join(' | '))
// Copilot, Kimi Code, dan Amp berbagi folder Antigravity, sehingga 13 agen memetakan ke 10 folder target.
check('A 13 agen dalam 10 folder', [AGENTS.length, defaultTargets.length], [13, 10])
check('A copilot dan kimi berbagi folder antigravity', resolveTargets('project', ['antigravity', 'copilot', 'kimi']).length, 1)

// Hanya Claude Code, melalui pemilihan eksplisit.
const targets = resolveTargets('project', ['claude'])
let written = installSkills({ skills, targets, overwrite: false })
let pointers = updatePointers({ targets, skills })
console.log('B target:', targets.map((t) => `${t.agents.map((a) => a.id).join('+')}@${t.path} exists=${t.exists}`).join(' | '))
console.log('B berkas tertulis:', written.map((w) => `${w.agents.join('+')}:${w.skill}`).join(', '))
check('B pointer', pointers.map((p) => path.basename(p)), ['CLAUDE.md'])

const conflicts = detectConflicts({ skills, targets })
written = installSkills({ skills, targets, overwrite: false })
check('C konflik terdeteksi', conflicts.length, 2)
check('C penulisan tanpa overwrite', written.length, 0)
written = installSkills({ skills, targets, overwrite: true })
check('C tertulis ulang dengan overwrite', written.length, 2)

// Antigravity pada proyek baru: .agents/ belum ada, instalasi akan membuatnya.
const agTargets = resolveTargets('project', ['antigravity'])
console.log('D target antigravity:', agTargets.map((t) => `${t.agents.map((a) => a.id).join('+')}@${t.path} exists=${t.exists}`).join(' | '), '(exists=false sebelum instalasi)')
const agWritten = installSkills({ skills, targets: agTargets, overwrite: false })
check('D berkas antigravity tertulis', agWritten.length, 2)
const agPointers = updatePointers({ targets: agTargets, skills })
check('D pointer antigravity', agPointers.map((p) => path.basename(p)), ['AGENTS.md'])
check('D .agents/skills/' + CORE + '/SKILL.md ada', fs.existsSync(path.join(process.cwd(), '.agents', 'skills', CORE, 'SKILL.md')), true)

// OpenCode, Cursor, Gemini, Oh My Pi, dan DeepSeek masing-masing menulis ke berkas entri sendiri.
for (const agent of ['opencode', 'cursor', 'gemini', 'omp', 'deepseek']) {
  const t = resolveTargets('project', [agent])
  const w = installSkills({ skills, targets: t, overwrite: false })
  const pointers = updatePointers({ targets: t, skills })
  check(`D2 ${agent} tertulis`, w.length, 2)
  check(`D2 ${agent} pointer`, pointers.map((p) => path.basename(p)), [agent === 'gemini' ? 'GEMINI.md' : 'AGENTS.md'])
  check(`D2 ${agent} folder ada`, fs.existsSync(path.join(process.cwd(), agent === 'gemini' ? '.gemini' : agent === 'cursor' ? '.cursor' : agent === 'omp' ? '.omp' : agent === 'deepseek' ? '.deepseek' : '.opencode', 'skills', CORE, 'SKILL.md')), true)
}

// Cline memiliki foldernya sendiri dan juga membaca .claude/skills.
const clineProject = resolveTargets('project', ['cline'])
check('D8 cline target proyek', clineProject[0].path, path.join(process.cwd(), '.cline', 'skills'))
check('D8 cline target global', resolveTargets('global', ['cline'])[0].path, path.join(os.homedir(), '.cline', 'skills'))
check('D8 cline tertulis', installSkills({ skills, targets: clineProject, overwrite: false }).length, 2)
check('D8 cline pointer', updatePointers({ targets: clineProject, skills }).map((p) => path.basename(p)), ['AGENTS.md'])
check('D8 cline folder ada', fs.existsSync(path.join(process.cwd(), '.cline', 'skills', CORE, 'SKILL.md')), true)

// Amp berbagi .agents/skills proyek yang sudah dibuat oleh Antigravity, namun folder globalnya berbeda.
const ampProject = resolveTargets('project', ['amp'])
check('D9 amp berbagi folder agents', ampProject[0].path, path.join(process.cwd(), '.agents', 'skills'))
check('D9 amp target global', resolveTargets('global', ['amp'])[0].path, path.join(os.homedir(), '.config', 'agents', 'skills'))
check('D9 amp tidak menulis ganda', installSkills({ skills, targets: ampProject, overwrite: false }).length, 0)
check('D9 amp pointer', updatePointers({ targets: ampProject, skills }).map((p) => path.basename(p)), ['AGENTS.md'])

// Hermes membaca .hermes/skills proyek, dan ~/.hermes/skills untuk instalasi global.
const hermesProject = resolveTargets('project', ['hermes'])
const hermesGlobal = resolveTargets('global', ['hermes'])
check('D3 hermes target proyek', hermesProject[0].path, path.join(process.cwd(), '.hermes', 'skills'))
check('D3 hermes target global', hermesGlobal[0].path, path.join(os.homedir(), '.hermes', 'skills'))
const hermesWritten = installSkills({ skills, targets: hermesProject, overwrite: false })
check('D3 hermes tertulis ke proyek', hermesWritten.length, 2)
check('D3 hermes terdeteksi di proyek', detectAgents('project').includes('hermes'), true)

// OpenCode membagi cakupannya: folder proyek untuk instalasi proyek, ~/.config untuk global.
const ocProject = resolveTargets('project', ['opencode'])
const ocGlobal = resolveTargets('global', ['opencode'])
check('D4 opencode target proyek', ocProject[0].path, path.join(process.cwd(), '.opencode', 'skills'))
check('D4 opencode target global', ocGlobal[0].path, path.join(os.homedir(), '.config', 'opencode', 'skills'))

// Antigravity membaca .agents/skills proyek namun bukan yang ada di direktori home.
const agGlobal = resolveTargets('global', ['antigravity'])
check('D5 antigravity target proyek', resolveTargets('project', ['antigravity'])[0].path, path.join(process.cwd(), '.agents', 'skills'))
check('D5 antigravity target global', agGlobal[0].path, path.join(os.homedir(), '.gemini', 'config', 'skills'))

// Kimi Code tidak memiliki foldernya sendiri: kedua cakupan memakai .agents/skills bersama.
check('D7 kimi target proyek', resolveTargets('project', ['kimi'])[0].path, path.join(process.cwd(), '.agents', 'skills'))

// updatePointers membutuhkan berkas entri, tidak boleh ada baris agen yang mengabaikannya.
check('D6 setiap agen memiliki berkas entri', AGENTS.filter((a) => !a.entry).map((a) => a.id), [])

// Hermes membaca AGENTS.md proyek, sehingga instalasi proyek harus menulis pointer ke sana.
check('D6 hermes menulis pointer proyek', updatePointers({ targets: hermesProject, skills }).map((p) => path.basename(p)), ['AGENTS.md'])

// Deteksi sekarang melihat seluruh agen yang telah terinstal.
const after = detectAgents('project')
check('E terdeteksi setelah instalasi', [...after].sort(), ['amp', 'antigravity', 'claude', 'cline', 'copilot', 'cursor', 'deepseek', 'gemini', 'hermes', 'kimi', 'omp', 'opencode'])

// OpenCode membaca .claude/skills dan .agents/skills, sehingga instalasi ke keduanya menghasilkan pembacaan ganda.
const dupReads = detectDuplicateReads({ targets: resolveTargets('project', ['claude', 'opencode']), location: 'project' })
check('E pembacaan ganda terdeteksi', dupReads.map((d) => [d.agent.id, d.paths.length]), [['opencode', 2]])
check('E satu folder tunggal bukan duplikat', detectDuplicateReads({ targets: resolveTargets('project', ['opencode']), location: 'project' }), [])
// Cline membaca .claude/skills sekaligus foldernya sendiri.
check('E pembacaan ganda cline terdeteksi', detectDuplicateReads({ targets: resolveTargets('project', ['claude', 'cline']), location: 'project' }).map((d) => [d.agent.id, d.paths.length]), [['cline', 2]])
// Amp membaca .claude/skills di samping folder bersama.
check('E pembacaan ganda amp terdeteksi', detectDuplicateReads({ targets: resolveTargets('project', ['claude', 'amp']), location: 'project' }).map((d) => [d.agent.id, d.paths.length]), [['amp', 2]])
check('E cakupan global tidak diperiksa duplikasi', detectDuplicateReads({ targets: resolveTargets('global', ['claude', 'opencode']), location: 'global' }), [])

// Cakupan global Codex adalah folder bersama, bukan ~/.codex/skills yang deprecated.
// Kimi Code juga berada di sana.
const globalTargets = resolveTargets('global', ['claude', 'codex', 'kimi'])
check('F target global', globalTargets.map((t) => `${t.agents.map((a) => a.id).join('+')}@${t.path}`), [
  `claude@${path.join(os.homedir(), '.claude', 'skills')}`,
  `codex+kimi@${path.join(os.homedir(), '.agents', 'skills')}`,
])

// Salinan identik dan deduplikasi blok pointer.
const src = fs.readFileSync(path.join(skillSourceDir(), 'slop-ai-indo-ui', 'SKILL.md'), 'utf8')
const dst = fs.readFileSync(path.join(process.cwd(), '.claude', 'skills', 'slop-ai-indo-ui', 'SKILL.md'), 'utf8')
check('G slop-ai-indo-ui SKILL.md identik', src === dst, true)

// Pengecekan versi yang terpasang dari berkas VERSION.
check('G versi terpasang tercatat dengan benar', installedVersion(targets[0].path), VERSION)
check('G tanpa instalasi menghasilkan versi null', installedVersion(path.join(process.cwd(), 'nowhere')), null)

updatePointers({ targets, skills })
const entry = fs.readFileSync(path.join(process.cwd(), 'CLAUDE.md'), 'utf8')
check('H blok setelah eksekusi kedua tetap satu', (entry.match(/antislop:start/g) || []).length, 1)

// Berkas entri adalah milik pengguna: setiap kasus uji memastikan berkas tidak rusak.
const entryPath = path.join(process.cwd(), 'CLAUDE.md')
const write = (text) => fs.writeFileSync(entryPath, text)
const read = () => fs.readFileSync(entryPath, 'utf8')

write('# Mine\r\n\r\nNotes.\r\n')
updatePointers({ targets, skills })
check('I CRLF dipertahankan', read().includes('\r\n<!-- antislop:start -->'), true)
check('I jumlah bare LF nol', (read().match(/(?<!\r)\n/g) || []).length, 0)

write('# Mine\n\n```md\n<!-- antislop:start -->\n<!-- antislop:end -->\n```\n')
updatePointers({ targets, skills })
check('I contoh dalam code fence tidak tersentuh', read().includes('```md\n<!-- antislop:start -->\n<!-- antislop:end -->\n```'), true)
check('I blok riil ditambahkan di luar code fence', (read().match(/antislop:start/g) || []).length, 2)

write('# Mine\n<!-- antislop:end -->\n')
updatePointers({ targets, skills })
const stable = read()
updatePointers({ targets, skills })
check('I marker yatim tidak bertambah', read() === stable, true)
check('I marker yatim dibersihkan', (read().match(/antislop:end/g) || []).length, 1)

// Fence yang terbuka di EOF adalah salah ketik, bukan batas penutup.
write('# Mine\n\nNotes:\n\n```bash\nnpm i\n')
updatePointers({ targets, skills })
const fenced = read()
updatePointers({ targets, skills })
updatePointers({ targets, skills })
check('J unclosed fence stabil', read() === fenced, true)
check('J unclosed fence mempertahankan kode', read().includes('npm i'), true)
check('J unclosed fence tepat satu blok', (read().match(/antislop:start/g) || []).length, 1)

// Penanda akhir yang salah ketik adalah teks pengguna, sehingga blok baru ditambahkan di akhir.
write('# Mine\n\n<!-- antislop:start -->\nold\n<!-- antislop:End -->\n\n## Notes\nKeep this line.\n')
updatePointers({ targets, skills })
check('J end marker salah ketik mempertahankan teks lanjutan', read().includes('Keep this line.'), true)
check('J end marker salah ketik menghasilkan satu blok riil', (read().match(/antislop:start/g) || []).length, 1)

// Fence run yang lebih panjang tidak ditutup oleh fence yang lebih pendek.
write('# Mine\n\n````md\n```md\n<!-- antislop:start -->\n<!-- antislop:end -->\n```\n````\n')
updatePointers({ targets, skills })
check('J contoh empat backtick tidak tersentuh', read().includes('````md\n```md\n<!-- antislop:start -->'), true)

// Baris serupa fence dengan teks tambahan adalah kode, bukan fence penutup.
for (const fence of ['```', '~~~']) {
  const example = `${fence}md\n${fence}js\n<!-- antislop:start -->\nKeep this example.\n<!-- antislop:end -->\n${fence}`
  write(`# Mine\n\n${example}\n`)
  updatePointers({ targets, skills })
  check(`J ${fence} dengan info string mempertahankan contoh`, read().includes(example), true)
  check(`J ${fence} blok riil ditambahkan di luar contoh`, (read().match(/antislop:start/g) || []).length, 2)
  const first = read()
  updatePointers({ targets, skills })
  check(`J ${fence} contoh tetap utuh saat reinstall`, read() === first, true)
}

// Marker penutup liar di bawah blok dibersihkan.
write('# Mine\n<!-- antislop:start -->\nold\n<!-- antislop:end -->\nTail text\n<!-- antislop:end -->\n')
updatePointers({ targets, skills })
check('J marker penutup liar di bawah dibersihkan', (read().match(/antislop:end/g) || []).length, 1)
check('J teks di bawah blok tetap dipertahankan', read().includes('Tail text'), true)

// Akhiran baris (EOL) dominan yang menang: dua baris CRLF tidak membalik berkas mayoritas LF.
write('# Mine\n' + 'line\n'.repeat(10) + 'a\r\nb\r\n')
updatePointers({ targets, skills })
check('J mayoritas LF tetap menggunakan LF', (read().match(/\r\n/g) || []).length, 0)

// Sepasang marker ganda dibersihkan menyisakan satu.
write('# Mine\n<!-- antislop:start -->\nX\n<!-- antislop:end -->\nKeep this too.\n<!-- antislop:start -->\nY\n<!-- antislop:end -->\n')
updatePointers({ targets, skills })
check('J pasangan ganda disatukan menjadi satu', (read().match(/antislop:start/g) || []).length, 1)
check('J teks di antara pasangan ganda tetap utuh', read().includes('Keep this too.'), true)

// Flag `--update` mengganti apa yang ada di disk, mempertahankan skill terpilih sebelumnya.
const present = resolveTargets('project').filter((t) => fs.existsSync(path.join(t.path, CORE)))
check('K update menemukan seluruh folder terpasang', present.length > 0, true)
const upd = updateAll({ locations: ['project'] })
check('K update melaporkan setiap folder yang ditemukan', upd.results.length, present.length)
check('K update memperbarui ke rilis versi saat ini', upd.results.every((r) => r.to === VERSION), true)
check('K update mempertahankan pilihan skill', upd.results.every((r) => r.skills.includes(CORE)), true)
check('K update menulis blok pointer', upd.pointers.length > 0, true)
check('K pointer memuat baris identifikasi slop-ai-indo', fs.readFileSync(path.join(process.cwd(), 'AGENTS.md'), 'utf8').includes('slop-ai-indo'), true)
const again = updateAll({ locations: ['project'] })
check('K update dapat diulang (repeatable)', again.results.map((r) => r.from), upd.results.map((r) => r.to))

// Direktori bersih tidak memiliki apapun untuk diperbarui.
const clean = fs.mkdtempSync(path.join(os.tmpdir(), 'slop-ai-indo-clean-'))
const here = process.cwd()
process.chdir(clean)
check('K update tidak melakukan apapun saat tidak ada folder terpasang', updateAll({ locations: ['project'] }).results.length, 0)
check('K update tidak menulis pointer saat tidak ada folder terpasang', updateAll({ locations: ['project'] }).pointers.length, 0)
process.chdir(here)
fs.rmSync(clean, { recursive: true, force: true })

// Setiap baris plugin door harus memiliki nama dan perintah pembaruan.
check('K setiap plugin door memiliki id label dan perintah', PLUGIN_DOORS.filter((d) => !d.id || !d.label || !d.update).map((d) => d.id), [])

if (failures.length > 0) {
  console.error(`\n${failures.length} pemeriksaan gagal: ${failures.join(', ')}`)
  process.exit(1)
}
console.log('\nsemua pemeriksaan berhasil')
