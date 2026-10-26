---
name: slop-ai-indo-human
description: "Skill aksesibilitas dan sisi manusiawi untuk Slop AI Indo. Memeriksa kontras warna, navigasi keyboard, indikator fokus, dan status UI bagi pengguna sungguhan. Dilengkapi alat pemeriksa kontras."
allowed-tools: Bash(python *) Bash(python3 *) Read Write Edit Glob Grep
---
# slop-ai-indo-human

> Anti Slop: Aturan untuk AI Coding Agent. Skill Aspek Manusia & Aksesibilitas

> Bagian dari sistem Slop AI Indo. Dibaca bersama dengan `slop-ai-indo.md` (inti). Skill ini mengulas mendalam aspek kebutuhan manusia: antarmuka harus tetap dapat digunakan oleh pengguna dengan berbagai kondisi penglihatan, motorik tangan, dan perangkat yang beragam. Kontras warna, keyboard, fokus, variasi status antarmuka, serta detail mobile yang mengecualikan orang sungguhan.

## Cara Menggunakan Skill Ini

- Muat bersama `slop-ai-indo.md` setiap kali tugas melibatkan pembuatan atau pengubahan antarmuka pengguna (UI). Filter inti memegang mekanisme utama (uji tujuan, tiga tingkatan, Delivery Gate); skill ini memegang kedalaman aspek manusia: bagian-bagian UI yang mengecualikan orang dengan penglihatan, tangan, atau pengaturan perangkat yang berbeda.
- Setiap pola memiliki format teratur: **Ciri (Tell)**, **Alasan (Why)** (siapa yang dirugikan/dikecualikan, dan mengapa ini menandakan pekerjaan belum selesai), dan **Solusi (Fix)**, dengan aturan inti yang dirujuk sebagai R-XX.
- Aksesibilitas bukanlah sekadar daftar periksa tambahan yang ditempelkan di bagian akhir. Ini adalah bagian dari janji inti bahwa "antarmuka harus kokoh dan dapat diandalkan" (C-4).
- Alat pemeriksa kontras (formula + tabel referensi + skrip) ada di dalam skill ini. Gunakan untuk setiap pasangan warna yang tidak dapat diverifikasi secara pasti hanya dengan mata telanjang.
- Skill ini hanya menyimpan detail mobile yang mengecualikan manusia secara langsung: pembesaran tampilan (zoom), dan papan ketik virtual di layar ponsel.

## Warna & Kontras

### Teks Rendah Kontras (Low-Contrast Text)

- **Ciri:** Teks abu-abu muda di atas latar belakang putih atau hampir putih, teks paragraf terlalu tipis, atau label redup yang dipilih semata-mata karena terlihat "elegan" padahal sulit dibaca.
- **Alasan:** Mengecualikan pengguna dengan penglihatan rendah dan siapa pun yang menggunakan perangkat di bawah terik matahari atau cahaya terang. Ini adalah keputusan visual yang diambil tanpa memeriksa standar kelayakan baca, yang merupakan target utama penyaring anti-slop.
- **Solusi:** Penuhi standar rasio minimum WCAG AA (R-25): 4.5:1 untuk teks normal, dan 3:1 untuk teks berukuran besar (18px ke atas atau 14px bold). Hitung rasionya secara matematis, jangan hanya mengira-ngira dengan pandangan mata.

### Teks di Atas Foto atau Gradien (Text Over a Photo or Gradient)

- **Ciri:** Teks putih ditempatkan langsung di atas gambar atau gradien yang memiliki area terang di beberapa bagiannya, namun hanya diuji pada satu titik gelap saja.
- **Alasan:** Kontras itu bersifat lokal. Di area gambar yang terang, kontras teks akan anjlok di bawah 4.5:1 meskipun banner hero secara keseluruhan terlihat bagus sekilas. Aturan R-25 mewajibkan pengujian di seluruh area yang dilewati teks, bukan hanya satu titik sampel terbaik.
- **Solusi:** Tambahkan lapisan peredup (scrim/overlay) atau blok latar belakang warna solid di belakang teks, lalu uji titik terburuknya (area paling terang), bukan titik terbaiknya. Jika ada bagian teks yang gagal memenuhi rasio, maka perlakuan visual tersebut dinyatakan gagal.

### Halusinasi Kontras Abu-abu di Atas Abu-abu (The Grey-on-Grey Hallucination)

