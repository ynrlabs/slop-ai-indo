# DESIGN.md - Sistem Desain Human-Crafted (Standar Anti-AI Style)

> **Tujuan Dokumen:** Menjadi standar baku visual dan arsitektur UI harian untuk semua proyek perangkat lunak (Web, SaaS, Mobile/Flutter, Laravel).  
> Dokumen ini adalah pasangan wajib dari **slop-ai-indo.md**: jika Slop AI Indo membuang elemen klise/sampah AI, `DESIGN.md` ini yang mendikte bentuk fisik, geometri siku, palet warna, dan hierarki agar hasil coding AI **terlihat 100% seperti buatan tim desainer manusia profesional (Human-Crafted)** seperti n8n, Linear, Stripe, dan Notion.

---

## 1. Prinsip Geometri: Siku Tegas & Presisi (The Sharp Corner Rule)

AI biasa cenderung membuat sudut membulat berlebihan (*pill/capsule*, *border-radius: 12px s/d 24px*, atau *rounded-full*). Hal ini membuat aplikasi terasa seperti template mainan atau bot generic.

### Aturan Wajib:
* **Kartu & Panel:** Maksimal `border-radius: 4px` atau `6px` (siku tegas, presisi, bukan melengkung balon).
* **Tombol (Buttons):** Berbentuk persegi panjang rapi dengan `border-radius: 4px` atau `6px`. **DILARANG** membuat tombol kapsul (*pill button*).
* **Badge, Tags, & Status Pills:** Gunakan sudut tajam (`border-radius: 3px` atau `4px`). Hindari badge lonjong oval.
* **Input & Form Field:** `border-radius: 4px`, border solid 1px tipis yang tegas.
* **Batas & Garis (Borders):** Gunakan border hairline 1px solid (`#e2e8f0` untuk tema terang, `#27272a` untuk tema gelap). **DILARANG** menggunakan efek glowing/pendar neon di sekeliling border.

---

## 2. Palet Warna: Kanvas Terang & Netral (The Clean Enterprise Canvas)

Mengapa n8n, Linear, dan Stripe terlihat profesional? Karena mereka menggunakan kanvas terang dengan kontras yang bersih dan elegan, bukan latar hitam pekat bertabur gradien ungu-cyan.

### Aturan Palet:
* **Default Kanvas:** Gunakan **Enterprise Light Mode** sebagai standar utama:
  * Latar Utama (*Canvas Background*): `#f8fafc` atau `#f1f5f9` dengan dot grid abu-abu halus (`#cbd5e1` / `#e2e8f0`, ukuran grid 20px x 20px).
  * Latar Kartu / Node (*Surface*): `#ffffff` solid putih bersih.
  * Border Netral: `1px solid #e2e8f0` (default) atau `#cbd5e1` (hover).
  * Teks Utama: `#0f172a` (slate-900 pekat, mudah dibaca, kontras tinggi).
  * Teks Sekunder: `#64748b` (slate-500).
* **Jika Dark Mode Diminta:** Gunakan matte obsidian/zinc (`#18181b` surface, `#09090b` canvas). **DILARANG KERAS** menggunakan background hitam kebiruan pekat ala AI crypto (`#080c14`) yang dikombinasikan dengan border ungu/cyan neon.
* **Warna Aksen Fungsional:**
  * Pilih **1 warna aksen solid** yang terarah (misal: Indigo `#4f46e5`, Emerald `#059669`, atau Slate Blue `#2563eb`).
  * **DILARANG** gradien ungu-ke-cyan atau ungu-ke-pink pada tombol dan background.

---

## 3. Komponen Node & Alur Kerja (Standar Visual Ala n8n)

Untuk aplikasi otomatisasi alur, diagram, atau kanvas multi-agent:
1. **Node Utama:**
   * Kotak persegi panjang putih bersih dengan sudut siku tajam (`border-radius: 5px`).
   * Border tipis 1px abu-abu netral (`#e2e8f0`).
   * Shadow tipis yang halus: `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05)`.
