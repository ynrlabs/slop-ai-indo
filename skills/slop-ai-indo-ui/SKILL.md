---
name: slop-ai-indo-ui
description: "Skill visual dan UI untuk Slop AI Indo. Gunakan saat membuat atau mengedit antarmuka: warna, tata letak, komponen, gerak animasi. Muat bersama berkas inti."
allowed-tools: Read Write Edit Glob Grep
---
# slop-ai-indo-ui

> Anti Slop: Aturan untuk AI Coding Agent. Skill UI & Visual

> Bagian dari sistem Slop AI Indo. Dibaca bersama dengan `slop-ai-indo.md` (inti). Skill ini mengulas mendalam aspek visual dan antarmuka pengguna: palet warna, tata letak, hierarki komponen, dekorasi, alur struktural, dan gerak animasi. Skill ini merujuk ke aturan inti berdasarkan nomor dan tidak pernah menduplikasi atau mengubah penomorannya. Muat skill ini saat tugas membangun atau mengedit situs web, web app, atau antarmuka apa pun.

## Cara Menggunakan Skill Ini

- Muat bersama `slop-ai-indo.md` setiap kali tugas menyangkut pembuatan atau pengubahan UI. Filter inti memegang mekanisme utama (uji tujuan, tiga tingkatan, Delivery Gate); skill ini memegang panduan teknis visual secara mendalam.
- Setiap pola memiliki format: **Ciri (Tell)**, **Alasan (Why)**, dan **Solusi (Fix)**, dengan aturan inti yang dirujuk sebagai R-XX.

## Visual & Warna

### Gradien Biru-Ungu Generik (Generic Blue-Purple Gradient)

- **Ciri:** Gradien biru ke ungu, biru ke cyan, atau ungu ke pink yang digunakan sebagai warna utama, atau pendaran warna latar di seluruh halaman.
- **Alasan:** Perlakuan warna paling berulang di data pelatihan model. Tampilan ini menandakan ketiadaan identitas merek dan langsung mencirikan halaman sebagai buatan AI sekilas pandang.
- **Solusi:** Ambil palet warna dari `DESIGN.md` atau identitas resmi produk. Pertahankan gradien hanya jika memiliki fungsi hierarki dengan alasan yang dituliskan (R-01).

### Glassmorphism Berlebihan (Excessive Glassmorphism)

- **Ciri:** Efek blur/backdrop-filter diterapkan bersamaan pada navbar, kartu, modal, dan sidebar sekaligus.
- **Alasan:** Blur yang berlebihan meratakan hierarki visual. Saat semua permukaan berupa kaca buram, tidak ada elemen yang benar-benar menjadi fokus utama.
- **Solusi:** Perlakukan efek kaca sebagai aksen sesekali, bukan karakter utama. Batas maksimal: 1-2 elemen saja (R-10).

### Border Radius Ekstrem (Excessive Border Radius)

- **Ciri:** Semua elemen berbentuk kapsul lonjong membulat penuh: tombol, input form, kartu, badge, modal.
- **Alasan:** Bentuk kapsul seragam mengaburkan perbedaan fungsi antara kartu dan tombol.
- **Solusi:** Gunakan variasi border-radius tegas dan terarah dalam sistem desain (`4px` s/d `6px`) (R-11).

### Bayangan Terlalu Lembut & Mengambang (Overly Soft Shadows)

- **Ciri:** Setiap komponen diberi shadow besar sehingga seluruh halaman terasa melayang tanpa pijakan.
- **Alasan:** Ketika semua elemen melayang, elevasi tidak lagi mengomunikasikan hierarki apa pun.
- **Solusi:** Gunakan bayangan hanya sebagai penanda elevasi fungsional (R-12). Sebagian besar elemen harus duduk datar di kanvas.

### Pendaran di Mana-Mana (Glow Everywhere)

- **Ciri:** Pendaran aktif pada kartu, tombol, ikon, badge, dan border secara serentak.
- **Alasan:** Glow adalah penguat perhatian. Jika diterapkan di semua tempat, tidak ada yang menonjol.
- **Solusi:** Batasi pendaran hanya untuk maksimal 1-2 elemen paling penting (R-13).

