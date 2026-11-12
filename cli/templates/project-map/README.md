# Universal Project Map (PROJECT_MAP.json)

Panduan pemetaan struktur proyek untuk AI Coding Agent agar hemat token, cepat, dan mencegah scan direktori berat (*zero-slop agent performance*).

---

## 1. Mengapa Peta Direktori Wajib Ada?
AI Coding Agent secara default sering kali menjalankan pencarian rekursif (`grep`, `find`, `Select-String`) yang tidak sengaja merambah folder dependensi berat seperti:
- `node_modules/`, `vendor/`, `venv/`, `.venv/`
- `.git/`, `.next/`, `dist/`, `build/`, `target/`

Hal ini membuang ribuan token, menghabiskan waktu, dan membebani context window model LLM. Dengan adanya `PROJECT_MAP.json` di root proyek, AI agent dapat memetakan seluruh file dan folder secara instan dalam 1 kali baca.

---

## 2. Cara Pembuatan Peta Direktori

### Cara 1: Bawaan Slop AI Indo (Paling Praktis)
Jika Anda sudah memasang `slop-ai-indo`, jalankan perintah:

```bash
npx slop-ai-indo map
```
*(Atau `node cli/bin/slop-map.mjs`)*

Perintah ini otomatis mengabaikan semua folder dependensi berat dan menghasilkan `PROJECT_MAP.json` secara instan.

### Cara 2: Menggunakan Repomix (Alat Universal Eksternal)
Repomix adalah alat open-source standar industri untuk AI agent. Dapat dijalankan tanpa install permanen:

```bash
# Format JSON (Sesuai rekomendasi)
npx repomix --style json --output PROJECT_MAP.json

# Atau format Markdown
npx repomix
```

### Cara 3: Menggunakan Skrip Mandiri Per Bahasa
Salin salah satu skrip dari folder ini ke proyek Anda:

- **Node.js / React / Next.js / Express**:
  ```bash
  node templates/project-map/generate-map.js
  ```
- **Python / FastAPI / Django / Flask**:
  ```bash
  python templates/project-map/generate_map.py
  ```
- **PHP / CodeIgniter / Laravel**:
  ```bash
  php templates/project-map/generate_map.php
  ```

---

## 3. Aturan Wajib di AGENTS.md

Pastikan dokumen aturan kerja agen (`AGENTS.md`) di root proyek memuat arahan berikut:

```markdown
## Agent Performance & Search Rules (Zero-Slop Token Efficiency)
### 1. DILARANG Scan Folder Berat
Jangan pernah melakukan recursive search (grep, find, Select-String, ls -R) ke folder:
- `node_modules/`, `vendor/`, `venv/`, `.venv/`
- `.git/`, `dist/`, `build/`, `.next/`, `target/`, `coverage/`, `.cache/`

### 2. Peta Direktori Instan
- Baca file `PROJECT_MAP.json` di root project untuk mengetahui seluruh struktur dan lokasi file secara instan.
- Targetkan pembacaan langsung ke file/folder spesifik sesuai kebutuhan tugas tanpa membuang token.
- Jika struktur berkas berubah signifikan, perbarui peta dengan `npx slop-ai-indo map`.
```

