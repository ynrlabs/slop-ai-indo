---
name: slop-ai-indo-layoutmobile
description: "Skill tata letak mobile untuk Slop AI Indo. Digunakan untuk tata letak yang mengalir dinamis lintas ukuran layar ponsel hingga desktop: sistem grid, pencegahan luapan, dan target sentuhan. Muat bersama berkas inti."
allowed-tools: Read Write Edit Glob Grep
---
# slop-ai-indo-layoutmobile

> Anti Slop: Aturan untuk AI Coding Agent. Skill Tata Letak Mobile

> Bagian dari sistem antislop. Dibaca bersama dengan `slop-ai-indo.md` (inti). Skill ini mengulas mendalam kebutuhan tata letak responsif: bagaimana layout harus mengalir ulang (reflow) secara wajar di berbagai ukuran layar, dari ponsel genggam hingga layar desktop lebar. Breakpoint layar, skala ukuran, penataan grid, pencegahan luapan konten, ukuran target sentuhan, dan arsitektur navigasi mobile. Skill ini merujuk ke aturan inti berdasarkan nomor dan tidak pernah menduplikasi atau mengubah penomorannya. Muat skill ini saat tugas melibatkan perancangan atau pengeditan tata letak yang harus tampil kokoh di semua lebar layar.

## Cara Menggunakan Skill Ini

- Muat bersama `slop-ai-indo.md` setiap kali tugas berhubungan dengan tata letak mobile atau desain responsif. Dokumen inti memegang mekanisme utama (uji tujuan, tiga tingkatan, Delivery Gate); skill ini memegang rincian teknis tata letak mobile secara mendalam.
- Setiap entri memiliki format seragam: **Ciri (Tell)**, **Alasan (Why)** (mengapa pola tersebut dianggap sebagai slop berkualitas rendah), dan **Solusi (Fix)** (tindakan yang benar), dengan aturan inti yang dirujuk sebagai R-XX.
- Prinsip utama di balik skill ini: **tata letak mobile adalah desain yang berbeda secara fundamental, bukan sekadar tampilan desktop yang diperkecil.** Tata letak mobile harus mengalir ulang: menumpuk kembali, menyesuaikan skala, dan mengatur ulang urutan dengan tujuan yang jelas. Setiap pola di bawah ini adalah contoh kegagalan tata letak dalam mengalir ulang secara benar.

## Breakpoint Layar

### Tata Letak Khusus Desktop (Desktop-Only Layout)

- **Ciri:** Hanya ada satu rancangan tata letak untuk semua ukuran layar; tampilan mobile hanyalah tampilan desktop yang dijepit secara paksa ke layar ponsel kecil.
- **Alasan:** Aturan R-03 mewajibkan tata letak mobile yang dirancang sempurna sejak awal, bukan sebagai pikiran belakangan. Halaman yang hanya menyusut tidak memiliki desain mobile sama sekali: kartu-kartu yang tadinya berdampingan menjadi saling bertabrakan, dan teks panjang yang dirancang untuk layar lebar menjadi sangat sesak di layar sempit.
- **Solusi:** Tentukan status mobile yang nyata pada breakpoint di mana konten mulai tidak nyaman dibaca. Tata letak mobile harus mengalir ulang: kolom-kolom menumpuk ke bawah (stacked), ukuran elemen mengecil wajar, dan urutan disesuaikan dengan kebutuhan pengguna ponsel. Jika tampilan ponsel hanyalah tampilan desktop versi mini, maka pekerjaan belum selesai.

### Breakpoint Berdasarkan Daftar Perangkat (Breakpoint Driven by Device List)

