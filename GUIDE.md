# Panduan Lengkap Slop AI Indo (The Slop AI Indo Guide)

Slop AI Indo adalah sebuah penyaring (*filter*) yang Anda berikan kepada asisten AI coding yang sudah biasa Anda gunakan. Tujuannya adalah menghentikan AI menghasilkan kode atau teks murahan (*slop*): halaman web, teks tulisan, dan komentar kode yang terlihat generik dan jelas-jelas buatan bot AI. Ini adalah sebuah **filter, bukan panduan gaya (style guide)**. Slop AI Indo tidak pernah mendikte warna, jenis font, atau tata letak Anda. Ia membuang elemen murahan tersebut dan menyerahkan arah desain sepenuhnya kepada Anda.

Baru mengenal Slop AI Indo? Bacalah panduan ini dari awal hingga akhir sekali saja.

Panduan ini terbagi menjadi empat bagian. **Pemasangan (Install)** memandu cara memasang Slop AI Indo pada agen Anda. **Pembaruan (Update)** dan **Penghapusan (Remove)** menjelaskan langkah perawatan di kemudian hari. **Referensi (Reference)** memuat fakta-fakta teknis yang dapat Anda lihat sewaktu-waktu: daftar skill, tabel lokasi folder tiap agen, dan batasan apa yang sengaja tidak dilakukan oleh Slop AI Indo.

