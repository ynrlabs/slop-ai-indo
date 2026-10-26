# DESIGN.md - Preset: Developer Tooling & Dokumentasi API (Standar Tailwind Docs, Cloudflare, Prisma)

> **Arah Desain:** Tata Letak Tiga Kolom (Three-Pane Layout), Blok Kode Presisi dengan Syntax Highlighter Bersih, Badge Tombol Keyboard (KBD), dan Split-Screen Dokumentasi API.  
> Dokumen ini memandu agen AI membangun portal dokumentasi developer, halaman API reference, dan antarmuka devtools kelas dunia.

---

## 1. Prinsip Tata Letak: Struktur Three-Pane Dokumentasi

* **Navigasi Sidebar Kiri:** Pohon direktori / daftar topik dengan font berukuran 13px–14px, indikator aktif berupa garis aksen vertikal 2px di sisi kiri atau background pill kotak (`border-radius: 4px`).
* **Konten Inti Tengah:** Lebar teks bacaan terukur (64ch–80ch), terstruktur dengan heading hierarkis yang jelas (h1, h2, h3).
* **Navigasi Sisi Kanan (Table of Contents):** Daftar sub-judul "Pada Halaman Ini" (On this page) yang responsif terhadap scroll pengguna.
* **Sudut Elemen:** `border-radius: 4px` atau `6px` untuk panel, input pencarian, dan kontainer kode. DILARANG sudut bulat balon.

---

## 2. Blok Kode & Syntax Highlighting

* **Kontainer Kode (`pre`, `code`):** Latar belakang matte `#0f172a` (slate-900) atau `#18181b` (zinc-900), border hairline `1px solid #334155`, padding lapang 14px–16px.
* **Font Monospace:** `JetBrains Mono`, `Fira Code`, atau `Geist Mono` dengan ligatur kode bersih.
* **Tombol Salin (Copy Code Button):** Terpasang di pojok kanan atas kontainer kode, berukuran kompak, menampilkan status "Tersalin" secara halus saat diklik.
* **Badge Tombol Keyboard (`<kbd>`):** Sudut `3px`, latar `#f1f5f9` (light) / `#1e293b` (dark), border `1px solid #cbd5e1` / `#334155`, font monospace 11px–12px untuk instruksi shortcut keyboard (misal: `Ctrl` + `K`).

---

## 3. Palet Warna & Callout Dokumen

* **Kanvas Utama:** Putih bersih `#ffffff` (light mode) / Kanvas malam `#0b0f19` (dark mode).
* **Sidebar & Header:** `#f8fafc` (light) / `#070a11` (dark).
* **Border:** `1px solid #e2e8f0` (light) / `1px solid #1e293b` (dark).
* **Callout Informasi & Peringatan:**
  * **Info:** Border kiri `3px solid #3b82f6`, latar belakang `#eff6ff` (light) / `rgba(59,130,246,0.1)` (dark).
  * **Warning:** Border kiri `3px solid #f59e0b`, latar belakang `#fffbeb` (light) / `rgba(245,158,11,0.1)` (dark).
  * **Tip / Solusi:** Border kiri `3px solid #10b981`, latar belakang `#f0fdf4` (light) / `rgba(16,185,129,0.1)` (dark).
* **Dilarang Slop:** Dilarang menggunakan ikon sparkle / sihir pada dokumentasi, dilarang pendaran neon, dan dilarang gradien teks warna-warni pada judul teknis.