- **Ciri:** Menentukan breakpoint kaku berdasarkan dimensi ponsel tertentu (misalnya 375px, 414px, 768px) semata-mata karena "itu ukuran iPhone", bukan karena kebutuhan konten di titik tersebut.
- **Alasan:** Dimensi fisik ponsel selalu berubah setiap tahun dan setiap seri perangkat baru. Breakpoint sejatinya adalah titik saat tata letak mulai rusak atau tidak ideal; memaksakan breakpoint pada daftar perangkat kaku membuat tata letak tunduk pada spesifikasi acak daripada kenyamanan membaca konten (R-03).
- **Solusi:** Tempatkan breakpoint tepat di titik saat konten mulai terganggu secara nyata: ketika sebuah kolom menjadi terlalu sempit untuk dibaca, atau saat jajaran kartu mulai terhimpit. Uji dengan mengecilkan jendela browser secara perlahan, amati titik patah alaminya, lalu pasang breakpoint di titik tersebut.

### Desain Mobile Dibuat Terakhir (Mobile Styled Last)

- **Ciri:** Aturan gaya mobile hanya ditempelkan sebagai tambalan darurat di baris paling bawah CSS: file stylesheet desktop yang sangat panjang dengan sedikit media query tambahan di akhir untuk memperbaiki satu atau dua elemen yang rusak.
- **Alasan:** Menambal gaya secara darurat bukanlah merancang tampilan mobile. Hal itu hanya menutupi gejala yang dilaporkan secara sementara dan meninggalkan masalah tersembunyi lainnya, sementara gaya dasarnya tetap terikat pada layar lebar (R-03).
- **Solusi:** Perlakukan tampilan mobile sebagai status yang dirancang dengan matang sejak awal, bukan sekadar penimpa gaya (override). Berikan viewport sempit skala ukuran dan urutan tumpukan elemennya sendiri yang terencana, lalu verifikasi seluruh alur di layar tersebut, bukan hanya titik yang diperbaiki (R-35).

### Tata Letak Dua Status Kaku (Two-State Layout)

- **Ciri:** Tata letak hanya memiliki tepat dua status: satu kolom tunggal yang menumpuk di bawah breakpoint tertentu, dan grid multi-kolom lebar di atasnya, tanpa ada rancangan sama sekali untuk ukuran di antaranya. Layar tablet atau laptop kecil akhirnya terpaksa mewarisi status yang canggung: tumpukan ponsel yang melebar aneh, atau grid desktop yang terjepit sempit.
- **Alasan:** Lebar layar di dunia nyata adalah rentang yang berkesinambungan, dan aturan R-03 menuntut antarmuka tampil rapi di setiap lebar layar tersebut. Dua status kaku mengorbankan seluruh rentang tengah (sekitar 600px hingga 1024px, tempat tablet dan laptop ringkas berada). Tampilan akan terlihat hanya terdesain pada dua titik acak dan berantakan di semua titik di antaranya.
- **Solusi:** Definisikan status penataan di lebar saat konten membutuhkan perubahan bentuk, sebanyak yang dibutuhkan oleh konten tersebut. Tata letak umum biasanya membutuhkan minimal tiga status: kolom tunggal di layar sempit, lalu dua kolom saat kartu mulai terlalu lebar jika menumpuk satu-satu, dan multi-kolom penuh hanya saat ruang layar benar-benar mencukupi. Uji dengan menggeser lebar jendela browser secara halus di seluruh rentang (R-35).

## Skala & Penentuan Ukuran (Scale & Sizing)

### Ukuran Desktop Dipaksakan ke Layar Ponsel (Desktop-Sized Everything)

- **Ciri:** Nilai padding, jarak gap, tinggi hero section, dan ukuran kartu desktop dibiarkan sama persis di ponsel, sehingga setiap bagian terlihat sangat raksasa dan memenuhi layar ponsel.
- **Alasan:** Elemen yang ukurannya pas untuk layar lebar 1440px akan mendominasi dan mengaburkan layar 375px. Apa yang tampak proporsional di desktop menjadi sangat membengkak di ponsel: tidak ada ruang bernapas dan halaman terasa tidak pas untuk genggaman tangan (R-03). Ruang dan tipografi harus memiliki ritme proporsional (R-05), dan ritme tersebut berukuran lebih ringkas di layar mobile.
- **Solusi:** Berikan skala ukuran khusus untuk mobile: skala font yang lebih ringkas, padding bagian yang lebih rapat, dan gap yang proporsional. Pertahankan target sentuh tombol pada ukuran minimal yang nyaman (lihat bagian Target Sentuhan), namun kurangi ruang kosong lainnya secara terencana saat memasuki breakpoint mobile.

