import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const CORE = 'slop-ai-indo'

export const VERSION = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')).version

export const DESIGN_PRESETS = [
  { value: 'enterprise', label: 'Enterprise SaaS (Rekomendasi Umum)', hint: 'Kanvas terang, radius 4-6px, presisi ala Linear / n8n' },
  { value: 'dark-modern', label: 'Dark Modern', hint: 'Kanvas gelap matte obsidian, monokrom presisi ala Vercel / Supabase' },
  { value: 'fintech', label: 'Fintech & Dashboard Finansial', hint: 'Keamanan finansial, angka tabular, presisi ala Stripe / Mercury / Wise' },
  { value: 'devtools', label: 'Developer Tooling & Docs', hint: 'Dokumentasi teknis, syntax split-panel ala Tailwind / Cloudflare' },
  { value: 'minimal-monochrome', label: 'Minimalist Monochrome', hint: 'Monokrom hitam-putih murni, kontras tinggi ala Raycast / Teenage Eng' },
  { value: 'editorial', label: 'Editorial & Content', hint: 'Warm canvas, serif typography ala Substack / Stripe Press' },
  { value: 'utilitarian', label: 'Utilitarian & Dense Data', hint: 'High-density grid, border tegas, tabular data ala Grafana' },
  { value: 'default', label: 'Bawaan (Default)', hint: 'Gunakan standar DESIGN.md asli slop-ai-indo' },
]

/**
 * Versi rilis dari instalasi yang ada, atau null jika mendahului berkas VERSION.
 * Tidak ada berkas lain di disk yang mencatat versi, sehingga tanpa berkas ini
 * proses pembaruan tidak dapat mengetahui versi yang sudah terpasang sebelumnya.
 */
export function installedVersion(targetPath) {
  const file = path.join(targetPath, CORE, 'VERSION')
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : null
}

// Setiap baris membawa berkas entri yang ditulisnya. Agen baru tidak dapat ditambahkan
// tanpa entri: properti `entry` dibutuhkan oleh `updatePointers`.
// Properti `readsAlso` mencantumkan folder proyek lain tempat agen memuat skill selain miliknya,
// sehingga duplikasi dapat dideteksi sejak awal daripada hilang tanpa jejak.
export const AGENTS = [
  { id: 'claude', label: 'Claude Code', dir: '.claude/skills', entry: 'CLAUDE.md' },
  // Antigravity membaca .agents/skills proyek, bukan yang ada di direktori home.
  { id: 'antigravity', label: 'Antigravity', dir: '.agents/skills', globalDir: '.gemini/config/skills', entry: 'AGENTS.md' },
  // Codex membaca $HOME/.agents/skills di cakupan global pengguna dan mengarahkan $CODEX_HOME/skills.
  // Di proyek, Codex membaca .codex/skills dan menelusuri .agents/skills dari working directory.
  { id: 'codex', label: 'Codex', dir: '.codex/skills', globalDir: '.agents/skills', readsAlso: ['.agents/skills'], entry: 'AGENTS.md' },
  // OpenCode mendokumentasikan ~/.config/opencode untuk skill global; ~/.opencode tidak terdokumentasi resmi.
  { id: 'opencode', label: 'OpenCode', dir: '.opencode/skills', globalDir: '.config/opencode/skills', readsAlso: ['.claude/skills', '.agents/skills'], entry: 'AGENTS.md' },
  { id: 'cursor', label: 'Cursor', dir: '.cursor/skills', entry: 'AGENTS.md' },
  // Cline membaca .claude/skills sekaligus foldernya sendiri, sehingga keduanya dapat bersinggungan di satu proyek.
  { id: 'cline', label: 'Cline', dir: '.cline/skills', readsAlso: ['.claude/skills'], entry: 'AGENTS.md' },
  // Amp berbagi .agents/skills proyek namun memiliki folder global tersendiri, serta turut memuat .claude/skills.
  { id: 'amp', label: 'Amp', dir: '.agents/skills', globalDir: '.config/agents/skills', readsAlso: ['.claude/skills'], entry: 'AGENTS.md' },
  { id: 'gemini', label: 'Gemini CLI', dir: '.gemini/skills', entry: 'GEMINI.md' },
  // Hermes membaca .hermes/skills dan .agents/skills milik proyek.
  { id: 'hermes', label: 'Hermes', dir: '.hermes/skills', readsAlso: ['.agents/skills'], entry: 'AGENTS.md' },
  // Copilot membaca folder bersama .agents/skills, berbagi target direktori dengan Antigravity.
  { id: 'copilot', label: 'GitHub Copilot', dir: '.agents/skills', entry: 'AGENTS.md' },
  // Kimi Code membaca folder bersama di kedua cakupan.
  { id: 'kimi', label: 'Kimi Code', dir: '.agents/skills', entry: 'AGENTS.md' },
  // Oh My Pi membaca .omp/skills dan mendukung .agents/skills serta .claude/skills.
  { id: 'omp', label: 'Oh My Pi', dir: '.omp/skills', readsAlso: ['.agents/skills', '.claude/skills'], entry: 'AGENTS.md' },
  // DeepSeek membaca .deepseek/skills dan shared .agents/skills.
  { id: 'deepseek', label: 'DeepSeek', dir: '.deepseek/skills', readsAlso: ['.agents/skills'], entry: 'AGENTS.md' },
]

