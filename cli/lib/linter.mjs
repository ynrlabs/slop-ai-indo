import fs from 'node:fs'
import path from 'node:path'

/**
 * Slop AI Indo - Mesin Linter Deterministik
 * Memeriksa kode, styling, dan teks secara statis terhadap 38 aturan anti-slop.
 */

function getFileExtension(filePath) {
  const lower = filePath.toLowerCase()
  if (lower.endsWith('.blade.php')) return '.blade.php'
  return path.extname(lower)
}

export const RULES = {
  // --- TIER 1: HARD GATES (Mutlak, Tanpa Pengecualian) ---
  'R-02-HYPE': {
    id: 'R-02',
    name: 'AI Copywriting Hype Phrases',
    tier: 'Hard Gate',
    description: 'Kata atau frasa klise promosi khas AI dilarang.',
    fix: 'Ganti dengan bahasa lugas, spesifik, dan manusiawi tanpa klaim bombastis.',
    patterns: [
      /\bunlock(?:ing)?\s+the\s+(?:true\s+)?power\s+of\b/i,
      /\bharness(?:ing)?\s+the\s+power\s+of\b/i,
      /\bseamless(?:ly)?\s+integrat(?:e|ed|ion|ing)\b/i,
      /\bseamless\s+synergy\b/i,
      /\bgame-changing\b/i,
      /\brevolutioniz(?:e|ing|ed)\b/i,
      /\bdelve(?:s|d)?\s+into\b/i,
      /\ba\s+testament\s+to\b/i,
      /\belevat(?:e|ing)\s+your\b/i,
      /\bsupercharg(?:e|ing|ed)\s+your\b/i,
      /\bcutting-edge\s+(?:solutions|technology|platform)\b/i,
      /\bin\s+today's\s+(?:fast-paced\s+)?digital\s+(?:age|world|landscape)\b/i,
      /\bbeacon\s+of\s+(?:hope|innovation|excellence)\b/i,
      /\bplethora\s+of\b/i,
    ],
    extensions: ['.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte', '.md', '.markdown', '.txt', '.js', '.ts'],
  },

  'R-02-EM-DASH': {
    id: 'R-02',
    name: 'Consecutive Em Dashes',
    tier: 'Hard Gate',
    description: 'Penggunaan em dash (—) berulang-ulang tanpa tujuan editorial.',
    fix: 'Gunakan titik atau tanda baca standar; batasi em dash maksimal 1 per paragraf.',
    check: (line) => {
      const count = (line.match(/—/g) || []).length
      return count >= 2
    },
    extensions: ['.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte', '.md', '.markdown', '.txt'],
  },

  'R-08-FAKE-METRICS': {
    id: 'R-08',
    name: 'Unsubstantiated / Fake AI Metrics',
    tier: 'Hard Gate',
    description: 'Metrik atau angka kepuasan fiktif buatan AI tanpa atribusi.',
    fix: 'Hapus angka karangan; hanya tampilkan angka nyata dengan kutipan sumber yang jelas.',
    patterns: [
      /\b99\.9%\s+(?:satisfaction|uptime guaranteed|happy clients)\b/i,
      /\b100%\s+(?:guaranteed|satisfaction|risk-free)\b/i,
      /\btrusted\s+by\s+(?:over\s+)?10(?:,|.)?000\+\s+(?:companies|users|teams|clients)\b/i,
      /\bloved\s+by\s+[0-9]+(?:k|\+)?\s+happy\s+(?:users|customers)\b/i,
      /\bjoin\s+[0-9]+(?:k|\+)?\s+(?:satisfied|happy)\s+users\b/i,
    ],
    extensions: ['.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte', '.md', '.markdown', '.txt'],
  },

  'R-09-TRANSITION-ALL': {
    id: 'R-09',
    name: 'Unbounded Transition All',
    tier: 'Hard Gate',
    description: 'Penggunaan transition: all atau transisi pada geometri (width/height/top/left).',
    fix: 'Gunakan transisi spesifik GPU (opacity, transform, color) atau transition-colors.',
    patterns: [
      /transition\s*:\s*all\b/i,
      /\btransition-all\b/,
      /transition\s*:[^;]*(?:\bwidth\b|\bheight\b|\btop\b|\bleft\b)/i,
    ],
    extensions: ['.css', '.scss', '.sass', '.less', '.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte'],
  },

  'R-11-NEON-GLOW': {
    id: 'R-11',
    name: 'Artificial Outer Neon Glow',
    tier: 'Hard Gate',
    description: 'Efek pendaran neon luar berlebihan pada kartu atau border.',
    fix: 'Ganti dengan hairline border halus (1px solid #e2e8f0 atau #27272a) dan shadow realistis.',
    patterns: [
      /box-shadow\s*:[^;]*0\s+0\s+(?:[1-9]\d*px|[6-9]px)[^;]*(?:cyan|magenta|#00f|#0ff|#f0f|rgba\(\s*(?:0,\s*255|255,\s*0|168,\s*85))/i,
      /filter\s*:[^;]*drop-shadow\(\s*0\s+0\s+[1-9]\d*px/i,
    ],
    extensions: ['.css', '.scss', '.sass', '.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte'],
  },

  'R-12-PILL-BUTTON': {
    id: 'R-12',
    name: 'Extreme Capsule / Pill Button',
    tier: 'Hard Gate',
    description: 'Tombol dengan border-radius kapsul ekstrem (9999px) dilarang.',
    fix: 'Gunakan border-radius presisi 4px–6px (rounded-md atau rounded) ala Linear & n8n.',
    patterns: [
      /border-radius\s*:\s*(?:9999px|1000px|50px|100%)/i,
      /<(?:button|a)[^>]*class="[^"]*\brounded-full\b[^"]*"[^>]*>/i,
    ],
    // Only flag on elements or styles that indicate buttons/cards, allow avatars
    ignoreIf: (line) => /\b(?:avatar|user-photo|rounded-avatar|profile-pic|icon-circle|badge-dot)\b/i.test(line),
    extensions: ['.css', '.scss', '.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte'],
  },

  'R-06-FOCUS-OUTLINE-NONE': {
    id: 'R-06',
    name: 'Missing Focus Indicator',
    tier: 'Hard Gate',
    description: 'Menghapus focus outline tanpa menyediakan :focus-visible atau ring pengganti.',
    fix: 'Pertahankan focus outline atau sediakan :focus-visible yang kontras untuk navigasi keyboard.',
    patterns: [
      /outline\s*:\s*(?:none|0)\s*;/i,
      /\bfocus:outline-none\b(?![^"]*\bfocus:(?:ring|border)\b)/,
    ],
    extensions: ['.css', '.scss', '.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte'],
  },

  // --- TIER 3: QUALITY LOCKS (Konsistensi Kode & Kebersihan) ---
  'R-31-TRIVIAL-COMMENTS': {
    id: 'R-31',
    name: 'Trivial / Redundant AI Comments',
    tier: 'Quality Lock',
    description: 'Komentar kode klise atau DocBlock boilerplate yang hanya mengulang sintaks atau memparafrase nama fungsi.',
    fix: 'Hapus komentar atau DocBlock yang sudah jelas dari nama/tipe fungsi; jelaskan alasan bisnis jika perlu.',
    patterns: [
      /\/\/\s*(?:initialize|declare|declaration of)\s+(?:variable|state|data)\b/i,
      /\/\/\s*(?:this function|function to)\s+(?:handles?|calculates?|renders?|returns?)\b/i,
      /\/\/\s*returns?\s+the\s+(?:result|value|data|response)\b/i,
      /\/\/\s*handle\s+(?:click|submit|change|event)\b/i,
      /\/\/\s*import\s+(?:dependencies|modules|libraries|components)\b/i,
      /\/\/\s*constructor\b/i,
      // DocBlock boilerplate / Signature echo:
      /^\s*\*\s*(?:Get|Set|Handles?|Retrieves?|Returns?|Fetches?|Deletes?|Updates?)\s+(?:all\s+)?(?:the\s+)?[a-zA-Z0-9_\s/]+(?:\bfor\b|\bfrom\b|\bto\b|\bof\b|\bby\b|\binstance\b|\bmenus?\b|\bdata\b|\buser\b)[a-zA-Z0-9_\s/]*\.?\s*$/i,
      /^\s*\*\s*@return\s+(?:void|Collection<int,\s*(?:object|mixed)>|mixed|object|array<string,\s*mixed>)\s*$/i,
    ],
    extensions: ['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.php', '.py', '.go', '.vue', '.svelte'],
  },

  'R-32-LAZY-PLACEHOLDERS': {
    id: 'R-32',
    name: 'Hallucinated / Lazy Placeholders',
    tier: 'Hard Gate',
    description: 'Placeholder kode malas khas AI yang tidak diimplementasikan.',
    fix: 'Implementasikan kode secara tuntas atau tangani fallback/error secara eksplisit.',
    patterns: [
      /\/\/\s*TODO:?\s*(?:implement later|add logic here|fill in|coming soon)\b/i,
      /\/\/\s*(?:rest of|remaining)\s+(?:code|logic|implementation)\s+(?:goes here|here)\b/i,
      /\/\*[\s\S]*?(?:rest of code|add implementation)[\s\S]*?\*\//i,
      /<!--\s*(?:rest of|remaining)\s+(?:content|sections?)\s*-->/i,
    ],
    extensions: ['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.php', '.py', '.html', '.blade.php', '.vue', '.svelte'],
  },
}

const DEFAULT_IGNORES = [
  'node_modules',
  '.git',
  '.agents',
  '.claude',
  '.cursor',
  '.codex',
  '.opencode',
  '.cline',
  '.gemini',
  'dist',
  'build',
  'vendor',
  'coverage',
  '.next',
  '.nuxt',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
]

/**
 * Scan a single file content against registered rules.
 */
export function lintContent(content, filePath = 'snippet') {
  const ext = getFileExtension(filePath)
  const lines = content.split(/\r?\n/)
  const findings = []

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]
    const lineNum = lineIndex + 1

    for (const [key, rule] of Object.entries(RULES)) {
      if (rule.extensions && !rule.extensions.includes(ext)) {
        continue
      }
      if (rule.ignoreIf && rule.ignoreIf(line, filePath)) {
        continue
      }

      let matched = false
      let matchText = ''

      if (rule.check) {
        if (rule.check(line, content)) {
          matched = true
          matchText = line.trim()
        }
      } else if (rule.patterns) {
        for (const pattern of rule.patterns) {
          const m = line.match(pattern)
          if (m) {
            matched = true
            matchText = m[0]
            break
          }
        }
      }

      if (matched) {
        findings.push({
          ruleId: rule.id,
          ruleKey: key,
          name: rule.name,
          tier: rule.tier,
          file: filePath,
          line: lineNum,
          snippet: line.trim(),
          matched: matchText,
          description: rule.description,
          fix: rule.fix,
        })
      }
    }
  }

  return findings
}

/**
 * Recursively scan directory or file.
 */
export function lintPath(targetPath, { ignores = DEFAULT_IGNORES, tier = 'all' } = {}) {
  const resolved = path.resolve(targetPath)
  if (!fs.existsSync(resolved)) {
    throw new Error(`Target path does not exist: ${resolved}`)
  }

  const stat = fs.statSync(resolved)
  const filesToScan = []

  if (stat.isFile()) {
    filesToScan.push(resolved)
  } else {
    function walk(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (ignores.includes(entry.name)) continue
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          walk(full)
        } else if (entry.isFile()) {
          filesToScan.push(full)
        }
      }
    }
    walk(resolved)
  }

  const allFindings = []
  let scannedFiles = 0

  for (const file of filesToScan) {
    try {
      const content = fs.readFileSync(file, 'utf8')
      const findings = lintContent(content, file)
      const filtered = tier === 'all'
        ? findings
        : findings.filter((f) => f.tier.toLowerCase().includes(tier.toLowerCase()))

      if (filtered.length > 0) {
        allFindings.push(...filtered)
      }
      scannedFiles++
    } catch {
      // Skip unreadable binary files
    }
  }

  return {
    scannedFiles,
    findings: allFindings,
    passed: allFindings.filter((f) => f.tier === 'Hard Gate').length === 0,
    counts: {
      hardGate: allFindings.filter((f) => f.tier === 'Hard Gate').length,
      purposeGate: allFindings.filter((f) => f.tier === 'Purpose-Gate').length,
      qualityLocks: allFindings.filter((f) => f.tier === 'Quality Lock').length,
      total: allFindings.length,
    },
  }
}
