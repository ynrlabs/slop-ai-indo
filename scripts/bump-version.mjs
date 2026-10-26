import fs from 'node:fs'

const newVersion = '1.3.0'

// 1. package.json
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
pkg.version = newVersion
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')

// 2. cli/package.json
const cliPkg = JSON.parse(fs.readFileSync('cli/package.json', 'utf8'))
cliPkg.version = newVersion
fs.writeFileSync('cli/package.json', JSON.stringify(cliPkg, null, 2) + '\n')

// 3. .claude-plugin/plugin.json
const claudePlugin = JSON.parse(fs.readFileSync('.claude-plugin/plugin.json', 'utf8'))
claudePlugin.version = newVersion
fs.writeFileSync('.claude-plugin/plugin.json', JSON.stringify(claudePlugin, null, 2) + '\n')

// 4. .claude-plugin/marketplace.json
const claudeMarket = JSON.parse(fs.readFileSync('.claude-plugin/marketplace.json', 'utf8'))
if (claudeMarket.plugins?.[0]) claudeMarket.plugins[0].version = newVersion
fs.writeFileSync('.claude-plugin/marketplace.json', JSON.stringify(claudeMarket, null, 2) + '\n')

// 5. .codex-plugin/plugin.json
const codexPlugin = JSON.parse(fs.readFileSync('.codex-plugin/plugin.json', 'utf8'))
codexPlugin.version = newVersion
fs.writeFileSync('.codex-plugin/plugin.json', JSON.stringify(codexPlugin, null, 2) + '\n')

// 6. .cursor-plugin/plugin.json
const cursorPlugin = JSON.parse(fs.readFileSync('.cursor-plugin/plugin.json', 'utf8'))
cursorPlugin.version = newVersion
fs.writeFileSync('.cursor-plugin/plugin.json', JSON.stringify(cursorPlugin, null, 2) + '\n')

// 7. .kimi-plugin/plugin.json
const kimiPlugin = JSON.parse(fs.readFileSync('.kimi-plugin/plugin.json', 'utf8'))
kimiPlugin.version = newVersion
fs.writeFileSync('.kimi-plugin/plugin.json', JSON.stringify(kimiPlugin, null, 2) + '\n')

// 8. .opencode-plugin/plugin.json
const opencodePlugin = JSON.parse(fs.readFileSync('.opencode-plugin/plugin.json', 'utf8'))
opencodePlugin.version = newVersion
fs.writeFileSync('.opencode-plugin/plugin.json', JSON.stringify(opencodePlugin, null, 2) + '\n')

// 9. .opencode-plugin/marketplace.json
const opencodeMarket = JSON.parse(fs.readFileSync('.opencode-plugin/marketplace.json', 'utf8'))
if (opencodeMarket.plugins?.[0]) opencodeMarket.plugins[0].version = newVersion
fs.writeFileSync('.opencode-plugin/marketplace.json', JSON.stringify(opencodeMarket, null, 2) + '\n')

// 10. cli/lib/banner.mjs
let banner = fs.readFileSync('cli/lib/banner.mjs', 'utf8')
banner = banner.replace(/installer v\d+\.\d+\.\d+/, `installer v${newVersion}`)
fs.writeFileSync('cli/lib/banner.mjs', banner)

// 11. skills/slop-ai-indo-human/contrast-mcp.py
let contrast = fs.readFileSync('skills/slop-ai-indo-human/contrast-mcp.py', 'utf8')
contrast = contrast.replace(/SERVER_VERSION = "\d+\.\d+\.\d+"/, `SERVER_VERSION = "${newVersion}"`)
fs.writeFileSync('skills/slop-ai-indo-human/contrast-mcp.py', contrast)

console.log('Bumped all manifests to version', newVersion)
