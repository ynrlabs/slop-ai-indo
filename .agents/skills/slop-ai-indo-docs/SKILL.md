---
name: slop-ai-indo-docs
description: "Pencegahan dokumentasi slop AI generik untuk README, PRD, API docs, dan dokumen teknis: lugas, akurat, bebas halusinasi, dan dapat diuji."
allowed-tools: Read Write Edit Glob Grep
---
# slop-ai-indo-docs

> Anti Slop: Aturan untuk AI Coding Agent. Skill Dokumentasi Teknis

> Bagian dari sistem antislop. Dibaca bersama dengan `slop-ai-indo.md` (inti). Skill ini menetapkan standar mutu dokumentasi teknis: berkas README, PRD, spesifikasi arsitektur, panduan API, dan petunjuk instalasi. Skill ini menyaring narasi hampa berbunga-bunga, klaim kehebatan palsu, cuplikan kode yang tidak dapat dijalankan, dan arsitektur fiktif. Skill ini merujuk ke aturan inti berdasarkan nomor dan tidak pernah mengubah penomoran aturan. Muat skill ini saat tugas menulis atau menyunting dokumentasi proyek.

## Cara Menggunakan Skill Ini

- Muat bersama `slop-ai-indo.md` setiap kali tugas menyentuh penulisan atau pembaruan dokumentasi teknis. Filter inti memegang mekanisme utama (uji tujuan, tiga tingkatan, Delivery Gate); skill ini memegang rincian khusus higienitas dokumentasi.
- Setiap pola disusun dengan format: **Pola (The pattern)**, **Mengapa Terbaca Khas AI (Why it reads as AI)**, **Sebelum (Before)**, **Sesudah (After)**, dengan aturan inti yang dirujuk sebagai R-XX.
- **Dua Pedoman Utama:**
  1. **Dokumentasi harus mencerminkan kode nyata saat ini** (R-35, R-36, R-38). Jangan pernah mendokumentasikan endpoint, opsi konfigurasi, argumen CLI, atau dependensi yang belum ada di dalam codebase atau belum disepakati bersama pengguna.
  2. **Singkat, padat, dan langsung dapat dieksekusi** (R-31). Pengembang membaca dokumentasi untuk memecahkan masalah atau menjalankan sistem, bukan membaca esai perkenalan.

## Pola Dokumentasi yang Menyesatkan

### Bagian Pengantar yang Berbunga-bunga (Flowery Intros)

- **Pola:** Paragraf pembuka panjang yang memuji repositori: "Selamat datang di repositori X, solusi mutakhir yang dirancang dengan teliti untuk memberdayakan para insinyur dalam menaklukkan lanskap modern..."
- **Mengapa terbaca khas AI:** Upacara basa-basi tanpa nilai teknis. Menghabiskan layar pertama pembaca sebelum mereka mengetahui apa fungsi program sebenarnya.
- **Sebelum:**
  > Selamat datang di NextGen Auth, sebuah terobosan revolusioner yang dirancang khusus untuk meningkatkan keamanan alur autentikasi tim Anda ke tingkat berikutnya.
- **Sesudah:**
  > NextGen Auth adalah pustaka middleware Express untuk verifikasi token JWT dan proteksi route berbasis peran.
- **Aturan:** R-16 (buzzwords), R-36 (dilarang mengarang klaim).

### Contoh Kode Halusinasi (Hallucinated Code Examples)

- **Pola:** Memberikan contoh kode yang menggunakan method khayalan, mengimpor package yang tidak terdaftar di konfigurasi proyek, atau menyelipkan placeholder malas seperti `// logic goes here` di alur penting.
- **Mengapa terbaca khas AI:** AI sering menebak nama fungsi berdasarkan logika probabilitas kata, bukan berdasarkan API publik yang sebenarnya diekspos oleh modul tersebut.
- **Sebelum:**
  > ```javascript
  > import { createSuperClient } from 'my-auth-lib'
  > const client = createSuperClient({ magicSync: true })
  > // logikamu di sini
  > client.autoProtectAllRoutes()
  > ```