2. **Port Konektor (In / Out Ports):**
   * Berbentuk titik (*dot*) atau *diamond* kecil berukuran 6px–8px di tepi kiri (masukan) dan tepi kanan (keluaran).
   * Warna port netral (#64748b), berubah warna saat terhubung.
3. **Sub-Node & Satelit (Tools, Memory, Model):**
   * Tidak ditaruh di dalam kartu utama hingga bertumpuk, melainkan **digantung rapi di bawah node utama** (seperti ikon AI model, memory, dan tools pada n8n).
   * Dihubungkan dengan garis putus-putus tipis vertikal (`stroke-dasharray: 4 3; stroke: #cbd5e1`).
4. **Kabel Koneksi (Connectors):**
   * Garis kurva Bezier abu-abu tipis netral (`stroke: #94a3b8; stroke-width: 1.5px; fill: none;`).
   * Tanpa animasi neon berputar yang mengganggu mata. Cukup panah atau dot arah yang minimalis.

---

## 4. Tipografi & Ikonografi

* **Font Utama:** Sans-serif modern dan bersih (`Inter`, `Plus Jakarta Sans`, atau `system-ui`).
* **Font Monospace:** Hanya digunakan untuk data teknis, kode, variabel, atau JSON (`JetBrains Mono` atau `Fira Code`). Dilarang memakai font mono untuk judul/heading marketing.
* **Ikon:** Gunakan ikon semantik SVG sederhana (misal: Lucide, Tabler, atau Heroicons) dengan goresan garis (*stroke*) 1.5px–1.75px yang seragam.
* **Larangan Emoji:** Dilarang menaburkan emoji hiasan (🚀, 🔥, ✨, 🧠) pada judul, tombol, atau navigasi. Gunakan teks atau ikon semantik.

---

## 5. Standar Kode & Komentar (Laravel, Flutter, React, Vue)

* **Laravel / PHP:**
  * Kode PSR-12 bersih.
  * Hapus komentar redundan yang hanya mengulang nama fungsi.
  * DILARANG membuat DocBlock/PHPDoc boilerplate (`/** ... */`) yang hanya memparafrase nama fungsi atau mengulang tipe data (seperti `/** Get all setup menus... @return Collection */`). Gunakan native type hint (PHP 8+). DocBlock HANYA diizinkan untuk tipe generic kompleks static analysis (PHPStan/Psalm) tanpa kalimat deskripsi hampa.
  * Terapkan Skinny Controller: validasi wajib dipisah ke Form Request, logika bisnis diekstrak ke Action Class / Service Layer.
  * Wajib bungkus response publik dengan API Resource (`JsonResource`) atau DTO; DILARANG mengembalikan Model Eloquent mentah ke JSON client.
  * Gunakan Guard Clauses / Early Return untuk menjaga kedalaman indentasi logika maksimal 2 tingkat.
  * Data Master & Konfigurasi: Wajib buatkan tabel database (Master / Lookup / Reference Tables) untuk data opsi, kategori, atau konfigurasi yang berpotensi dinamis agar mudah dirawat tanpa redeploy kode. Hardcode (Backed Enum / Config) HANYA untuk alur status tertutup (state machine) yang terikat langsung dengan percabangan logika kode.
  * DILARANG menggunakan `protected $guarded = []`. Wajib deklarasikan `$fillable` secara eksplisit atau hanya passing `$request->validated()` untuk mencegah celah Mass Assignment.
  * Migrasi Database: Foreign key wajib gunakan `$table->foreignId()->constrained()->cascadeOnDelete()` dan beri `->index()` pada kolom yang sering disaring/diurutkan (`status`, `slug`, `created_at`).
  * Blade/Inertia views menggunakan utilitas CSS dengan siku tajam (`rounded-sm` atau `rounded`, jangan `rounded-full`).
* **Flutter:**
  * Widget menggunakan `RoundedRectangleBorder(borderRadius: BorderRadius.circular(4))`.
  * Hindari `StadiumBorder` atau `BoxDecoration(borderRadius: BorderRadius.circular(30))` untuk kartu data.
  * Gunakan `ThemeData` dengan `colorScheme` yang teruji kontrasnya via WCAG.
* **CSS / Tailwind:**
  * Gunakan `border-radius: 4px` atau `border-radius: 6px`.
  * Hindari class `rounded-2xl`, `rounded-3xl`, `rounded-full` kecuali untuk avatar pengguna berbentuk lingkaran.
* **URL & Routing (Clean / Semantic URLs):**
  * Wajib gunakan URL semantik RESTful dan slug (`/articles/{article:slug}`, `/users/{id}/edit`), DILARANG menggunakan query string untuk routing halaman atau identifier entitas (`?id=123`, `?page=settings`, `?action=delete`).
  * Query string (`?`) HANYA diizinkan untuk filter opsional, pencarian, dan paginasi (`?category=tech&page=2`).
  * Seluruh parameter URL wajib diproses via parameter binding (Prepared Statements / ORM) untuk proteksi mutlak dari SQL Injection dan IDOR.

---

## 6. Ringkasan Cepat untuk Prompt AI

Saat memulai fitur baru di proyek apa pun, Anda cukup menyertakan instruksi berikut ke AI:
> *"Terapkan aturan slop-ai-indo.md dan DESIGN.md: gunakan tampilan human-crafted gaya n8n (kanvas terang bersih, sudut siku tegas 4-6px, tanpa tombol kapsul, tanpa gradien neon AI, dan kode bersih tanpa komentar sampah)."*