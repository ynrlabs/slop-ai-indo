# DESIGN.md - Preset: Developer Tooling & Dokumentasi API (Standar Tailwind Docs, Cloudflare, Prisma)

> **Arah Desain:** Tata letak tiga kolom (three-pane), blok kode presisi dengan syntax highlighting bersih, badge tombol keyboard (KBD), dan split-screen API reference.
> Dokumen ini memandu agen AI membangun portal dokumentasi developer, halaman API reference, dan antarmuka devtools yang rapi, cepat dipindai, dan bebas dekorasi berlebihan.

---

## 1. Prinsip Inti

1. **Keterbacaan di atas estetika.** Pengguna datang untuk menyelesaikan masalah, bukan mengagumi desain.
2. **Mudah dipindai.** Heading jelas, paragraf pendek, kode menonjol dari teks.
3. **Navigasi selalu terlihat.** Pengguna harus tahu posisi mereka di dokumentasi setiap saat.
4. **Light dan dark setara.** Keduanya wajib didukung dengan kualitas yang sama.

---

## 2. Token Desain

```css
:root {
  /* Surface */
  --bg-canvas:  #ffffff;
  --bg-sidebar: #f8fafc;
  --bg-code:    #f1f5f9;
  --bg-hover:   #f1f5f9;

  /* Border */
  --border:        #e2e8f0;
  --border-strong: #cbd5e1;

  /* Teks */
  --text-primary:   #0f172a;
  --text-secondary: #475569;
  --text-muted:     #64748b;

  /* Aksen & tautan (SATU aksen) */
  --accent:      #2563eb;
  --accent-soft: rgba(37, 99, 235, 0.08);

  /* Fungsional */
  --info: #3b82f6;  --warning: #f59e0b;  --success: #10b981;  --danger: #ef4444;
}

[data-theme="dark"] {
  --bg-canvas:  #0b0f19;
  --bg-sidebar: #070a11;
  --bg-code:    #0f172a;
  --bg-hover:   #111827;

  --border:        #1e293b;
  --border-strong: #334155;

  --text-primary:   #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted:     #64748b;

  --accent:      #60a5fa;
  --accent-soft: rgba(96, 165, 250, 0.12);
}
```

---

## 3. Tata Letak Three-Pane

| Kolom | Lebar | Perilaku |
|---|---|---|
| Sidebar kiri | `260px` (sticky) | Scroll independen, `top: header-height` |
| Konten tengah | fluid, maks `720px` (teks) | Teks `64ch-80ch`, padding `0 48px` |
| TOC kanan | `220px` (sticky) | Hanya muncul di layar ≥ `1280px` |

* **Header global:** tinggi `56px`, sticky, border-bottom hairline, berisi logo, kolom pencarian (`Ctrl K`), versi dokumen, dan toggle tema.
* **Lebar total maksimum:** `1440px`, di-center.
* **Halaman API reference:** konten tengah melebar dan terbagi dua (lihat bagian 8).

### Sidebar Kiri
* Font `13px-14px`, weight 400; grup berjudul `12px`, weight 600, uppercase opsional, warna `--text-muted`.
* **Item aktif:** garis aksen vertikal `2px` di sisi kiri, teks `--accent`, weight 500. Alternatif: latar `--accent-soft` dengan `border-radius: 4px`.
* **Hover:** latar `--bg-hover`, teks `--text-primary`.
* Grup bisa dilipat dengan chevron `16px`; tinggi item `32px`; indentasi level dua `12px`.

### TOC Kanan ("Pada Halaman Ini")
* Judul `12px`, weight 600. Daftar `13px`, indentasi `h3` sebesar `12px`.
* Item aktif mengikuti posisi scroll (Intersection Observer), ditandai teks `--text-primary` dan garis kiri `--accent`.
* Item tidak aktif berwarna `--text-muted`.

---

## 4. Geometri

* **Panel, input, kontainer kode:** `border-radius: 6px`.
* **Badge, KBD, tag kecil:** `3px-4px`.
* **Tombol:** `6px`. DILARANG pill atau sudut bulat balon.
* **Border:** selalu `1px solid var(--border)`; hindari bayangan kecuali pada dropdown dan modal pencarian (`0 8px 24px rgba(0,0,0,0.15)`, dark: `rgba(0,0,0,0.5)`).

---

## 5. Tipografi

