# AGENTS.md - Standar Kerja Harian AI Coding Agent

Dokumen ini memadukan **slop-ai-indo** (penyaring slop) dengan **DESIGN.md** (arahan visual human-crafted ala n8n) agar setiap kode dan UI yang dihasilkan berkualitas tinggi.

## 1. Panduan Wajib
Setiap kali Anda mengerjakan tugas coding, pembuatan fitur, UI, atau perbaikan bug:
1. Baca dan patuhi aturan penyaring di `slop-ai-indo.md` dan `.agents/rules/slop-ai-indo.md`.
2. Baca dan patuhi aturan estetika human-crafted di `DESIGN.md`:
   - Sudut kartu dan tombol tegas serta presisi (border-radius: 4px - 6px, DILARANG kapsul pill).
   - Tampilan kanvas terang enterprise yang bersih (ala n8n dan Linear, tanpa pendaran neon).
   - Tidak ada angka metrik palsu atau kata-kata bombastis yang hiperbola.
   - Kode bersih tanpa komentar berlebihan.
3. Untuk pekerjaan audit keamanan, review kerentanan kode/API, dan pen-testing defensif, baca dan patuhi panduan di `skills/slop-ai-indo-security/SKILL.md`.