### Ukuran Font Pixel Kaku (Fixed Pixel Type)

- **Ciri:** Ukuran font menggunakan nilai pixel statis (`px`) yang tidak pernah berubah antara tampilan desktop dan mobile, sehingga judul maupun paragraf menjadi terlalu besar dan memakan ruang berlebih di ponsel.
- **Alasan:** Tipografi yang tidak merespons lebar layar adalah tipografi yang egois untuk satu perangkat saja. Aturan R-03 mewajibkan keterbacaan mobile yang prima, dan R-06 mewajibkan tipografi yang meningkatkan kenyamanan membaca. Judul yang terpotong aneh atau paragraf yang memanjang melintasi layar merusak kenyamanan pengguna.
- **Solusi:** Gunakan tipografi fluida berbasis fungsi CSS `clamp()` agar ukuran font menyesuaikan lebar layar secara halus, atau tentukan ukuran langkah font yang lebih kecil pada media query mobile. Uji hasilnya langsung pada layar sempit (R-35).

### Bagian Berukuran 100vh (100vh Sections)

- **Ciri:** Menetapkan tinggi hero section atau wadah konten sebesar `100vh`, sehingga bagian tersebut memenuhi seluruh layar ponsel dan mendorong konten penting lainnya jauh ke bawah lipatan layar.
- **Alasan:** Bagian layar penuh yang dirancang untuk monitor desktop menjadi lempengan raksasa yang kaku di layar ponsel. Selain itu, satuan `100vh` di browser ponsel sering kali menyertakan bilah alamat browser, sehingga konten di bagian bawahnya terpotong atau tersembunyi.
- **Solusi:** Biarkan tinggi bagian menyesuaikan konten alaminya (`height: auto`), atau gunakan satuan viewport dinamis (`dvh`) jika bagian setinggi layar penuh memang benar-benar dibutuhkan secara fungsional. Tidak boleh ada informasi penting yang tersembunyi di bawah layar karena kesalahan penetapan satuan viewport.

### Ruang Kosong Padding Terlalu Besar (Huge Empty Padding)

- **Ciri:** Mempertahankan jarak vertikal padding desktop (seperti 96px atau 128px) di tampilan ponsel, menciptakan jurang ruang kosong yang sangat jauh di antara setiap bagian halaman.
- **Alasan:** Padding yang pas untuk kanvas lebar akan menjadi pemborosan ruang vertikal yang menjengkelkan di ponsel. Pengguna terpaksa menggulir layar melalui ruang kosong yang hampa, dan ritme desain R-05 rusak menjadi jeda kosong tanpa makna.
- **Solusi:** Turunkan padding bagian pada breakpoint mobile menjadi sekitar setengah atau sepertiga dari ukuran desktop, dan pastikan kepadatan visual terasa nyaman saat digulir.

## Sistem Grid & Penumpukan (Grids & Stacking)

### Kolom yang Tidak Runtuh/Menumpuk (Columns That Don't Collapse)

- **Ciri:** Grid multi-kolom tetap mempertahankan kolom berdampingan di ponsel, sehingga setiap kolom menyusut tipis, teks terputus-putus secara canggung, dan elemen saling bertumpukan.
- **Alasan:** Grid adalah komitmen atas ketersediaan ruang lebar. Saat layar menyempit dan kolom tidak ditumpuk ke bawah, setiap kolom hanya mendapatkan secuil ruang, teks menjadi tidak terbaca, dan kartu saling bertabrakan (R-03).
- **Solusi:** Runtuhkan grid multi-kolom menjadi kolom tunggal yang menumpuk ke bawah pada breakpoint mobile. Setiap item mendapatkan lebar penuh kembali secara leluasa. Verifikasi ulang di lebar sempit (R-35).

