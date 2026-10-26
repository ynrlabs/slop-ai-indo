import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(__dirname, '..', '..')
const repoSkills = path.join(repoRoot, 'skills')
const cliSkills = path.join(__dirname, '..', 'skills')

const CORE_FRONTMATTER = [
  '---',
  'name: slop-ai-indo',
  'description: "Slop AI Indo: Aturan untuk AI Coding Agent. Penyaring inti. Selalu aktif untuk menghentikan slop AI generik."',
  'allowed-tools: Read Write Edit Glob Grep',
  '---',
  '',
].join('\n')

const version = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')).version

const coreBody = fs.readFileSync(path.join(repoRoot, 'slop-ai-indo.md'), 'utf8')
  .replace(/\r\n/g, '\n')
  .trim()

// Snyk W012: skill yang dirilis dilarang meminta agen mengunduh instruksinya sendiri saat runtime.
if (/https?:\/\/raw\.githubusercontent\.com/.test(coreBody)) {
  throw new Error('slop-ai-indo.md memuat URL unduhan runtime; hapus sebelum sinkronisasi (Snyk W012)')
}

fs.writeFileSync(path.join(repoSkills, 'slop-ai-indo', 'SKILL.md'), CORE_FRONTMATTER + coreBody + '\n')

// Salinan yang terpasang adalah snapshot; berkas VERSION mencatat rilis asalnya.
fs.writeFileSync(path.join(repoSkills, 'slop-ai-indo', 'VERSION'), version + '\n')

// Python meninggalkan folder __pycache__ di samping alat pemeriksa kontras warna; jangan sertakan ke tarball paket.
fs.rmSync(cliSkills, { recursive: true, force: true })
fs.cpSync(repoSkills, cliSkills, {
  recursive: true,
  filter: (src) => path.basename(src) !== '__pycache__',
})

const agentsSkills = path.join(repoRoot, '.agents', 'skills')
if (fs.existsSync(agentsSkills)) {
  fs.rmSync(agentsSkills, { recursive: true, force: true })
  fs.cpSync(repoSkills, agentsSkills, {
    recursive: true,
    filter: (src) => path.basename(src) !== '__pycache__',
  })
}

// Salin presets/ ke cli/presets untuk distribusi paket npm
const repoPresets = path.join(repoRoot, 'presets')
const cliPresets = path.join(__dirname, '..', 'presets')
if (fs.existsSync(repoPresets)) {
  fs.rmSync(cliPresets, { recursive: true, force: true })
  fs.cpSync(repoPresets, cliPresets, { recursive: true })
}

// Salin DESIGN.md, slop-ai-indo.md, README.md, dan LICENSE ke cli/ untuk paket npm
fs.copyFileSync(path.join(repoRoot, 'DESIGN.md'), path.join(__dirname, '..', 'DESIGN.md'))
fs.copyFileSync(path.join(repoRoot, 'slop-ai-indo.md'), path.join(__dirname, '..', 'slop-ai-indo.md'))
fs.copyFileSync(path.join(repoRoot, 'README.md'), path.join(__dirname, '..', 'README.md'))
if (fs.existsSync(path.join(repoRoot, 'LICENSE'))) {
  fs.copyFileSync(path.join(repoRoot, 'LICENSE'), path.join(__dirname, '..', 'LICENSE'))
}

console.log(`Berhasil memperbarui skills/slop-ai-indo/SKILL.md dan VERSION (${version}) serta menyinkronkan ke cli/skills/ & .agents/skills/`)
