import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(__dirname, '..', '..')
const repoSkills = path.join(repoRoot, 'skills')
const cliSkills = path.join(__dirname, '..', 'skills')

const CORE_FRONTMATTER = [
  '---',
  'name: antislop',
  'description: "Anti Slop: Aturan untuk AI Coding Agent. Penyaring inti. Selalu aktif untuk menghentikan slop AI generik."',
  'allowed-tools: Read Write Edit Glob Grep',
  '---',
  '',
].join('\n')

const version = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')).version

const coreBody = fs.readFileSync(path.join(repoRoot, 'antislop.md'), 'utf8')
  .replace(/\r\n/g, '\n')
  .trim()

// Snyk W012: a shipped skill must not tell the agent to download its own instructions.
if (/https?:\/\/raw\.githubusercontent\.com/.test(coreBody)) {
  throw new Error('antislop.md carries a runtime download URL; remove it before syncing (Snyk W012)')
}

fs.writeFileSync(path.join(repoSkills, 'antislop', 'SKILL.md'), CORE_FRONTMATTER + coreBody + '\n')

// An installed copy is a snapshot with nothing in it that names the release it came from,
// so an update could not say what was on disk. Every install route copies this folder.
fs.writeFileSync(path.join(repoSkills, 'antislop', 'VERSION'), version + '\n')

// Python leaves a __pycache__ beside the contrast checker; it must not reach the tarball.
fs.rmSync(cliSkills, { recursive: true, force: true })
fs.cpSync(repoSkills, cliSkills, {
  recursive: true,
  filter: (src) => path.basename(src) !== '__pycache__',
})

const agentsSkills = path.join(repoRoot, '.agents', 'skills')
if (fs.existsSync(agentsSkills)) {
  fs.cpSync(repoSkills, agentsSkills, {
    recursive: true,
    filter: (src) => path.basename(src) !== '__pycache__',
  })
}

// Copy DESIGN.md and antislop.md into cli/ for npm package distribution
fs.copyFileSync(path.join(repoRoot, 'DESIGN.md'), path.join(__dirname, '..', 'DESIGN.md'))
fs.copyFileSync(path.join(repoRoot, 'antislop.md'), path.join(__dirname, '..', 'antislop.md'))

console.log(`Regenerated skills/antislop/SKILL.md and VERSION (${version}) and synced to cli/skills/ & .agents/skills/`)

