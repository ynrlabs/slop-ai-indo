#!/usr/bin/env node
/**
 * Slop AI Indo - Server MCP Terpadu (slop-mcp)
 * Protokol Model Context Protocol (MCP) standar via stdio.
 * Mengekspos tool linter, kontras WCAG, validasi Delivery Gate, dan katalog aturan ke IDE.
 */

import readline from 'node:readline'
import path from 'node:path'
import { lintContent, lintPath, RULES } from '../lib/linter.mjs'

const PROTOCOL_VERSION = '2024-11-05'
const SERVER_NAME = 'slop-ai-indo-mcp'
const SERVER_VERSION = '1.1.0'

// --- WCAG CONTRAST ALGORITHM ---
function channel(c) {
  c = c / 255.0
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function relativeLuminance(hexColor) {
  let h = hexColor.trim().replace(/^#/, '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function computeContrast(fg, bg) {
  try {
    const l1 = relativeLuminance(fg)
    const l2 = relativeLuminance(bg)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    const ratio = Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100

    return {
      foreground: fg,
      background: bg,
      ratio,
      normalText: { threshold: 4.5, pass: ratio >= 4.5 },
      largeText: { threshold: 3.0, pass: ratio >= 3.0 },
      verdict: ratio >= 4.5 ? 'PASS (WCAG AA)' : ratio >= 3.0 ? 'PASS (Large Text Only)' : 'FAIL (Insufficient Contrast)',
    }
  } catch (err) {
    throw new Error(`Invalid hex color input: ${err.message}`)
  }
}

// --- DELIVERY GATE VALIDATOR ---
export function validateDeliveryGate(report) {
  const blocks = {
    testedRules: /aturan\s+yang\s+diuji|\brules?\s+tested\b/i.test(report),
    smokeTest: /smoke\s+test|uji\s+interaktif|click-through/i.test(report),
    contrastAudit: /kontras|wcag|contrast/i.test(report),
    verdict: /\b(?:PASS|FAIL|LULUS|GAGAL)\b/.test(report),
  }

  const missing = []
  if (!blocks.testedRules) missing.push('Blok 1: Aturan yang Diuji (Daftar R-xx yang dipatuhi)')
  if (!blocks.smokeTest) missing.push('Blok 2: Bukti Smoke Test Interaktif (Uji klik elemen/form)')
  if (!blocks.contrastAudit) missing.push('Blok 3: Pemeriksaan Kontras WCAG')
  if (!blocks.verdict) missing.push('Blok 4: Status Kelulusan (PASS/FAIL)')

  return {
    valid: missing.length === 0,
    blocks,
    missing,
    verdict: missing.length === 0 ? 'VALID' : 'INVALID (Incomplete Delivery Gate)',
  }
}

// --- MCP TOOL DEFINITIONS ---
const TOOLS = [
  {
    name: 'check_contrast',
    description: 'Menghitung rasio kontras WCAG 2.1 antara dua warna heksadesimal (foreground & background) dan menentukan apakah memenuhi ambang batas AA.',
    inputSchema: {
      type: 'object',
      properties: {
        foreground: { type: 'string', description: 'Kode heksadesimal warna teks/foreground, misal: #0f172a' },
        background: { type: 'string', description: 'Kode heksadesimal warna latar/background, misal: #ffffff' },
      },
      required: ['foreground', 'background'],
    },
  },
  {
    name: 'lint_snippet',
    description: 'Memeriksa potongan kode atau teks secara instan dari AI slop (hype marketing, transition-all, pill button, komentar hampa, placeholder malas).',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Konten kode atau teks yang ingin diperiksa' },
        filename: { type: 'string', description: 'Nama berkas indikatif untuk deteksi ekstensi, misal: Button.tsx atau page.blade.php', default: 'snippet.html' },
      },
      required: ['code'],
    },
  },
  {
    name: 'lint_file',
    description: 'Menjalankan linter deterministik terhadap berkas atau direktori di komputer lokal.',
    inputSchema: {
      type: 'object',
      properties: {
        targetPath: { type: 'string', description: 'Path absolut atau relatif ke file atau folder yang ingin diperiksa' },
        tier: { type: 'string', description: 'Filter tingkat keparahan: all, hard-gate, atau quality-lock', default: 'all' },
      },
      required: ['targetPath'],
    },
  },
  {
    name: 'validate_delivery_gate',
    description: 'Memvalidasi kelengkapan 4 blok wajib laporan Delivery Gate sebelum kode diserahkan ke pengguna.',
    inputSchema: {
      type: 'object',
      properties: {
        report: { type: 'string', description: 'Teks laporan evaluasi Delivery Gate yang dibuat agen' },
      },
      required: ['report'],
    },
  },
  {
    name: 'get_rule',
    description: 'Mengambil informasi lengkap, alasan, dan solusi perbaikan dari suatu aturan slop-ai-indo berdasarkan Rule ID (misal: R-01, R-09, R-12, B-01, T-01).',
    inputSchema: {
      type: 'object',
      properties: {
        ruleId: { type: 'string', description: 'Kode nomor aturan, misal: R-09 atau R-12' },
      },
      required: ['ruleId'],
    },
  },
]

