import { lintContent } from '../lib/linter.mjs'

const testCases = [
  {
    name: 'Detects AI hype phrase (R-02)',
    code: '<h1>Unlock the true power of AI in your business</h1>',
    file: 'index.html',
    expectedRule: 'R-02',
    shouldFail: true,
  },
  {
    name: 'Detects fake metric (R-08)',
    code: '<p>Trusted by over 10,000+ companies worldwide with 99.9% satisfaction</p>',
    file: 'features.html',
    expectedRule: 'R-08',
    shouldFail: true,
  },
  {
    name: 'Detects transition: all (R-09)',
    code: '.btn { transition: all 0.3s ease-in-out; }',
    file: 'button.css',
    expectedRule: 'R-09',
    shouldFail: true,
  },
  {
    name: 'Detects tailwind transition-all (R-09)',
    code: '<button class="transition-all duration-300">Submit</button>',
    file: 'form.jsx',
    expectedRule: 'R-09',
    shouldFail: true,
  },
  {
    name: 'Detects pill button rounded-full (R-12)',
    code: '<button class="rounded-full bg-blue-500 px-4 py-2">Get Started</button>',
    file: 'hero.blade.php',
    expectedRule: 'R-12',
    shouldFail: true,
  },
  {
    name: 'Allows rounded-full on user avatar (R-12 exception)',
    code: '<img class="rounded-full avatar" src="/user.jpg" alt="User avatar" />',
    file: 'profile.jsx',
    expectedRule: null,
    shouldFail: false,
  },
  {
    name: 'Detects neon outer glow (R-11)',
    code: '.card { box-shadow: 0 0 15px cyan; }',
    file: 'card.css',
    expectedRule: 'R-11',
    shouldFail: true,
  },
  {
    name: 'Detects trivial comments (R-31)',
    code: '// initialize variable\nconst count = 0;',
    file: 'counter.js',
    expectedRule: 'R-31',
    shouldFail: true,
  },
  {
    name: 'Detects lazy placeholders (R-32)',
    code: 'function processPayment() {\n  // TODO: implement later\n}',
    file: 'payment.ts',
    expectedRule: 'R-32',
    shouldFail: true,
  },
  {
    name: 'Passes clean human-crafted code',
    code: `
      // Explains non-obvious business rule: idempotency key expires in 5 minutes
      const IDEMPOTENCY_TTL_SEC = 300;
      export function Button({ label, onClick }) {
        return (
          <button
            onClick={onClick}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {label}
          </button>
        );
      }
    `,
    file: 'CleanButton.tsx',
    expectedRule: null,
    shouldFail: false,
  },
]

let passed = 0
let failed = 0

for (const tc of testCases) {
  const findings = lintContent(tc.code, tc.file)
  if (tc.shouldFail) {
    const matched = findings.find((f) => f.ruleId === tc.expectedRule)
    if (matched) {
      console.log(`✔ [PASS] ${tc.name} -> detected ${matched.ruleId} (${matched.name})`)
      passed++
    } else {
      console.error(`✖ [FAIL] ${tc.name} -> did not detect expected rule ${tc.expectedRule}. Got:`, findings)
      failed++
    }
  } else {
    if (findings.length === 0) {
      console.log(`✔ [PASS] ${tc.name} -> clean with 0 findings`)
      passed++
    } else {
      console.error(`✖ [FAIL] ${tc.name} -> expected clean, but got findings:`, findings)
      failed++
    }
  }
}

console.log(`\nLinter test results: ${passed} passed, ${failed} failed.`)
if (failed > 0) process.exit(1)
