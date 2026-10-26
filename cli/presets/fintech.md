# DESIGN.md - Preset: Fintech, Transaksi & Dashboard Finansial (Standar Stripe, Wise, Mercury, Brex)

> **Arah Desain:** Kanvas Slate Kokoh, Presisi Angka Tabular (tabular-nums), Hairline Borders 1px, Badge Finansial Tegas.  
> Dokumen ini memandu agen AI merancang antarmuka keuangan, pembayaran, e-commerce, dan manajemen transaksi yang berwibawa, akurat, dan menumbuhkan rasa percaya (trust).

---

## 1. Prinsip Geometri & Form Input (Precision & Confidence)

Antarmuka finansial menuntut kepastian visual. Hindari elemen yang terasa rapuh, dekoratif kekanak-kanakan, atau melengkung balon.

* **Kartu & Panel Saldo:** `border-radius: 4px` atau `6px`. Garis batas tegas mendefinisikan pembagian data moneter.
* **Tombol Pembayaran / Aksi Finansial:** Persegi panjang presisi dengan `border-radius: 4px` atau `6px`. DILARANG tombol kapsul oval membulat (pill-button).
* **Field Input Nominal Uang:** Wajib menyertakan label mata uang statis (misal `IDR` atau `USD`) di sisi kiri input, dengan font angka tegas dan spasi vertikal proporsional.
* **Garis Pembatas (Dividers):** Hairline border `1px solid #e2e8f0` (light) atau `#1e293b` (dark).
* **Dilarang Efek Pendaran:** Dilarang menggunakan outer glow, efek neon, atau bayangan melayang berlebihan pada kartu transaksi.

---

## 2. Palet Warna: Kepercayaan & Status Transaksi Jernih

Gunakan palet warna tenang yang merepresentasikan keamanan perbankan dan kejelasan audit trail.

* **Kanvas Latar (Canvas Background):** `#f8fafc` (slate-50) atau `#f1f5f9` (slate-100).
* **Permukaan Kartu & Tabel (Surface):** `#ffffff` solid putih bersih.
* **Border Netral:** `1px solid #e2e8f0` (default), `#cbd5e1` (saat fokus/aktif).
* **Teks Utama:** `#0f172a` (slate-900, kontras tinggi).
* **Teks Sekunder & Timestamp:** `#475569` (slate-600).
* **Warna Aksen Primer:** Deep Navy (`#0f2744`) atau Deep Emerald (`#047857`) yang elegan dan stabil.
* **Warna Semantik Status Finansial:**
  * **Berhasil / Lunas (Settled):** `#059669` (Emerald matang, bukan hijau neon cerah).
  * **Diproses / Menunggu (Pending):** `#d97706` (Amber hangat stabil).
  * **Gagal / Ditolak (Failed):** `#dc2626` (Red karmin pekat).
  * **Dikembalikan (Refunded):** `#4b5563` (Neutral gray).

---

## 3. Penataan Angka & Tipografi Tabular (Tabular Numbers)

* **Font Utama:** Sans-serif bersih dengan keterbacaan tinggi (`Inter`, `Plus Jakarta Sans`, atau `system-ui`).
* **Angka Finansial Wajib Tabular:** Semua angka saldo, mutasi, fee, dan nominal uang WAJIB mengaktifkan `font-variant-numeric: tabular-nums` (atau menggunakan font monospaced) agar digit angka dan koma desimal sejajar vertikal secara sempurna pada tabel.
* **Simbol & Prefiks:** Beri pembeda hierarki visual yang jelas antara simbol mata uang dan angka nominal (misal simbol sedikit lebih redup daripada nominal angka utama).
* **Dilarang Ikon Mainan:** Jangan gunakan emoji atau ilustrasi AI kartun pada riwayat transaksi. Gunakan ikon status semantik monokrom (Lucide / Heroicons).