- **Ciri:** Klaim sepihak bahwa pasangan warna "abu-abu gelap di atas hitam" atau "abu-abu muda di atas putih" telah lulus standar AA tanpa perhitungan rasio yang valid.
- **Alasan:** Ini adalah halusinasi aksesibilitas paling umum pada AI. Mata manusia sering melebih-lebihkan kontras pada pasangan warna abu-abu, dan AI sering mengulang klaim palsu karena terdengar meyakinkan. Warna `#555555` di atas hitam rasionya hanya 2.8:1, dan ini gagal telak.
- **Solusi:** Jangan pernah berasumsi pasangan warna lolos standar tanpa bukti. Jalankan skrip pemeriksa kontras di bawah ini atau hitung dengan formula. Jika keduanya tidak memungkinkan, jadikan tabel referensi sebagai acuan wajib.

### Kontras Elemen Non-Teks (Non-Text Contrast)

- **Ciri:** Komponen interaktif (tombol, ikon fungsional, garis batas input form, indikator fokus, irisan grafik) hanya berbeda dari latar belakang dengan rasio kurang dari 3:1.
- **Alasan:** Elemen UI non-teks menyampaikan informasi penting melalui bentuk dan batas tepinya. Saat batas tepi terlalu samar atau nyaris menyatu dengan latar, pengguna dengan keterbatasan penglihatan tidak dapat menemukan kontrol interaktif tersebut. Standar yang sama berlaku untuk status aktif seperti hover dan selected.
- **Solusi:** Berikan setiap batas komponen dan setiap indikator status rasio kontras minimal 3:1 terhadap warna di sebelahnya (WCAG 1.4.11). Pasangkan ikon fungsional dengan label teks yang memenuhi standar rasio 4.5:1.

### Alat Pemeriksa Kontras (The Contrast Checker)

Pusat alat pemeriksa kontras. Tersedia dalam tiga tingkatan kepraktisan:

**1. Menggunakan Skrip Otomatis.** Jika runtime skrip tersedia di lingkungan kerja dan berkasnya ada, jalankan skrip alih-alih menghitung manual. Skrip ini disertakan di folder skill ini (`contrast-check.py`, di sebelah berkas `SKILL.md` ini). Jalankan dengan perintah `python3` di macOS/Linux atau `python` di Windows:

```bash
python3 "${CLAUDE_SKILL_DIR}/contrast-check.py" "#FFFFFF" "#777777"
# normal text: FAIL (4.48 < 4.5)
# large text:  PASS (4.48 >= 3.0)
```

Jika variabel lingkungan tidak tersedia, arahkan path skrip langsung ke folder skill ini. Skrip ini hadir agar agen AI berhenti berhalusinasi tentang standar AA. Skrip menerima dua nilai warna hex, lalu mencetak rasio beserta status kelulusan untuk ukuran teks normal maupun besar. Jika berkas skrip tidak ada, formula dan tabel di bawah ini sudah lengkap dan mandiri. Jangan pernah tertahan hanya karena skrip belum dieksekusi.

**2. Formula Matematis (WCAG 2.x).**

1. Rasio Kontras = `(L1 + 0.05) / (L2 + 0.05)`, di mana L1 adalah luminansi relatif yang lebih terang dan L2 yang lebih gelap.
2. Luminansi relatif L dari satu warna: ubah setiap kanal RGB ke rentang 0-1 (`c = hex / 255`), lalu linearisasi: jika `c <= 0.03928`, maka `c_lin = c / 12.92`; jika lebih besar, maka `c_lin = ((c + 0.055) / 1.055) ^ 2.4`.
3. `L = 0.2126 * R + 0.7152 * G + 0.0722 * B`.
4. Bulatkan rasio ke dua desimal dan bandingkan: minimal 4.5:1 untuk teks normal, minimal 3:1 untuk teks berukuran besar (18px ke atas atau 14px tebal, sesuai R-25). Rasio kontras maksimum adalah 21.0 (hitam murni di atas putih murni).

**3. Tabel Referensi Cepat** (pasangan warna umum, dihitung berdasarkan formula resmi):

