# DESIGN.md - Preset: Minimalist Monochrome (Standar Raycast & Teenage Engineering)

> **Arah Desain:** Estetika monokromatik hitam-putih murni, tipografi grid ketat, rasio kontras tertinggi, zero-gimmick.
> Dokumen ini memandu agen AI menciptakan desain minimalis radikal yang berani, fungsional, dan bebas dari warna dekoratif artifisial.

---

## 1. Prinsip Inti

1. **Tipografi adalah dekorasi.** Skala, weight, dan posisi menggantikan warna dan efek.
2. **Garis adalah struktur.** Border solid menentukan ruang; tidak ada bayangan.
3. **Kontras maksimum.** Hitam dan putih murni; abu-abu hanya untuk hierarki teks.
4. **Zero-gimmick.** Setiap elemen harus punya fungsi. Jika dihapus tidak mengubah makna, hapus.

---

## 2. Token Desain

```css
:root {
  /* Terang (default) */
  --bg:             #ffffff;
  --bg-inverse:     #000000;
  --text-primary:   #000000;
  --text-secondary: #525252;
  --text-muted:     #737373;
  --text-inverse:   #ffffff;

  --border:        #e5e5e5;  /* garis penyekat halus */
  --border-strong: #000000;  /* garis struktural */

  --hover-bg: #f5f5f5;

  /* Status (opsional, minimal) */
  --danger: #dc2626;

  /* Radius */
  --radius: 0px;       /* default; maksimal 3px */

  /* Font */
  --font-sans: "Geist", "Inter", "Helvetica Neue", system-ui, sans-serif;
  --font-mono: "Geist Mono", "JetBrains Mono", ui-monospace, monospace;
}

[data-theme="dark"] {
  --bg:             #000000;
  --bg-inverse:     #ffffff;
  --text-primary:   #ffffff;
  --text-secondary: #a3a3a3;
  --text-muted:     #8a8a8a;
  --text-inverse:   #000000;

  --border:        #262626;
  --border-strong: #ffffff;

  --hover-bg: #141414;
}

::selection { background: var(--bg-inverse); color: var(--text-inverse); }
```

---

## 3. Geometri & Garis

* **Sudut:** `0px` secara default. Maksimal `3px` untuk tombol dan kartu bila diperlukan. DILARANG pill, `rounded-full`, dan sudut bulat balon (avatar boleh bulat, atau tetap persegi demi konsistensi).
* **Hierarki garis:**

| Garis | Spesifikasi | Fungsi |
|---|---|---|
| Struktural | `2px solid var(--border-strong)` | Header, pemisah section utama, kartu penting |
| Standar | `1px solid var(--border-strong)` | Tombol sekunder, input, kartu |
| Halus | `1px solid var(--border)` | Pemisah baris tabel, daftar |

* **Larangan total:** `box-shadow` (termasuk bayangan halus), glow, blur, dan `backdrop-filter`. Kedalaman dibuat dari border solid dan spasi.
* **Elemen melayang** (dropdown, modal) dibedakan dengan border `1px solid var(--border-strong)` dan latar solid, bukan bayangan.

---

## 4. Palet Warna

* **Terang:** latar `#ffffff`, teks `#000000`, pendukung `#525252`.
* **Gelap:** latar `#000000`, teks `#ffffff`, pendukung `#a3a3a3`.
* **Garis halus:** `#e5e5e5` (terang) / `#262626` (gelap).
* **Nol warna dekoratif:** 0% gradien, 0% aksen jenuh. Daya tarik dibangun dari proporsi ukuran, bobot garis, dan kerapatan tata letak.
* **Inversi sebagai penekanan:** blok hitam dengan teks putih (atau sebaliknya) menggantikan warna aksen untuk elemen yang perlu menonjol.
* **Status minimal:**
  * Netral: dot solid `6px` atau simbol teks (`●`, `○`, `×`).
  * Error kritis saja: `#dc2626`, ukuran kecil (dot atau teks pesan), tidak untuk latar blok besar.

---

## 5. Tipografi

