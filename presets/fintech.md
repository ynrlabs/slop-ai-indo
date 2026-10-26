# DESIGN.md - Preset: Fintech, Transaksi & Dashboard Finansial (Standar Stripe, Wise, Mercury, Brex)

> **Arah Desain:** Kanvas slate kokoh, presisi angka tabular (tabular-nums), hairline border 1px, badge finansial tegas.
> Dokumen ini memandu agen AI merancang antarmuka keuangan, pembayaran, e-commerce, dan manajemen transaksi yang berwibawa, akurat, dan menumbuhkan rasa percaya (trust).

---

## 1. Prinsip Inti

1. **Akurasi di atas gaya.** Angka harus selalu jelas, sejajar, dan tidak ambigu.
2. **Kepercayaan lewat ketenangan.** Warna tenang, sudut tegas, tanpa efek dekoratif.
3. **Status selalu eksplisit.** Setiap transaksi punya status berteks, bukan hanya warna.
4. **Aksi uang butuh konfirmasi.** Alur pembayaran harus jelas, dapat ditinjau, dan sulit salah klik.

---

## 2. Token Desain

```css
:root {
  /* Surface */
  --bg-canvas:  #f8fafc;  /* alternatif: #f1f5f9 */
  --bg-surface: #ffffff;
  --bg-subtle:  #f1f5f9;  /* header tabel, hover baris */

  /* Border */
  --border:        #e2e8f0;
  --border-strong: #cbd5e1;  /* fokus/aktif */

  /* Teks */
  --text-primary:   #0f172a;
  --text-secondary: #475569;
  --text-muted:     #64748b;  /* placeholder, simbol mata uang */

  /* Aksen primer (pilih SATU) */
  --accent:       #0f2744;  /* deep navy; alternatif: #047857 */
  --accent-hover: #0a1c33;
  --accent-soft:  rgba(15, 39, 68, 0.08);

  /* Status transaksi */
  --settled:  #059669;  --settled-bg:  #ecfdf5;
  --pending:  #d97706;  --pending-bg:  #fffbeb;
  --failed:   #dc2626;  --failed-bg:   #fef2f2;
  --refunded: #4b5563;  --refunded-bg: #f3f4f6;

  /* Radius */
  --radius-sm: 3px;  /* badge */
  --radius:    4px;  /* input, tombol */
  --radius-lg: 6px;  /* kartu, panel, modal */

  /* Bayangan */
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
  --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.12);  /* modal saja */
}

[data-theme="dark"] {
  --bg-canvas:  #0b1120;
  --bg-surface: #111827;
  --bg-subtle:  #172033;
  --border:        #1e293b;
  --border-strong: #334155;
  --text-primary:   #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted:     #64748b;
  --accent:       #34d399;
  --accent-hover: #6ee7b7;
  --settled-bg: rgba(5,150,105,0.15);  --pending-bg: rgba(217,119,6,0.15);
  --failed-bg:  rgba(220,38,38,0.15);  --refunded-bg: rgba(75,85,99,0.25);
}
```

---

## 3. Geometri & Batas

| Elemen | Radius | Catatan |
|---|---|---|
| Kartu saldo, panel, modal | `6px` | Maksimal; jangan lebih |
| Tombol, input, select | `4px` | **DILARANG** pill/kapsul |
| Badge status | `3px` | Hindari badge oval |
| Avatar | `50%` | Satu-satunya pengecualian bulat |

* **Border:** `1px solid var(--border)`; fokus/aktif naik ke `--border-strong`.
* **Bayangan:** hanya `--shadow-sm` pada kartu; `--shadow-lg` khusus modal. DILARANG outer glow, neon, dan bayangan melayang berlebihan pada kartu transaksi.

---

## 4. Palet Warna

* **Kanvas:** `--bg-canvas`; **surface** kartu dan tabel putih solid `#ffffff`.
* **Aksen primer** hanya untuk tombol utama, tautan, navigasi aktif, dan fokus. Navy atau emerald, tidak keduanya.
* **Warna status** hanya untuk makna transaksi, bukan dekorasi.
* **Emerald status** `#059669` adalah hijau matang, bukan hijau neon.
* **Nominal negatif/positif:** pemasukan boleh `--settled`, pengeluaran tetap `--text-primary` (jangan seluruh daftar berwarna merah). Selalu sertai tanda `+` / `−`.
* DILARANG gradien dekoratif dan lebih dari satu warna aksen.

---

## 5. Angka & Tipografi

* **Sans:** `Inter`, `Plus Jakarta Sans`, `Geist`, `system-ui`, sans-serif.
* **Mono:** `JetBrains Mono`, hanya untuk ID transaksi, nomor rekening, referensi, dan hash.

