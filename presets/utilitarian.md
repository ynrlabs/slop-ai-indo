# DESIGN.md - Preset: Utilitarian & Dense Data (Standar Grafana & Datadog)

> **Arah Desain:** Rasio data-to-ink maksimal, border tegas 1-2px, tipografi tabular dan grid padat (Grafana, Datadog, Retool, Bloomberg).
> Dokumen ini memandu agen AI merancang antarmuka dashboard data-intensif, analitik teknis, dan alat internal developer.

---

## 1. Prinsip Inti

1. **Data dulu, dekorasi nol.** Setiap piksel harus membawa informasi atau struktur.
2. **Padat tapi terpindai.** Kerapatan tinggi dijaga lewat grid ketat, border tegas, dan hierarki tipografi yang konsisten.
3. **Warna berarti status.** Warna hanya untuk makna data (normal, waspada, kritis), bukan hiasan.
4. **Semua bisa difilter.** Setiap panel menghormati time range dan variabel global yang sama.

---

## 2. Token Desain

```css
:root {
  /* Surface */
  --bg-canvas:  #f3f4f6;
  --bg-panel:   #ffffff;
  --bg-header:  #f9fafb;  /* header tabel, judul panel */
  --bg-stripe:  #f9fafb;  /* zebra */
  --bg-hover:   #eef2f7;
  --bg-select:  #e0ecff;

  /* Border */
  --border:        #d1d5db;
  --border-strong: #9ca3af;  /* fokus, panel terpilih */

  /* Teks */
  --text-primary:   #111827;
  --text-secondary: #4b5563;
  --text-muted:     #6b7280;

  /* Aksen fungsional (SATU, untuk interaksi) */
  --accent: #2563eb;

  /* Status data */
  --ok:       #16a34a;  --ok-bg:   #dcfce7;
  --warn:     #d97706;  --warn-bg: #fef3c7;
  --crit:     #dc2626;  --crit-bg: #fee2e2;
  --inactive: #6b7280;  --inactive-bg: #f3f4f6;

  /* Radius & spasi */
  --radius: 2px;
  --gap: 8px;
  --pad: 8px;

  /* Font */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Roboto Mono", ui-monospace, monospace;
}

[data-theme="dark"] {
  --bg-canvas:  #111827;
  --bg-panel:   #1f2937;
  --bg-header:  #243041;
  --bg-stripe:  #222c3b;
  --bg-hover:   #2b3a4f;
  --bg-select:  #1e3a5f;

  --border:        #374151;
  --border-strong: #6b7280;

  --text-primary:   #f3f4f6;
  --text-secondary: #9ca3af;
  --text-muted:     #8b95a5;

  --accent: #60a5fa;

  --ok: #22c55e;  --warn: #f59e0b;  --crit: #ef4444;
  --ok-bg: rgba(34,197,94,0.15);  --warn-bg: rgba(245,158,11,0.15);
  --crit-bg: rgba(239,68,68,0.15);
}
```

---

## 3. Geometri & Batas

* **Radius:** `2px` untuk panel, input, tombol, badge; `0px` untuk tabel dan sel grid. DILARANG pill dan `rounded-full`.
* **Border:** `1px solid var(--border)` pada setiap batas panel, kolom, dan baris. Gunakan `2px` hanya untuk pemisah struktural (header tabel, sidebar) atau penanda status panel (garis atas).
* **Larangan:** `box-shadow` melayang, glassmorphism (`backdrop-filter`), glow, dan gradien dekoratif.
* **Elemen melayang** (dropdown, tooltip, modal): latar solid, `1px solid var(--border-strong)`, tanpa bayangan lembut.

---

## 4. Palet Warna

* **Kanvas:** `--bg-canvas`; **panel** solid `--bg-panel`.
* **Aksen biru** hanya untuk elemen interaktif: tautan, seleksi, fokus, dan tombol utama.
* **Status data** adalah warna semantik utama:

| Status | Warna | Penggunaan |
|---|---|---|
| OK / Nominal | `#16a34a` | Sehat, dalam ambang |
| Warning / Elevated | `#d97706` | Mendekati ambang |
| Critical / Alert | `#dc2626` | Melewati ambang, butuh tindakan |
| Muted / Inactive | `#6b7280` | Nonaktif, tidak ada data |