* **Sans:** `Inter`, `Geist Sans`, `system-ui`, sans-serif.
* **Mono:** `JetBrains Mono`, `Fira Code`, `Geist Mono`, monospace; ligatur hanya aktif di blok kode.

| Peran | Ukuran | Weight | Catatan |
|---|---|---|---|
| H1 | 36px | 700 | `letter-spacing: -0.02em`, satu per halaman |
| H2 | 24px | 600 | margin atas `48px`, border-bottom opsional |
| H3 | 18px | 600 | margin atas `32px` |
| Body | 16px | 400 | `line-height: 1.75` |
| Sidebar / TOC | 13-14px | 400-500 | - |
| Inline code | 0.875em | 500 | latar `--bg-code`, border hairline, padding `2px 6px`, radius `4px` |

* Heading memiliki anchor link `#` yang muncul saat hover (warna `--text-muted`).
* Tautan di konten: warna `--accent`, underline tipis dengan `text-underline-offset: 3px`.
* DILARANG gradien teks warna-warni pada judul teknis.

---

## 6. Blok Kode & Syntax Highlighting

### Kontainer
* Latar `--bg-code` (dark: `#0f172a`), border `1px solid var(--border-strong)`, radius `6px`, padding `14px-16px`.
* Font `13px-14px`, `line-height: 1.65`, scroll horizontal di dalam kontainer (jangan wrap).
* **Header blok (opsional):** nama berkas (contoh `schema.prisma`) atau bahasa di kiri, tombol salin di kanan, dipisahkan border-bottom hairline.

### Tombol Salin
* Pojok kanan atas, ukuran `28px`, ikon `16px`, muncul saat hover blok (selalu tampak di perangkat sentuh).
* Setelah klik: ikon berubah menjadi centang dan label "Tersalin" selama `2s`, transisi `150ms`.
* Wajib `aria-label="Salin kode"` dan `aria-live="polite"` untuk status.

### Tab Kode
* Untuk varian bahasa atau package manager (`npm`, `pnpm`, `yarn`, `bun`).
* Tab aktif: border-bottom `2px solid var(--accent)`, teks `--text-primary`. Pilihan diingat lintas halaman (localStorage).

### Fitur Blok
* **Line highlight:** latar `--accent-soft` dengan border kiri `2px solid var(--accent)`.
* **Diff:** baris tambah `rgba(16,185,129,0.12)`, baris hapus `rgba(239,68,68,0.12)`; awalan `+` / `-` tetap tampil agar tidak bergantung warna.
* **Nomor baris:** hanya untuk blok panjang atau yang dirujuk; warna `--text-muted`, tidak bisa diseleksi.

### Palet Syntax (Dark / Light)

| Token | Dark | Light |
|---|---|---|
| Keyword | `#c4b5fd` | `#7c3aed` |
| String | `#86efac` | `#15803d` |
| Function | `#7dd3fc` | `#0369a1` |
| Number / konstanta | `#fdba74` | `#c2410c` |
| Komentar | `#64748b` (italic) | `#94a3b8` (italic) |
| Properti / variabel | `#e2e8f0` | `#0f172a` |
| Operator / tanda baca | `#94a3b8` | `#64748b` |

* Gunakan maksimal 5-6 warna per blok; jangan membuat pelangi.

### Badge KBD (`<kbd>`)
* Radius `3px`, padding `2px 6px`, font mono `11px-12px`, weight 500.
* Light: latar `#f1f5f9`, border `1px solid #cbd5e1`, border-bottom `2px` untuk kesan tombol.
* Dark: latar `#1e293b`, border `1px solid #334155`.
* Kombinasi ditulis terpisah: `<kbd>Ctrl</kbd> + <kbd>K</kbd>`; tampilkan `⌘` untuk macOS dan `Ctrl` untuk lainnya.

---

## 7. Callout & Komponen Dokumen

### Callout
Struktur: border kiri `3px`, radius `0 6px 6px 0`, padding `12px 16px`, judul `14px` weight 600, isi `14px`.

| Tipe | Border kiri | Latar light | Latar dark |
|---|---|---|---|
| Info | `#3b82f6` | `#eff6ff` | `rgba(59,130,246,0.1)` |
| Warning | `#f59e0b` | `#fffbeb` | `rgba(245,158,11,0.1)` |
| Tip / Solusi | `#10b981` | `#f0fdf4` | `rgba(16,185,129,0.1)` |
| Danger | `#ef4444` | `#fef2f2` | `rgba(239,68,68,0.1)` |

