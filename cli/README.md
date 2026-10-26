
# slop-ai-indo

> **Slop AI Indo: Aturan Anti-Slop untuk AI Coding Agent.** Menghentikan agen menghasilkan UI dan teks klise (*AI slop*) yang generik, tanpa membuat hasilnya menjadi kaku atau dingin. Ini adalah sebuah **penyaring (filter), bukan panduan gaya (style guide)**: tidak mendikte warna, font, atau tata letak tertentu. Bukan hanya untuk membangun halaman web: Slop AI Indo juga menulis dan mengaudit teks, sehingga teks buatan AI tidak lagi terbaca seperti bot. Dan Slop AI Indo tidak pernah mempercantik tampilan sendirian; `DESIGN.md` (milik Anda) adalah sumber keindahan dan arah visual sesungguhnya.

> **Baru di sini? Mulailah dari [GUIDE.md](GUIDE.md).** Panduan ini menjelaskan apa itu slop-ai-indo dan cara memasangnya dari nol.

## Apa yang Dilakukannya

- **38 aturan wajib** (R-01 hingga R-38) dalam tiga tingkatan: *Hard Gate* (mutlak tanpa kompromi), *Purpose-Gate* (teknik diizinkan hanya jika ada alasan fungsional), *Quality Locks* (kunci konsistensi visual & kode).
- **Liveliness Toolkit** dengan tiga skala kendali (*ENERGY / RHYTHM / MOTION*) dan pembacaan desain, sehingga hasilnya hidup dan spesifik, bukan sekadar "bersih".
- **Verifikasi Fungsional Langsung:** pengujian interaktif elemen (smoke test R-35) dan audit kontras warna sebelum kode diserahkan.
- **Skill aditif modular**, satu per bidang kebutuhan, sehingga agen hanya memuat apa yang dibutuhkan oleh tugas terkait.

Filter inti mencegah kode murahan (*slop*) tetapi tidak menciptakan arah gaya. `DESIGN.md` (milik Anda) yang menyuplainya; hasil yang steril berarti arah desainnya hilang, bukan filternya yang gagal (R-37).




## Cara Pemasangan (Install)

Slop AI Indo didistribusikan sebagai kumpulan **skill agen terstandar** (satu folder per skill, memuat berkas `SKILL.md`). Filter inti selalu dimuat; skill lainnya hanya dimuat saat tugas membutuhkannya. Bagian ini adalah referensi lengkap: semua perintah instalasi di satu tempat. [GUIDE.md](GUIDE.md) memandu langkahnya dari awal, dan bagian Pembaruan (*Update*) serta Penghapusan (*Remove*) mencakup setiap metode dengan cara yang sama.

### 1. Pemasang Resmi NPM (`npx slop-ai-indo`) - Rekomendasi

Cukup jalankan satu perintah ini di folder proyek mana saja:

```bash
npx slop-ai-indo
```

Perintah ini secara otomatis memasang **1 paket lengkap**:
- `DESIGN.md`: Standar estetika human-crafted (bisa dipilih langsung saat instalasi: Enterprise SaaS, Dark Modern, Fintech & Transaksi, DevTools, Minimalist Monochrome, Editorial, Utilitarian, atau Bawaan).
- `AGENTS.md`: Aturan otomatis AI agent saat membuka proyek terkait.
- `slop-ai-indo.md`: Mesin filter inti (38 aturan wajib).
- `.agents/`: Folder konfigurasi lengkap dengan 11 modul skill terstandar (termasuk arsitektur backend, audit keamanan, testing, dan kebersihan kode).

### 2. Pemasang Instan Lokal Windows (`slop.bat`)

Jika Anda bekerja secara lokal di Windows dan ingin memasang tanpa koneksi internet, gunakan skrip batch bawaan:

```cmd
slop.bat
```
*(Atau tentukan folder tujuan: `slop.bat D:\path\ke\proyek`)*

### 3. Direktori Skills (skills.sh & GitHub)