### Aturan Angka (Wajib)
* Semua nominal, saldo, mutasi, dan fee memakai `font-variant-numeric: tabular-nums` agar digit sejajar vertikal.
* **Rata kanan** untuk semua kolom nominal; header kolom nominal juga rata kanan.
* **Simbol mata uang** lebih redup (`--text-muted`, weight 400) dan sedikit lebih kecil (`0.75em-0.85em`) daripada angka utama (`--text-primary`, weight 500-600).
* **Desimal** konsisten per mata uang (USD: 2 digit; IDR: tanpa desimal) dan bagian desimal boleh sedikit lebih redup pada angka hero.
* **Format lokal:** IDR memakai titik ribuan dan koma desimal (`Rp1.250.000`); USD memakai koma ribuan dan titik desimal (`$1,250.00`). Gunakan `Intl.NumberFormat` dengan locale yang sesuai, jangan format manual.
* **Angka negatif:** tanda minus sejati `−` (bukan tanda hubung), bukan kurung, kecuali konteks akuntansi.
* **Tanggal & waktu:** `DD MMM YYYY, HH:mm` dengan zona waktu (contoh `26 Okt 2026, 14:32 WIB`); warna `--text-secondary`.

| Peran | Ukuran | Weight | Catatan |
|---|---|---|---|
| Angka hero (saldo) | 32-40px | 600 | `letter-spacing: -0.02em` |
| Angka metrik kartu | 24px | 600 | - |
| Judul halaman | 24px | 600 | - |
| Judul section | 16-18px | 600 | - |
| Body / isi tabel | 14px | 400 | `line-height: 1.5` |
| Label form | 13px | 500 | - |
| Caption / timestamp | 12px | 400 | `--text-secondary` |

* **Ikon:** SVG monokrom (Lucide, Heroicons), stroke `1.5px`, ukuran `16px-20px`.
* **DILARANG** emoji dan ilustrasi kartun pada riwayat transaksi.

---

## 6. Tata Letak Dashboard

| Area | Spesifikasi |
|---|---|
| Sidebar | `240px`, latar surface, border-right hairline; mode ringkas `56px` |
| Header | `56px`, sticky, berisi pencarian, pemilih akun/entitas, notifikasi |
| Konten | padding `24px-32px`, lebar maksimum `1280px` |
| Grid | basis `4px`; spasi `4 / 8 / 12 / 16 / 24 / 32` |

* **Urutan informasi:** saldo dan ringkasan di atas, grafik arus kas di tengah, tabel transaksi terbaru di bawah.
* **Baris metrik:** 3-4 kartu sejajar (saldo tersedia, pemasukan, pengeluaran, pending), masing-masing dengan label, angka, dan perbandingan periode kecil.
* **Filter periode** (7 hari, 30 hari, kustom) di kanan atas, berupa segmented control bersudut `4px`.
* Maksimal satu tombol primer per layar.

---

## 7. Komponen Inti

**Kartu Saldo**
* Latar putih, border hairline, radius `6px`, padding `20px-24px`.
* Struktur: label `13px` (contoh "Saldo tersedia"), angka hero, baris sekunder (saldo tertahan, pembaruan terakhir). Tombol aksi (Kirim, Tarik, Top up) di bawah atau di kanan atas.
* Opsi sembunyikan saldo (ikon mata) untuk privasi.

**Tabel Transaksi**
* Header `12px`, weight 500, `--text-secondary`, latar `--bg-subtle`.
* Tinggi baris `44px-48px`; border-bottom hairline; hover baris `--bg-subtle`.
* **Kolom standar:** tanggal, deskripsi/penerima, ID referensi (mono), metode, status (badge), nominal (rata kanan).
* Klik baris membuka panel detail di kanan (`420px`) berisi rincian, timeline status, dan aksi (unduh bukti, refund).
* Dukung filter status, rentang tanggal, pencarian ID, ekspor CSV, dan paginasi (bukan scroll tak terbatas untuk data audit).
* Baris total/subtotal di kaki tabel dengan border-top `2px`.

**Badge Status**
* Radius `3px`, padding `2px 8px`, font `12px` weight 500, selalu berisi dot `6px` atau ikon kecil plus teks.

| Status | Label | Teks | Latar |
|---|---|---|---|
| Berhasil | Berhasil / Lunas | `#059669` | `#ecfdf5` |
| Diproses | Menunggu / Diproses | `#d97706` | `#fffbeb` |
| Gagal | Gagal / Ditolak | `#dc2626` | `#fef2f2` |
| Dikembalikan | Dikembalikan | `#4b5563` | `#f3f4f6` |

**Input Nominal Uang**
* Prefiks mata uang statis di sisi kiri (`IDR`, `USD`) dalam segmen terpisah dengan border-right hairline, latar `--bg-subtle`, teks `--text-muted`.
* Angka rata kanan atau kiri secara konsisten, `tabular-nums`, `inputmode="decimal"`.
* Format otomatis pemisah ribuan saat mengetik; validasi saldo tidak cukup secara langsung dengan pesan di bawah field.
* Fokus: border `--accent` + ring `0 0 0 3px var(--accent-soft)`. Error: border `--failed`, pesan `12px` dengan ikon.
* Sediakan tombol pintasan ("Maks", nominal cepat) bersudut `4px`.