export function skillSourceDir() {
  const bundled = path.join(__dirname, '..', 'skills')
  if (fs.existsSync(bundled)) return bundled
  const repo = path.join(__dirname, '..', '..', 'skills')
  if (fs.existsSync(repo)) return repo
  return null
}

function resolveBase(location) {
  return location === 'global' ? os.homedir() : process.cwd()
}

// Beberapa agen menyimpan skill global di luar ~/<dir>, seperti ~/.config milik OpenCode.
function skillPath(agent, location) {
  const dir = location === 'global' ? (agent.globalDir ?? agent.dir) : agent.dir
  return path.join(resolveBase(location), dir)
}

// Agen yang berbagi folder memakai target yang sama, sehingga skill hanya disalin satu kali
// dan jumlah konflik sesuai dengan folder di disk, bukan jumlah agen yang dipilih.
export function resolveTargets(location, selected = AGENTS.map((a) => a.id)) {
  const byPath = new Map()
  for (const agent of AGENTS.filter((a) => selected.includes(a.id))) {
    const target = skillPath(agent, location)
    const found = byPath.get(target)
    if (found) found.agents.push(agent)
    else byPath.set(target, { agents: [agent], path: target, exists: fs.existsSync(target) })
  }
  return [...byPath.values()]
}

// OpenCode, Hermes, Cline, Amp, Oh My Pi, dan DeepSeek membaca lebih dari satu folder proyek.
// Memasang ke dua folder berbeda dapat menempatkan salinan skill yang sama di kedua tempat.
export function detectDuplicateReads({ targets, location }) {
  if (location !== 'project') return []
  const paths = new Set(targets.map((t) => t.path))
  const found = []
  for (const t of targets) {
    for (const agent of t.agents) {
      const others = (agent.readsAlso ?? [])
        .map((d) => path.join(resolveBase(location), d))
        .filter((p) => paths.has(p))
      if (others.length > 0) found.push({ agent, paths: [t.path, ...others] })
    }
  }
  return found
}

// Agen yang foldernya sudah ada di disk, digunakan untuk pra-pilihan pada picker.
// Folder yang belum ada bukan berarti agen tidak terpasang, pengguna tetap bisa memilihnya.
export function detectAgents(location) {
  return AGENTS.filter((a) => fs.existsSync(path.dirname(skillPath(a, location)))).map((a) => a.id)
}

// Plugin door menyimpan salinan sendiri di bawah jalur vendor.
// Pemeriksaan ini hanya membaca; jika tidak ditemukan akan diabaikan tanpa melempar error.
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

function listDirs(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
  } catch {
    return []
  }
}

// Door yang meng-clone repo membawa berkas VERSION; yang di-clone sebelum rilis tidak membawanya.
// Versi yang tidak dikenal dilaporkan sebagai null daripada ditebak.
function cloneVersion(dir) {
  try {
    return fs.readFileSync(path.join(dir, 'skills', CORE, 'VERSION'), 'utf8').trim()
  } catch {
    return null
  }
}