Tiga bagian pertama membahas jalur pemasangan yang sama dalam urutan yang sama, sehingga setelah Anda menemukan metode yang Anda pilih di satu bagian, Anda akan tahu posisinya di bagian lainnya. Jika Anda hanya ingin segera memasang, langsung lompat ke [Pemasangan](#pemasangan-install).

## Apa yang Dimaksud dengan "Slop"?

*Slop* adalah ciri visual dan gaya bahasa bawaan (*default*) AI yang klise dan murahan:

- Banner gradien warna memudar yang itu-itu saja di bagian atas, kartu-kartu dengan sudut membulat berlebihan, dan judul klise seperti *"Unlock the power of..."*.
- Teks yang terdengar sangat bersemangat dan hiperbola tetapi tidak memiliki substansi nyata.
- Halaman web yang terlihat bagus di tangkapan layar tetapi mengecewakan pengguna manusia nyata: teks yang menyatu dengan latar belakang (sulit dibaca), atau pengguna keyboard yang terkunci tidak bisa navigasi.

Jika Anda pernah menggunakan AI untuk membuat halaman web atau menulis teks, Anda pasti pernah melihat *slop*. Slop AI Indo diciptakan untuk menghilangkannya.

## Untuk Apa Saja Anda Dapat Menggunakannya?

Setiap output AI yang rentan menjadi murahan dapat diperbaiki dengan Slop AI Indo:

- **Membangun halaman atau aplikasi web baru:** tata letak, warna, struktur, dan animasi.
- **Menulis atau menyunting teks (*copywriting*):** judul, tombol, email, dan nada bicara yang tidak terdengar seperti buatan bot AI.
- **Menjaga halaman tetap ramah bagi manusia:** warna dengan kontras tinggi yang terbaca, navigasi keyboard, indikator fokus yang jelas, dan status tombol yang nyata.
- **Membersihkan komentar kode program:** membuang komentar basa-basi AI yang tidak berguna, dan mempertahankan komentar penting arsitektural.
- **Mengaudit pekerjaan yang sudah ada:** mencatat daftar temuan perbaikan yang perlu diperbaiki.

Berkas inti mencakup semuanya. Skill modular (lihat [Apa itu Skill?](#apa-itu-skill)) mendalami kebutuhan spesifik saat Anda memerlukan panduan yang lebih terfokus.

---

## Pemasangan (Install)

Ada empat jalur pemasangan, dan perbedaan di antara keduanya lebih penting daripada yang terlihat sekilas:

| Jalur | Apa yang Dilakukannya | Agen yang Didukung |
|-------|-----------------------|--------------------|
| **Pemasang Instan Lokal (`slop.bat`)** | Menyalin 1 paket lengkap (AGENTS.md, DESIGN.md, slop-ai-indo.md, dan skill) | Seluruh agen yang mendukung standar .agents/skills |
| **Direktori skills.sh & GitHub** | Menyalin folder skill langsung dari GitHub | Agen yang didukung oleh direktori tersebut |
| **Plugin Native (Plugin doors)** | Memuat slop-ai-indo langsung dari repositori ini tanpa menyalin berkas ke proyek | Claude Code, Antigravity, Codex, Cursor, Kimi Code, Cline, OpenCode |
| **Berkas Tunggal (The single file)** | Satu berkas Markdown yang Anda berikan ke AI apa pun | Apa pun yang dapat membaca teks, termasuk jendela chat HP |

Pilihlah salah satu. Semuanya memuat aturan yang sama persis, sehingga menambahkan cara kedua hanya akan membuat Anda memiliki dua hal yang harus diperbarui.

### Jalur Mana yang Harus Saya Pilih?

- **Pemasang Instan Lokal (`slop.bat` / `slop.ps1`):** Pilihan paling cepat dan lengkap jika Anda bekerja di Windows secara lokal. Secara otomatis menyalin file aturan inti, desain, dan seluruh modul skill tanpa butuh koneksi internet.
- **Direktori skills.sh & GitHub:** Pilih ini jika Anda ingin menarik modul skill langsung dari repositori GitHub menggunakan `npx skills add ynrlabs/slop-ai-indo`.
- **Plugin Native:** Pilih ini jika Anda menggunakan Claude Code, Antigravity, Codex, Cursor, Kimi Code, Cline, atau OpenCode dan lebih suka tidak menyimpan salinan berkas di dalam proyek Anda. Anda memperbaruinya langsung melalui perintah pembaruan plugin milik agen terkait.
- **Berkas Tunggal:** Pilih ini jika Anda tidak memiliki akses terminal, atau ingin menggunakan slop-ai-indo di jendela chat browser (ChatGPT web, Claude web) atau di ponsel.

### Sebelum Anda Memulai

Tiga dari empat jalur memerlukan terminal. Jika Anda tidak memiliki terminal atau tidak dapat memasang perangkat lunak di komputer ini, langsung lompat ke [Berkas Tunggal](#berkas-tunggal-the-single-file).

Berikut cara membuka terminal:
- **Windows:** Tekan tombol Start, ketik `powershell`, lalu buka.
- **macOS:** Tekan tombol Cmd dan Spasi bersamaan, ketik `terminal`, lalu tekan Enter.
- **Linux:** Buka aplikasi terminal Anda.

Anda juga memerlukan Node.js versi 18 atau yang lebih baru. Periksa versinya dengan mengetikkan ini lalu tekan Enter:

```bash
node -v
```

Jika Anda melihat keluaran seperti `v22.11.0`, komputer Anda sudah siap. Jika muncul pesan error, pasang Node.js terlebih dahulu dari [nodejs.org](https://nodejs.org), lalu tutup dan buka kembali terminal Anda.

---

### 1. Pemasang Resmi NPM (`npx slop-ai-indo`)

Cukup buka terminal di folder proyek Anda, lalu jalankan:

```bash
npx slop-ai-indo
```

Perintah ini secara otomatis memasang **1 paket lengkap** (`AGENTS.md`, `DESIGN.md`, `slop-ai-indo.md`, dan seluruh modul `.agents/skills`) ke proyek Anda.

---

### 2. Pemasang Instan Lokal Windows (`slop.bat` / `slop.ps1`)

Jika Anda ingin memasang secara offline tanpa koneksi internet:

```cmd
D:\project_yanuar\anti-slop\slop.bat
```

*(Atau jika menggunakan PowerShell: `powershell -File D:\project_yanuar\anti-slop\slop.ps1`)*

**Langkah 5. Mulai sesi agen yang baru.**
Slop AI Indo dimuat saat sesi baru dimulai, sehingga jendela sesi yang sedang terbuka saat ini belum membacanya. Tutup sesi obrolan agen Anda dan buka yang baru.

Untuk memastikan Slop AI Indo aktif, tanyakan hal yang hanya ada di dalam aturan Slop AI Indo, misalnya: *"Apa bunyi aturan R-02 pada Slop AI Indo?"*. Jika agen menjawab berdasarkan aturan tersebut, instalasi Anda berhasil.

---

### 2. Direktori Skills (skills.sh)

[skills.sh](https://skills.sh/ynrlabs/slop-ai-indo) adalah direktori terbuka skill agen coding. Jalur ini menggunakan kakas direktori tersebut untuk menyalin folder skill tanpa mengajukan pertanyaan:

```bash
npx skills add ynrlabs/slop-ai-indo
```

Gunakan bendera `--all` untuk memasang semua skill, `-g` untuk instalasi global, atau `--skill <nama>` untuk satu skill spesifik. Jalankan `--list` terlebih dahulu untuk melihat daftar skill yang tersedia.

Metode ini menyalin modul skill langsung dari GitHub ke `.agents/skills/`. Jika Anda ingin paket lengkap dengan `AGENTS.md` dan `DESIGN.md`, jalankan `slop.bat` di folder proyek Anda.

---

### 3. Plugin Native (Plugin Doors)

Plugin adalah fitur langsung dari agen, bukan bawaan Slop AI Indo. Anda mengarahkan agen ke repositori ini satu kali, dan sejak saat itu agen memuat Slop AI Indo langsung dari repositori. Tidak ada berkas yang disalin ke dalam proyek Anda. Versi baru diperoleh cukup dengan memperbarui pluginnya.

#### Claude Code

Di dalam sesi Claude Code, jalankan dua baris ini:

```text
/plugin marketplace add https://github.com/ynrlabs/slop-ai-indo
/plugin install slop-ai-indo
```

#### Antigravity

Jalankan perintah Antigravity CLI:

```bash
agy plugin install https://github.com/ynrlabs/slop-ai-indo
```

Komponen `rules/` miliknya secara otomatis memuat Slop AI Indo pada setiap sesi, jadi tidak ada berkas penunjuk tambahan yang perlu ditulis.

#### Codex

```bash
codex plugin marketplace add ynrlabs/slop-ai-indo
codex plugin add slop-ai-indo
```

#### Cursor

Tambahkan repositori sebagai marketplace plugin dengan Cursor Agent CLI:

```bash
agent plugin marketplace add https://github.com/ynrlabs/slop-ai-indo
```

Lalu, di dalam Cursor, buka menu **Customize** di bilah sisi (*sidebar*), cari **slop-ai-indo**, dan klik **Install** (pilih cakupan proyek atau pengguna).

#### Kimi Code

Di dalam sesi Kimi Code:

```text
/plugins install https://github.com/ynrlabs/slop-ai-indo
```

Setelah instalasi selesai, jalankan `/reload` atau `/new`. Kimi Code memasang plugin per pengguna, sehingga satu instalasi langsung mencakup semua proyek.

#### Cline

Plugin Cline dipasang melalui CLI:

```bash
cline plugin install https://github.com/ynrlabs/slop-ai-indo.git
```

*Perhatian:* Dokumentasi resmi Cline saat ini membatasi plugin hanya untuk SDK, CLI, dan Kanban, dan menyatakan bahwa fitur plugin belum berlaku untuk ekstensi VS Code dan JetBrains. Jika Anda menggunakan Cline di dalam ekstensi editor kode, gunakan metode 1 (`slop.bat`) atau metode 2 (Direktori Skills).

#### OpenCode

Repositori ini berfungsi sebagai plugin dan marketplace OpenCode. Pasang menggunakan OpenCode CLI:

```bash
opencode plugin marketplace install https://github.com/ynrlabs/slop-ai-indo
```

---

### 4. Berkas Tunggal (The Single File)

Gunakan metode ini jika Anda tidak memiliki terminal atau jika AI Anda hanya berupa antarmuka obrolan web/aplikasi di mana Anda tidak dapat menjalankan perintah terminal.

**1. Unduh berkas `slop-ai-indo.md` sekali.**
- Lewat browser: buka halaman repositori [di sini](https://github.com/ynrlabs/slop-ai-indo), buka `slop-ai-indo.md`, lalu klik tombol Download.
- Lewat terminal (jika tersedia):
  ```bash
  curl -o slop-ai-indo.md https://raw.githubusercontent.com/ynrlabs/slop-ai-indo/main/slop-ai-indo.md
  ```

**2. Berikan berkas tersebut kepada AI Anda, lalu sampaikan kebutuhan Anda.**
`slop-ai-indo.md` adalah teks biasa, sehingga semua model AI dapat membacanya. Jika AI Anda dapat membaca file lokal (Claude Code, Cursor, Cline, dll.), letakkan file tersebut di folder kerja proyek Anda. Jika AI Anda berupa jendela obrolan (ChatGPT web, Claude web), buka `slop-ai-indo.md` di teks editor, salin semua isinya, lalu tempelkan ke obrolan.

Ketikkan instruksi ini kepada AI:
> Baca `slop-ai-indo.md` dan ikuti instruksi instalasinya. Saya ingin memasang skill UI dan copywriting.

Jika Anda menempelkan isi teks secara langsung, ketik: *"Ikuti petunjuk instalasi yang saya tempelkan di atas. Saya ingin skill UI dan copywriting."*

**3. Jawab pertanyaan dari wizard.**
Wizard akan mengonfirmasi skill apa yang Anda inginkan dan menanyakan kapan slop-ai-indo harus diterapkan: saat AI sedang bekerja (*during*), atau setelah pekerjaan selesai untuk audit (*after*). Pilih *during* untuk pekerjaan baru.

---

### Penggunaan di Ponsel (Smartphone)

Pemasang CLI, direktori skills, dan pintu plugin semuanya memerlukan terminal, sehingga tidak berjalan langsung di ponsel. Di ponsel, Anda menggunakan metode berkas tunggal:

- **Claude Projects, ChatGPT Projects, atau Gemini Gems:** Semuanya menerima berkas sebagai referensi proyek. Unduh `slop-ai-indo.md`, lampirkan ke dalam project atau custom instructions, lalu tambahkan instruksi singkat agar AI selalu mematuhinya. Ukuran berkas ~50 KB sangat jauh di bawah batas kuota dokumen referensi platform tersebut.
- **Catatan Penting:** Di dalam agen coding, slop-ai-indo berfungsi sebagai instruksi terstandar yang dipatuhi secara ketat. Di aplikasi chat ponsel, slop-ai-indo berfungsi sebagai dokumen konteks panduan. Aturan tetap bekerja memfilter gaya bahasa dan tata letak, namun penegakannya bergantung pada kepatuhan model AI obrolan.

---

## Pembaruan (Update)

Pembaruan slop-ai-indo tidak berjalan otomatis di latar belakang. Setiap jalur diperbarui dengan menjalankan perintah jalurnya masing-masing, atau dengan menimpa salinan yang sudah ada.

**Bagaimana mengetahui ada versi baru?**
Dua tempat selalu memuat versi terkini: [halaman rilis GitHub](https://github.com/ynrlabs/slop-ai-indo/releases) dan lencana versi di bagian atas berkas [README.md](README.md).

**Versi berapa yang sedang terpasang di komputer Anda?**
Folder `slop-ai-indo` yang terpasang memuat file `VERSION`. Anda dapat membukanya langsung, atau bertanya pada agen Anda: *"Versi slop-ai-indo berapa yang sedang terpasang?"*.

### Perintah Pembaruan Cepat

Untuk memperbarui skill ke versi terbaru dari GitHub, jalankan perintah berikut di folder proyek Anda:

```bash
npx skills add ynrlabs/slop-ai-indo
```

Atau jika menggunakan installer lokal Windows, jalankan kembali `slop.bat` di folder proyek Anda.

Perintah ini akan mencari di proyek saat ini dan folder home pengguna, memperbarui setiap folder slop-ai-indo yang ditemukan, mempertahankan pilihan skill yang sebelumnya sudah dipasang, dan mencetak nomor versi yang diperbarui.

### Pembaruan Tiap Plugin Native

| Platform Agen | Perintah Pembaruan |
|---------------|--------------------|
| **Claude Code** | `claude plugin update slop-ai-indo@slop-ai-indo` (lalu buka ulang atau jalankan `/reload-plugins`) |
| **Antigravity** | Jalankan ulang: `agy plugin install https://github.com/ynrlabs/slop-ai-indo` |
| **Codex** | `codex plugin marketplace upgrade slop-ai-indo` |
| **Cursor** | `agent plugin marketplace update https://github.com/ynrlabs/slop-ai-indo` (atau via panel Customize) |
| **Kimi Code** | Jalankan ulang: `/plugins install https://github.com/ynrlabs/slop-ai-indo` lalu `/reload` |
| **Cline** | `cline plugin install https://github.com/ynrlabs/slop-ai-indo.git --force` |
| **OpenCode** | `opencode plugin marketplace install https://github.com/ynrlabs/slop-ai-indo` |
| **Berkas Tunggal** | Unduh ulang berkas `slop-ai-indo.md` terbaru dan gantikan file yang lama |

---

## Penghapusan (Remove)

### Menghapus Pemasang CLI

Dua hal yang perlu dihapus:
1. **Folder skill yang disalin:** Hapus folder `slop-ai-indo` atau `slop-ai-indo-*` di dalam folder skill agen Anda (misalnya di `.agents/skills/` atau `.claude/skills/`).
2. **Blok penunjuk di file inisialisasi:** Buka `AGENTS.md`, `CLAUDE.md`, atau `GEMINI.md`, cari blok antara `<!-- slop-ai-indo:start -->` dan `<!-- slop-ai-indo:end -->`, lalu hapus blok tersebut. Jika file tersebut tidak memuat aturan lain, Anda dapat menghapus file tersebut.

### Menghapus Plugin Native

- **Claude Code:** `/plugin uninstall slop-ai-indo@slop-ai-indo`
- **Antigravity:** `agy plugin uninstall slop-ai-indo` (atau `agy plugin disable slop-ai-indo` untuk menonaktifkan sementara)
- **Codex:** `codex plugin remove slop-ai-indo@slop-ai-indo`
- **Cursor:** Hapus dari panel Customize, atau hapus marketplacenya: `agent plugin marketplace remove slop-ai-indo`
- **Kimi Code:** `/plugins remove slop-ai-indo`
- **Cline:** Hapus folder plugin di `~/.cline/plugins/_installed/`
- **OpenCode:** `opencode plugin uninstall slop-ai-indo`

---

## Referensi Teknis (Reference)

### Di Mana Tiap Agen Membaca Slop AI Indo?

| Agen Coding | Jalur Pembacaan Proyek |
|-------------|------------------------|
| Claude Code | `.claude/skills/` |
| Codex | `.codex/skills/` |
| Antigravity | `.agents/skills/` |
| OpenCode | `.opencode/skills/` |
| Cursor | `.cursor/skills/` |
| Cline | `.cline/skills/` |
| Amp | `.agents/skills/` |
| Gemini CLI | `.gemini/skills/` |
| Hermes | `.hermes/skills/` |
| GitHub Copilot | `.agents/skills/` |
| Kimi Code | `.agents/skills/` |
| Oh My Pi | `.omp/skills/` |
| DeepSeek | `.deepseek/skills/` |

### Apa itu Skill?

Skill adalah modul opsional (berisi berkas `SKILL.md`) yang mendalami satu topik tertentu secara mendalam. Filter inti bekerja secara mandiri; modul skill menambahkan kepatuhan spesifik:
- **slop-ai-indo-ui:** Tampilan visual, geometri sudut, warna, komponen, animasi.
- **slop-ai-indo-copywriting:** Judul, tombol aksi, nada bicara, larangan klaim/statistik palsu AI.
- **slop-ai-indo-human:** Keterbacaan warna, kepatuhan rasio kontras WCAG, navigasi keyboard.
- **slop-ai-indo-layoutmobile:** Tata letak responsif HP ke desktop, breakpoint, area sentuh minimal 44x44px.
- **slop-ai-indo-code:** Pembersihan komentar kode klise tanpa mengubah logika kode.
- **slop-ai-indo-security:** Audit keamanan mendalam, identifikasi kerentanan source-first, threat modeling, pengujian sandbox aman, dan pelaporan defensif terstruktur.
- **slop-ai-indo-docs:** Standar kebersihan dokumentasi teknis, README, PRD, dan spesifikasi arsitektur.
- **slop-ai-indo-identity:** Karakter produk unik, branding terarah, dan pencegahan klon template generik.
- **slop-ai-indo-backend:** Arsitektur server, API controller, sanitasi query database, dan error handling.
- **slop-ai-indo-test:** Pengujian otomatis, validasi skenario gagal nyata, dan pencegahan over-mocking.

### Apa yang Sengaja Tidak Dilakukan oleh Slop AI Indo?

Slop AI Indo tidak pernah mempercantik antarmuka secara sepihak tanpa arahan. Slop AI Indo membuang apa yang murahan (*slop*); ia tidak menciptakan konsep gaya dari ketiadaan. Jika Anda menginginkan gaya visual tertentu, tuangkan dalam berkas `DESIGN.md` di proyek Anda, dan AI akan membangun antarmuka sesuai dokumen tersebut.

Jika berkas `DESIGN.md` Anda secara eksplisit meminta sesuatu yang dianggap *slop* oleh aturan Slop AI Indo, sistem tidak akan menuruti secara diam-diam dan juga tidak akan mengabaikan Anda secara sepihak: sistem akan menyebutkan elemen yang diminta, menyebutkan aturan yang dilanggar, dan meminta konfirmasi apakah Anda tetap ingin mempertahankannya.
