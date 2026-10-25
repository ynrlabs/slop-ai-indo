import { computeContrast, validateDeliveryGate, handleToolCall } from '../bin/slop-mcp.mjs'

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    console.log(`✔ [PASS] ${message}`)
    passed++
  } else {
    console.error(`✖ [FAIL] ${message}`)
    failed++
  }
}

// 1. Test computeContrast
const c1 = computeContrast('#0f172a', '#ffffff')
assert(c1.ratio >= 10 && c1.normalText.pass === true, 'High contrast color passes WCAG AA')

const c2 = computeContrast('#777777', '#ffffff')
assert(c2.ratio < 4.5 && c2.normalText.pass === false, 'Low contrast color fails WCAG AA normal text')

// 2. Test tool call check_contrast
const toolRes1 = handleToolCall('check_contrast', { foreground: '#000000', background: '#ffffff' })
const parsed1 = JSON.parse(toolRes1.content[0].text)
assert(parsed1.ratio === 21, 'Black on white contrast ratio is 21')

// 3. Test tool call lint_snippet
const toolRes2 = handleToolCall('lint_snippet', {
  code: '<button class="rounded-full transition-all">Unlock the power</button>',
  filename: 'test.html'
})
const parsed2 = JSON.parse(toolRes2.content[0].text)
assert(parsed2.passed === false && parsed2.totalFindings >= 2, 'Lint snippet detects slop in HTML button')

// 4. Test tool call validate_delivery_gate
const validReport = `
## Delivery Gate Report
- Aturan yang diuji: R-01, R-09, R-12 dipatuhi
- Bukti Smoke Test: Semua tombol diklik dan merespon
- Pemeriksaan Kontras: Rasio kontras 14.2:1 (Lolos WCAG AA)
- Status Kelulusan: PASS
`
const dgRes = handleToolCall('validate_delivery_gate', { report: validReport })
const parsedDg = JSON.parse(dgRes.content[0].text)
assert(parsedDg.valid === true, 'Valid 4-block Delivery Gate report recognized')

const invalidReport = 'All looks good to me!'
const dgResInvalid = handleToolCall('validate_delivery_gate', { report: invalidReport })
const parsedDgInvalid = JSON.parse(dgResInvalid.content[0].text)
assert(parsedDgInvalid.valid === false && parsedDgInvalid.missing.length === 4, 'Incomplete Delivery Gate rejected')

// 5. Test tool call get_rule
const ruleRes = handleToolCall('get_rule', { ruleId: 'R-09' })
const parsedRule = JSON.parse(ruleRes.content[0].text)
assert(parsedRule.length > 0 && parsedRule[0].id === 'R-09', 'Rule R-09 retrieved accurately')

console.log(`\nMCP Tool Tests: ${passed} passed, ${failed} failed.`)
if (failed > 0) process.exit(1)
