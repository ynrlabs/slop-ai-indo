# DESIGN.md - Preset: Enterprise SaaS (Standar n8n & Linear)

> **Arah Desain:** Kanvas terang bersih, sudut presisi 4px-6px, hierarki elegan ala SaaS kelas enterprise (n8n, Linear, Stripe, Notion).
> Dokumen ini memandu agen AI membangun antarmuka yang terstruktur, padat informasi, dan terasa seperti hasil kerajinan desainer profesional (*human-crafted*).

---

## 1. Prinsip Inti

1. **Presisi di atas dekorasi.** Grid, sudut, dan garis yang konsisten menciptakan kesan profesional.
2. **Padat tapi terbaca.** Tampilkan banyak informasi tanpa terasa sesak; gunakan hierarki, bukan warna.
3. **Satu aksen, banyak netral.** Warna aksen hanya untuk aksi utama dan status aktif.
4. **Konsistensi mutlak.** Komponen yang sama selalu terlihat dan berperilaku sama.

---

## 2. Token Desain

```css
:root {
  /* Surface */
  --bg-canvas:  #f8fafc;  /* alternatif: #f1f5f9 */
  --bg-surface: #ffffff;
  --bg-subtle:  #f1f5f9;  /* header tabel, hover baris */
  --bg-hover:   #f8fafc;

  /* Border */
  --border:        #e2e8f0;
  --border-strong: #cbd5e1;  /* hover/fokus */

  /* Teks */
  --text-primary:   #0f172a;
  --text-secondary: #64748b;
  --text-muted:     #94a3b8;  /* placeholder, disabled */

  /* Aksen tunggal (pilih SATU) */
  --accent:        #4f46e5;  /* alternatif: #059669, #2563eb */
  --accent-hover:  #4338ca;
  --accent-soft:   rgba(79, 70, 229, 0.08);

  /* Status */
  --success: #059669;  --warning: #d97706;  --danger: #dc2626;  --info: #2563eb;

  /* Radius */
  --radius-sm: 3px;  /* badge */
  --radius:    4px;  /* input, tombol kecil */
  --radius-lg: 6px;  /* kartu, panel, modal */

  /* Bayangan */
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.05);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08);  /* dropdown, popover */
  --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.12); /* modal */
}
```

---

## 3. Geometri: Aturan Sudut Tegas

Hindari pembulatan berlebihan. Aplikasi profesional mengutamakan keteraturan grid.

| Elemen | Radius | Catatan |
|---|---|---|
| Kartu, panel, modal | `6px` | Maksimal; jangan lebih |
| Node workflow | `5px` | - |
| Tombol, input, select | `4px` | **DILARANG** pill/kapsul |
| Badge, status, tag | `3px` | Hindari badge oval |
| Avatar | `50%` | Satu-satunya pengecualian bulat |

* **Border:** `1px solid var(--border)`; hover/fokus naik ke `--border-strong`.
* **Larangan:** `rounded-full` pada tombol, glow neon, dan border berpendar.
* **Bayangan:** hanya `--shadow-sm` pada kartu/node; `--shadow-md/lg` untuk elemen melayang.

---

## 4. Palet Warna

* **Kanvas:** `--bg-canvas`, dengan dot grid opsional (`#cbd5e1`, titik `1px`, jarak `20px`) khusus area canvas workflow.
* **Surface:** putih solid `#ffffff` untuk kartu, node, panel.
* **Aksen tunggal** dipakai untuk: tombol primer, tautan, item navigasi aktif, fokus, dan seleksi.
* **Status** (success, warning, danger) hanya untuk makna, bukan dekorasi.
* **DILARANG:** gradien ungu-cyan atau ungu-pink pada latar dan tombol, serta lebih dari satu warna aksen.

---

## 5. Tipografi & Ikon

* **Sans:** `Inter`, `Geist`, `Plus Jakarta Sans`, `system-ui`, sans-serif.
* **Mono:** `JetBrains Mono` atau `Fira Code`, hanya untuk kode, ID, variabel, dan JSON.

