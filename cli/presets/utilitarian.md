# DESIGN.md - Preset: Utilitarian & Dense Data (Standar Grafana & Datadog)

> **Arah Desain:** Rasio Data-to-Ink Maksimal, Border Tegas 1-2px, Tipografi Tabular & Grid Padat (Grafana, Datadog, Retool, Bloomberg).  
> Dokumen ini memandu agen AI merancang antarmuka dashboard data-intensif, analitik teknis, dan alat internal developer.

---

## 1. Prinsip Tata Letak: Densitas Tinggi & Presisi Grid

* **Spasi Kompak:** Padding elemen 6px–10px, margin antar panel 8px–12px. Tanpa ruang kosong mengambang yang mubazir.
* **Border Penyekat:** Garis 1px solid yang tegas pada setiap batas kolom dan baris (`#d1d5db` untuk light, `#374151` untuk dark).
* **Sudut:** `border-radius: 2px` atau `0px` (sudut siku murni tanpa lekukan).
* **Struktur Tabel & Matriks:** Bordered table dengan zebra striping halus dan sticky header.

---

## 2. Palet Warna Fungsional & Status Data

* **Latar Kanvas:** Abu-abu netral teknis (`#f3f4f6` di light mode, `#111827` di dark mode).
* **Permukaan Sel & Panel:** Solid (`#ffffff` di light mode, `#1f2937` di dark mode).
* **Teks Data:** Font monospace tabular (`JetBrains Mono`, `Roboto Mono`, font angka monospaced) agar digit angka sejajar vertikal secara sempurna.
* **Warna Semantik Status Data:**
  * Success / Nominal: `#16a34a` (Green)
  * Warning / Elevated: `#d97706` (Amber)
  * Critical / Alert: `#dc2626` (Red)
  * Muted / Inactive: `#6b7280` (Gray)
* **Larangan Efek:** DILARANG shadow melayang, dilarang efek blur (glassmorphism), dan dilarang gradien dekoratif.