### Grid dengan Lebar Tetap (Fixed-Width Grid)

- **Ciri:** Penulisan `grid-template-columns` menggunakan nilai pixel statis, atau area grid yang tidak bisa mengalir dinamis, sehingga tata letak tetap kaku saat layar mengecil.
- **Alasan:** Kolom berukuran pixel statis tidak memedulikan lebar layar; kolom tersebut mempertahankan lebarnya secara kaku dan memicu luapan horizontal yang merusak tampilan (R-03).
- **Solusi:** Gunakan satuan fleksibel seperti `minmax()`, `auto-fit`, atau `auto-fill` agar kolom dapat menyusut dan berpindah baris mengikuti ruang yang tersedia. Sistem grid harus fleksibel secara default dan hanya kaku jika ada alasan fungsional yang kuat.

### Memaksakan Sistem 12-Kolom di Layar Ponsel (Forced 12-Column)

- **Ciri:** Sistem grid 12-kolom dipaksakan pada konten mobile yang sejatinya hanya butuh satu atau dua kolom, sehingga perhitungan pembagian kolom menjadi rumit dan memicu benturan visual.
- **Alasan:** Sistem 12-kolom diciptakan untuk kanvas lebar desktop dengan banyak variasi susunan. Memaksakannya di layar ponsel membuat setiap elemen menjadi pecahan pecahan kecil yang rumit tanpa alasan nyata (R-03).
- **Solusi:** Biarkan jumlah kolom mengikuti kebutuhan alami konten. Di layar ponsel, konten hampir selalu membutuhkan satu kolom tunggal, atau maksimal dua kolom untuk item kecil; sistem 12-kolom hanya relevan di layar lebar.

### Pengabaian Container Queries untuk Komponen Modular (Ignoring Container Queries)

- **Ciri:** Hanya mengandalkan media query viewport global (`@media (max-width: ...)`) untuk kartu atau widget di dalam sidebar, modal, atau grid multi-kolom, sehingga kartu di dalam kolom sempit tetap mempertahankan tata letak desktop yang sesak.
- **Alasan:** Komponen modular sejati harus menyesuaikan diri dengan ruang wadah pembungkusnya (container), bukan sekadar lebar layar perangkat secara keseluruhan (R-03).
- **Solusi:** Gunakan CSS Container Queries (`container-type: inline-size` pada wadah dan `@container (max-width: ...)` pada komponen) agar kartu, formulir, atau widget dapat beralih ke tata letak tumpuk secara otomatis di mana pun komponen tersebut disematkan.

## Luapan Konten (Overflow)

### Kebocoran Geser Horizontal (Horizontal Scroll Leak)

- **Ciri:** Halaman web bisa digeser ke samping (scroll horizontal) secara tidak sengaja karena ada elemen yang lebih lebar dari layar: tabel data besar, blok kode panjang, gambar lebar, atau teks panjang tanpa pemutus kata.
- **Alasan:** Pengguliran horizontal yang tidak disengaja merusak kenyamanan pengguna mobile. Pengguna tidak bisa membaca dengan stabil dan tata letak terlihat pecah ke samping (R-03). Ini adalah jenis kesalahan paling umum karena sering terlewat saat pengujian di monitor desktop lebar.
- **Solusi:** Cari elemen yang melebihi lebar layar (tabel yang butuh wadah penggulir terisolasi atau diubah menjadi kartu, blok kode yang perlu diberi bungkus rapi, gambar yang diberi aturan `max-width: 100%`), lalu isolasi atau sesuaikan. Pastikan halaman web memiliki nol luapan horizontal pada lebar layar tersempit (R-35).

### Pemotongan Konten dengan Overflow Hidden (Overflow Hidden Clipping)

