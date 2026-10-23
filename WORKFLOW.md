# WORKFLOW.md - Alur Kerja Operasional AI Coding Agent

Dokumen ini memandu langkah kerja harian agen coding dari penerimaan prompt hingga pengiriman kode yang bersih, aman, dan bebas dari AI slop.

---

## 1. Alur Kerja Standar (End-to-End Workflow)

```mermaid
graph TD
    A[Terima Prompt / Tugas dari User] --> B[Identifikasi Lingkup Kerja]
    B --> C{Pilih Skill Relevan}
    C -->|UI / Frontend| D[Muat slop-ai-indo-ui & Baca DESIGN.md]
    C -->|Copy / Teks| E[Muat slop-ai-indo-copywriting]
    C -->|Aksesibilitas / Kontras| F[Muat slop-ai-indo-human]
    C -->|Mobile Layout| G[Muat slop-ai-indo-layoutmobile]
    C -->|Refactor Kode / Komentar| H[Muat slop-ai-indo-code]
    C -->|Audit Keamanan & Kerentanan| Q[Muat slop-ai-indo-security]
    
    D & E & F & G & H & Q --> I[Eksekusi Koding & Penulisan]
    I --> J[Validasi Aturan 3-Tier: R-01 s/d R-38]
    J --> K[Uji Coba Smoke Test Elemen Interaktif - R-35]
    K --> L[Uji Coba Rasio Kontras WCAG]
    L --> M{Lolos Evaluasi?}
    M -->|Gagal / Cacat| N[Refactor & Perbaiki Temuan]
    N --> I
    M -->|Lolos| O[Buat Laporan Delivery Gate: PASS]
    O --> P[Kirim Hasil Kerja ke User]
```

---

## 2. Tahapan Detail Eksekusi

### Langkah 1: Klasifikasi Tugas & Pemilihan Skill
Sebelum menulis baris kode pertama, agen wajib mengidentifikasi domain pekerjaan:
- Jika membangun antarmuka web, SaaS, dashboard, atau form: Wajib membaca `DESIGN.md` untuk mengunci token kanvas terang, siku radius 4px-6px, dan palet warna.
- Jika menulis judul, pesan status, atau dokumentasi: Wajib mematuhi larangan kata-kata hiperbola AI (seperti *"revolusioner"*, *"seamless"*, atau *"game-changing"*).
- Jika melakukan audit keamanan, pengujian penetrasi defensif, atau review kerentanan kode/API: Wajib memuat `skills/slop-ai-indo-security/SKILL.md` untuk alur source-first, boundary verification, dan format temuan terstandarisasi.

### Langkah 2: Eksekusi Koding Bertahap (Clean Coding)
1. **Hindari Tombol & Badge Kapsul (*No Pill Buttons*):** Selalu gunakan `border-radius: 4px` atau `6px`.
2. **Hindari Pendaran Neon (*No Glowing Borders*):** Gunakan border garis tipis solid 1px (`#e2e8f0` untuk terang, `#27272a` untuk gelap).
3. **Tanpa Angka Metrik Rekayasa (*No Fake Metrics*):** Dilarang membuat teks statistik palsu seperti *"10,000% ROI"* atau rating statis *"5.0 bintang dari 100.000 pelanggan"*.
4. **Komentar Kode Minimalis:** Hapus komentar yang hanya mengulang fungsi nama variabel atau instruksi dasar.

### Langkah 3: Pengujian Interaktif (Smoke Test - R-35)
Agen wajib menguji setiap elemen yang dapat diklik atau diinput:
- Tombol aksi utama (Submit, Cancel, Delete).
- Form input dan validasi data (error message tampil dengan benar).
- Transisi status (Hover, Focus, Active, Disabled).

### Langkah 4: Pengujian Kontras Warna (WCAG AA)
Gunakan skrip pemeriksa kontras `skills/slop-ai-indo-human/contrast-check.py` untuk mengukur rasio:
- Teks biasa terhadap latar: minimal **4.5:1**.
- Teks tebal / besar terhadap latar: minimal **3.0:1**.

### Langkah 5: Penerbitan Delivery Gate Report
Agen wajib menyertakan laporan evaluasi formal sebelum menutup sesi:

```markdown
### Delivery Gate Report
- **Ruang Lingkup:** [Komponen / Fitur yang dibangun]
- **Aturan yang Dievaluasi:** R-01 (Metrik Riil), R-12 (Radius Siku), R-18 (Kontras), R-35 (Smoke Test)
- **Hasil Smoke Test:**
  - Tombol Simpan: Berfungsi normal (klik memicu request).
  - Input Form: Validasi berjalan saat field kosong.
- **Hasil Cek Kontras:**
  - Teks `#0f172a` pada latar `#ffffff`: Rasio 15.8:1 (PASS WCAG AAA)
  - Teks Sekunder `#64748b` pada `#f8fafc`: Rasio 4.9:1 (PASS WCAG AA)
- **Keputusan Akhir:** PASS (Siap Diterbitkan)
```
