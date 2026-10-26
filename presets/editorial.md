# DESIGN.md - Preset: Editorial & Content (Standar Substack & Stripe Press)

> **Arah Desain:** Kanvas hangat (warm off-white), tipografi serif kelas atas, tata letak lapang berpusat pada tulisan (Substack, Stripe Press, ReadCV).
> Dokumen ini memandu agen AI menghasilkan antarmuka berbasis konten dan publikasi yang anggun, humanis, dan berwibawa.

---

## 1. Prinsip Inti

1. **Tulisan adalah antarmuka.** Setiap keputusan desain melayani kenyamanan membaca, bukan dekorasi.
2. **Hierarki dari tipografi.** Skala ukuran, weight, dan spasi, bukan warna-warni.
3. **Ruang kosong adalah fitur.** Margin lapang memberi kesan tenang dan berwibawa.
4. **Terasa seperti buku cetak.** Hangat, tenang, dan tahan lama; bukan dashboard SaaS.

---

## 2. Token Desain

```css
:root {
  /* Surface */
  --bg-canvas: #fcfbf9;  /* krem hangat */
  --bg-panel:  #f1efe9;  /* kutipan, kode, kotak catatan */
  --bg-hover:  #f6f4ef;

  /* Border */
  --border:        #e7e5df;
  --border-strong: #d6d3cb;

  /* Tinta */
  --ink-primary:   #1c1917; /* stone-900 */
  --ink-secondary: #57534e; /* stone-600 */
  --ink-muted:     #78716c; /* stone-500: caption, metadata */

  /* Aksen tunggal (pilih SATU) */
  --accent:       #c2410c; /* terracotta; alternatif: #4d7c0f olive, #1e3a8a navy */
  --accent-hover: #9a3412;
  --selection:    rgba(194, 65, 12, 0.15);

  /* Font */
  --font-serif: "Newsreader", "Lora", "Charter", Georgia, serif;
  --font-sans:  "Inter", "Source Sans Pro", system-ui, sans-serif;
  --font-mono:  "JetBrains Mono", ui-monospace, monospace;
}

[data-theme="dark"] {
  --bg-canvas: #1a1816;  /* arang hangat, bukan hitam murni */
  --bg-panel:  #232019;
  --bg-hover:  #201e1a;

  --border:        #35312b;
  --border-strong: #4a453d;

  --ink-primary:   #f5f2ec;
  --ink-secondary: #b8b2a7;
  --ink-muted:     #8f897e;

  --accent:       #e8825a;
  --accent-hover: #f0a07f;
  --selection:    rgba(232, 130, 90, 0.25);
}

::selection { background: var(--selection); }
```

---

## 3. Tipografi

* **Heading:** serif berkarakter (`Newsreader`, `Lora`, `Merriweather`, atau `Charter`).
* **Body:** sans-serif humanis (`Inter`, `Source Sans Pro`, `system-ui`). Alternatif: body serif untuk esai panjang bergaya buku.
* **Mono:** hanya untuk potongan kode atau data, tidak untuk dekorasi.

| Peran | Font | Ukuran | Weight | Catatan |
|---|---|---|---|---|
| Judul artikel (H1) | Serif | 40-56px | 600 | `line-height: 1.1`, `letter-spacing: -0.02em` |
| Subjudul / deck | Serif | 20-24px | 400 | warna `--ink-secondary`, `line-height: 1.4` |
| H2 | Serif | 28-32px | 600 | margin atas `56px`, bawah `16px` |
| H3 | Serif | 22-24px | 600 | margin atas `40px` |
| Body | Sans | 17-18px | 400 | `line-height: 1.7` |
| Metadata / caption | Sans | 13-14px | 400-500 | warna `--ink-muted` |
| Label / kategori | Sans | 12px | 600 | uppercase, `letter-spacing: 0.08em` |

* **Measure:** `65ch-75ch` untuk teks bacaan, tidak pernah lebih.
* **Ritme paragraf:** jarak antar-paragraf `1.25em`, tanpa indentasi (gaya web), atau indentasi `1.5em` tanpa jarak (gaya buku, pilih salah satu).
* **Aktifkan** `font-feature-settings: "liga", "kern"` dan `text-rendering: optimizeLegibility`.
* **Gunakan** tanda kutip tipografis (“ ”), apostrof (’), dan tanda pisah (–, —) yang benar.
* DILARANG teks rata kanan-kiri (*justify*) tanpa `hyphens: auto`.

---

## 4. Palet Warna

* **Kanvas:** `--bg-canvas` hangat. DILARANG putih murni `#fff` dan hitam murni `#000`.
* **Tinta:** teks utama `--ink-primary`, sekunder `--ink-secondary`, metadata `--ink-muted`.
* **Aksen tunggal** dipakai hanya untuk: tautan, tombol utama, tanda kutip, drop cap, dan penanda aktif.
* **Hierarki** dibangun lewat ukuran dan weight; warna aksen tidak boleh dipakai untuk menghias heading.
* DILARANG gradien, pendaran neon, dan lebih dari satu warna aksen.

---

## 5. Geometri & Finishing

* **Radius:** `2px-4px` untuk tombol, input, dan gambar; kartu bisa benar-benar siku. DILARANG pill dan sudut bulat balon.
* **Border:** hairline `1px solid var(--border)`. Bayangan hampir tidak dipakai; bila perlu: `0 1px 2px rgba(28,25,23,0.06)`.
* **Pemisah seksi:** `hr` 1px dengan lebar penuh kolom, atau ornamen tipografi (`* * *`, `❦`, atau `§`) di tengah, warna `--ink-muted`.
* **Gambar:** bingkai tipis atau tanpa bingkai, radius `2px`, caption `13px` italic di bawah, rata kiri.

