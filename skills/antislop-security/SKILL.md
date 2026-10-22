---
name: antislop-security
description: "Panduan audit keamanan dan review kerentanan kode, API, layanan, dan arsitektur sistem. Pemodelan ancaman, investigasi celah, verifikasi sandbox aman, dan remediasi defensif untuk antislop."
---

# antislop-security (Audit Keamanan)

Temukan kerentanan yang melanggar batas kepercayaan (trust boundary) nyata, lalu berikan bukti sumber (source evidence), cara reproduksi yang aman, tingkat prioritas, dan perbaikan terkecil yang paling efektif. Ini adalah alur kerja defensif berbasis kode sumber. Temuan yang tidak memiliki dampak konkret pada pengguna, resource, atau status keamanan tidak dianggap sebagai kerentanan terkonfirmasi.

## Mode Operasi

Secara default, skill ini berfungsi sebagai **panduan konsultasi**. Memuat skill ini tidak secara otomatis memberi wewenang untuk menjalankan seluruh alur audit penuh atau membuat file sembarangan.

- **Mode Panduan (Guidance Mode)**: Untuk menjawab pertanyaan keamanan, review terfokus pada modul tertentu, konsultasi metodologi, triase, atau investigasi temuan spesifik. Gunakan hanya bagian yang relevan dari skill ini. Jangan menjalankan ke-6 fase secara otomatis, jangan membuat direktori output, dan jangan menulis artefak laporan audit jika tidak diminta.
- **Mode Audit Penuh (Full Audit Mode)**: Gunakan alur kerja lengkap jika pengguna secara eksplisit meminta untuk mengaudit atau melakukan penetration testing pada basis kode, meminta review keamanan menyeluruh/end-to-end, atau meminta dokumen laporan audit resmi. Jalankan ke-6 fase secara berurutan dan tulis file laporan yang telah ditentukan.

Jika permintaan pengguna ambigu, ajukan satu pertanyaan klarifikasi singkat sebelum membuat file atau memulai alur kerja audit penuh.

## Terminologi Platform

Skill ini netral terhadap platform AI agent:

- **Parent**: Agen utama yang mengoordinasikan eksekusi dan mengelola status bersama.
- **Task tool**: Mekanisme delegasi atau sub-agent pada platform.
- **Agen `research`**: Agen yang didelegasikan untuk eksplorasi kode sumber secara terfokus dan verifikasi fakta.
- **Agen `general`**: Agen yang didelegasikan untuk investigasi luas dan eksekusi lokal yang terisolasi.
- **`subagent_type:`**: Menentukan peran sub-agent yang menjalankan tugas tersebut.

Gunakan kemampuan platform yang setara dengan tetap menjaga pemisahan peran, isolasi penulisan, instruksi prompt, dan independensi antar agen.

## Keamanan Eksekusi Universal

Aturan ini berlaku mutlak di kedua mode operasi:
- Pemeriksaan kode sumber bersifat **read-only** (hanya baca).
- Jalankan build, testing, proses, browser, emulator, dan pemrosesan data hanya di dalam sandbox sistem operasi yang terisolasi dengan kontrol berikut:
  - Tanpa akses internet luar; gunakan hanya loopback lokal jika membutuhkan komunikasi client-server.
  - Environment bersih dengan nilai aman yang diizinkan (allowlist), dengan direktori sementara `scratch/` lokal.
  - Target repositori dan kakas bersifat read-only; proses hanya boleh menulis ke folder `scratch/` yang ditentukan.
  - Batasan eksplisit untuk penggunaan CPU, memori, jumlah proses, batas waktu eksekusi, dan ukuran file.
- Gunakan identitas fiktif (dummy), fixture lokal, dan kredensial tiruan.
- Dilarang memindai endpoint produksi yang aktif, server cloud eksternal, infrastruktur bersama, atau data pengguna riil.
- Hentikan pengujian begitu efek minimum dari celah keamanan telah terbukti. Jangan membuat kode eksploitasi berlebihan.

## Pengaturan Audit Penuh

Dalam mode audit penuh, tentukan nilai-nilai ini sebelum memulai tahap reconnaissance:
- **Direktori Skill**: Jalur folder absolut tempat file `SKILL.md` ini berada.
- **Target**: Jalur absolut repositori yang sedang diaudit.
- **Nama Repositori**: Pengenal repositori yang stabil.
- **Direktori Output**: Folder baru di luar target (default: `~/security-audit-skill/<nama-repo>/run-<N>`, dengan `<N>` nomor urut).
- **Source ref**: Commit hash yang direview dan status git worktree.

### Isolasi Penulisan (Write Isolation)

Agen Parent adalah satu-satunya entitas yang berhak membuat dan memperbarui file laporan bersama:
- `run-metadata.json`
- `architecture.md`
- `coverage-ledger.json`
- `findings.json`
- `REPORT.md`
- `FINDINGS-DETAIL.md`
- `NEEDS-VALIDATION.md`

Setiap agen hunter atau verifikator menerima folder kerja unik di `<output-dir>/agents/<agent-id>/`, dengan folder `scratch/` dan `artifacts/` yang terpisah. Sub-agent dilarang mengubah file bersama, kode repositori target, atau folder milik agen lain.

## Perencanaan Audit

### Cakupan dan Profil Eksekusi