### Grid Latar Belakang Tanpa Alasan (Background Grid)

- **Ciri:** Garis grid kotak, cetak biru (blueprint), kertas grafik, atau dot grid di belakang konten.
- **Alasan:** Cara default AI agar halaman terlihat "canggih/teknis" tanpa usaha desain nyata.
- **Solusi:** Gunakan tekstur hanya jika mendukung identitas produk secara nyata dengan alasan tertulis (R-07).

### Default Mode Gelap Tanpa Alasan

- **Ciri:** Halaman dibuat hitam pekat semata-mata karena terlihat "keren", tanpa pertimbangan identitas merek.
- **Alasan:** Mode gelap adalah keputusan produk, bukan setelan bawaan otomatis.
- **Solusi:** Pilih tema berdasarkan identitas merek, tipe produk, dan audiens (R-21). Sediakan toggle terang/gelap yang berfungsi jika relevan.

### Terlalu Banyak Warna dalam Palet

- **Ciri:** 5-7 warna berbeda dalam satu halaman tanpa panduan desain yang jelas.
- **Alasan:** Palet warna yang berantakan merusak hierarki membaca.
- **Solusi:** Batasi palet aktif pada 2-3 warna utama + 1 warna aksen (R-29).

### Default yang Steril (Sterile Default)

- **Ciri:** Warna putih polos datar, border abu-abu tipis, tanpa tekstur, font generik, tanpa jiwa desain.
- **Alasan:** Hasil dari pembersihan berlebih tanpa adanya arahan gaya positif.
- **Solusi:** Lengkapi `DESIGN.md` atau deklarasikan Design Read (Part 3), lalu naikkan dial liveliness (R-37). Solusinya bukan menambah larangan, melainkan menyatakan tujuan dan menaikkan energi visual.

## Tata Letak & Komponen

### Layout Template Monoton

- **Ciri:** Susunan hero, subtitle, 2 CTA, screenshot, feature grid, testimoni, FAQ, footer berulang di setiap halaman.
- **Alasan:** Urutan ini adalah template baku AI, bukan cerita produk yang nyata.
- **Solusi:** Bangun struktur halaman berdasarkan alur kebutuhan konten riil (R-05, C-3).

### Kartu Fitur Hasil Copy-Paste

- **Ciri:** Ukuran, tinggi, ikon, dan padding identik di semua kartu fitur.
- **Alasan:** Meratakan nilai fitur. Fitur unggulan utama terlihat sama bobotnya dengan fitur kecil.
- **Solusi:** Variasikan kartu fitur untuk mencerminkan hierarki kepentingan (R-14). Fitur utama dapat dibuat selebar halaman penuh, sedangkan fitur pendukung berupa daftar rapi.

### Bento Grid yang Dipaksakan

- **Ciri:** Seksi halaman dijejali mosaik kartu berbagai ukuran hanya untuk meniru gaya tren dashboard.
- **Alasan:** Layout menjadi pajangan template, bukan cerminan konten.
- **Solusi:** Gunakan bento grid hanya jika konten memang memiliki ukuran dan jenis data yang beragam (R-05).

### Seksi FAQ Template Generik

- **Ciri:** Pertanyaan FAQ yang klise ("Bagaimana cara memulainya?", "Apakah aman?") tanpa relevansi produk.
- **Alasan:** Hanya untuk mengisi kekosongan halaman.
- **Solusi:** Tampilkan pertanyaan yang nyata dialami calon pengguna produk tersebut (R-28).

## Elemen Dekoratif

### Ikon Klise AI

- **Ciri:** Simbol bintang berkilau (sparkle), petir, berlian, robot, atau bola pendar.
- **Alasan:** Simbol-simbol ini adalah kosakata default produk AI yang tidak menjelaskan fitur secara konkret.
- **Solusi:** Gunakan ikon yang relevan dengan arti fungsional fitur (R-04).

### Emoji sebagai Dekorasi UI

