# DESIGN.md - Preset: Minimalist Monochrome (Standar Raycast & Teenage Engineering)

> **Arah Desain:** Estetika Monokromatik Hitam-Putih Murni, Tipografi Grid Ketat, Rasio Kontras Tertinggi, Zero-Gimmick.  
> Dokumen ini memandu agen AI menciptakan desain minimalis radikal yang berani, fungsional, dan bebas dari warna dekoratif artifisial.

---

## 1. Prinsip Geometri & Garis Siku Tegas (Architectural Grid)

* **Sudut:** `border-radius: 0px` (siku arsitektural murni) atau maksimal `3px` untuk tombol dan kartu.
* **Garis Pembatas (Borders):** Garis 1px atau 2px solid hitam `#000000` (pada tema terang) atau putih/abu-abu netral `#333333` (pada tema gelap). Garis adalah pemisah utama, bukan efek bayangan.
* **Tombol (Buttons):** Kotak berujung siku tajam dengan skema inverted contrast (tombol hitam dengan teks putih di kanvas terang; tombol putih dengan teks hitam di kanvas gelap).
* **Larangan Total Drop Shadow:** Dilarang menggunakan box-shadow kabur yang melayang. Semua kedalaman dibuat menggunakan outline border solid dan spasi yang disiplin.

---

## 2. Palet Warna: Monokromatik Mutlak (Stark High Contrast)

* **Kanvas Terang:** Latar belakang `#ffffff` murni, teks utama `#000000`, teks pendukung `#525252`.
* **Kanvas Gelap:** Latar belakang `#000000` murni, teks utama `#ffffff`, teks pendukung `#a3a3a3`.
* **Garis Penyekat:** `#e5e5e5` (mode terang) atau `#262626` (mode gelap).
* **Nol Warna Dekoratif:** 0% gradien, 0% warna aksen jenuh. Daya tarik antarmuka dibangun seutuhnya dari proporsi ukuran tipografi, bobot garis, dan kerapatan tata letak.
* **Status Fungsional Minimal:** Jika indikator status mutlak dibutuhkan, gunakan titik monokrom (dot solid) atau maksimal 1 warna status murni berukuran kecil (`#dc2626` untuk error kritis).

---

## 3. Tipografi & Hirarki Skala

* **Font Utama:** Sans-serif netral bertenaga (`Geist`, `Inter`, `Helvetica Neue`, atau font sistem bawaan).
* **Font Monospace:** `Geist Mono` atau `JetBrains Mono` untuk seluruh label sistem, timestamp, kode, dan data terstruktur.
* **Hirarki Tipografi:** Mengandalkan perbedaan ekstrem antara font-weight (misal: Extra Bold vs Regular) dan ukuran teks (Display vs Small Mono Caps), bukan mengandalkan pewarnaan.