---

## 6. Tata Letak

| Konteks | Spesifikasi |
|---|---|
| Kolom artikel | maks `680px` (≈ 65-75ch), di-center |
| Gambar / figur lebar | boleh keluar kolom hingga `960px` |
| Gambar full-bleed | `100%` lebar viewport, dipakai hemat |
| Padding samping (mobile) | `20px-24px` |
| Header situs | tinggi `64px`, tidak sticky berat; boleh menyusut saat scroll |
| Jarak antar-section | `72px-96px` |

* **Header artikel:** label kategori, judul, subjudul, lalu baris penulis (avatar `36px` bulat, nama, tanggal, waktu baca) dalam satu baris.
* **Beranda / arsip:** daftar vertikal satu kolom (judul serif, ringkasan 2 baris, metadata), dipisah `hr` hairline. Grid kartu hanya untuk koleksi visual (contoh: buku), maksimal 3 kolom.
* **Footer:** minimalis, tautan sekunder `14px`, dengan blok berlangganan bila relevan.

---

## 7. Komponen Editorial

**Kutipan Blok (Blockquote)**
* Border kiri `2px solid var(--accent)`, padding kiri `24px`, font serif italic `22px`, warna `--ink-primary`.
* Atribusi di bawah: `14px`, sans, `--ink-muted`, diawali tanda pisah (—).

**Pull Quote**
* Boleh keluar kolom, font serif `28-32px`, border atas dan bawah hairline, rata tengah atau kiri. Maksimal satu per 800 kata.

**Drop Cap**
* Hanya pada paragraf pembuka artikel panjang. Serif, tinggi 3 baris, warna `--accent` atau `--ink-primary`.
* Pakai `initial-letter: 3` dengan cadangan `float: left`.

**Catatan Kaki & Sidenote**
* Angka superskrip warna `--accent`; catatan di akhir artikel atau sebagai sidenote di margin kanan (layar ≥ `1200px`), `14px`, `--ink-secondary`.

**Kotak Catatan (Aside)**
* Latar `--bg-panel`, border hairline, radius `4px`, padding `20px 24px`, judul kecil uppercase `12px`.

**Daftar**
* Penanda bullet warna `--ink-muted`; jarak antar-item `0.5em`. Daftar bernomor memakai angka serif.

**Kode & Tabel**
* Inline code: latar `--bg-panel`, radius `3px`, padding `1px 5px`.
* Tabel sederhana: tanpa garis vertikal, hanya border-bottom hairline, header uppercase `12px`.

**Tautan**
* Warna `--ink-primary` dengan underline aksen, atau warna `--accent` dengan underline tipis. Pilih satu gaya secara konsisten.
* `text-decoration-thickness: 1px; text-underline-offset: 3px;` hover: ketebalan `2px`, warna `--accent-hover`.

**Tombol**
* *Primary:* latar `--ink-primary`, teks `--bg-canvas`, radius `3px`, tinggi `40px`, font sans 500.
* *Secondary:* transparan, border `--border-strong`, teks `--ink-primary`.
* Hover hanya mengubah warna; tanpa efek angkat atau bayangan.

**Berlangganan / Newsletter**
* Satu input dan satu tombol dalam satu baris, dengan teks pendukung singkat `14px`. Tidak ada pop-up yang menutup bacaan.

**Progress Baca**
* Garis `2px` di tepi atas, warna `--accent`; opsional.

---

## 8. Motion & Interaksi

* **Transisi:** `150ms-200ms ease` pada warna dan border saja.
* **Fokus keyboard:** outline `2px solid var(--accent)`, offset `3px`.
* **Tanpa** parallax, animasi masuk berlebihan, atau efek hover yang menggeser tata letak.
* Hormati `prefers-reduced-motion` dan `prefers-color-scheme`.

---

## 9. Responsif

| Breakpoint | Perilaku |
|---|---|
| ≥ 1200px | Sidenote tampil di margin; figur lebar aktif |
| 768-1199px | Satu kolom, sidenote menjadi catatan kaki |
| < 768px | Judul turun ke `32-36px`, body `17px`, padding `20px`; menu menjadi tombol sederhana |

* Jangan perkecil body di bawah `16px`.
* Gambar selalu `max-width: 100%`, tinggi otomatis.

---

## 10. Aksesibilitas

* Kontras teks minimal WCAG AA (`4.5:1`); periksa `--ink-muted` di atas `--bg-canvas`.
* Heading berurutan; judul artikel adalah satu-satunya `h1`.
* Tautan dapat dikenali tanpa warna (garis bawah wajib).
* Gambar informatif wajib punya `alt`; dekoratif memakai `alt=""`.
* Dukung zoom teks hingga 200% tanpa kehilangan tata letak.

---

## 11. Checklist Cepat

**Lakukan:** kanvas krem hangat, heading serif, measure 65-75ch, satu aksen tinta, hairline `1px`, tanda kutip tipografis, ruang kosong lapang, mode gelap hangat.
**Hindari:** putih/hitam murni, gradien, pill dan sudut bulat balon, bayangan tebal, pop-up yang menutup bacaan, warna aksen ganda, teks justify tanpa hyphenation, dan animasi dekoratif.