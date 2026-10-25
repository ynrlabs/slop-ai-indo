# DESIGN.md - Preset: Dark Modern (Standar Vercel & Supabase)

> **Arah Desain:** Kanvas Gelap Matte Obsidian, Border Presisi Halus, Monokrom Bersih dengan Aksen Tajam (Vercel, Supabase, Raycast).  
> Dokumen ini memandu agen AI menghasilkan antarmuka gelap (*dark mode*) yang dewasa, elegan, dan bebas dari stereotip AI neon/crypto.

---

## 1. Prinsip Geometri & Batas (Strict Hairline Borders)

* **Kartu & Kontainer:** `border-radius: 6px` atau `8px`.
* **Tombol (Buttons):** Persegi panjang berujung siku halus (`border-radius: 6px`). DILARANG tombol kapsul oval melengkung ekstrem.
* **Borders:** Wajib hairline 1px solid (`#27272a` atau `#3f3f46`). Sudut dan garis adalah penentu utama struktur, bukan bayangan tebal.
* **Larangan Pendaran:** DILARANG efek *outer neon glow* (`box-shadow: 0 0 15px #06b6d4`). Bayangan gelap harus realistis (`rgba(0,0,0,0.4)`).

---

## 2. Palet Warna: Matte Obsidian & Zinc

* **Kanvas Latar (Canvas Background):** `#09090b` (zinc-950 pekat, bukan hitam murni 100% dan bukan biru dongker).
* **Permukaan Kartu (Card Surface):** `#121215` atau `#18181b` (zinc-900).
* **Border:** `#27272a` (zinc-800 default), `#3f3f46` (zinc-700 saat hover).
* **Teks Utama:** `#f4f4f5` (zinc-100, jernih, kontras tinggi).
* **Teks Sekunder:** `#a1a1aa` (zinc-400).
* **Aksen Monokromatik:** Tombol utama putih bersih (`#fafafa`) dengan teks gelap (`#09090b`), atau 1 aksen fungsional (`#3b82f6` atau `#10b981`).
* **Larangan Gradien:** Dilarang menggunakan gradien ungu-cyan ala sci-fi murahan.

---

## 3. Tipografi & Densitas

* **Font:** `Geist Sans`, `Inter`, atau `system-ui`. Huruf harus tajam pada latar gelap.
* **Monospace:** `Geist Mono` atau `JetBrains Mono` untuk path, hash, metrics, dan key-value data.
* **Status Indicators:** Gunakan dot kecil 6px solid (`#22c55e` untuk live, `#eab308` untuk pending) dengan teks pendamping di sampingnya.