| Pasangan Warna (Teks di atas Latar) | Rasio Kontras | Teks Normal (Min 4.5) | Teks Besar (Min 3.0) |
|-------------------------------------|---------------|-----------------------|----------------------|
| Hitam di atas Putih (#000 di #FFF)  | 21.00         | Lolos                 | Lolos                |
| Putih di atas Hitam (#FFF di #000)  | 21.00         | Lolos                 | Lolos                |
| Putih di atas #333333               | 12.63         | Lolos                 | Lolos                |
| Putih di atas #666666               | 5.74          | Lolos                 | Lolos                |
| #777777 di atas Putih               | 4.48          | Gagal                 | Lolos                |
| Putih di atas #888888               | 3.54          | Gagal                 | Lolos                |
| Putih di atas #999999               | 2.85          | Gagal                 | Gagal                |
| #555555 di atas Hitam               | 2.82          | Gagal                 | Gagal                |

Gunakan tabel ini sebagai pemeriksaan cepat kewarasan desain, bukan pengganti mutlak. Pasangan warna apa pun yang tidak tertera di tabel, atau nilainya mendekati batas ambang batas, wajib dihitung menggunakan formula atau skrip.

## Navigasi Keyboard

### Menghilangkan Garis Fokus (Removed Focus Outline)

- **Ciri:** Menggunakan aturan CSS `outline: none` atau `outline: 0` tanpa menyediakan gaya pengganti indikator fokus yang terlihat.
- **Alasan:** Pengguna keyboard tidak dapat melihat di mana posisi kursor/fokus mereka berada saat ini. Ini adalah cara tercepat merusak kegunaan UI tanpa mouse, dan aturan R-32 melarangnya secara keras.
- **Solusi:** Pertahankan outline bawaan browser atau ganti dengan gaya `:focus-visible` yang jelas terlihat dan memenuhi standar kontras 3:1 terhadap warna di sekitarnya. Dilarang keras menulis `outline: none` tanpa gaya pengganti yang setara.

### Pola Khusus Mouse (Mouse-Only Patterns)

- **Ciri:** Menu dropdown yang hanya terbuka saat kursor hover, dropdown yang hanya bisa diklik tetapi tidak bisa dibuka lewat keyboard, fitur drag-and-drop tanpa alternatif keyboard.
- **Alasan:** Setiap pola ini secara sepihak mengecualikan pengguna keyboard dan teknologi pembaca layar (R-32). Jika kontrol interaktif tidak bisa dijangkau dan dioperasikan menggunakan tombol Tab, Enter, atau Spasi, maka fitur tersebut praktis tidak ada bagi sebagian pengguna.
- **Solusi:** Pastikan setiap elemen interaktif dapat dijangkau dan dioperasikan sepenuhnya melalui keyboard (R-32): urutan tab yang logis mengikuti urutan visual, aktivasi tombol dengan Enter atau Spasi, dan kotak dialog/modal yang wajib bisa ditutup dengan tombol Escape (R-26).

### Urutan Tab Berantakan (Broken Tab Order)

- **Ciri:** Fokus keyboard melompat-lompat secara acak di halaman, melewati konten penting, atau berhenti pada elemen yang tersembunyi karena urutan elemen di kode DOM tidak sesuai dengan tata letak visual di layar.
- **Alasan:** Urutan tab yang mengikuti urutan kode acak alih-alih urutan visual membuat alur navigasi membingungkan pengguna (R-32). Pengguna kehilangan jejak posisi fokus dan halaman terasa rusak.
- **Solusi:** Samakan urutan kode sumber dengan urutan tampilan visual, tambahkan tautan lewati navigasi ("skip to content") pada halaman yang panjang, dan jangan pernah memberikan atribut `tabindex="-1"` pada konten penting kecuali jika itu bagian dari jebakan fokus (focus trap) terkontrol seperti jendela modal.

## Fokus & Status UI

### Indikator Fokus Lemah atau Tidak Terlihat (Weak or Invisible Focus Indicator)

- **Ciri:** Garis cincin fokus memiliki warna yang nyaris sama dengan latar belakang, cincin fokus hanya muncul saat hover kursor mouse, atau ketebalan indikator kurang dari batas minimal 1px.
- **Alasan:** Indikator fokus adalah satu-satunya panduan bagi pengguna keyboard untuk mengetahui posisi interaktif mereka. Jika kontrasnya gagal atau hanya muncul saat disentuh mouse, navigasi berbasis keyboard langsung lumpuh (R-32, R-34).
- **Solusi:** Sediakan indikator fokus yang tegas dan terlihat jelas pada setiap elemen interaktif, dengan rasio kontras minimal 3:1 terhadap warna di sebelahnya, di semua tema warna yang disediakan (baik tema terang maupun gelap).

### Umpan Balik Hanya Mengandalkan Warna (Color-Only Feedback)

- **Ciri:** Status berhasil, peringatan, atau error hanya dikomunikasikan lewat perubahan warna: teks error berwarna merah, kotak sukses bergaris hijau, tanpa disertai teks deskriptif, lencana, atau ikon pendukung.
- **Alasan:** Pola ini mengabaikan pengguna buta warna dan pengguna dengan penglihatan terbatas, serta hilang sama sekali saat pengguna mengaktifkan mode kontras tinggi (forced-colors mode). Status yang hanya bergantung pada persepsi warna bukanlah status yang dapat diandalkan (C-4).
- **Solusi:** Selalu pasangkan sinyal warna dengan teks penjelasan, ikon yang bermakna, atau pola visual. Pesan error wajib mengutamakan teks yang jelas: "Kata sandi harus minimal 8 karakter", bukan sekadar memberi garis batas merah tanpa keterangan.

### Status UI yang Hilang (Missing UI States)

- **Ciri:** Tampilan data tidak memiliki status kosong (empty state), status memuat (loading state), atau status error. Atau status tersebut ada tetapi tidak informatif: hanya menampilkan spinner berputar tanpa teks penjelasan, atau layar kosong tanpa arahan tindakan berikutnya.
- **Alasan:** Aturan R-27 mewajibkan ketiga status tersebut. Dari sudut pandang aksesibilitas, setiap status harus dapat dirasakan dan informatif bagi pengguna, bukan sekadar hiasan visual. Ikon memuat tanpa keterangan membuat pengguna pembaca layar mengira halaman mengalami crash atau macet.
- **Solusi:** Setiap tampilan data wajib menyediakan ketiga status lengkap (R-27), dengan teks yang terbaca jelas: pesan eksplisit saat data kosong, teks penjelasan saat sedang memuat, dan pesan error informatif yang menjelaskan apa yang terjadi serta langkah perbaikan yang dapat dilakukan pengguna.

## Zoom & Penggunaan Mobile

Mekanisme tata letak teknis tampilan mobile (breakpoint layar, skala, sistem grid, luapan konten, dan ukuran target sentuhan) dibahas mendalam pada skill `slop-ai-indo-layoutmobile`. Bagian ini khusus menangani detail mobile yang mengecualikan manusia secara langsung: pembesaran tampilan (zoom) dan interaksi keyboard virtual.

### Teks yang Tidak Bisa Diperbesar (Text That Cannot Zoom)

- **Ciri:** Penggunaan ukuran font pixel mati (fixed px), atau wadah pembungkus dengan aturan `overflow: hidden` yang memotong teks ketika layar diperbesar hingga 200%.
- **Alasan:** Pengguna wajib dapat mengubah ukuran teks sesuai kebutuhan penglihatan mereka (WCAG 1.4.4). Jika pembesaran 200% memotong teks atau memaksa pengguliran horizontal yang merusak tata letak, maka teks tersebut praktis tidak dapat diakses.
- **Solusi:** Gunakan tipografi fleksibel yang mengalir dinamis saat di-zoom, jangan bungkus teks dengan wadah yang memotong konten secara kaku, dan verifikasi bahwa tata letak tetap utuh pada tingkat pembesaran 200% di layar sempit (R-35).

### Papan Ketik Virtual Menutupi Formulir (Mobile Keyboard Covers the Form)

- **Ciri:** Kolom input form di bagian bawah layar tertutup oleh papan ketik virtual saat disentuh, tanpa mekanisme scroll otomatis dan tanpa ruang sisa yang cukup untuk melihat apa yang sedang diketik.
- **Alasan:** Formulir yang tidak dapat dilihat atau dijangkau oleh pengguna adalah formulir yang tidak bisa diselesaikan. Ini adalah bentuk pengabaian pengalaman pengguna mobile yang nyata (R-03).
- **Solusi:** Saat kolom input mendapatkan fokus keyboard, gulirkan otomatis ke area pandang yang nyaman di atas papan ketik virtual, dengan ruang padding bawah yang memadai sehingga input tidak pernah tertutup. Uji menggunakan perangkat ponsel sungguhan atau emulator keyboard mobile.