**Tombol** (tinggi `36px`-`40px`)
* *Primary:* latar `--accent`, teks putih; hover `--accent-hover`.
* *Secondary:* putih, border `--border-strong`; hover `--bg-subtle`.
* *Destructive:* latar `--failed`, untuk pembatalan atau refund permanen, wajib konfirmasi.
* Saat memproses: tombol dinonaktifkan dengan indikator kecil dan teks "Memproses…", cegah klik ganda.

**Grafik Arus Kas**
* Garis atau batang sederhana, warna: pemasukan `--accent`, pengeluaran `#94a3b8`. Gridline hairline horizontal saja, tooltip berisi nominal `tabular-nums`.
* Tanpa gradien area, 3D, atau animasi masuk berlebihan.

**Kartu Pembayaran & Rekening**
* Tampilkan hanya 4 digit terakhir (`•••• 4821`) dalam mono, logo jaringan kartu kecil monokrom, tanggal kedaluwarsa.

---

## 8. Alur Pembayaran & Keamanan

* **Stepper** 3 langkah maksimum: Detail → Tinjau → Konfirmasi. Langkah aktif bergaris bawah aksen.
* **Layar tinjau** wajib menampilkan: penerima, nominal, fee, kurs (bila ada), total yang didebit, dan estimasi tiba, dalam tabel rincian dengan total tebal.
* **Konfirmasi aksi sensitif** lewat modal (lebar `480px`) dengan ringkasan; autentikasi tambahan (PIN/OTP) untuk nominal besar.
* **Layar hasil:** ikon status, judul jelas ("Pembayaran berhasil"), ID referensi dengan tombol salin, tombol unduh bukti. Tanpa konfeti atau animasi perayaan.
* **Pesan error** spesifik dan berisi langkah lanjut ("Saldo tidak mencukupi. Top up atau kurangi nominal."), bukan pesan generik.
* **Penanda keamanan** (ikon gembok, "Terenkripsi") ditampilkan seperlunya di formulir kartu, dengan gaya monokrom kecil; tidak berlebihan.
* **Idempotensi visual:** setelah submit, tampilkan status dan cegah pengiriman ulang tanpa peringatan.

---

## 9. State & Interaksi

* **Transisi:** `120ms-150ms ease-out` pada warna dan border saja.
* **Fokus keyboard:** outline `2px solid var(--accent)`, offset `2px`; jangan dihapus.
* **Loading:** skeleton `--bg-subtle` pada tabel dan kartu; hindari spinner penuh layar.
* **Empty state:** ikon `20px`, judul, satu kalimat, satu aksi ("Belum ada transaksi. Buat pembayaran pertama.").
* **Salin ke clipboard** untuk ID dan nomor rekening, dengan umpan balik "Tersalin" `2s`.
* Hormati `prefers-reduced-motion` dan `prefers-color-scheme`.

---

## 10. Responsif

| Breakpoint | Perilaku |
|---|---|
| ≥ 1280px | Sidebar penuh, panel detail transaksi berdampingan |
| 1024-1279px | Sidebar ringkas, panel detail melayang |
| 768-1023px | Sidebar menjadi drawer |
| < 768px | Tabel berubah menjadi daftar kartu: penerima dan nominal di baris atas, status dan tanggal di bawah |

* Nominal tetap rata kanan dan `tabular-nums` di semua ukuran layar.
* Tombol aksi finansial utama tetap terjangkau ibu jari (bawah layar) pada mobile; target sentuh minimal `44px`.
* Halaman tidak boleh scroll menyamping.

---

## 11. Aksesibilitas

* Kontras teks minimal WCAG AA (`4.5:1`); periksa `--text-muted` dan teks badge pada latarnya.
* Status tidak bergantung pada warna: selalu ada teks dan ikon/dot.
* Nominal dibaca layar secara lengkap (contoh `aria-label="Kredit seribu dua ratus lima puluh ribu rupiah"` bila format visual ambigu); tanda `+`/`−` tidak boleh hanya berupa warna.
* Tabel memakai `<th scope>` dan `<caption>`; pembaruan status memakai `aria-live="polite"`.
* Semua alur pembayaran dapat diselesaikan hanya dengan keyboard.

---

## 12. Checklist Cepat

**Lakukan:** kanvas slate, surface putih, `tabular-nums` pada semua nominal, nominal rata kanan, prefiks mata uang statis, badge berteks, layar tinjau sebelum konfirmasi, format angka lewat `Intl.NumberFormat`, satu aksen (navy/emerald).
**Hindari:** tombol pill, glow neon, bayangan melayang, gradien dekoratif, emoji pada riwayat transaksi, hijau neon, status yang hanya dibedakan warna, angka tanpa tabular-nums, konfeti pada layar sukses, dan pesan error generik.