- **Ciri:** Menggunakan aturan `overflow: hidden` pada wadah utama untuk menutupi luapan di layar sempit, yang akhirnya malah memotong teks atau tombol kontrol sehingga hilang dari pandangan.
- **Alasan:** Memotong konten secara sembarangan hanyalah cara malas menutupi kesalahan tata letak. Pengguna kehilangan informasi dan tombol penting karena antarmuka tidak mampu menyesuaikan diri (R-03).
- **Solusi:** Biarkan konten mengalir dan membungkus secara wajar (wrap) alih-alih memotongnya: izinkan wadah bertambah tinggi, bungkus baris teks, atau tumpuk elemen ke bawah pada breakpoint. Gunakan pemotongan hanya jika memang bertujuan estetika yang terencana (seperti crop gambar thumbnail), bukan untuk menyembunyikan teks atau tombol interaktif.

### Elemen Anak Berlebar Kaku (Fixed-Width Children)

- **Ciri:** Elemen anak di dalam Flexbox atau Grid memiliki nilai `width` atau `min-width` kaku dalam satuan pixel yang melebihi wadah induknya di layar sempit.
- **Alasan:** Elemen berukuran pixel statis tidak peduli seberapa kecil wadah induknya. Di ponsel, wadah induk mengecil namun elemen anak tetap melebar, sehingga memicu luapan layar (R-03).
- **Solusi:** Berikan ukuran menggunakan satuan relatif dan aktifkan pembungkusan baris (`flex-wrap: wrap`, lebar fluida, atau aturan `min-width: 0` pada elemen anak di dalam grid). Elemen anak harus diizinkan menyusut bersama induknya.

## Target Sentuhan (Tap Targets)

### Target Sentuh Terlalu Kecil (Under-Sized Targets)

- **Ciri:** Tombol, tautan, dan kontrol interaktif berukuran lebih kecil dari 44 x 44 pixel, yang mudah diklik dengan kursor mouse presisi di desktop tetapi sangat sulit ditekan dengan ibu jari di ponsel.
- **Alasan:** Kursor mouse di desktop memiliki presisi hingga tingkat pixel tunggal; ibu jari manusia di layar ponsel tidak demikian. Tombol kecil berukuran 16px akan memicu salah pencet dan frustrasi pengguna di layar sentuh (R-03).
- **Solusi:** Berikan setiap elemen interaktif area sentuh minimum 44 x 44 pixel, menggunakan padding yang memadai atau area hit-box tak terlihat meskipun tampilan visual ikonnya lebih kecil. Uji seluruh kontrol interaktif pada ukuran layar ponsel (R-35).

### Target Sentuh Terlalu Berdempetan (Targets Too Close)

- **Ciri:** Tombol-tombol berukuran 44px diletakkan saling menempel rapat tanpa ada jarak jeda, sehingga sentuhan jari sering mengenai tombol yang salah.
- **Alasan:** Ukuran target sentuh hanya efektif jika didukung oleh jarak antar elemen yang memadai. Dua tombol besar yang saling menempel akan diperlakukan seperti satu kesatuan area bagi jemari pengguna (R-03).
- **Solusi:** Berikan jarak celah (gap) yang jelas di antara target interaktif yang berdampingan, minimal beberapa pixel agar area sentuhan jari tidak saling tumpang tindih. Jarak adalah separuh penentu kenyamanan navigasi sentuh.

### Interaksi Khusus Hover (Hover-Only Interactions)

- **Ciri:** Menu navigasi, tooltip penjelasan, atau tombol aksi hanya muncul saat kursor mouse melayang di atasnya (hover), sehingga pengguna layar sentuh ponsel tidak pernah bisa membukanya.
- **Alasan:** Tidak ada status hover kursor pada layar sentuh ponsel. Interaksi yang hanya merespons hover praktis tidak ada bagi pengguna mobile, dan kontrol tersebut menjadi jalan buntu (R-03).
- **Solusi:** Sediakan padanan interaksi sentuhan untuk setiap interaksi hover: menu yang terbuka saat hover juga wajib bisa dibuka dengan sekali sentuh/ketuk, tooltip bisa ditampilkan lewat klik ikon, dan tombol interaktif memberikan umpan balik visual saat disentuh (`:active`). Uji penggunaan UI secara murni dengan simulasi sentuhan (R-35).

