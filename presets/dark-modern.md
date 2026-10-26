# DESIGN.md - Preset: Dark Modern (Standar Vercel & Supabase)

> **Arah Desain:** Kanvas gelap matte obsidian, border hairline presisi, monokrom bersih dengan satu aksen tajam (Vercel, Supabase, Raycast).
> Dokumen ini memandu agen AI menghasilkan antarmuka *dark mode* yang dewasa, elegan, dan bebas dari stereotip AI neon/crypto.

---

## 1. Prinsip Inti

1. **Struktur dari garis, bukan bayangan.** Border 1px menentukan hierarki; bayangan hanya pelengkap.
2. **Monokrom dulu, aksen belakangan.** Seluruh UI harus tetap terbaca jika aksen dihapus.
3. **Kontras lewat tingkat keabuan.** Bedakan lapisan dengan zinc yang berbeda, bukan warna baru.
4. **Padat tapi lega.** Informasi rapat, namun jarak antar-grup jelas.

---

## 2. Geometri & Batas

| Elemen | Radius | Catatan |
|---|---|---|
| Kartu, panel, modal | `8px` | Modal boleh `12px` |
| Tombol, input, dropdown | `6px` | DILARANG kapsul/pill |
| Badge, tag | `4px` | Kecil dan tegas |
| Avatar | `50%` | Satu-satunya bentuk bulat penuh |

* **Border:** wajib `1px solid`, `#27272a` (default) dan `#3f3f46` (hover/fokus).
* **Larangan pendaran:** DILARANG `box-shadow` neon (contoh: `0 0 15px #06b6d4`).
* **Bayangan realistis:** hanya untuk elemen melayang (dropdown, modal): `0 8px 24px rgba(0,0,0,0.4)`.

---

## 3. Palet Warna

### Token

```css
:root {
  /* Surface */
  --bg-canvas:   #09090b; /* zinc-950, bukan hitam murni */
  --bg-surface:  #121215; /* kartu */
  --bg-elevated: #18181b; /* zinc-900: dropdown, modal, hover baris */

  /* Border */
  --border:        #27272a; /* zinc-800 */
  --border-strong: #3f3f46; /* zinc-700 */

  /* Teks */
  --text-primary:   #f4f4f5; /* zinc-100 */
  --text-secondary: #a1a1aa; /* zinc-400 */
  --text-muted:     #71717a; /* zinc-500: placeholder, caption */

  /* Aksen (pilih SATU) */
  --accent: #3b82f6;   /* alternatif: #10b981 */

  /* Status */
  --success: #22c55e;
  --warning: #eab308;
  --danger:  #ef4444;
}
```

### Aturan
* **Tombol utama:** latar `#fafafa`, teks `#09090b`. Atau pakai `--accent` bila perlu penekanan fungsional.
* **Satu aksen per layar.** Jangan campur biru dan hijau sebagai aksen setara.
* **Larangan gradien:** tidak ada gradien ungu-cyan atau gradien dekoratif di latar, tombol, maupun teks.

---

## 4. Tipografi

* **Sans:** `Geist Sans`, `Inter`, `system-ui`, sans-serif.
* **Mono:** `Geist Mono`, `JetBrains Mono`, monospace, untuk path, hash, API key, metrics, dan data key-value.

| Peran | Ukuran | Weight | Catatan |
|---|---|---|---|
| Display / H1 | 32-40px | 600 | `letter-spacing: -0.02em` |
| H2 | 24px | 600 | `letter-spacing: -0.01em` |
| H3 | 18px | 500 | - |
| Body | 14-15px | 400 | `line-height: 1.6` |
| Caption / label | 12-13px | 500 | warna `--text-secondary` |

* Hindari weight 700+ pada latar gelap karena terlihat berat dan "berpendar".
* Judul memakai `--text-primary`, deskripsi memakai `--text-secondary`.

---

## 5. Spacing & Layout

* **Basis grid:** 4px. Gunakan kelipatan `4 / 8 / 12 / 16 / 24 / 32 / 48`.
* **Padding kartu:** `16px` (padat) atau `24px` (standar).
* **Jarak antar-section:** minimal `48px`.
* **Lebar konten maksimum:** `1200px`, teks bacaan `65ch`.

---

## 6. Komponen Inti

**Tombol**
* *Primary:* latar `#fafafa`, teks `#09090b`; hover `#e4e4e7`.
* *Secondary:* latar transparan, border `--border-strong`, teks `--text-primary`; hover latar `--bg-elevated`.
* *Ghost:* tanpa border, teks `--text-secondary`; hover teks `--text-primary`.
* Tinggi standar `36px`, padding horizontal `14px`.

**Kartu**
* Latar `--bg-surface`, border `--border`; hover border naik ke `--border-strong`.
* Tanpa bayangan pada kondisi default.

**Input**
* Latar `--bg-canvas`, border `--border`, tinggi `36px`.
* Fokus: border `--text-secondary` + ring `0 0 0 3px rgba(161,161,170,0.15)`. Bukan ring neon.

**Tabel**
* Header `12px`, uppercase opsional, warna `--text-secondary`.
* Pemisah baris hanya `border-bottom: 1px solid --border`; hover baris `--bg-elevated`.

**Status Indicator**
* Dot solid `6px` (`#22c55e` live, `#eab308` pending, `#ef4444` error) dengan teks di sampingnya. Warna tidak boleh jadi satu-satunya penanda.

---

## 7. Interaksi & Motion

* **Transisi:** `150ms ease-out` pada warna, border, dan background saja.
* **Fokus keyboard:** outline `2px` offset `2px` berwarna `--text-secondary`; jangan dihapus.
* **Animasi:** minimal. Tidak ada bounce, glow berdenyut, atau parallax berlebihan.
* Hormati `prefers-reduced-motion`.

---

## 8. Checklist Cepat

**Lakukan:** border hairline, kanvas `#09090b`, teks `zinc-100/400`, satu aksen, font mono untuk data teknis.
**Hindari:** neon glow, gradien ungu-cyan, tombol pill, hitam murni `#000`, bayangan tebal, lebih dari satu warna aksen.