// --- JSON-RPC STDIO TRANSPORT ---
function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n')
}

function reply(id, result) {
  send({ jsonrpc: '2.0', id, result })
}

function error(id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } })
}

export function handleToolCall(name, args = {}) {
  switch (name) {
    case 'check_contrast': {
      const { foreground, background } = args
      if (!foreground || !background) throw new Error('Parameter foreground dan background wajib diisi.')
      const res = computeContrast(foreground, background)
      return {
        content: [{ type: 'text', text: JSON.stringify(res, null, 2) }],
      }
    }

    case 'lint_snippet': {
      const { code, filename = 'snippet.html' } = args
      if (typeof code !== 'string') throw new Error('Parameter code wajib diisi.')
      const findings = lintContent(code, filename)
      const passed = findings.filter((f) => f.tier === 'Hard Gate').length === 0
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            passed,
            totalFindings: findings.length,
            findings,
          }, null, 2),
        }],
      }
    }

    case 'lint_file': {
      const { targetPath, tier = 'all' } = args
      if (!targetPath) throw new Error('Parameter targetPath wajib diisi.')
      const resolved = path.resolve(process.cwd(), targetPath)
      const res = lintPath(resolved, { tier })
      return {
        content: [{ type: 'text', text: JSON.stringify(res, null, 2) }],
      }
    }

    case 'validate_delivery_gate': {
      const { report } = args
      if (!report) throw new Error('Parameter report wajib diisi.')
      const res = validateDeliveryGate(report)
      return {
        content: [{ type: 'text', text: JSON.stringify(res, null, 2) }],
      }
    }

    case 'get_rule': {
      const { ruleId } = args
      if (!ruleId) throw new Error('Parameter ruleId wajib diisi.')
      const normalized = ruleId.trim().toUpperCase()
      const matched = Object.values(RULES).filter((r) => r.id === normalized)
      if (matched.length === 0) {
        return {
          content: [{ type: 'text', text: `Aturan dengan ID "${ruleId}" tidak ditemukan dalam katalog linter.` }],
          isError: true,
        }
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(matched, null, 2) }],
      }
    }

    default:
      throw new Error(`Tool "${name}" tidak dikenal.`)
  }
}

export function startMcpServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  rl.on('line', (line) => {
    const trimmed = line.trim()
    if (!trimmed) return

    let msg
    try {
      msg = JSON.parse(trimmed)
    } catch {
      return
    }

    const { id, method, params } = msg

    if (method === 'initialize') {
      reply(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
      })
    } else if (method === 'notifications/initialized') {
      // Client ready
    } else if (method === 'ping') {
      reply(id, {})
    } else if (method === 'tools/list') {
      reply(id, { tools: TOOLS })
    } else if (method === 'tools/call') {
      const { name, arguments: toolArgs } = params || {}
      try {
        const result = handleToolCall(name, toolArgs)
        reply(id, result)
      } catch (err) {
        reply(id, {
          content: [{ type: 'text', text: `Error executing ${name}: ${err.message}` }],
          isError: true,
        })
      }
    } else {
      if (id !== undefined) {
        error(id, -32601, `Method not found: ${method}`)
      }
    }
  })

  process.stderr.write(`${SERVER_NAME} v${SERVER_VERSION} listening on stdio\n`)
}

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))) {
  startMcpServer()
}
