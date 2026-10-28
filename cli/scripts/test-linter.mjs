import { lintContent } from '../lib/linter.mjs'

/**
 * Rangkaian Pengujian Mesin Linter Deterministik Slop AI Indo
 */
const testCases = [
  {
    name: 'Mendeteksi frasa klise promosi AI (R-02)',
    code: '<h1>Unlock the true power of AI in your business</h1>',
    file: 'index.html',
    expectedRule: 'R-02',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi metrik dan angka kepuasan rekayasa fiktif (R-08)',
    code: '<p>Trusted by over 10,000+ companies worldwide with 99.9% satisfaction</p>',
    file: 'features.html',
    expectedRule: 'R-08',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi transisi global transition: all (R-09)',
    code: '.btn { transition: all 0.3s ease-in-out; }',
    file: 'button.css',
    expectedRule: 'R-09',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi utility Tailwind transition-all (R-09)',
    code: '<button class="transition-all duration-300">Submit</button>',
    file: 'form.jsx',
    expectedRule: 'R-09',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi tombol kapsul membulat rounded-full (R-12)',
    code: '<button class="rounded-full bg-blue-500 px-4 py-2">Get Started</button>',
    file: 'hero.blade.php',
    expectedRule: 'R-12',
    shouldFail: true,
  },
  {
    name: 'Mengizinkan rounded-full pada avatar pengguna (pengecualian R-12)',
    code: '<img class="rounded-full avatar" src="/user.jpg" alt="User avatar" />',
    file: 'profile.jsx',
    expectedRule: null,
    shouldFail: false,
  },
  {
    name: 'Mendeteksi pendaran neon luar berlebihan (R-11)',
    code: '.card { box-shadow: 0 0 15px cyan; }',
    file: 'card.css',
    expectedRule: 'R-11',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi komentar kode trivial dan boilerplate (R-31)',
    code: '// initialize variable\nconst count = 0;',
    file: 'counter.js',
    expectedRule: 'R-31',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi placeholder malas TODO / rest of code (R-32)',
    code: 'function processPayment() {\n  // TODO: implement later\n}',
    file: 'payment.ts',
    expectedRule: 'R-32',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi gradien biru-ke-ungu generik AI (R-01)',
    code: '<div class="from-indigo-500 to-pink-500 bg-gradient-to-r">Hero</div>',
    file: 'banner.html',
    expectedRule: 'R-01',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi ikon bintang sparkle AI generik (R-04)',
    code: '<button><Sparkles className="w-4 h-4" /> Generate Magic</button>',
    file: 'Generator.tsx',
    expectedRule: 'R-04',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi efek kaca glassmorphism menumpuk (R-10)',
    code: '<div class="backdrop-blur-md bg-white/10 p-6 border border-white/20">Card</div>',
    file: 'card.blade.php',
    expectedRule: 'R-10',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi tombol CTA klise generik AI (R-15)',
    code: '<button class="btn-primary">Get Started Today</button>',
    file: 'landing.html',
    expectedRule: 'R-15',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi tautan navigasi mati href="#" (R-24)',
    code: '<a href="#" class="nav-item">Documentation</a>',
    file: 'navbar.blade.php',
    expectedRule: 'R-24',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi penanganan error hampa silent catch (B-01)',
    code: 'try { doTask(); } catch (e) {}',
    file: 'service.js',
    expectedRule: 'B-01',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi mass assignment rentan $guarded = [] (B-02)',
    code: 'class Product extends Model {\n  protected $guarded = [];\n}',
    file: 'Product.php',
    expectedRule: 'B-02',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi emoji prefix pada judul modal (R-04)',
    code: '<h2>✏️ Edit Konfigurasi Kontrol Budget: 2026</h2>',
    file: 'BudgetModal.blade.php',
    expectedRule: 'R-04',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi emoji prefix pada legend/header seksi formulir (R-04)',
    code: '<legend>📅 Horizon Periode Kontrol Pagu</legend>',
    file: 'BudgetForm.html',
    expectedRule: 'R-04',
    shouldFail: true,
  },
  {
    name: 'Mendeteksi emoji prefix pada tombol simpan/aksi (R-04)',
    code: '<button type="submit" class="btn">💾 Simpan Konfigurasi</button>',
    file: 'ActionButtons.jsx',
    expectedRule: 'R-04',
    shouldFail: true,
  },
  {
    name: 'Meloloskan kode bersih buatan manusia (human-crafted)',
    code: `
      // Menjelaskan aturan bisnis: kunci idempotensi kedaluwarsa dalam 5 menit
      const IDEMPOTENCY_TTL_SEC = 300;
      export function Button({ label, onClick }) {
        return (
          <button
            type="button"
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
      console.log(`✔ [LULUS] ${tc.name} -> terdeteksi ${matched.ruleId} (${matched.name})`)
      passed++
    } else {
      console.error(`✖ [GAGAL] ${tc.name} -> tidak mendeteksi aturan ${tc.expectedRule}. Temuan:`, findings)
      failed++
    }
  } else {
    if (findings.length === 0) {
      console.log(`✔ [LULUS] ${tc.name} -> bersih dengan 0 temuan`)
      passed++
    } else {
      console.error(`✖ [GAGAL] ${tc.name} -> seharusnya bersih, namun ada temuan:`, findings)
      failed++
    }
  }
}

console.log(`\nHasil Pengujian Linter: ${passed} lolos, ${failed} gagal.`)
if (failed > 0) process.exit(1)