function findClone(dir) {
  return fs.existsSync(dir) ? { path: dir, version: cloneVersion(dir) } : null
}

const claudePlugins = () => path.join(os.homedir(), '.claude', 'plugins', 'installed_plugins.json')

export const PLUGIN_DOORS = [
  {
    id: 'claude',
    label: 'Claude Code',
    update: 'claude plugin update slop-ai-indo',
    find() {
      const plugins = readJSON(claudePlugins())?.plugins
      const entry = plugins?.['slop-ai-indo']?.[0] ?? plugins?.['antislop@slop-ai-indo']?.[0] ?? plugins?.['antislop@anti-slop']?.[0]
      return entry ? { path: entry.installPath ?? claudePlugins(), version: entry.version ?? null } : null
    },
  },
  {
    id: 'antigravity',
    label: 'Antigravity',
    update: 'agy plugin install https://github.com/yanuar1997/slop-ai-indo',
    find: () => findClone(path.join(os.homedir(), '.gemini', 'config', 'plugins', CORE)),
  },
  {
    id: 'codex',
    label: 'Codex',
    update: 'codex plugin marketplace upgrade slop-ai-indo',
    find() {
      const cacheNew = path.join(os.homedir(), '.codex', 'plugins', 'cache', 'slop-ai-indo', CORE)
      const cacheOld = path.join(os.homedir(), '.codex', 'plugins', 'cache', 'anti-slop', CORE)
      const cache = fs.existsSync(cacheNew) ? cacheNew : cacheOld
      const versions = listDirs(cache).sort()
      return versions.length ? { path: cache, version: versions[versions.length - 1] } : null
    },
  },
  {
    id: 'cursor',
    label: 'Cursor',
    update: 'agent plugin marketplace update https://github.com/yanuar1997/slop-ai-indo',
    find: () =>
      findClone(path.join(os.homedir(), '.cursor', 'plugins', 'local', 'slop-ai-indo')) ??
      findClone(path.join(os.homedir(), '.cursor', 'plugins', 'local', 'anti-slop')),
  },
  {
    id: 'opencode',
    label: 'OpenCode',
    update: 'opencode plugin marketplace install https://github.com/yanuar1997/slop-ai-indo',
    find: () =>
      findClone(path.join(os.homedir(), '.config', 'opencode', 'plugins', 'slop-ai-indo')) ??
      findClone(path.join(os.homedir(), '.config', 'opencode', 'plugins', CORE)),
  },
]

// Door yang memindahkan berkasnya merusak pemeriksaannya sendiri: pemasang berhenti
// menyebutkan door tersebut alih-alih melempar error gagal.
export function detectPluginDoors() {
  return PLUGIN_DOORS.flatMap((door) => {
    let found = null
    try {
      found = door.find()
    } catch {
      found = null
    }
    return found ? [{ door, ...found }] : []
  })
}

export function detectConflicts({ skills, targets }) {
  const conflicts = []
  for (const t of targets) {
    for (const skill of skills) {
      if (fs.existsSync(path.join(t.path, skill))) {
        conflicts.push({ skill, agent: t.agent, path: path.join(t.path, skill) })
      }
    }
  }
  return conflicts
}

