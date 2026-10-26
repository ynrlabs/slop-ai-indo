# Product Requirements Document (PRD): Slop AI Indo

## 1. Ringkasan Eksekutif & Tujuan Produk
**Slop AI Indo** adalah sistem penyaring (*filter*) presisi tinggi untuk AI Coding Agent (seperti Claude Code, Cursor, Cline, Antigravity, Codex, dan Kimi Code). 
Tujuan utamanya adalah **mencegah AI menghasilkan kode UI, teks *copywriting*, dan komentar kode yang klise, generik, dan murahan ("AI slop")**, tanpa mematikan kreativitas atau membuat hasil akhir menjadi kaku/steril.

Slop AI Indo **bukan panduan gaya (style guide)**, melainkan **filter negatif**. Slop AI Indo membuang apa yang tidak boleh ada, sedangkan arahan visual dan estetika positif disuplai oleh `DESIGN.md`.

---

## 2. Target Pengguna (User Persona)
1. **Software Engineer & Frontend Developer:** Menggunakan coding agent di IDE (Cursor, Cline, VS Code, JetBrains) dan frustrasi melihat AI menghasilkan komponen UI ungu-cyan generik, *pill button* balon, atau metrik palsu.
2. **Product Designer / Design Technologist:** Membutuhkan jaminan bahwa kode prototype yang dihasilkan AI memenuhi standar aksesibilitas manusia (kontras warna WCAG, navigasi keyboard) dan geometri bersih ala SaaS modern.
3. **Copywriter & Technical Writer:** Menuntut teks yang padat, lugas, jujur, dan bebas dari kata-kata bombastis AI (*"unlock the power of"*, *"seamless synergy"*, *"game-changing"*).
4. **Autonomous AI Coding Agents:** Berfungsi sebagai guardrail internal bagi agen otonom saat merancang arsitektur komponen, halaman web, dan fungsionalitas sistem.

---

## 3. Fitur Utama & Kapabilitas

### 3.1. Penyaring Aturan 3-Tier (38 Aturan Mutlak)
Sistem membagi 38 aturan (R-01 sampai R-38) ke dalam tiga tingkatan kepatuhan:
- **Tier 1: Hard Gate (Gerbang Mutlak)** — Pelanggaran langsung berakibat `FAIL`. Tidak ada kompromi (contoh: metrik/angka palsu, pendaran neon tanpa batas, tombol kapsul balon berlebihan, em dash beruntun).
- **Tier 2: Purpose-Gate (Gerbang Tujuan)** — Teknik tertentu hanya diizinkan jika ada alasan fungsional yang kuat dan terdokumentasi (contoh: animasi kompleks, modal overlay, visual chart).
- **Tier 3: Quality Locks (Kunci Kualitas)** — Memastikan konsistensi ritme visual, hierarki tipografi, padding konsisten, dan kebersihan komentar kode.

### 3.2. Liveliness Toolkit (Pengukur Kegairahan Visual)
Mencegah hasil UI menjadi dingin dan hampa setelah difilter. Terdiri dari 3 skala dial (nilai 1 s/d 5):
- **ENERGY:** Intensitas kontras visual dan ketegasan hierarki.
- **RHYTHM:** Variasi ukuran grid, spasi, dan pergantian densitas konten antar seksi.
- **MOTION:** Kehalusan dan kesopanan transisi interaktif.

### 3.3. Verifikasi Fungsional (Functional Verification)
Verifikasi langsung sebelum menyerahkan pekerjaan ke pengguna:
1. **Bukti Interaktivitas (Smoke Test):** Uji coba klik elemen interaktif secara nyata (tombol, input, form, modal, link navigasi).
2. **Pemeriksaan Kontras (Human/WCAG):** Rasio kontras teks terhadap latar belakang memenuhi standar AA (4.5:1 / 3:1).
3. **Kepatuhan Aturan:** Bebas dari elemen klise generik AI tanpa mewajibkan laporan checklist formal yang membebani output token.

### 3.4. Modul Skill Aditif (Modular Skills)
Pengguna atau agen hanya memuat modul yang relevan dengan tugas yang sedang dikerjakan:
- `slop-ai-indo` (Core filter 38 aturan)
- `slop-ai-indo-ui` (Tata letak, warna, geometri, shadow, dan dekorasi)
- `slop-ai-indo-copywriting` (Teks, judul, CTA, anti kata klise AI)
- `slop-ai-indo-human` (Aksesibilitas WCAG, fokus keyboard, skrip pemeriksa kontras)
- `slop-ai-indo-layoutmobile` (Responsivitas layar, breakpoint, overflow, area sentuh)
- `slop-ai-indo-code` (Sanitasi komentar kode berlebihan)
- `slop-ai-indo-security` (Audit keamanan komprehensif, tinjauan kerentanan source-first, threat modeling, verifikasi sandbox)

### 3.5. Dua Mode Penggunaan (Usage Modes)
- **Mode DURING (Saat Pengerjaan):** Memandu pengerjaan sejak awal, memastikan setiap komponen yang dibuat langsung patuh aturan hingga siap diserahkan.
- **Mode AFTER (Audit Pasca Pengerjaan):** Memeriksa kode/halaman yang sudah ada, menghasilkan daftar temuan bernomor (*numbered findings*), dan melakukan perbaikan setelah persetujuan pengguna.

---

## 4. Batasan Produk (Non-Goals & Constraints)
1. **Tidak Menentukan Selera Desain (Bukan Magic Beautifier):** Anti-slop tidak menciptakan identitas merek dari ketiadaan. Arah desain spesifik wajib datang dari `DESIGN.md` atau arahan pengguna.
2. **Tidak Melakukan Fetching Jaringan Mandiri di Runtime:** Demi keamanan agen, modul skill dan skrip diinstal secara lokal (`skills/`). Agen dilarang mengunduh kode eksekusi dari internet di tengah sesi.
3. **Zero Invasive Modification:** Pemasangan plugin/aturan ke file inisialisasi agen (`AGENTS.md`, `CLAUDE.md`, dll.) hanya menambahkan pointer rujukan statis dan tidak boleh merusak konfigurasi pengguna yang sudah ada.
4. **Ringan dan Bebas Dependensi Eksternal Berat:** Skrip utilitas (seperti `contrast-check.py`) hanya menggunakan pustaka standar Python/Node.js tanpa runtime bloat.

---

## 5. Metrik Keberhasilan (Success Metrics)
- **Zero AI Slop Artifacts:** Tidak ada metrik rekayasa (seperti "99.9% Kepuasan"), tidak ada gradien ungu-cyan klise, tidak ada pendaran neon tak beraturan.
- **100% WCAG AA Compliance:** Semua teks dan elemen interaktif memenuhi rasio kontras minimal 4.5:1 untuk teks normal dan 3:1 untuk teks besar.
- **100% Functional Verification:** Seluruh elemen interaktif dan alur navigasi teruji berfungsi sebelum pekerjaan diserahkan.
