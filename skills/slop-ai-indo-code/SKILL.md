---
name: slop-ai-indo-code
description: "Kebersihan komentar kode untuk AI coding agent: menghapus komentar klise AI, mempertahankan komentar bernilai, tanpa menyentuh logika kode."
allowed-tools: Read Write Edit Glob Grep
---
# slop-ai-indo-code

> Anti Slop: Aturan untuk AI Coding Agent. Skill Komentar Kode Program

> Bagian dari sistem Slop AI Indo. Dibaca bersama dengan `slop-ai-indo.md` (inti). Skill ini menyaring komentar yang terbaca generik khas AI (dekoratif, mengulang hal yang sudah jelas, kaku, berisik) sambil tetap mempertahankan komentar yang memuat informasi arsitektural nyata. Skill ini merujuk ke aturan inti berdasarkan nomor dan tidak pernah menduplikasi atau mengubah penomoran aturan. Muat skill ini saat tugas menulis atau merapikan komentar kode.

## Cara Menggunakan Skill Ini

- Muat bersama `slop-ai-indo.md` setiap kali tugas menyentuh komentar kode. Filter inti memegang mekanisme utama (uji tujuan, tiga tingkatan); skill ini memegang panduan mendalam seputar komentar.
- Setiap pola memiliki format: **Ciri (Tell)**, **Alasan (Why)**, dan **Solusi (Fix)**, dengan aturan inti yang dirujuk sebagai R-XX.
- **Batasan Ruang Lingkup (Scope Guardrail):** Skill ini HANYA memodifikasi komentar. JANGAN PERNAH mengubah kode program yang dapat dieksekusi, nama variabel/fungsi, import, indentasi logika, atau alur kontrol. Jika ragu, biarkan kodenya tidak tersentuh.

## Komentar yang Tidak Menambah Nilai

### Pemisah Dekoratif (Decorative Separators)

- **Ciri:** Komentar banner yang dibuat dari pengulangan karakter, teks HURUF KAPITAL SEMUA, atau garis kotak di sekitar nama seksi: `// =======================` di sekitar `Authentication`, `// -------- WORKFLOW --------`, atau header `/* ---- ROUTES ---- */`.
- **Alasan:** Dekorasi dijadikan pesan utama. Teks yang dibungkus `=` atau `-` menandakan "ini dibuat oleh AI" tanpa memberikan informasi teknis baru, dan huruf kapital terbaca seperti berteriak.
- **Solusi:** Ganti dengan satu baris teks biasa yang sederhana, atau hapus sepenuhnya jika label tersebut tidak menambahkan informasi nyata (R-31).

### Mengulang Hal yang Sudah Jelas (Restating the Obvious)

- **Ciri:** Komentar yang hanya mengulang apa yang sudah dijelaskan oleh baris kode berikutnya, seperti `// Initialize the variable` di atas `let count = 0`, `// User class` di atas `class User {}`, `// Validate user` di atas `function validateUser()`, atau `const userAge = 25; // User age is 25`.
- **Alasan:** Membebani pembaca dua kali lipat tanpa memberi informasi baru. Kodenya sudah berbicara sendiri; komentar hanya mengulanginya.
- **Solusi:** Hapus komentar tersebut dan biarkan baris kode tetap bersih.

### Narasi Alur Langkah Demi Langkah (Workflow Narration)

- **Ciri:** Komentar yang menceritakan alur langkah demi langkah seperti `// Step 1: Validate input`, `// Step 2: Process request`, `// Step 3: Return response`, atau `// First...`, `// Next...`, `// Finally...`.
- **Alasan:** Alur logika sudah terlihat jelas dari struktur kodenya. Memberi nomor menjadikannya seperti daftar checklist yang kaku, bukan penjelasan fungsional.
- **Solusi:** Hapus. Jika alur kode memang sulit dipahami, itu adalah masalah struktur arsitektur kode, bukan kurangnya komentar.

### Label Kosong (Empty Labels)

- **Ciri:** Label kategori generik tanpa informasi substansial di baliknya: `// Main logic`, `// Core logic`, `// Business logic`, `// Helper function`, `// Entry point`, `// Error handling`, atau `// Note: This is important.`
- **Alasan:** Label hanya menyebutkan nama kategori, bukan fakta teknis. "Main logic" tidak memberi tahu apa pun yang tidak bisa disimpulkan pembaca dari kodenya.
- **Solusi:** Hapus kecuali label tersebut membawa informasi spesifik. "Catatan: retry hanya berjalan pada status 5xx" layak dipertahankan; "Catatan: ini penting" harus dihapus.

### TODO Samar Tanpa Rincian (Vague Placeholders)

