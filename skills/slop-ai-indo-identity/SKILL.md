---
name: slop-ai-indo-identity
description: "Menjaga identitas merek, karakter produk, dan bahasa visual dari penjiplakan template AI generik serta klon buta produk populer."
allowed-tools: Read Write Edit Glob Grep
---
# slop-ai-indo-identity

> Anti Slop: Aturan untuk AI Coding Agent. Skill Identitas & Karakter Produk

> Bagian dari sistem antislop. Dibaca bersama dengan `slop-ai-indo.md` (inti) dan `DESIGN.md`. Skill ini menegakkan keunikan identitas visual, karakter produk, dan konsistensi branding. Skill ini mencegah peniruan buta terhadap produk populer (Linear, Vercel, Stripe), melarang dekorasi template AI murahan (ikon sparkle tanpa fungsi, glow berlebihan, badge kapsul hampa), serta menuntut arah desain yang terencana. Skill ini merujuk ke aturan inti berdasarkan nomor dan tidak pernah mengubah penomorannya. Muat skill ini saat merancang arah visual atau mendefinisikan bahasa produk baru.

## Cara Menggunakan Skill Ini

- Muat bersama `slop-ai-indo.md` dan `DESIGN.md` setiap kali tugas menyangkut pembuatan bahasa desain, tema produk, hierarki warna, atau identitas komponen.
- Setiap pola disusun dengan format: **Pola (The pattern)**, **Mengapa Terbaca Khas AI (Why it reads as AI)**, **Sebelum (Before)**, **Sesudah (After)**, dengan aturan inti yang dirujuk sebagai R-XX.
- **Dua Pedoman Utama:**
  1. **Uji Pertukaran Logo (The Logo Swap Test):** Jika logo dan nama produk diganti dengan produk lain dan desainnya masih terasa cocok tanpa perbedaan rasa, maka desain tersebut gagal membangun identitas asli (R-20).
  2. **Tujuan Mengalahkan Tren:** Jangan memilih warna, sudut komponen, atau gaya latar belakang hanya karena sedang viral di media sosial. Setiap keputusan visual wajib memiliki alasan fungsional satu baris (R-31).

## Pola Slop Identitas & Branding

### Penjiplakan Buta Produk Populer (Blind Cloning of Popular SaaS)

- **Pola:** Meniru tema gelap pekat dengan aksen ungu milik Linear, pola grid blueprint cetak biru milik Vercel, atau garis gradien diagonal milik Stripe secara mentah-mentah pada produk yang sama sekali tidak berhubungan (misalnya dashboard logistik, portal sekolah, atau toko buku lokal).
- **Mengapa terbaca khas AI:** AI mengambil estetika devtools modern sebagai gaya bawaan untuk segala jenis antarmuka, membuat semua aplikasi di dunia tampak seperti klon Linear atau Vercel.
- **Sebelum:**
  > Aplikasi manajemen inventaris gudang dibuat dengan latar belakang hitam pekat (#0a0a0a), border ungu menyala, dan font monospace micro-tracking.
  > Desain ini membuat operator gudang di bawah lampu terang kesulitan membaca data stok.
- **Sesudah:**
  > Kanvas terang berdensitas tinggi ala enterprise (#f8fafc), tabel berkontras tajam, aksen biru navy fungsional, dan font sans-serif yang nyaman dibaca sekilas.
- **Aturan:** R-20 (identitas generik), R-30 (jangan menjiplak produk populer).

### Ikon & Maskot AI Generik Tanpa Relevansi (Meaningless AI Icons & Mascots)

- **Pola:** Memasang ikon bintang sparkle (✨) di samping fitur biasa, menaruh ilustrasi robot kartun melayang, atau memasang ikon petir/berlian di setiap kartu benefit.
- **Mengapa terbaca khas AI:** Koleksi ikon ini adalah cap pabrikan AI generik untuk menyamarkan ketiadaan ide visual yang bermakna.
- **Sebelum:**
  > Kartu filter pencarian tabel diberi ikon bintang sparkle dan label "Fitur Cerdas".
- **Sesudah:**
  > Beri ikon fungsional yang akurat (seperti corong filter standar atau kaca pembesar), tanpa lencana hiasan palsu.
- **Aturan:** R-04 (ikon generik), R-09 (badge hampa).

### Skema Gradien Pelangi Acak (Unprincipled Rainbow Gradients)

- **Pola:** Menabrakkan gradien ungu, pink, cyan, dan kuning pada kartu yang sama tanpa sistem warna atau alasan hierarki informasi.
- **Mengapa terbaca khas AI:** AI mengandalkan gradien pendar warna-warni untuk memberi efek "ramai" secara instan, namun akibatnya pengguna tidak tahu elemen mana yang paling penting untuk diklik.
- **Sebelum:**
  > Judul h1 menggunakan gradien teks cyan-ke-pink, tombol utama memakai gradien oranye-ke-ungu, dan kartu border memakai gradien hijau-ke-biru.
- **Sesudah:**
  > Terapkan 1 warna utama untuk teks dominan, 1 latar kanvas bersih, dan tepat 1 aksen warna solid terencana untuk tindakan kunci.
- **Aturan:** R-01 (gradien tanpa alasan), R-29 (batasan palet 2-3 warna).

### Bentuk Balon Membulat Tanpa Variasi (Monotonous Pill Shapes)

- **Pola:** Mengatur seluruh tombol, tag input, dan kartu penampung dengan `rounded-full` (radius kapsul balon) tanpa pertimbangan komposisi struktur dan bobot antarmuka.
- **Mengapa terbaca khas AI:** Memberikan kesan mainan anak-anak yang belum matang (*childish toy*), mengurangi densitas informasi pada aplikasi profesional, dan menghilangkan ketegasan hierarki.
- **Sesudah:**
  > Gunakan sudut tegas nan presisi (border-radius 4px sampai 6px sesuai DESIGN.md). Pertahankan bentuk persegi berstruktur rapi untuk komponen fungsional enterprise.
- **Aturan:** R-11 (hindari kapsul bulat tanpa tujuan), R-37 (arah desain tegas).

## Membangun Identitas Visual yang Autentik

- **Pahami Konteks Pengguna:** Siapa yang menggunakan antarmuka ini dan di lingkungan apa? Desain untuk teknisi lapangan berbeda dengan desain untuk desainer grafis.
- **Pernyataan Karakter Produk (Product Persona):** Sebelum memilih warna dan tipografi, tentukan 3 kata sifat yang mencerminkan rasa produk: misalnya *presisi*, *tenang*, *dapat diandalkan*. Segala dekorasi yang bertentangan dengan kata sifat tersebut harus disingkirkan.
