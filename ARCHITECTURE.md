# ARCHITECTURE.md - Arsitektur Sistem Slop AI Indo

Dokumen ini menjelaskan rancangan arsitektural sistem **Slop AI Indo**, alur integrasi aturan ke dalam agen AI, serta mekanisme evaluasi dan pengiriman hasil kerja.

---

## 1. Diagram Arsitektur Tingkat Tinggi

```
+---------------------------------------------------------------------------------+
|                                 USER / DEVELOPER                                |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                          LAYER 1: ENTRY & DISCOVERY                             |
|  - Pointer Blocks: AGENTS.md, CLAUDE.md, GEMINI.md, .mdc rules                  |
|  - Plugin Doors: Antigravity, Cursor, Claude Code, Cline, Codex, Kimi, OpenCode |
|  - Installer Scripts: npx slop-ai-indo, slop.bat, slop.ps1, install.ps1         |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                       LAYER 2: CORE FILTER ENGINE (slop-ai-indo.md)             |
|  - 38 Mandatory Rules (R-01 s/d R-38)                                           |
|    * Tier 1: Hard Gate (Mutlak, Tanpa Pengecualian)                             |
|    * Tier 2: Purpose-Gate (Harus Ada Justifikasi Fungsional)                    |
|    * Tier 3: Quality Locks (Konsistensi, Spasi, Tipografi)                      |
|  - Liveliness Toolkit (Skala Dials: ENERGY / RHYTHM / MOTION)                   |
|  - Direction Binding: Menghubungkan arahan positif dari DESIGN.md               |
+---------------------------------------------------------------------------------+
                                         |
                     +-------------------+-------------------+
                     |                                       |
                     v                                       v
+---------------------------------------+   +-------------------------------------+
|     LAYER 3: ADDITIVE SKILLS          |   |      LAYER 4: DIRECTION & STYLE     |
| - slop-ai-indo-ui (Visual & Komponen)     |   | - DESIGN.md                         |
| - slop-ai-indo-copywriting (Teks & Hype)  |   |   * Kanvas Terang Enterprise        |
| - slop-ai-indo-human (Aksesibilitas/WCAG) |   |   * Siku Tegas (Radius 4px - 6px)   |
| - slop-ai-indo-layoutmobile (Responsif)   |   |   * Tipografi Modern Bersih         |
| - slop-ai-indo-code (Komentar Kode Rapi)  |   |   * Larangan Tombol Kapsul & Neon   |
| - slop-ai-indo-security (Audit Keamanan)  |   +-------------------------------------+
+---------------------------------------+
                     |                                       |
                     +-------------------+-------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                       LAYER 5: VERIFICATION & DELIVERY GATE                     |
|  - Smoke Test Interaktif (R-35): Klik dan uji setiap tombol & form              |
|  - Audit Kontras Warna WCAG: contrast-check.py / contrast-mcp.py                |
|  - Verifikasi Keamanan Sandbox & Ledger: validate-findings / coverage-ledger    |
|  - Delivery Gate PASS/FAIL Report (4 Blok Evaluasi Mandatori)                   |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                           DELIVERABLE (KODE & UI BERSIH)                        |
+---------------------------------------------------------------------------------+
```

---

## 2. Alur Pemrosesan Data & Siklus Agen (Execution Lifecycle)

### 2.1. Inisialisasi Sesi (Session Start)
1. Agen membaca file konfigurasi root (`AGENTS.md` atau `CLAUDE.md`).
2. Pointer block mengarahkan agen untuk memuat `slop-ai-indo.md` sebagai filter inti.
3. Agen mendeteksi jenis tugas yang diminta pengguna:
   - Jika membuat/mengubah UI: Agen memuat `skills/slop-ai-indo-ui/SKILL.md` dan membaca arahan `DESIGN.md`.
   - Jika menulis konten/copy: Agen memuat `skills/slop-ai-indo-copywriting/SKILL.md`.
   - Jika memvalidasi aksesibilitas/kontras: Agen memuat `skills/slop-ai-indo-human/SKILL.md`.
   - Jika membuat layout mobile: Agen memuat `skills/slop-ai-indo-layoutmobile/SKILL.md`.
   - Jika membersihkan komentar kode: Agen memuat `skills/slop-ai-indo-code/SKILL.md`.
   - Jika melakukan audit keamanan atau review kerentanan kode/API/service: Agen memuat `skills/slop-ai-indo-security/SKILL.md`.

### 2.2. Mode Operasi: During vs After
- **Mode DURING:** Agen mengevaluasi setiap potongan kode (HTML, CSS, JS, Blade, Flutter) secara real-time terhadap aturan R-01 s/d R-38 sebelum menulisnya ke berkas.
- **Mode AFTER:** Agen membaca berkas yang sudah ada, memetakan pelanggaran ke dalam daftar temuan bernomor (misalnya: *Finding #1: Border-radius 9999px pada tombol kirim melanggar R-12*), meminta persetujuan perbaikan, lalu melakukan refactoring bertahap.

### 2.3. Hubungan Simbiotik antara `Slop AI Indo` dan `DESIGN.md`
- **`Slop AI Indo`** bertindak sebagai **Validator Negatif**: Menolak kode murahan, gradien klise, angka palsu, dan tombol kapsul lonjong.
- **`DESIGN.md`** bertindak sebagai **Arsitek Positif**: Memberikan palet warna spesifik (`#f8fafc`, `#ffffff`, `#0f172a`), ukuran padding, font sans-serif modern, dan proporsi geometri kartu presisi.
- Hasil kombinasi keduanya menghasilkan tampilan perangkat lunak kelas enterprise setara SaaS manusia profesional (seperti n8n dan Linear).

---

## 3. Komponen Utilitas & Skrip Pembantu

1. **CLI Installer (`cli/`)**:
   - Mendeteksi 11 IDE dan agen coding yang terpasang di komputer pengguna.
   - Menulis file rujukan dan menyalin modul skill tanpa menyentuh kode aplikasi utama.
2. **WCAG Contrast Checker (`skills/slop-ai-indo-human/contrast-check.py`)**:
   - Menghitung rasio luminansi relatif antara warna teks (foreground) dan warna latar (background).
   - Menjamin nilai kontras minimal 4.5:1 untuk teks biasa dan 3:1 untuk elemen UI grafis / teks tebal.
3. **Contrast MCP Server (`contrast-mcp.py`)**:
   - Antarmuka Model Context Protocol (MCP) untuk IDE yang mendukung pemanggilan tool kontras secara langsung.
