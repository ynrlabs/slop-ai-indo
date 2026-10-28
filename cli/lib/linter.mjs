import fs from 'node:fs'
import path from 'node:path'

/**
 * Slop AI Indo - Mesin Linter Deterministik
 * Memeriksa kode, tata letak, styling, dan teks secara statis terhadap aturan anti-slop.
 */

function getFileExtension(filePath) {
  const lower = filePath.toLowerCase()
  if (lower.endsWith('.blade.php')) return '.blade.php'
  return path.extname(lower)
}

export const RULES = {
  // --- TINGKATAN 1: HARD GATES (Mutlak, Tanpa Pengecualian) ---
  'R-02-HYPE': {
    id: 'R-02',
    name: 'Frasa Klise Promosi AI (Hype Phrases)',
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
    name: 'Tanda Em Dash Jamak Berturut-turut',
    tier: 'Hard Gate',
    description: 'Penggunaan em dash berulang-ulang tanpa tujuan editorial yang sah.',
    fix: 'Gunakan titik, koma, atau tanda kurung standar; batasi em dash maksimal 1 per paragraf.',
    check: (line) => {
      const count = (line.match(/—/g) || []).length
      return count >= 2
    },
    extensions: ['.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte', '.md', '.markdown', '.txt'],
  },

  'R-08-FAKE-METRICS': {
    id: 'R-08',
    name: 'Metrik & Statistik Fiktif Rekayasa AI',
    tier: 'Hard Gate',
    description: 'Metrik atau angka kepuasan fiktif buatan AI tanpa atribusi sumber nyata.',
    fix: 'Hapus angka karangan; hanya tampilkan angka nyata dengan sumber yang dapat diverifikasi.',
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
    name: 'Transisi Global Tanpa Batas (transition: all)',
    tier: 'Hard Gate',
    description: 'Penggunaan transition: all atau transisi pada geometri (width/height/top/left) yang memicu reflow berat.',
    fix: 'Gunakan transisi spesifik GPU (opacity, transform, color) atau utility transition-colors.',
    patterns: [
      /transition\s*:\s*all\b/i,
      /\btransition-all\b/,
      /transition\s*:[^;]*(?:\bwidth\b|\bheight\b|\btop\b|\bleft\b)/i,
    ],
    extensions: ['.css', '.scss', '.sass', '.less', '.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte'],
  },

  'R-11-NEON-GLOW': {
    id: 'R-11',
    name: 'Pendaran Neon Luar Artifisial (Outer Neon Glow)',
    tier: 'Hard Gate',
    description: 'Efek pendaran neon luar berlebihan pada kartu atau border.',
    fix: 'Ganti dengan border garis tipis solid 1px (#e2e8f0 untuk terang, #27272a untuk gelap) dan shadow realistis.',
    patterns: [
      /box-shadow\s*:[^;]*0\s+0\s+(?:[1-9]\d*px|[6-9]px)[^;]*(?:cyan|magenta|#00f|#0ff|#f0f|rgba\(\s*(?:0,\s*255|255,\s*0|168,\s*85))/i,
      /filter\s*:[^;]*drop-shadow\(\s*0\s+0\s+[1-9]\d*px/i,
    ],
    extensions: ['.css', '.scss', '.sass', '.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte'],
  },

  'R-12-PILL-BUTTON': {
    id: 'R-12',
    name: 'Tombol Balon Kapsul Ekstrem (Pill-shaped Button)',
    tier: 'Hard Gate',
    description: 'Tombol aksi dengan border-radius kapsul ekstrem (9999px atau rounded-full) dilarang.',
    fix: 'Gunakan border-radius presisi 4px-6px (rounded-md atau rounded) ala Linear dan n8n.',
    patterns: [
      /border-radius\s*:\s*(?:9999px|1000px|50px|100%)/i,
      /<(?:button|a)[^>]*class="[^"]*\brounded-full\b[^"]*"[^>]*>/i,
    ],
    // Pengecualian khusus: Izinkan rounded-full pada avatar, foto profil pengguna, atau badge titik status
    ignoreIf: (line) => /\b(?:avatar|user-photo|rounded-avatar|profile-pic|icon-circle|badge-dot)\b/i.test(line),
    extensions: ['.css', '.scss', '.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte'],
  },

  'R-04-EMOJI-PREFIX': {
    id: 'R-04',
    name: 'Emoji / Icon Prefix Slop pada Judul, Form, atau Tombol',
    tier: 'Hard Gate',
    description: 'Menempelkan emoji dekoratif sebagai awalan teks pada modal, heading, form legend/label, atau tombol aksi.',
    fix: 'Hapus emoji; gunakan teks bersih (Clean Typography-First) atau ikon SVG semantik monokrom terpisah jika mutlak diperlukan.',
    patterns: [
      /<(?:h[1-6]|button|legend|summary)\b[^>]*>\s*(?:[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\u{1F1E6}-\u{1F1FF}])/u,
      /<(?:h[1-6]|button|legend|summary)\b[^>]*>[^<]*(?:✏️|📅|☘️|🌲|🛡️|💾|🚀|🔥|✨|💡|🎉|❌|➕|🗑️|⚙️)/u,
      /(?:title|label|header)\s*[:=]\s*["'][^"']*(?:✏️|📅|☘️|🌲|🛡️|💾|🚀|🔥|✨|💡|🎉|❌|➕|🗑️|⚙️)/u,
    ],
    extensions: ['.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte'],
  },

  'R-06-FOCUS-OUTLINE-NONE': {
    id: 'R-06',
    name: 'Indikator Fokus Keyboard Hilang (outline: none)',
    tier: 'Hard Gate',
    description: 'Menghapus focus outline tanpa menyediakan :focus-visible atau ring pengganti bagi aksesibilitas keyboard.',
    fix: 'Pertahankan focus outline atau sediakan :focus-visible yang kontras untuk navigasi keyboard pengguna.',
    patterns: [
      /outline\s*:\s*(?:none|0)\s*;/i,
      /\bfocus:outline-none\b(?![^"]*\bfocus:(?:ring|border)\b)/,
    ],
    extensions: ['.css', '.scss', '.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte'],
  },

  'R-24-DEAD-LINKS': {
    id: 'R-24',
    name: 'Tautan Navigasi Mati / Anchor Kosong',
    tier: 'Hard Gate',
    description: 'Tautan href="#" atau link tanpa tujuan nyata yang menuju ke halaman kosong.',
    fix: 'Hubungkan ke ID seksi yang nyata, rute yang valid, atau gunakan tombol jika memicu aksi.',
    patterns: [
      /<a\b[^>]*\bhref\s*=\s*["'](?:#|javascript:void\(0\);?|javascript:;)["'][^>]*>/i,
    ],
    extensions: ['.html', '.php', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte'],
  },

  'R-32-LAZY-PLACEHOLDERS': {
    id: 'R-32',
    name: 'Placeholder Malas Khas AI',
    tier: 'Hard Gate',
    description: 'Placeholder kode malas yang ditinggalkan AI tanpa implementasi tuntas.',
    fix: 'Implementasikan kode secara tuntas atau tangani fallback/error secara eksplisit.',
    patterns: [
      /\/\/\s*TODO:?\s*(?:implement later|add logic here|fill in|coming soon)\b/i,
      /\/\/\s*(?:rest of|remaining)\s+(?:code|logic|implementation)\s+(?:goes here|here)\b/i,
      /\/\*[\s\S]*?(?:rest of code|add implementation)[\s\S]*?\*\//i,
      /<!--\s*(?:rest of|remaining)\s+(?:content|sections?)\s*-->/i,
    ],
    extensions: ['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.php', '.py', '.html', '.blade.php', '.vue', '.svelte'],
  },

  'B-01-SILENT-CATCH': {
    id: 'B-01',
    name: 'Penanganan Error Hampa (Silent Catch)',
    tier: 'Hard Gate',
    description: 'Menelan exception atau error tanpa logging, re-throw, atau umpan balik ke pemanggil.',
    fix: 'Catat pesan error ke logger resmi sistem atau lempar kembali exception agar kegagalan dapat ditelusuri.',
    patterns: [
      /catch\s*\([^)]*\)\s*\{\s*(?:\/\/[^\n]*)?\s*\}/i,
    ],
    extensions: ['.js', '.mjs', '.cjs', '.ts', '.tsx', '.php', '.java'],
  },

  'B-02-GUARDED-EMPTY': {
    id: 'B-02',
    name: 'Mass Assignment Rentan ($guarded = [])',
    tier: 'Hard Gate',
    description: 'Membuka seluruh kolom database terhadap mass assignment tanpa perlindungan.',
    fix: 'Deklarasikan properti $fillable secara eksplisit untuk menentukan kolom yang aman diisi.',
    patterns: [
      /\bprotected\s+\$guarded\s*=\s*\[\s*\];/i,
    ],
    extensions: ['.php'],
  },

  // --- TINGKATAN 2: PURPOSE-GATE (Wajib Ada Alasan Tertulis) ---
  'R-01-GRADIENT': {
    id: 'R-01',
    name: 'Gradien Biru-Ungu Generik AI',
    tier: 'Purpose-Gate',
    description: 'Gradien biru ke ungu/cyan khas template AI tanpa alasan hierarki atau identitas merek tertulis.',
    fix: 'Gunakan warna solid terarah atau ambil palet kanvas terang dari panduan DESIGN.md.',
    patterns: [
      /\bfrom-(?:purple|indigo|violet)-(?:500|600)\s+to-(?:pink|blue|cyan)-(?:500|600)\b/i,
      /\blinear-gradient\([^)]*(?:#6366f1|#8b5cf6|#a855f7|purple)[^)]*(?:#ec4899|#06b6d4|#3b82f6|cyan)\b/i,
    ],
    extensions: ['.css', '.scss', '.html', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte'],
  },

  'R-04-SPARKLE-ICON': {
    id: 'R-04',
    name: 'Ikon Bintang Sparkle / Magic AI Generik',
    tier: 'Purpose-Gate',
    description: 'Ikon bintang sparkle atau tongkat sihir yang disematkan tanpa fungsi nyata.',
    fix: 'Ganti dengan ikon fungsional yang relevan dengan tindakan atau konten pengguna.',
    patterns: [
      /<(?:Sparkles|Wand2?|MagicWand|IconSparkles?)\b[^>]*\/?>/i,
      /\blucide:sparkles?\b/i,
      /\b(?:fa-magic|fa-wand-magic-sparkles)\b/i,
    ],
    extensions: ['.jsx', '.tsx', '.vue', '.svelte', '.html', '.blade.php'],
  },

  'R-10-GLASSMORPHISM': {
    id: 'R-10',
    name: 'Efek Kaca Menumpuk (Excessive Glassmorphism)',
    tier: 'Purpose-Gate',
    description: 'Efek kaca (backdrop-blur) yang dipasang pada banyak elemen sekaligus tanpa fungsi hierarki.',
    fix: 'Gunakan latar belakang solid atau batasi efek kaca maksimal pada 1 elemen aksen (misal navbar melayang).',
    patterns: [
      /\bbackdrop-blur-(?:md|lg|xl)\s+(?:bg-white|bg-black)\/(?:5|10|20)\b/i,
    ],
    extensions: ['.css', '.scss', '.html', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte'],
  },

  // --- TINGKATAN 3: QUALITY LOCKS (Konsistensi Kode & Kebersihan) ---
  'R-15-GENERIC-CTA': {
    id: 'R-15',
    name: 'Tombol CTA Generik Klise AI',
    tier: 'Quality Lock',
    description: 'Teks ajakan bertindak (CTA) klise AI yang tidak spesifik terhadap konteks tindakan.',
    fix: 'Gunakan label tombol spesifik terhadap aksi nyata (misal: "Mulai Uji Coba Gratis", "Lihat Demo Langsung").',
    patterns: [
      /<button[^>]*>\s*(?:Get\s+Started\s+Today|Transform\s+Your\s+Business|Supercharge\s+Your\s+Workflow|Unlock\s+Your\s+Potential)\s*<\/button>/i,
    ],
    extensions: ['.html', '.blade.php', '.jsx', '.tsx', '.vue', '.svelte'],
  },

  'R-31-TRIVIAL-COMMENTS': {
    id: 'R-31',
    name: 'Komentar Trivial & DocBlock Boilerplate',
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
  '.omp',
  '.deepseek',
  '.hermes',
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
 * Memeriksa konten satu berkas terhadap seluruh aturan yang terdaftar.
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
        const colNum = matchText ? Math.max(1, line.indexOf(matchText) + 1) : 1
        findings.push({
          ruleId: rule.id,
          ruleKey: key,
          name: rule.name,
          tier: rule.tier,
          file: filePath,
          line: lineNum,
          column: colNum,
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
 * Memeriksa direktori atau berkas target secara rekursif.
 */
export function lintPath(targetPath, { ignores = DEFAULT_IGNORES, tier = 'all' } = {}) {
  const resolved = path.resolve(targetPath)
  if (!fs.existsSync(resolved)) {
    throw new Error(`Jalur target tidak ditemukan: ${resolved}`)
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
      // Lewati berkas biner atau berkas yang tidak dapat dibaca
    }
  }

  const hardGateCount = allFindings.filter((f) => f.tier === 'Hard Gate').length
  const purposeGateCount = allFindings.filter((f) => f.tier === 'Purpose-Gate').length
  const qualityLocksCount = allFindings.filter((f) => f.tier === 'Quality Lock').length

  // Formula skor kebersihan kualitas kode (0 - 100)
  const penalty = (hardGateCount * 15) + (purposeGateCount * 8) + (qualityLocksCount * 4)
  const score = Math.max(0, 100 - penalty)

  return {
    scannedFiles,
    findings: allFindings,
    passed: hardGateCount === 0,
    score,
    counts: {
      hardGate: hardGateCount,
      purposeGate: purposeGateCount,
      qualityLocks: qualityLocksCount,
      total: allFindings.length,
    },
  }
}
