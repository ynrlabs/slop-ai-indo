# DESIGN.md - Preset: Enterprise SaaS (Standar n8n & Linear)

> **Arah Desain:** Kanvas Terang Bersih, Sudut Presisi 4px–6px, Hierarki Elegan ala SaaS Kelas Enterprise (n8n, Linear, Stripe, Notion).  
> Dokumen ini memandu agen AI membangun estetika visual yang terstruktur, padat informasi, dan 100% terasa seperti hasil kerajinan tangan desainer manusia profesional (*human-crafted*).

---

## 1. Prinsip Geometri: Siku Tegas & Presisi (The Sharp Corner Rule)

Hindari pembulatan sudut berlebihan (*pill/capsule*, *border-radius: 12px s/d 24px*, atau *rounded-full*). Aplikasi profesional mengutamakan keteraturan grid dan sudut tegas.

* **Kartu & Panel:** Maksimal `border-radius: 4px` atau `6px` (siku tegas, presisi, bukan melengkung balon).
* **Tombol (Buttons):** Persegi panjang rapi dengan `border-radius: 4px` atau `6px`. **DILARANG** membuat tombol kapsul lonjong (*pill button*).
* **Badge & Status:** Sudut tajam (`border-radius: 3px` atau `4px`). Hindari badge oval.
* **Input & Form Field:** `border-radius: 4px`, border solid 1px tipis yang tegas.
* **Batas & Garis (Borders):** Border hairline 1px solid (`#e2e8f0` di latar terang). **DILARANG** efek pendaran neon (*glowing borders*).

---

## 2. Palet Warna: Kanvas Terang & Netral (Clean Enterprise Canvas)

* **Latar Utama (Canvas Background):** `#f8fafc` atau `#f1f5f9` dengan dot grid opsional abu-abu halus (`#cbd5e1`, 20px x 20px).
* **Latar Kartu / Node (Surface):** `#ffffff` solid putih bersih.
* **Border Netral:** `1px solid #e2e8f0` (default), `#cbd5e1` (hover/fokus).
* **Teks Utama:** `#0f172a` (slate-900 pekat, kontras tinggi).
* **Teks Sekunder:** `#64748b` (slate-500).
* **Warna Aksen:** Tepat **1 warna aksen solid** (misal: Indigo `#4f46e5`, Emerald `#059669`, atau Slate Blue `#2563eb`).
* **Larangan Warna:** DILARANG gradien ungu-ke-cyan atau ungu-ke-pink pada background dan tombol.

---

## 3. Tipografi & Ikon

* **Font Utama:** Sans-serif modern dan bersih (`Inter`, `Plus Jakarta Sans`, `Geist`, atau `system-ui`).
* **Font Monospace:** Hanya untuk data teknis, kode, variabel, ID, atau JSON (`JetBrains Mono` atau `Fira Code`).
* **Ikon:** SVG semantik (Lucide, Heroicons, atau Tabler) dengan ketebalan goresan (*stroke*) 1.5px–1.75px seragam.
* **Larangan Emoji:** Dilarang menggunakan emoji dekoratif pada tombol, heading, atau navigasi.

---

## 4. Komponen Node & Visual Alur Kerja (Workflow UI)

* **Node Utama:** Kotak persegi panjang putih (`border-radius: 5px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.05)`).
* **Konektor:** Garis kurva Bezier abu-abu netral (`stroke: #94a3b8; stroke-width: 1.5px; fill: none;`).
* **Satelit Sub-Node:** Menggantung di bawah node utama dengan garis putus-putus vertikal (`stroke-dasharray: 4 3`).