## Navigasi Mobile

### Navigasi Desktop yang Dipaksakan di Layar Ponsel (Nav That Stays Desktop)

- **Ciri:** Bilah navigasi atas desktop dengan deretan tautan panjang tetap dipaksakan berdampingan di ponsel, sehingga tautan-tautan tersebut berdesakan, patah menjadi dua baris berantakan, atau terpotong ke samping layar.
- **Alasan:** Navigasi desktop dirancang untuk kanvas horizontal yang luas. Dibiarkan sebaris di ponsel, ia menjadi tumpukan teks yang berantakan dan merupakan hal pertama yang dilihat pengguna (R-03).
- **Solusi:** Runtuhkan navigasi ke dalam pola khusus mobile pada breakpoint yang tepat: bilah navigasi bawah (bottom nav) untuk beberapa menu utama terpenting, atau menu laci (drawer/sheet) untuk menu lainnya. Tautan utama harus tetap mudah dijangkau dengan satu sentuhan ibu jari.

### Menu Hamburger Polosan Tanpa Label (The Bare Hamburger)

- **Ciri:** Semua menu navigasi disembunyikan di balik tiga garis ikon hamburger tanpa label teks dan tanpa petunjuk apa pun.
- **Alasan:** Ikon hamburger polosan mengasumsikan semua pengguna sudah tahu makna ikon tersebut dan paham bahwa ada menu penting di baliknya. Padahal banyak pengguna yang melewatkannya, padahal menu tersebut menyimpan satu-satunya cara menjelajahi aplikasi (R-03).
- **Solusi:** Jaga agar menu mudah ditemukan: tambahkan label teks yang jelas pada ikon hamburger ("Menu"), atau biarkan beberapa menu utama tetap terlihat langsung di layar dan sembunyikan hanya menu sekunder. Jika menu tersembunyi adalah satu-satunya jalur akses, kemudahan penemuannya harus sangat jelas.

### Navigasi Bawah Menutupi Konten (Bottom Nav That Eats Content)

- **Ciri:** Bilah navigasi bawah posisi tetap (fixed bottom nav) menempel di atas konten, sehingga menutupi item daftar terakhir, tombol konfirmasi form, atau tombol checkout yang sedang dicari pengguna.
- **Alasan:** Bilah navigasi posisi tetap memakan ruang fisik nyata di layar ponsel yang sempit. Jika tidak ada ruang pengganjal (padding) yang disediakan di bawah, konten akan tenggelam di bawah bilah tersebut dan tidak bisa dijangkau pengguna (R-03).
- **Solusi:** Sediakan ruang bawah yang cukup pada konten halaman: tambahkan padding bawah pada kontainer utama dan perhatikan batas aman layar perangkat (safe-area insets pada iOS), sehingga tidak ada konten yang tertutup navigasi.

### Navigasi Sticky Menguasai Layar (Sticky Nav Steals the Screen)

- **Ciri:** Bilah navigasi melayang (sticky header) atau bilah bawah yang terlalu tebal dan memakan porsi besar layar ponsel secara permanen saat digulir.
- **Alasan:** Di layar ponsel yang kecil, setiap pixel ruang navigasi yang kaku adalah kehilangan ruang untuk membaca konten. Header melayang yang terlalu tinggi membuat area baca konten menjadi sangat sempit seperti celah sempit (R-03).
- **Solusi:** Rancang bilah navigasi yang ringkas dan padat: cukup kecil agar konten tetap menjadi fokus utama, serta pertimbangkan untuk mengecilkan atau menyembunyikan header secara halus saat layar digulir ke bawah, lalu memunculkannya kembali saat digulir ke atas.