- **Sesudah:**
  > ```javascript
  > import { initAuth } from './lib/auth.js'
  > const auth = initAuth({ secret: process.env.AUTH_SECRET })
  > app.use('/api', auth.verifyToken)
  > ```
- **Aturan:** R-26 (fungsi fiktif), R-35 (wajib dapat diuji), R-38 (dilarang konten fiktif).

### Arsitektur Khayalan (Imaginary Architecture Diagrams)

- **Pola:** Menampilkan diagram arsitektur atau tabel modul yang mencantumkan komponen canggih seperti "Distributed Event Bus", "AI Prediction Engine", atau "Multi-Region Cache Sync", padahal repositorinya hanyalah skrip CLI satu berkas atau aplikasi monolitik lokal.
- **Mengapa terbaca khas AI:** AI cenderung mengisi kekosongan arsitektur dengan pola enterprise teoritis yang dipelajarinya, tanpa melihat realitas file sistem di proyek yang sedang dikerjakan.
- **Sebelum:**
  > Diagram sistem: Web App -> Redis Pub/Sub Cluster -> Event Gateway -> Worker Pools -> Data Lake
- **Sesudah:**
  > Diagram sistem: CLI -> Local SQLite -> Output Formatter (tuliskan struktur fisik yang nyata ada di folder).
- **Aturan:** R-36 (klaim tanpa bukti), R-38 (arsitektur fiktif).

### Panduan Instalasi Template yang Tidak Teruji (Untested Install Guides)

- **Pola:** Menuliskan perintah instalasi generik yang gagal saat dijalankan: misalnya menulis `npm run setup` atau `python run.py` ketika `package.json` tidak memiliki script tersebut atau berkas `run.py` tidak ada.
- **Mengapa terbaca khas AI:** Menulis langkah demi langkah dari ingatan template umum alih-alih memeriksa isi file konfigurasi lokal.
- **Sebelum:**
  > Jalankan `npm install`, lalu ketik `npm run bootstrap`, dan jalankan `npm start` untuk melihat antarmuka di localhost:3000.
- **Sesudah:**
  > Periksa script di package.json terlebih dahulu. Jika perintah sebenarnya adalah `node cli/index.mjs`, tulis perintah tersebut secara tepat.
- **Aturan:** R-26 (perintah mati), R-35 (smoke test).

### Referensi Parameter Hampa (Signature Echo Documentation)

- **Pola:** Tabel atau daftar parameter fungsi yang hanya mengulang namanya sendiri: `timeout: timeout untuk operasi`, `user: user yang sedang login`, `config: objek konfigurasi`.
- **Mengapa terbaca khas AI:** Menciptakan ilusi kelengkapan dokumen tanpa memberikan penjelasan tipe data, nilai bawaan (default), atau batasan nilai yang diterima.
- **Sebelum:**
  > - `maxRetries`: Jumlah maksimal percobaan ulang.
  > - `payload`: Payload data.
- **Sesudah:**
  > - `maxRetries` *(number, default: 3)*: Jumlah percobaan ulang koneksi sebelum melempar NetworkError.
  > - `payload` *(Record<string, unknown>)*: Objek JSON body yang dikirim ke server; wajib memuat atribut `id`.
- **Aturan:** R-27 (penanganan batas dan error), R-31 (alasan keputusan teknis).

## Karakteristik Dokumentasi yang Baik

- **Struktur To-the-Point:** Judul, ringkasan 1-2 baris, prasyarat nyata, cara instalasi yang teruji, contoh penggunaan minimal yang bekerja, dan daftar opsi/API yang presisi.
- **Jujur Terhadap Batasan Sistem:** Sebutkan apa yang belum didukung atau batasan performa sistem saat ini secara transparan, daripada menyamarkannya dengan klaim "skalabel tanpa batas".