- **Ciri:** Emoji yang disebarkan pada judul, poin fitur, badge, dan tombol (🚀, ✅, 🔥, 📈).
- **Alasan:** Emoji merusak kesan profesional perangkat lunak dan membuat teks terdengar seperti obrolan media sosial.
- **Solusi:** Bersihkan emoji dari teks antarmuka. Gunakan teks yang padat dan lugas.

### Panah Kecil pada Setiap Tombol

- **Ciri:** Panah (`→` atau `↗`) yang dipasang di hampir setiap tombol.
- **Alasan:** Panah kehilangan makna arah saat dipasang di mana-mana.
- **Solusi:** Simpan panah hanya untuk aksi navigasi keluar halaman (R-08).

### Jendela Terminal Rekaan

- **Ciri:** Mockup jendela terminal dengan titik lampu merah-kuning-hijau dan perintah pura-pura di area hero.
- **Alasan:** Topeng generik "aplikasi developer". Produk aslinya jarang terlihat seperti itu.
- **Solusi:** Tampilkan tangkapan layar produk asli yang bekerja, bukan jendela konsol rekaan (R-06, C-5).

## Aplikasi & Dashboard

### Kerangka Dashboard Klise

- **Ciri:** Sidebar kiri, topbar, 4 kartu metrik, 1 chart garis, 1 tabel. Dipilih sebelum mengetahui tujuan layar tersebut.
- **Alasan:** Masalah template di ranah aplikasi: layout diambil dari memori AI, bukan dari pekerjaan yang harus diselesaikan pengguna.
- **Solusi:** Tentukan keputusan utama yang ingin dibuat pengguna di halaman ini, lalu bangun tata letak di sekitarnya (C-3, R-20).

### Kartu Statistik Berisi Angka Karangan

- **Ciri:** Empat kartu statistik dengan angka buatan (12,483 / 94.2% / $48.2K) dan kenaikan palsu (+12% minggu ini).
- **Alasan:** Angka karangan adalah penipuan visual.
- **Solusi:** Hubungkan dengan data riil atau gunakan label placeholder yang jujur `[DATA NYATA]` (R-17, R-38).

### Data Pengisi dalam Kolom dan Tabel

- **Ciri:** Nama dan email fiktif generik seperti `John Doe` atau teks klise `"Let's build something"`.
- **Alasan:** Menandakan layar ini sekadar digenerasi AI tanpa data nyata.
- **Solusi:** Biarkan sel kosong jika belum ada data, atau gunakan placeholder deskriptif yang jujur (R-23, R-38).

### Status Kosong, Memuat, dan Error yang Jelas

- **Ciri:** Hanya menampilkan teks "Tidak ada data" dengan ilustrasi kosong.
- **Alasan:** Tidak memberi tahu pengguna apa yang terjadi atau apa langkah berikutnya.
- **Solusi:** Jelaskan mengapa data kosong dan berikan satu aksi untuk mengisinya (R-27). Loading state harus menyebutkan apa yang sedang dimuat.

## Gerak & Animasi (Motion)

### Denyut dan Animasi Melayang Tanpa Akhir (Endless Loops)

- **Ciri:** Elemen yang berdenyut atau memantul terus-menerus tanpa pemicu aksi pengguna.
- **Alasan:** Gerak tanpa henti menciptakan kebisingan visual dan mengganggu konsentrasi pengguna.
- **Solusi:** Animasi harus memiliki tujuan UX tertulis dan berhenti dengan sopan (R-19).

### Efek Shimmer atau Skeleton Memuat Tanpa Akhir (Endless Shimmer / Skeleton)

- **Ciri:** Efek gelombang kilap (shimmer wave) atau placeholder skeleton berdenyut tanpa henti pada kartu/komponen yang sebenarnya tidak sedang menunggu data jaringan.
- **Alasan:** Shimmer adalah indikator status memuat (loading state) asinkron, bukan dekorasi latar belakang. Membiarkannya berjalan terus-menerus membingungkan pengguna seolah antarmuka belum selesai memuat.
- **Solusi:** Tampilkan konten langsung jika data sudah tersedia. Terapkan skeleton shimmer hanya selama proses permintaan data asinkron riil berlangsung, lalu ganti seketika dengan konten asli (R-19, R-27).