* **Seri grafik** (maksimal 8 warna, urutan tetap): `#2563eb`, `#16a34a`, `#d97706`, `#9333ea`, `#0891b2`, `#db2777`, `#65a30d`, `#6b7280`. Warna merah dan hijau status tidak dipakai sebagai seri biasa bila ada ambang di panel yang sama.
* DILARANG gradien dekoratif, dan gradien area pada grafik (pakai isian datar dengan opasitas `0.15`).

---

## 5. Tipografi & Angka

* **Sans:** `Inter` atau `system-ui` untuk label dan judul.
* **Mono:** `JetBrains Mono` atau `Roboto Mono` untuk **semua nilai data**, ID, timestamp, query, dan log.

| Peran | Font | Ukuran | Weight | Catatan |
|---|---|---|---|---|
| Judul dashboard | Sans | 18-20px | 600 | - |
| Judul panel | Sans | 12-13px | 600 | `--text-secondary`, boleh uppercase |
| Nilai stat besar | Mono | 28-40px | 600 | `tabular-nums`, unit lebih kecil dan redup |
| Isi tabel | Mono / Sans | 12px | 400 | `line-height: 1.35` |
| Label / legenda | Sans | 11-12px | 400-500 | - |
| Timestamp / meta | Mono | 11px | 400 | `--text-muted` |

* Semua angka `font-variant-numeric: tabular-nums`; kolom angka **rata kanan**.
* Unit (`ms`, `%`, `req/s`, `MB`) lebih kecil dan redup di samping nilai; gunakan satuan SI dan pemendekan konsisten (`1,2k`, `3,4M`).
* Ukuran teks minimum `11px`.

---

## 6. Tata Letak Dashboard

| Area | Spesifikasi |
|---|---|
| Sidebar | `48px` (ikon) atau `200px`, border-right `1px`, item `28px` |
| Toolbar atas | `40px`, sticky: breadcrumb, variabel, time range, refresh, mode TV |
| Grid panel | 24 kolom, tinggi baris `30px`, gap `8px` |
| Padding panel | `8px`; header panel `28px` dengan border-bottom hairline |

* **Urutan:** baris stat/ringkasan di atas, grafik deret waktu di tengah, tabel dan log di bawah.
* **Baris dapat dilipat** (collapsible) dengan judul grup untuk mengelola densitas.
* Panel dapat di-resize dan dipindah; garis resize `2px` `--accent` saat drag.
* **Mode TV/kiosk:** sembunyikan sidebar dan toolbar, perbesar font stat.

---

## 7. Komponen Inti

**Panel**
* Latar `--bg-panel`, border `1px solid var(--border)`, radius `2px`, tanpa bayangan.
* Header: judul kiri, menu aksi (`...`) dan ikon info kanan (muncul saat hover). Opsional garis atas `2px` berwarna status.

**Panel Stat (Single Value)**
* Nilai besar mono, unit kecil, perubahan periode sebelumnya (`▲ 4,2%`) dengan warna status bila bermakna, sparkline `24px` tinggi di bawah.
* Latar boleh tint status (`--ok-bg`, `--crit-bg`) hanya saat melewati ambang.

**Tabel**
* Header sticky, latar `--bg-header`, border-bottom `2px`, teks `11px` weight 600 uppercase `--text-secondary`.
* Baris `24px-28px`; zebra `--bg-stripe`; hover `--bg-hover`; baris terpilih `--bg-select`.
* Border `1px` pada setiap sel (grid penuh) atau minimal baris; kolom dapat disortir (panah di header), diubah ukuran, dan disembunyikan.
* Sel dengan ambang: latar tint status; sel numerik dengan bar inline (isian datar `0.2` opasitas).
* Footer: jumlah baris, paginasi atau virtual scroll untuk data besar.

**Grafik Deret Waktu**
* Garis `1.5px`, tanpa smoothing berlebihan, tanpa gradien area; gridline hairline `--border` horizontal dan vertikal tipis.
* Sumbu `11px` mono, label waktu konsisten dengan zona waktu dashboard.
* **Tooltip bersama** (shared crosshair) di semua panel; isi: timestamp, lalu seri dengan swatch `8px` dan nilai `tabular-nums` diurutkan menurun.
* **Garis ambang** putus-putus (`stroke-dasharray: 4 3`) berwarna status; wilayah kritis diisi datar `0.08`.
* **Legenda:** di bawah atau kanan, tabel kecil dengan kolom min/maks/rata-rata/terakhir; klik menyembunyikan seri, `Ctrl`+klik mengisolasi.
* **Anotasi** (deploy, insiden) berupa garis vertikal tipis dengan penanda kecil.