* **Sans:** `Geist`, `Inter`, `Helvetica Neue`, font sistem.
* **Mono:** `Geist Mono` atau `JetBrains Mono` untuk label sistem, timestamp, kode, indeks, dan data terstruktur.

Hierarki dibangun dari kontras ekstrem antara skala dan weight, bukan warna.

| Peran | Font | Ukuran | Weight | Catatan |
|---|---|---|---|---|
| Display | Sans | 64-120px | 800 | `letter-spacing: -0.04em`, `line-height: 0.95` |
| H1 | Sans | 40-56px | 700 | `letter-spacing: -0.03em`, `line-height: 1.05` |
| H2 | Sans | 24-32px | 700 | `letter-spacing: -0.02em` |
| H3 | Sans | 18-20px | 600 | - |
| Body | Sans | 15-16px | 400 | `line-height: 1.55`, maks `65ch` |
| Label sistem | Mono | 11-12px | 500 | UPPERCASE, `letter-spacing: 0.08em` |
| Timestamp / meta | Mono | 12px | 400 | `--text-secondary` |
| Angka | Mono / tabular | - | - | `font-variant-numeric: tabular-nums` |

* Pasangkan Display ekstra tebal dengan label Mono kecil untuk kontras skala yang tegas.
* Hindari weight di antara (500 untuk heading) agar kontras tetap jelas: pilih 400 atau 700+.
* Penomoran bergaya indeks (`01`, `02`, `03`) dalam mono untuk section dan daftar.

---

## 6. Grid & Tata Letak

* **Basis grid:** `8px`; spasi `8 / 16 / 24 / 32 / 48 / 64 / 96`.
* **Kolom:** 12 kolom, gutter `0` bila elemen dipisahkan garis, atau `24px` bila dipisahkan ruang.
* **Lebar konten:** maksimum `1280px`; teks bacaan `65ch`.
* **Struktur khas:** section dipisahkan garis horizontal `1px` atau `2px` selebar penuh; sel grid berbagi border (tanpa jarak antar-kartu) membentuk tabel besar.
* **Header:** tinggi `56px`, border-bottom `1px solid var(--border-strong)`, logo teks di kiri, navigasi mono uppercase di kanan.
* **Ruang kosong:** jarak antar-section `96px-128px`; kepadatan datang dari garis dan tipografi, bukan dari dekorasi.
* **Perataan:** rata kiri dominan; hindari tengah kecuali hero tunggal.

---

## 7. Komponen Inti

**Tombol** (tinggi `40px`, padding `0 20px`, radius `0-3px`)
* *Primary:* latar `--bg-inverse`, teks `--text-inverse`; hover: tukar warna (latar `--bg`, teks `--text-primary`, border `1px solid --border-strong`).
* *Secondary:* latar transparan, border `1px solid --border-strong`, teks `--text-primary`; hover: terinversi.
* *Ghost / tautan:* teks dengan underline `1px`, `text-underline-offset: 3px`.
* Teks tombol bisa mono uppercase `12px` untuk kesan instrumen.

**Input**
* Latar `--bg`, border `1px solid --border-strong`, tinggi `40px`, radius `0`, teks mono atau sans `14px`.
* Fokus: border `2px` (kompensasi padding agar tidak bergeser) tanpa ring berwarna.
* Label mono uppercase `11px` di atas field. Error: pesan `--danger` `12px` di bawah field disertai teks "ERROR".

**Kartu / Sel**
* Latar `--bg`, border `1px solid --border-strong`, padding `24px`, radius `0`.
* Kartu bersebelahan berbagi border (hindari border ganda dengan `margin: -1px` atau `gap: 0` plus border-collapse).
* Hover: inversi penuh atau latar `--hover-bg`; tanpa efek angkat.

**Tabel**
* Header mono uppercase `11px`, border-bottom `2px solid --border-strong`.
* Baris: border-bottom `1px solid --border`, tinggi `44px`; hover `--hover-bg`.
* Angka rata kanan, `tabular-nums`.