- **Ciri:** Komentar yang menjanjikan pekerjaan masa depan tanpa menyebutkan apa yang harus dilakukan: `// TODO: Improve this`, `// Future improvements`, `// Additional optimization can be added here`, `// Add more validation`.
- **Alasan:** TODO yang samar adalah polusi teks. Itu hanya perasaan ("ini bisa lebih baik") bukan tugas nyata (apa dan mengapa).
- **Solusi:** Hapus. Pertahankan TODO hanya jika menyebutkan tugas spesifik dengan konteks yang cukup untuk dieksekusi.

### Mengulang Signature Fungsi (Signature Echo) & DocBlock Slop

- **Ciri:** Dokumentasi atau DocBlock (`/** ... */`, JSDoc, PHPDoc, TSDoc) yang hanya memparafrase nama method/fungsi dalam bahasa Inggris atau mengulang type hint bawaan bahasa (misal di PHP 8+, TypeScript, Dart).
  Contoh DocBlock Slop yang dilarang:
  ```php
  /**
   * Get all Setup / Setting menus authorized for the current user.
   *
   * @return Collection<int, object>
   */
  public function getSetupMenus(): Collection
  ```
  atau di TypeScript/JS:
  ```typescript
  /**
   * Process payment for the user
   * @param amount The payment amount
   * @returns Promise of payment result
   */
  async function processPayment(amount: number): Promise<PaymentResult>
  ```
- **Alasan:** Menambah baris kode (visual noise) 2 hingga 3 kali lipat tanpa memberikan pemahaman teknis baru. Di era bahasa bertipe modern (PHP 8+, TypeScript, Go, Dart), nama fungsi yang deskriptif dan native type hint sudah menjadi dokumentasi hidup (*self-documenting*) yang divalidasi oleh compiler/interpreter.
- **Solusi:**
  - Hapus DocBlock sepenuhnya jika nama fungsi dan tipe data sudah jelas secara native:
    ```php
    public function getSetupMenus(): Collection
    ```
  - **Kapan DocBlock Diizinkan?**
    HANYA jika:
    1. Menyediakan anotasi generic untuk static analysis (PHPStan / Psalm) yang tidak didukung sintaks native bahasa (misal: `/** @return Collection<int, SettingMenu> */` tanpa deskripsi basa-basi di atasnya).
    2. Menjelaskan **MENGAPA** (alasan bisnis, edge-case tidak wajar, workaround bug dependensi/pihak ketiga, atau pertimbangan konkurensi/keamanan).

### Emoji Dekoratif

- **Ciri:** Emoji yang dipakai sebagai hiasan komentar, seperti `// ✅ Validation` atau `// 🚀 Performance`.
- **Alasan:** Emoji menimbulkan visual noise di dalam kode, dan set emoji tertentu (✅, 🚀, 🔒) adalah kosakata bawaan generator AI.
- **Solusi:** Ganti dengan teks biasa yang lugas, atau hapus jika label tersebut tidak menambahkan nilai.

### Penanda Akhir Blok (End Markers)

- **Ciri:** Komentar yang hanya menandai akhir dari sebuah blok kurung kurawal, seperti `} // end if`, `# End of function`, atau `// End processOrder`.
- **Alasan:** Tanda kurung tutup sudah mengakhiri blok tersebut. Penanda ini ada karena kebiasaan lama, bukan kebutuhan.
- **Solusi:** Hapus.

## Karakteristik Komentar yang Baik

### Hindari Penjelasan Bertele-tele (The Over-Explained Comment)
Jangan mengubah fakta satu baris menjadi satu paragraf panjang dengan rantai alasan "karena X, maka Y, sehingga Z". Fokus langsung pada batasan teknisnya: maksimal satu atau dua baris ringkas.

### Komentar Per Blok Logika, Bukan Per Baris (Line-by-Line Narration)
Tulis satu komentar ringkas untuk satu blok logika, bukan mengomentari setiap baris instruksi sepele.

### Nada Bahasa Wajar dan Singkat (Stiff or Loud Wording)
Gunakan gaya bahasa developer yang alami, singkat, dan menjelaskan **MENGAPA** (alasan/batasan), bukan **APA** (yang sudah jelas terlihat dari kode).

## Hal yang BUKAN Larangan (Pertahankan Komentar Ini)

JANGAN PERNAH menghapus komentar yang menjelaskan:
- Logika dan tujuan aturan bisnis
- Keputusan arsitektural dan trade-off performa
- Pertimbangan keamanan sistem
- Penanganan konkurensi dan race condition
- Rincian protokol dan kontrak API
- Solusi sementara (workaround) terhadap bug dependensi/OS
- Asumsi dan edge case yang tidak biasa
- Lisensi dan pemberitahuan hukum

Contoh komentar berkualitas yang wajib dipertahankan:
```js
// Stripe dapat mencoba pengiriman webhook ulang hingga 3 hari.
// Abaikan event duplikat menggunakan event ID.
```

