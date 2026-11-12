# AGENTS.md - Standar Kerja Harian AI Coding Agent

Dokumen ini memadukan **slop-ai-indo** (penyaring slop) dengan **DESIGN.md** (arahan visual human-crafted ala n8n) agar setiap kode dan UI yang dihasilkan berkualitas tinggi.

## 1. Panduan Wajib
Setiap kali Anda mengerjakan tugas coding, pembuatan fitur, UI, atau perbaikan bug:
1. Baca dan patuhi aturan penyaring di `slop-ai-indo.md` dan `.agents/rules/slop-ai-indo.md`.
2. Baca dan patuhi aturan estetika human-crafted di `DESIGN.md`:
   - Sudut kartu dan tombol tegas serta presisi (border-radius: 4px - 6px, DILARANG kapsul pill).
   - Tampilan kanvas terang enterprise yang bersih (ala n8n dan Linear, tanpa pendaran neon).
   - Tidak ada angka metrik palsu atau kata-kata bombastis yang hiperbola.
   - Tipografi & Ikon Bersih: DILARANG menempelkan emoji atau icon hiasan sebagai awalan (prefix) teks pada judul modal (✏️), header seksi formulir/fieldset (📅, 🛡️, ☘️), dan tombol aksi (💾, ❌). Terapkan Clean Typography-First; jika butuh ikon, wajib gunakan SVG monokrom semantik line/stroke tipis (1.5px–1.75px).
   - Kode bersih tanpa komentar sampah: DILARANG menulis DocBlock/PHPDoc/JSDoc boilerplate (`/** ... */`) yang hanya memparafrase nama method atau menduplikasi native type hint. Manfaatkan native typing (PHP 8+, TypeScript, Dart).
   - URL Semantik & Bersih: gunakan Clean RESTful URLs dan slug (`/articles/{slug}` alih-alih `?id=123`), dan selalu gunakan parameter binding / ORM untuk proteksi dari SQL Injection.
   - Keamanan Model & Database: DILARANG `protected $guarded = []` (wajib `$fillable` eksplisit), gunakan tabel database untuk opsi dinamis, dan deklarasikan Foreign Key cascade & index pada migrasi.
3. Untuk pekerjaan backend, API, dan sanitasi query, baca dan patuhi panduan di `skills/slop-ai-indo-backend/SKILL.md`.
4. Untuk pekerjaan audit keamanan, review kerentanan kode/API, dan pen-testing defensif, baca dan patuhi panduan di `skills/slop-ai-indo-security/SKILL.md`.
5. Untuk efisiensi token dan komunikasi, baca dan patuhi panduan di `skills/slop-ai-indo-concise/SKILL.md`: terapkan prinsip *Say Less & Answer First* (nol basa-basi, nol pengulangan prompt, format langsung ke solusi teknis, dan kode/payload verbatim 100% utuh tanpa placeholder).

## 2. Agent Performance & Search Rules (Zero-Slop Token Efficiency)
1. **DILARANG Scan Folder Berat**: Jangan pernah melakukan recursive search (`grep`, `find`, `Select-String`, `dir -Recurse`, `ls -R`) ke folder:
   - `node_modules/`, `vendor/`, `venv/`, `.venv/`
   - `.git/`, `dist/`, `build/`, `.next/`, `target/`, `coverage/`, `.cache/`
2. **Peta Direktori Instan**:
   - Baca file `PROJECT_MAP.json` di root project untuk mengetahui seluruh struktur dan lokasi file secara instan tanpa membuang token dan context window.
   - Targetkan pembacaan langsung ke file/folder spesifik sesuai kebutuhan tugas.
3. **Pembaruan Peta**:
   - Jika terdapat banyak perubahan struktur berkas, jalankan `npx slop-ai-indo map` atau `npm run map` untuk meregenerasi `PROJECT_MAP.json`.