**Daftar Berindeks**
* Baris dengan nomor mono di kiri (`01`), judul di tengah, meta di kanan; dipisahkan garis `1px`. Hover membalik warna baris.

**Tag & Status**
* Tag: border `1px solid --border-strong`, radius `0`, mono `11px` uppercase, padding `2px 8px`, tanpa latar warna.
* Status: dot `6px` solid monokrom + label mono. Pembeda antar status lewat bentuk dan teks (`●` aktif, `○` nonaktif, `×` gagal), bukan warna.

**Tab & Navigasi**
* Tab aktif: border-bottom `2px solid --border-strong` dan weight 600; tab tidak aktif `--text-secondary`.
* Item navigasi aktif: inversi (latar `--bg-inverse`, teks `--text-inverse`).

**Kbd**
* Border `1px solid --border-strong`, radius `0-2px`, mono `11px`, padding `1px 6px`.

**Modal & Dropdown**
* Latar solid `--bg`, border `1px solid --border-strong`, radius `0`, tanpa bayangan; overlay `rgba(0,0,0,0.6)` (gelap) atau `rgba(255,255,255,0.8)` (terang).

**Gambar & Media**
* Hitam-putih atau desaturasi (`filter: grayscale(1)`) untuk konsistensi; bingkai `1px` tipis; tanpa sudut membulat. Ilustrasi hanya garis geometris sederhana.

---

## 8. Ikon

* SVG monokrom stroke `1.5px` (Lucide atau Phosphor), ukuran `16px-20px`, warna `currentColor`.
* DILARANG emoji dan ikon berwarna. Simbol teks (`→`, `↗`, `+`, `×`) boleh dipakai sebagai pengganti ikon.

---

## 9. State & Interaksi

* **Transisi:** `100ms-150ms linear/ease-out` pada warna dan latar saja. Perubahan state bersifat tegas (inversi), bukan lembut.
* **Fokus keyboard:** outline `2px solid var(--text-primary)`, offset `2px`; jangan dihapus.
* **Disabled:** teks `--text-muted`, border `--border`, kursor `not-allowed`; jangan hanya menurunkan opasitas.
* **Loading:** teks mono (`LOADING…`) atau bar garis `2px` bergerak linear; hindari spinner dekoratif.
* **Empty state:** satu baris teks mono + satu aksi; tanpa ilustrasi.
* Hormati `prefers-reduced-motion` dan `prefers-color-scheme`.

---

## 10. Responsif

| Breakpoint | Perilaku |
|---|---|
| ≥ 1280px | Grid 12 kolom penuh, Display ukuran maksimum |
| 768-1279px | Grid 8 kolom, Display turun ke `64-80px` |
| < 768px | Satu kolom; Display `40-48px`; sel grid ditumpuk dengan garis pemisah tetap ada |

* Gunakan `clamp()` untuk tipografi fluid (contoh `clamp(2.5rem, 8vw, 7.5rem)`).
* Target sentuh minimal `44px`; halaman tidak boleh scroll menyamping.

---

## 11. Aksesibilitas

* Kontras hitam-putih sudah memenuhi AAA; pastikan `--text-muted` tetap ≥ `4.5:1` (`#737373` di atas putih lolos AA).
* Status tidak bergantung warna: selalu ada simbol dan teks.
* Hierarki heading berurutan; label wajib untuk setiap input (bukan hanya placeholder).
* Mono uppercase kecil: jaga ukuran ≥ `11px` dan `letter-spacing` cukup agar terbaca.
* Fokus selalu terlihat jelas di kedua tema.

---

## 12. Checklist Cepat

**Lakukan:** hitam-putih murni, garis `1-2px` solid, radius `0-3px`, kontras skala dan weight ekstrem, mono uppercase untuk label, inversi untuk penekanan, grid ketat dengan sel berbagi border, indeks bernomor.
**Hindari:** `box-shadow` apa pun, gradien, warna aksen jenuh, tombol pill, blur dan glassmorphism, emoji, weight tanggung (500) pada heading, ilustrasi dekoratif, dan status yang hanya dibedakan warna.