**Heatmap & Bar**
* Skala warna sekuensial satu hue (biru atau abu), bukan pelangi; legenda skala selalu ditampilkan.

**Log Viewer**
* Mono `12px`, baris `20px`, level berwarna lewat teks kecil (`ERROR`, `WARN`, `INFO`) bukan latar penuh; baris dapat diperluas menjadi JSON terstruktur; teks cari disorot `--warn-bg`.

**Badge & Status**
* Radius `2px`, padding `1px 6px`, mono `11px` uppercase; dot `6px` + teks (`OK`, `WARN`, `CRIT`, `NO DATA`).

**Kontrol Filter**
* **Time range picker:** tombol dengan ikon jam dan rentang (`Last 6 hours`), dropdown berisi preset cepat (5m, 15m, 1h, 6h, 24h, 7d) dan input absolut; dukung zona waktu.
* **Variabel/template:** dropdown multi-select di toolbar (env, service, host), dengan chip nilai terpilih radius `2px`.
* **Auto-refresh:** pilihan interval (off, 5s, 30s, 1m) dengan indikator jeda.
* **Input & select:** tinggi `28px`, font `12px`, border `1px solid --border`, fokus border `--accent`.

**Tombol** (tinggi `28px`, padding `0 10px`, `12px`)
* *Primary:* latar `--accent`, teks putih. *Secondary:* latar `--bg-panel`, border `--border`. *Ghost:* tanpa border. Radius `2px`.

**Alert & Banner**
* Strip tipis `32px` berlatar tint status dengan border kiri `3px`; teks singkat dan tautan ke detail.

---

## 8. State & Interaksi

* **Transisi:** hampir nihil; `80ms-120ms` pada warna saja. Tanpa animasi masuk dekoratif.
* **Fokus keyboard:** outline `2px solid var(--accent)`, offset `1px`; jangan dihapus.
* **Loading:** skeleton datar per panel atau teks mono `Loading…`; panel lain tetap interaktif.
* **No data:** teks `NO DATA` mono di tengah panel, abu-abu; bedakan dari nilai nol.
* **Error panel:** ikon segitiga kecil di header, pesan singkat saat hover, dan tombol coba lagi.
* **Pintasan:** `t z` zoom out, `[` `]` geser waktu, `/` pencarian, `?` bantuan; tampilkan lewat `<kbd>` (radius `2px`, mono `11px`).
* **Drill-down:** klik titik atau baris membuka panel detail/eksplorasi dengan konteks time range terbawa.
* Hormati `prefers-reduced-motion` dan `prefers-color-scheme`.

---

## 9. Responsif

| Breakpoint | Perilaku |
|---|---|
| ≥ 1440px | Grid 24 kolom penuh, sidebar `200px` |
| 1024-1439px | Sidebar ikon `48px`, panel menyesuaikan lebar |
| 768-1023px | Panel 12 kolom (dua per baris), toolbar membungkus |
| < 768px | Satu kolom; tabel scroll horizontal dalam kontainer; grafik tinggi minimum `200px` |

* Densitas tetap dipertahankan; jangan memperbesar padding secara otomatis di desktop.
* Target sentuh minimal `36px` pada layar sentuh; halaman tidak boleh scroll menyamping.

---

## 10. Aksesibilitas

* Kontras teks minimal WCAG AA (`4.5:1`), termasuk `--text-muted` dan teks `11px`.
* Status tidak bergantung warna: selalu ada teks (`OK`, `CRIT`) atau simbol (`▲`, `▼`).
* Seri grafik dibedakan juga lewat bentuk penanda atau gaya garis bila ada lebih dari 3 seri; sediakan tampilan tabel data sebagai alternatif grafik.
* Tabel memakai `<th scope>`, sortir diumumkan lewat `aria-sort`; pembaruan data live memakai `aria-live="polite"` dengan frekuensi terbatas.
* Semua panel dan kontrol dapat dijangkau keyboard; urutan tab mengikuti urutan visual.

---

## 11. Checklist Cepat

**Lakukan:** padding `6-10px`, border `1px` di setiap batas, radius `0-2px`, nilai data mono `tabular-nums` rata kanan, header tabel sticky, zebra halus, time range global, warna hanya untuk status, tooltip bersama, state `NO DATA` yang jelas.
**Hindari:** bayangan melayang, glassmorphism, gradien dekoratif (termasuk area grafik), tombol pill, ruang kosong berlebih, pelangi pada heatmap, status yang hanya dibedakan warna, font di bawah `11px`, dan animasi dekoratif.