slop-ai-indo juga terdaftar di [skills.sh](https://skills.sh/ynrlabs/slop-ai-indo) dan dapat dipasang langsung dari repositori GitHub:

```bash
npx skills add ynrlabs/slop-ai-indo
```

### 4. Plugin (Claude Code)

Tambahkan repositori ke marketplace sekali, lalu pasang pluginnya:

```text
/plugin marketplace add https://github.com/ynrlabs/slop-ai-indo
/plugin install slop-ai-indo
```

### 5. Plugin (Antigravity)

Repositori ini juga merupakan plugin native untuk Antigravity. Pasang menggunakan Antigravity CLI:

```bash
agy plugin install https://github.com/ynrlabs/slop-ai-indo
```

### 6. Plugin (Codex)

Repositori ini berfungsi sebagai plugin dan marketplace Codex. Tambahkan marketplace sekali, lalu pasang pluginnya:

```bash
codex plugin marketplace add ynrlabs/slop-ai-indo
codex plugin add slop-ai-indo
```

### 7. Plugin (Cursor)

Repositori ini adalah plugin Cursor. Tambahkan sebagai marketplace plugin menggunakan Cursor Agent CLI:

```bash
agent plugin marketplace add https://github.com/ynrlabs/slop-ai-indo
```

Kemudian buka menu **Customize** di Cursor, cari **slop-ai-indo**, dan pilih **Install** (pilih cakupan proyek atau user).

### 8. Plugin (Kimi Code)

Pasang langsung di sesi Kimi Code, lalu buka sesi baru:

```text
/plugins install https://github.com/ynrlabs/slop-ai-indo
```

### 9. Plugin (Cline)

Pasang menggunakan Cline CLI:

```bash
cline plugin install https://github.com/ynrlabs/slop-ai-indo.git
```

*Catatan:* Dokumentasi resmi Cline saat ini membatasi plugin untuk lingkungan CLI/SDK/Kanban, dan belum berlaku untuk ekstensi editor VS Code/JetBrains. Untuk pengguna ekstensi editor, gunakan metode 1 (`slop.bat`) atau metode 2 (Direktori Skills GitHub).

### 10. Plugin (OpenCode)

Repositori ini berfungsi sebagai plugin dan marketplace OpenCode. Pasang menggunakan OpenCode CLI:

```bash
opencode plugin marketplace install https://github.com/ynrlabs/slop-ai-indo
```

### Di Mana Lokasi Skill Disimpan

Setiap skill berbentuk folder berstandar terbuka Agent Skills (`<nama>/SKILL.md`), sehingga dapat langsung dikenali oleh agen mana pun yang mendukung standar ini. Pemasang (Metode 1) akan menyimpannya ke folder yang sesuai berikut ini:

| Agen Coding | Jalur Pembacaan Skill |
|-------------|--------------------------|
| Claude Code | `.claude/skills/` |
| Codex | `.codex/skills/` |
| Antigravity | `.agents/skills/` |
| OpenCode | `.opencode/skills/` |
| Cursor | `.cursor/skills/` |
| Cline | `.cline/skills/` |
| Amp | `.agents/skills/` |
| Gemini CLI | `.gemini/skills/` (dukungan legasi) |
| Hermes | `.hermes/skills/` |
| GitHub Copilot | `.agents/skills/` |
| Kimi Code | `.agents/skills/` |
| Oh My Pi | `.omp/skills/` |
| DeepSeek | `.deepseek/skills/` |

Antigravity, Copilot, Kimi Code, dan Amp berbagi satu folder (`.agents/skills/`). Pemasang menuliskan folder bersama ini sehingga memilih mereka bersamaan hanya memasang skill satu kali. Oh My Pi (`.omp/skills/`) dan DeepSeek (`.deepseek/skills/`) juga mendukung pembacaan folder bersama tersebut secara langsung.

### Manual (Berkas Tunggal)

Berkas inti `slop-ai-indo.md` adalah filter lengkap yang dapat Anda salin langsung ke jendela obrolan AI apa pun. Unduh dan minta agen Anda untuk membacanya; panduan wizard di dalamnya akan memandu instalasi skill secara manual:

```bash
curl -o slop-ai-indo.md https://raw.githubusercontent.com/ynrlabs/slop-ai-indo/main/slop-ai-indo.md
```

## Pembaruan (Update)

slop-ai-indo tidak memperbarui dirinya sendiri secara otomatis di latar belakang. Untuk memperbarui paket ke versi terbaru, cukup jalankan:

```bash
npx slop-ai-indo
```

| Metode | Perintah Pembaruan |
|--------|--------------------|
| Pemasang Resmi NPM | `npx slop-ai-indo` |
| Skrip Lokal Windows | `slop.bat` |
| Direktori skills.sh & GitHub | `npx skills add ynrlabs/slop-ai-indo` |
| Plugin Claude Code | `claude plugin update slop-ai-indo` |
| Plugin Antigravity | `agy plugin install https://github.com/ynrlabs/slop-ai-indo` |
| Plugin Codex | `codex plugin marketplace upgrade slop-ai-indo` |
| Plugin Cursor | `agent plugin marketplace update https://github.com/ynrlabs/slop-ai-indo` |
| Plugin Kimi Code | `/plugins install https://github.com/ynrlabs/slop-ai-indo` |
| Plugin Cline | `cline plugin install https://github.com/ynrlabs/slop-ai-indo.git --force` |
| Plugin OpenCode | `opencode plugin marketplace install https://github.com/ynrlabs/slop-ai-indo` |
| Manual | Unduh ulang berkas `slop-ai-indo.md` |

Skill dimuat saat sesi agen dimulai, jadi bukalah sesi baru setelah melakukan pembaruan.

## Daftar Skill Modular

| Skill | Cakupan Kerja | Hadir Sejak Versi |
|-------|---------------|-------------------|
| **slop-ai-indo** | Filter inti: 38 aturan, tingkatan gerbang, skala liveliness | v1.0.0 |
| **slop-ai-indo-ui** | Visual & tata letak: layout, warna, komponen, dekorasi, gerak, struktur | v1.0.0 |
| **slop-ai-indo-copywriting** | Penulisan & teks: judul, CTA, tone, anti kata klise AI, higienitas markdown | v1.0.0 |
| **slop-ai-indo-human** | Aksesibilitas: rasio kontras (disertai checker), navigasi keyboard, fokus, status elemen | v1.0.0 |
| **slop-ai-indo-layoutmobile** | Responsivitas mobile: adaptasi layar HP hingga desktop, breakpoint, grid, overflow, area sentuh | v1.0.0 |
| **slop-ai-indo-code** | Kebersihan komentar kode: membuang komentar klise AI, larangan DocBlock boilerplate pada native typing, menjaga komentar arsitektural | v1.0.0 |
| **slop-ai-indo-security** | Audit keamanan mendalam: tinjauan kerentanan source-first, threat modeling, verifikasi sandbox, pelaporan defensif | v1.0.0 |
| **slop-ai-indo-docs** | Dokumentasi teknis: pencegahan narasi hampa, cuplikan kode halusinasi, dan arsitektur fiktif di README & PRD | v1.0.2 |
| **slop-ai-indo-identity** | Karakter & identitas produk: pencegahan penjiplakan layout SaaS populer, ikon generik, dan palet acak | v1.0.2 |
| **slop-ai-indo-backend** | Arsitektur backend & API: Clean REST URL, parameter binding, controller ramping, DTO/Resource, database lookup table, $fillable, foreign key cascade | v1.1.0 |
| **slop-ai-indo-test** | Pengujian otomatis & mocking: pemberantasan tes palsu, over-mocking, asersi hampa, skenario kegagalan nyata | v1.1.0 |

Pilih skill yang sesuai dengan pekerjaan:
- Membuat UI → `slop-ai-indo-ui`
- Menulis teks/konten → `slop-ai-indo-copywriting`
- Aksesibilitas & kontras → `slop-ai-indo-human`
- Desain responsif mobile → `slop-ai-indo-layoutmobile`
- Komentar kode program → `slop-ai-indo-code`
- Audit keamanan & kerentanan kode → `slop-ai-indo-security`
- Dokumentasi teknis & PRD → `slop-ai-indo-docs`
- Identitas produk & branding → `slop-ai-indo-identity`
- Arsitektur backend & API → `slop-ai-indo-backend`
- Pengujian otomatis & unit test → `slop-ai-indo-test`
- Tugas campuran → pasang beberapa skill sekaligus
- Tanpa skill tambahan → berkas inti sendirian sudah merupakan filter yang lengkap

## Rekomendasi Preset Desain (DESIGN.md)

Saat memasang ke dalam proyek (`npx slop-ai-indo`), Anda dapat memilih preset estetika human-crafted yang otomatis disalin menjadi `DESIGN.md`:

| Preset | Karakter Visual & Arah Desain | Rekomendasi Kasus Penggunaan |
|--------|-------------------------------|------------------------------|
| **Enterprise SaaS** *(enterprise)* | Kanvas terang bersih, sudut 4px - 6px, border hairline, hierarki elegan ala Linear, n8n, Stripe, Notion. | Rekomendasi umum untuk aplikasi web B2B, SaaS, CRM, dashboard operasional, portal enterprise. |
| **Dark Modern** *(dark-modern)* | Kanvas matte zinc/obsidian `#09090b`, sudut 6px - 8px, hairline border, tanpa pendaran neon ala Vercel, Supabase, Raycast. | Cloud console, platform developer, AI tooling modern, produk bertema dark mode default. |
| **Fintech & Transaksi** *(fintech)* | Kanvas slate kokoh, angka tabular (`tabular-nums`), field nominal terstruktur, badge status audit perbankan ala Stripe, Wise, Mercury, Brex. | Gateway pembayaran, checkout e-commerce, dashboard investasi, akuntansi, aplikasi perbankan. |
| **Developer Tooling & Docs** *(devtools)* | Tata letak three-pane, kontainer kode presisi dengan tombol salin, badge shortcut keyboard (`<kbd>`), callout teknis ala Tailwind Docs, Cloudflare, Prisma. | Portal dokumentasi API, library open-source, knowledge base teknis, CLI reference. |
| **Minimalist Monochrome** *(minimal-monochrome)* | Monokromatik hitam-putih murni, rasio kontras maksimal, garis tegas 1px - 2px solid, zero drop-shadow ala Raycast, Basecamp, Teenage Engineering. | Utility tools, antarmuka minimalis radikal, portfolio desain, brutalism arsitektural. |
| **Editorial & Content** *(editorial)* | Kanvas hangat (warm off-white), tipografi serif anggun, panjang baris terukur 65ch - 75ch ala Substack, Stripe Press, ReadCV. | Blog, newsletter, publikasi artikel panjang, platform media dan konten berbasis tulisan. |
| **Utilitarian & Dense Data** *(utilitarian)* | Rasio data-ke-tinta tinggi, grid padat tanpa ruang mubazir, border penyekat tegas, status data semantik ala Grafana, Datadog, Retool. | Monitoring server, dashboard analitik teknis, visualisasi metrik real-time, industrial SCADA/IoT. |
| **Bawaan** *(default)* | Standar dasar human-crafted asli slop-ai-indo. | Proyek umum yang ingin menyesuaikan arah gaya secara mandiri dari awal. |

## Mode Penggunaan (Usage Modes)

Slop AI Indo digunakan dalam salah satu dari dua mode, yang ditentukan di awal sesi:

- **DURING (Saat Pengerjaan):** Memandu pengerjaan saat kode sedang dibangun, mencegah AI slop sejak awal. Gunakan saat membuat fitur atau UI baru dari nol.
- **AFTER (Audit Pasca Pengerjaan):** Mengaudit pekerjaan yang sudah selesai: menghasilkan daftar temuan bernomor, meminta persetujuan mana yang harus diperbaiki, lalu memberikan laporan tindak lanjut. Gunakan untuk membersihkan kode yang sudah ada.

## Mesin Linter Deterministik (`slop-lint`)

Verifikasi kode secara instan dan deterministik tanpa menunggu evaluasi subjektif LLM:

```bash
# Memeriksa seluruh file di proyek saat ini
npx slop-ai-indo lint

# Memeriksa folder tertentu
npx slop-ai-indo lint ./src

# Hanya memeriksa aturan tingkatan Hard Gate
npx slop-ai-indo lint . --tier=hard-gate

# Output format JSON untuk integrasi CI/CD
npx slop-ai-indo lint --json

# Mode senyap (hanya kode keluar dan ringkasan jika error)
npx slop-ai-indo lint --quiet
```

Linter ini memindai berkas secara statis dan memvalidasi aturan anti-slop lintas 3 tingkatan gerbang:
- **Hard Gate (Wajib Lulus Mutlak):**
  - Frasa klise promosi AI seperti *"unlock the power"*, *"seamless synergy"*, *"game-changing"* (`R-02`).
  - Penggunaan tanda em dash ganda berurutan tanpa tujuan editorial (`R-02`).
  - Metrik & statistik kepuasan fiktif rekayasa AI tanpa sumber nyata (`R-08`).
  - Transisi global `transition: all` dan transisi geometri pembuat lag (`R-09`).
  - Pendaran neon luar berlebihan / outer neon glow (`R-11`).
  - Tombol balon kapsul ekstrem (`rounded-full` / 9999px) di luar avatar (`R-12`).
  - Indikator fokus keyboard hilang (`outline: none`) tanpa cincin fokus pengganti (`R-06`).
  - Tautan navigasi mati atau anchor kosong `href="#"` (`R-24`).
  - Placeholder malas khas AI seperti `// TODO: implement later` atau `// rest of code` (`R-32`).
  - Penanganan error hampa / silent catch `catch (e) {}` (`B-01`).
  - Mass assignment model database tanpa perlindungan `$guarded = []` (`B-02`).
- **Purpose-Gate (Wajib Alasan Fungsional Tertulis):**
  - Gradien biru-ke-ungu generik khas template AI (`R-01`).
  - Ikon bintang sparkle atau magic wand tanpa fungsi nyata (`R-04`).
  - Efek kaca menumpuk berlebihan / excessive glassmorphism (`R-10`).
- **Quality Locks (Kerapian & Konsistensi):**
  - Tombol CTA generik klise AI (`R-15`).
  - Komentar kode trivial & DocBlock boilerplate yang mengulang sintaks (`R-31`).

## Server MCP Terpadu (`slop-mcp`)

Slop AI Indo menyediakan server Model Context Protocol (MCP) terpadu berbasis stdio untuk dipanggil langsung oleh AI agent di IDE (Claude Code, Cursor, Antigravity, Cline, Windsurf):

```bash
# Menjalankan server MCP secara langsung
npx slop-ai-indo mcp
```

### Konfigurasi MCP di IDE
Tambahkan entri berikut pada konfigurasi MCP IDE Anda:

```json
{
  "mcpServers": {
    "slop-ai-indo": {
      "command": "npx",
      "args": ["-y", "slop-ai-indo", "mcp"]
    }
  }
}
```

### Tools yang Disediakan Server MCP:
1. **`check_contrast`**: Menghitung rasio kontras WCAG 2.1 antara dua warna heksadesimal dengan vonis kepatuhan AA (normal & large text).
2. **`lint_snippet`**: Memeriksa potongan kode aktif secara in-memory dari AI slop sebelum ditulis ke disk.
3. **`lint_file`**: Menjalankan analisis statis deterministik pada path berkas atau direktori proyek.
4. **`validate_delivery_gate`**: Memvalidasi kelengkapan 4 blok laporan Delivery Gate (Aturan, Smoke Test, Kontras, dan status akhir).
5. **`get_rule`**: Mengambil referensi detail dan solusi perbaikan dari suatu aturan anti-slop berdasarkan Rule ID.

---

## Git Pre-commit Hook & CI/CD Pipeline

Slop AI Indo menyediakan penjaga gerbang otomatis (*automated gatekeeper*) agar kode yang mengandung AI slop tidak pernah masuk ke repositori git atau lolos ke branch produksi.

### 1. Git Pre-commit Hook Lokal

Pasang Git pre-commit hook ke direktori repositori Anda hanya dengan satu perintah:

```bash
npx slop-ai-indo hook
```

Fitur Pre-commit Hook:
- **Zero-overhead & Cepat (<100ms):** Hanya memindai berkas yang sedang di-*stage* (`git diff --cached`), tanpa overhead subprocess yang lambat.
- **Deteksi Pelanggaran Statis:** Otomatis memblokir commit jika kode staged memuat pelanggaran *Hard Gate* (frasa promosi klise `R-02`, metrik fiktif `R-08`, `transition: all` `R-09`, outer neon glow `R-11`, tombol kapsul `R-12`, outline none tanpa ring `R-06`, link mati `href="#"` `R-24`, placeholder malas `R-32`, silent catch `B-01`, atau `$guarded = []` `B-02`).
- **Bypass Darurat:** Jika dalam kondisi darurat Anda tetap harus melakukan commit, gunakan opsi bawaan git atau environment variable:
  ```bash
  git commit -m "emergency fix" --no-verify
  # atau
  SLOP_SKIP_HOOK=1 git commit -m "emergency fix"
  ```

### 2. Integrasi CI/CD (GitHub Actions)

Jadikan audit anti-slop sebagai salah satu tahap pengecekan otomatis pada setiap *Pull Request* dan *Push*.

Salin template workflow yang sudah disediakan ke direktori proyek Anda:

```bash
mkdir -p .github/workflows
cp templates/slop-audit.yml .github/workflows/
```

Contoh isi workflow (`.github/workflows/slop-audit.yml`):

```yaml
name: Slop AI Audit Gate

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master, develop ]

jobs:
  audit:
    name: Audit Anti-Slop Code Quality
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Run Deterministic Slop Linter
        run: npx -y slop-ai-indo lint .
```

Jika linter menemukan pelanggaran aturan pada kode PR, pipeline otomatis berstatus *Failed* dengan rincian baris dan Rule ID yang harus diperbaiki oleh kontributor atau AI agent.

## Peta Jalan (Roadmap)

**v1.3.1** adalah rilis saat ini. Riwayat setiap rilis dan rencana fitur selanjutnya tercantum lengkap di [ROADMAP.md](ROADMAP.md).

## FAQ (Pertanyaan yang Sering Diajukan)

### Apakah Slop AI Indo adalah sebuah panduan gaya (style guide)?
Bukan, melainkan sebuah **penyaring (filter)**. Slop AI Indo tidak mendikte palet warna, jenis font, atau template tata letak tertentu. Filter ini menolak teknik desain murahan yang tanpa tujuan fungsional dan menuntut tampilan yang hidup; arahan desain spesifik diserahkan sepenuhnya kepada Anda melalui `DESIGN.md`.

### Agen AI apa saja yang didukung?
Semua agen AI coding modern, melalui metode berikut:
- **Pemasang resmi NPM (`npx slop-ai-indo`):** Mendukung Claude Code, Codex, Antigravity, OpenCode, Cursor, Cline, Amp, Gemini CLI, Hermes, GitHub Copilot, Kimi Code, Oh My Pi, dan DeepSeek.
- **Direktori skills (GitHub) dan skrip lokal:** Tersedia via `slop.bat` dan `slop.ps1`.
- **Plugin native:** Tersedia untuk Claude Code, Antigravity, Codex, Cursor, Kimi Code, Cline, dan OpenCode dari repositori ini.
- **Berkas tunggal (`slop-ai-indo.md`):** Berfungsi pada agen AI apa pun yang dapat membaca teks Markdown polos, termasuk jendela chat browser atau aplikasi ponsel.

### Apa yang dimaksud dengan "Skill"?
Folder modul yang mendalami satu topik spesifik (UI, penulisan teks, aksesibilitas, dll.), yang memuat berkas `SKILL.md` berisi aturan khususnya. Modul ini merujuk pada aturan inti berdasarkan nomor dan tidak pernah menduplikasi isi aturan inti.

## Pengembang & Kontributor

Dikembangkan dan dirawat oleh [Yanuar (ynrlabs)](https://github.com/ynrlabs). 