* Setiap callout wajib punya judul teks (contoh "Catatan", "Peringatan"), bukan hanya warna.
* Ikon fungsional sederhana (info, segitiga, centang) ukuran `16px`; DILARANG ikon sparkle atau sihir.

### Komponen Lain
* **Breadcrumb:** `13px`, pemisah `/`, item terakhir `--text-primary`.
* **Pager (Sebelumnya / Berikutnya):** dua kartu di akhir halaman, border hairline, label kecil `12px` di atas judul halaman.
* **Tautan "Edit halaman ini"** dan tanggal pembaruan terakhir di kaki konten, `13px`, `--text-muted`.
* **Tabel:** header `12px` uppercase opsional, warna `--text-secondary`; pemisah baris border-bottom hairline; scroll horizontal pada layar sempit.
* **Stepper / langkah instalasi:** angka dalam lingkaran `24px` bergaris hairline, terhubung garis vertikal `1px`.

---

## 8. API Reference (Split-Screen)

* **Kolom kiri (deskripsi):** penjelasan endpoint, parameter, respons.
* **Kolom kanan (contoh kode):** `sticky`, latar `--bg-code`, berisi request dan response; pilihan bahasa lewat tab.
* **Method badge:** font mono `11px`, weight 600, radius `4px`, padding `2px 8px`.

| Method | Teks | Latar (dark) |
|---|---|---|
| GET | `#34d399` | `rgba(16,185,129,0.12)` |
| POST | `#60a5fa` | `rgba(59,130,246,0.12)` |
| PUT / PATCH | `#fbbf24` | `rgba(245,158,11,0.12)` |
| DELETE | `#f87171` | `rgba(239,68,68,0.12)` |

* **Path endpoint:** font mono, parameter dinamis (`{id}`) diberi warna `--accent`.
* **Tabel parameter:** kolom nama (mono), tipe (mono, `--text-muted`), wajib/opsional (badge kecil), deskripsi.
* **Kode status respons:** `2xx` hijau, `4xx` kuning, `5xx` merah, selalu disertai angka dan teks.

---

## 9. Pencarian & Interaksi

* **Trigger:** kolom di header (tinggi `36px`, radius `6px`) dengan badge `<kbd>⌘ K</kbd>` di kanan.
* **Modal pencarian:** lebar `640px`, radius `8px`, hasil dikelompokkan per bagian, navigasi dengan panah dan `Enter`, tutup dengan `Esc`.
* **Transisi:** `150ms ease-out` pada warna, border, dan background saja.
* **Fokus keyboard:** outline `2px solid var(--accent)`, offset `2px`; jangan dihapus.
* **Scroll anchor:** `scroll-margin-top` sebesar tinggi header + `16px` agar heading tidak tertutup.
* Hormati `prefers-reduced-motion` dan `prefers-color-scheme`.

---

## 10. Responsif

| Breakpoint | Perilaku |
|---|---|
| ≥ 1280px | Tiga kolom penuh |
| 1024-1279px | TOC kanan disembunyikan; TOC menjadi dropdown "Pada halaman ini" di atas konten |
| 768-1023px | Sidebar menjadi drawer lewat tombol menu |
| < 768px | Satu kolom; contoh kode API tampil di bawah deskripsi, bukan di samping |

* Target sentuh minimal `40px` pada mobile.
* Blok kode dan tabel scroll horizontal di dalam kontainernya sendiri; halaman tidak boleh scroll menyamping.

---

## 11. Aksesibilitas

* Kontras teks minimal WCAG AA (`4.5:1`), termasuk warna syntax dan komentar kode.
* Struktur heading berurutan (tidak melompat dari h2 ke h4).
* Sidebar memakai `<nav aria-label>`; item aktif memakai `aria-current="page"`.
* Informasi tidak boleh bergantung pada warna saja (diff, status, method badge).

---

## 12. Checklist Cepat

**Lakukan:** tiga kolom, lebar baca terukur, TOC mengikuti scroll, tombol salin di setiap blok kode, KBD untuk shortcut, callout berjudul, light dan dark setara.
**Hindari:** ikon sparkle/sihir, pendaran neon, gradien teks pada judul, sudut bulat balon, blok kode yang di-wrap paksa, warna syntax lebih dari 6 hue, dan informasi yang hanya dibedakan lewat warna.