| Peran | Ukuran | Weight | Catatan |
|---|---|---|---|
| Judul halaman | 24px | 600 | `letter-spacing: -0.01em` |
| Judul section | 16-18px | 600 | - |
| Body / isi tabel | 14px | 400 | `line-height: 1.5` |
| Label form | 13px | 500 | warna `--text-primary` |
| Caption / metadata | 12px | 400 | warna `--text-secondary` |
| Angka (metrik, tabel) | 14px+ | 500 | `font-variant-numeric: tabular-nums` |

* **Ikon:** SVG semantik (Lucide, Heroicons, Tabler), stroke seragam `1.5px-1.75px`, ukuran `16px` (inline) atau `20px` (navigasi).
* **DILARANG** emoji dekoratif pada tombol, heading, atau navigasi.

---

## 6. Tata Letak Aplikasi

| Area | Spesifikasi |
|---|---|
| Sidebar | `240px`, latar `--bg-surface`, border-right hairline; mode ringkas `56px` (ikon saja) |
| Header | `48px-56px`, sticky, border-bottom hairline |
| Konten | padding `24px-32px`, lebar maksimum `1280px` (kecuali canvas) |
| Grid | basis `4px`; spasi `4 / 8 / 12 / 16 / 24 / 32` |

* **Item sidebar:** tinggi `32px`, font `14px`; aktif: latar `--accent-soft`, teks `--accent`, weight 500. Hover: latar `--bg-subtle`.
* **Header halaman:** judul kiri, aksi utama kanan (maksimal satu tombol primer per layar).
* **Breadcrumb** `13px`, pemisah `/`.

---

## 7. Komponen Inti

**Tombol** (tinggi `32px` kecil, `36px` standar)
* *Primary:* latar `--accent`, teks putih; hover `--accent-hover`.
* *Secondary:* latar putih, border `--border-strong`, teks `--text-primary`; hover latar `--bg-subtle`.
* *Ghost:* tanpa border, teks `--text-secondary`; hover latar `--bg-subtle`.
* *Destructive:* latar `--danger`, teks putih; konfirmasi wajib untuk aksi permanen.
* Padding horizontal `12px-14px`, ikon `16px` dengan jarak `6px`.

**Input & Form**
* Tinggi `36px`, radius `4px`, border `--border`, placeholder `--text-muted`.
* Fokus: border `--accent` + ring `0 0 0 3px var(--accent-soft)`.
* Error: border `--danger`, pesan `12px` di bawah field dengan ikon. Label selalu di atas field, bukan placeholder-sebagai-label.

**Tabel**
* Header `12px`, weight 500, warna `--text-secondary`, latar `--bg-subtle`.
* Tinggi baris `40px-44px`; pemisah border-bottom hairline; hover baris `--bg-hover`.
* Angka rata kanan, teks rata kiri, aksi baris di kolom terakhir (muncul saat hover atau menu `...`).
* Dukungan: sortir, filter, seleksi baris (checkbox), dan paginasi di kaki tabel.

**Badge & Status**
* Radius `3px`, padding `2px 8px`, font `12px` weight 500.
* Gaya lembut: latar tint 10% dari warna status, teks warna status penuh.
* Dot status `6px` bersama teks; warna tidak boleh jadi satu-satunya penanda.

**Kartu**
* Latar putih, border `--border`, radius `6px`, padding `16px` (padat) atau `24px`.
* Hover (jika interaktif): border `--border-strong`. Tanpa efek angkat besar.

**Modal & Popover**
* Modal lebar `480px-640px`, radius `6px`, `--shadow-lg`, overlay `rgba(15,23,42,0.4)`. Header, isi, footer dengan aksi di kanan.
* Dropdown/popover: `--shadow-md`, radius `6px`, item tinggi `32px`.

**Tab**
* Garis bawah `2px solid var(--accent)` pada tab aktif, tanpa latar pill.

**Toast**
* Pojok kanan bawah, lebar `360px`, radius `6px`, border hairline, ikon status di kiri, hilang otomatis `4s-6s`.