Pilih salah satu profil audit berikut sesuai kebutuhan:
- **`quick`**: Pemeriksaan cepat dan terikat untuk proyek kecil atau pengecekan kilat. Menjalankan 1 gelombang hunting dan 1 tahap verifikasi.
- **`standard`**: Alur kerja standar penuh (default).
- **`deep`**: Untuk proyek berisiko tinggi atau berukuran besar. Melakukan pembagian unit per subsistem secara mendalam dan verifikasi multi-tahap.

Sebuah **audit terbatas (scoped run)** memeriksa subset tertentu: path file yang ditentukan, satu subsistem, atau diff antara dua commit.

## Prinsip Inti

### 1. Wajib Ada Batasan & Dampak Nyata
Setiap kandidat temuan wajib menyebutkan aktor dengan tingkat kepercayaan rendah, input/aksi yang diterima, kontrol keamanan yang dilanggar, batas kepercayaan yang ditembus, serta dampak nyata yang dialami pengguna atau sistem. Jangan menganggap sekadar saran best-practice sebagai kerentanan jika tidak ada dampak risiko nyata.

### 2. Gunakan Bukti Lokal Terbatas
Analisis statis menentukan alur kode. Pengujian sandbox lokal membuktikan kerentanan: unit test kecil, fixture parser tiruan, atau client loopback terisolasi. Hentikan pengujian begitu efek kegagalan pertama teramati. Jangan membuat payload perusak atau upaya persistensi.

### 3. Hormati Batas Visibilitas Kode Sumber
Kontrol deployment, proxy, header browser, dan policy cloud adalah komponen keamanan nyata. Jika tidak ada di dalam repositori kode, jangan berasumsi ada atau tidak ada. Gunakan status `needs_validation` disertai rencana validasi aman.

### 4. Pisahkan Prioritas dari Kepastian
Hanya temuan `confirmed` (terbukti) yang diberi peringkat keparahan (severity):
- **critical**: Penyerang tanpa login memperoleh eksekusi kode sembarang, akses database penuh, atau pengambilalihan akun secara bebas.
- **high**: Penyerang berhasil menembus kontrol keamanan utama dengan dampak besar: bypass autentikasi, akses baca/tulis lintas tenant, stored XSS terhadap pengguna lain, atau penghentian layanan bersama.
- **medium**: Pelanggaran batas dengan radius dampak terbatas atau membutuhkan prasyarat yang jarang terjadi.
- **low**: Kebocoran informasi internal non-rahasia atau efek yang membutuhkan upaya besar untuk dampak yang sangat kecil.
- **informational**: Temuan terkonfirmasi dengan dampak minimal, berguna sebagai prasyarat temuan lain.

### 5. Rekomendasikan Perbaikan Terkecil yang Paling Efektif
Untuk setiap temuan terkonfirmasi, tentukan aturan logika yang harus ditegakkan dan perubahan kode terkecil yang menerapkannya pada titik keputusan terpercaya. Berikan saran perbaikan konkret dan uji regresi. Audit mendeskripsikan perbaikan, tetapi tidak mengubah kode target secara langsung.

## Alur Kerja 6 Fase (Mode Penuh)

1. **Fase 1: Reconnaissance**: Petakan struktur kode, batas kepercayaan, alur build lokal, dan daftar cakupan awal dengan membaca [RECONNAISSANCE.md](RECONNAISSANCE.md).
2. **Fase 2: Hunting Waves (Pencarian Celah Berkelompok)**: Tugaskan agen hunter terisolasi untuk mencari kandidat celah menggunakan panduan [HUNTING.md](HUNTING.md), [ATTACK-CLASSES.md](ATTACK-CLASSES.md), dan modul referensi domain terkait.
3. **Fase 3: Validasi Kandidat**: Konsolidasikan temuan dan verifikasi setiap kandidat secara independen menggunakan panduan [VALIDATION-AND-REPORTING.md](VALIDATION-AND-REPORTING.md).
4. **Fase 4: Output Terstruktur**: Catat seluruh temuan final (`confirmed`, `needs_validation`, `rejected`) ke file `findings.json`; validasi dengan `report-schema.json` dan `validate-findings.cjs`, serta validasi cakupan dengan `validate-coverage-ledger.cjs`.
5. **Fase 5: Verifikasi Rekaman Independen**: Gunakan agen independen untuk memverifikasi klaim baris kode dan rekonsiliasi bukti akhir.
6. **Fase 6: Laporan Defensif**: Susun dokumen akhir `REPORT.md`, `FINDINGS-DETAIL.md`, dan `NEEDS-VALIDATION.md` dari data final tanpa memuat instruksi penyerangan langsung.

## Anti-Pola yang Dilarang

1. Menyajikan deviasi checklist generik sebagai kerentanan keamanan.
2. Memberikan saran teoritis tanpa adanya jalur pelanggaran batas yang nyata.
3. Melakukan pengujian terhadap lingkungan aktif atau server produksi.
4. Menebak-nebak konfigurasi infrastruktur luar yang tidak tercantum di kode sumber.
5. Menganggap dampak terhadap diri sendiri (self-impact) sebagai pelanggaran keamanan.
6. Melaporkan dampak yang lebih besar dari bukti lokal yang diobservasi.
7. Memberikan tingkat keparahan pada temuan yang masih berstatus `needs_validation`.
8. Menulis laporan sebelum verifikasi rekaman selesai atau membiarkan teks berbeda dengan file JSON.