function copyDir(src, dest) {
  fs.rmSync(dest, { recursive: true, force: true })
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    // README.md hanya untuk tampilan repositori GitHub; jangan disalin ke direktori skill pengguna.
    if (entry.name === 'README.md') continue
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    if (entry.isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}

export function installSkills({ skills, targets, overwrite = false }) {
  const source = skillSourceDir()
  // Berikan alasan jelas daripada TypeError dari path.join(null, skill).
  if (!source) throw new Error('Tidak dapat menemukan direktori sumber skill slop-ai-indo. Silakan instal ulang paket slop-ai-indo.')
  const written = []
  for (const t of targets) {
    for (const skill of skills) {
      const src = path.join(source, skill)
      if (!fs.existsSync(src)) continue
      const dest = path.join(t.path, skill)
      if (fs.existsSync(dest) && !overwrite) continue
      copyDir(src, dest)
      written.push({ skill, agents: t.agents.map((a) => a.id), path: dest })
    }
  }
  return written
}

const POINTER_START = '<!-- antislop:start -->'
const POINTER_END = '<!-- antislop:end -->'

const SKILL_LINES = {
  [CORE]: 'Penyaring inti, selalu aktif: `slop-ai-indo`',
  'slop-ai-indo-ui': 'UI & estetika visual: `slop-ai-indo-ui`',
  'slop-ai-indo-copywriting': 'Teks & copywriting: `slop-ai-indo-copywriting`',
  'slop-ai-indo-human': 'Aksesibilitas & manusia: `slop-ai-indo-human`',
  'slop-ai-indo-layoutmobile': 'Mobile & responsif: `slop-ai-indo-layoutmobile`',
  'slop-ai-indo-code': 'Komentar kode bersih: `slop-ai-indo-code`',
  'slop-ai-indo-security': 'Audit keamanan & kerentanan: `slop-ai-indo-security`',
  'slop-ai-indo-docs': 'Dokumentasi teknis: `slop-ai-indo-docs`',
  'slop-ai-indo-identity': 'Identitas brand & karakter visual: `slop-ai-indo-identity`',
  'slop-ai-indo-backend': 'Backend, API, & sanitasi query: `slop-ai-indo-backend`',
  'slop-ai-indo-test': 'Pengujian otomatis & anti-mocking: `slop-ai-indo-test`',
}

export const SKILL_NAMES = Object.keys(SKILL_LINES)

// Menyebutkan nama-nama skill daripada mengimpor core: impor '@' akan memuat seluruh 46 KB
// ke setiap sesi, termasuk sesi yang tidak menyentuh antarmuka pengguna.
function pointerBlock(skills) {
  return [
    POINTER_START,
    '## slop-ai-indo',
    'Untuk pekerjaan UI, copy, aksesibilitas, layout mobile, komentar kode, backend, keamanan, atau testing, muat skill slop-ai-indo yang relevan:',
    ...skills.filter((s) => SKILL_LINES[s]).map((s) => `- ${SKILL_LINES[s]}`),
    'Sebelum mulai, tanyakan ke pengguna kapan slop-ai-indo diterapkan: selama pengerjaan atau setelah selesai.',
    'Untuk memperbarui slop-ai-indo nanti: jalankan `npx slop-ai-indo` atau `slop.bat`.',
    POINTER_END,
  ]
}

// Penanda di dalam code fence adalah contoh milik pengguna, bukan blok kita. Panjang pembatas code fence
// dicocokkan berdasarkan panjang karakter backtick, dan fence yang terbuka di EOF dianggap salah ketik.
function scanMarkers(lines) {
  const fenced = new Array(lines.length).fill(false)
  let mark = null
  let len = 0
  let from = -1
  lines.forEach((line, i) => {
    const m = /^\s*(`{3,}|~{3,})/.exec(line)
    if (m) {
      if (!mark) {
        mark = m[1][0]
        len = m[1].length
        from = i
      } else if (m[1][0] === mark && m[1].length >= len && /^[ \t]*$/.test(line.slice(m[0].length))) {
        mark = null
        from = -1
      }
      fenced[i] = true
      return
    }
    fenced[i] = Boolean(mark)
  })
  if (mark) for (let i = from; i < lines.length; i++) fenced[i] = false

  const starts = []
  const ends = []
  lines.forEach((line, i) => {
    if (fenced[i]) return
    const t = line.trim()
    if (t === POINTER_START) starts.push(i)
    else if (t === POINTER_END) ends.push(i)
  })
  return { starts, ends }
}

function writeBlock(entry, block) {
  const existing = fs.existsSync(entry) ? fs.readFileSync(entry, 'utf8') : ''
  // Ikuti line ending (EOL) dominan pada berkas. Memeriksa "apakah ada CRLF" saja
  // dapat mengubah berkas yang mayoritas LF, hal yang harus dicegah.
  const crlf = (existing.match(/\r\n/g) || []).length
  const eol = crlf > (existing.match(/\n/g) || []).length - crlf ? '\r\n' : '\n'
  const lines = existing.split(/\r?\n/)
  const { starts, ends } = scanMarkers(lines)
  const start = starts.length ? starts[0] : -1
  const end = start === -1 ? -1 : ends.find((i) => i > start) ?? -1
  const paired = start !== -1 && end !== -1

  // Hanya baris penanda (marker) yang dihapus. Menafsirkan penanda awal tunggal
  // sampai EOF dapat menghapus teks asli yang ditulis oleh pengguna.
  const removed = new Set([...starts, ...ends])
  if (paired) for (let i = start; i <= end; i++) removed.add(i)

  const insertAt = paired ? start : lines.length
  const head = lines.slice(0, insertAt).filter((_, i) => !removed.has(i))
  const tail = lines.slice(insertAt).filter((_, i) => !removed.has(insertAt + i))

  // Rapikan hanya pada sambungan batas blok: penggantian /\n{3,}/g di seluruh dokumen
  // dapat merusak baris kosong yang sengaja ditulis pengguna di dalam code block.
  while (head.length && head[head.length - 1].trim() === '') head.pop()
  while (tail.length && tail[0].trim() === '') tail.shift()

  const body = [...head, '', ...block, ...(tail.length ? ['', ...tail] : [])]
    .join(eol)
    .replace(/^\r?\n+/, '')
    .trimEnd()

  fs.writeFileSync(entry, body + eol)
}

export function updatePointers({ targets, skills, designPreset = 'enterprise' } = {}) {
  const entries = new Set()
  for (const t of targets) {
    if (fs.existsSync(path.join(t.path, CORE))) for (const a of t.agents) entries.add(a.entry)
  }

  // Salin preset DESIGN.md dan slop-ai-indo.md ke direktori proyek saat ini jika tersedia
  const presetFile = `${designPreset}.md`
  const bundledPreset = path.join(__dirname, '..', 'presets', presetFile)
  const repoPreset = path.join(__dirname, '..', '..', 'presets', presetFile)
  const bundledDesign = path.join(__dirname, '..', 'DESIGN.md')

  let sourceDesign = null
  if (fs.existsSync(bundledPreset)) sourceDesign = bundledPreset
  else if (fs.existsSync(repoPreset)) sourceDesign = repoPreset
  else if (fs.existsSync(bundledDesign)) sourceDesign = bundledDesign

  if (sourceDesign) {
    fs.copyFileSync(sourceDesign, path.join(process.cwd(), 'DESIGN.md'))
  }
  const bundledSlop = path.join(__dirname, '..', 'slop-ai-indo.md')
  if (fs.existsSync(bundledSlop)) {
    fs.copyFileSync(bundledSlop, path.join(process.cwd(), 'slop-ai-indo.md'))
  }

  const block = pointerBlock(skills)
  const written = []
  for (const name of entries) {
    const entry = path.join(process.cwd(), name)
    writeBlock(entry, block)
    written.push(entry)
  }
  return written
}

// Flag `--update` mengganti setiap folder slop-ai-indo yang sudah ada di komputer ini,
// di kedua cakupan (project dan global) tanpa prompt interaktif.
// Setiap folder mempertahankan pilihan skill sebelumnya. Parameter cakupan memungkinkan
// pengujian berjalan tanpa menyentuh direktori home pengguna.
export function updateAll({ locations = ['project', 'global'] } = {}) {
  const results = []
  const projectTargets = []
  const projectSkills = new Set()

  for (const location of locations) {
    for (const target of resolveTargets(location)) {
      if (!fs.existsSync(path.join(target.path, CORE))) continue
      const skills = SKILL_NAMES.filter((s) => fs.existsSync(path.join(target.path, s)))
      if (skills.length === 0) continue
      const from = installedVersion(target.path)
      installSkills({ skills, targets: [target], overwrite: true })
      results.push({ location, path: target.path, agents: target.agents.map((a) => a.id), skills, from, to: VERSION })
      if (location === 'project') {
        projectTargets.push(target)
        for (const s of skills) projectSkills.add(s)
      }
    }
  }

  // Satu blok per berkas entri pointer, sehingga gabungan skill dari seluruh folder proyek dijadikan satu daftar.
  const pointers = projectTargets.length > 0
    ? updatePointers({ targets: projectTargets, skills: [...projectSkills] })
    : []
  return { results, pointers }
}