**Empty State**
* Ikon `20px` abu-abu, judul `16px`, deskripsi satu kalimat, satu tombol aksi. Tanpa ilustrasi berlebihan.

**Skeleton Loading**
* Blok `--bg-subtle` dengan denyut halus; hindari spinner penuh layar.

---

## 8. Workflow UI (Node & Canvas)

* **Canvas:** latar `--bg-canvas` dengan dot grid `#cbd5e1` setiap `20px`; zoom `25%-200%`, pan dengan drag.
* **Node utama:** putih, border `--border`, radius `5px`, `--shadow-sm`, lebar `220px-280px`, padding `12px`.
  * Struktur: ikon `20px` di kiri, judul `14px` weight 500, subjudul `12px` `--text-secondary`.
  * Terpilih: border `--accent` + ring `0 0 0 3px var(--accent-soft)`. Hover: border `--border-strong`.
  * Status eksekusi: dot atau ikon kecil di pojok (sukses hijau, error merah, berjalan biru).
* **Port (handle):** lingkaran `8px`, latar putih, border `1.5px solid #94a3b8`; hover berubah ke `--accent`.
* **Konektor:** kurva Bezier `stroke: #94a3b8; stroke-width: 1.5px; fill: none;`; hover/terpilih `--accent`. Panah kecil di ujung, label opsional `11px` di tengah garis.
* **Sub-node (satelit):** menggantung di bawah node utama, dihubungkan garis putus-putus vertikal (`stroke-dasharray: 4 3`), ukuran lebih kecil (`160px-200px`).
* **Panel properti:** panel kanan `320px-400px` saat node dipilih, dengan tab (Parameter, Pengaturan, Output) dan blok JSON mono.
* **Toolbar canvas:** melayang di bawah/kiri, radius `6px`, border hairline, berisi zoom, fit view, dan undo/redo.
* **Mini-map** opsional di pojok kanan bawah, radius `4px`.

---

## 9. State & Interaksi

* **Transisi:** `120ms-150ms ease-out` pada warna, border, dan latar saja. Tanpa bounce atau animasi dekoratif.
* **Fokus keyboard:** outline `2px solid var(--accent)`, offset `2px`; jangan dihapus.
* **Disabled:** opasitas `0.5`, kursor `not-allowed`.
* **Command palette** (`Ctrl K`): modal `560px`, radius `6px`, dikelompokkan per kategori, dengan badge `<kbd>` (radius `3px`, mono `11px`).
* **Shortcut** ditampilkan di tooltip dan menu; tooltip muncul setelah `400ms`.
* Hormati `prefers-reduced-motion`.

---

## 10. Responsif

| Breakpoint | Perilaku |
|---|---|
| ≥ 1280px | Sidebar penuh, panel properti berdampingan |
| 1024-1279px | Sidebar ringkas (ikon), panel properti melayang |
| 768-1023px | Sidebar menjadi drawer |
| < 768px | Satu kolom; tabel scroll horizontal; canvas workflow mode lihat saja |

* Target sentuh minimal `40px` pada perangkat sentuh.
* Halaman tidak boleh scroll menyamping; tabel dan kode scroll di kontainernya sendiri.

---

## 11. Aksesibilitas

* Kontras teks minimal WCAG AA (`4.5:1`); periksa `--text-muted` pada latar putih.
* Semua kontrol dapat dioperasikan lewat keyboard; urutan tab logis.
* Ikon-saja wajib punya `aria-label`; status tidak bergantung pada warna semata.
* Gunakan `aria-current="page"` pada navigasi aktif dan `aria-live` untuk toast.

---

## 12. Checklist Cepat

**Lakukan:** kanvas terang `#f8fafc`, surface putih, sudut `3-6px`, border hairline, satu aksen, ikon stroke seragam, angka tabular, satu tombol primer per layar.
**Hindari:** tombol pill, `rounded-full` selain avatar, glow neon, gradien ungu-cyan/pink, emoji dekoratif, bayangan tebal, lebih dari satu warna aksen, dan status yang hanya dibedakan lewat warna.