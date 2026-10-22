# Panduan Lengkap antislop (The antislop guide)

antislop adalah sebuah penyaring (*filter*) yang Anda berikan kepada asisten AI coding yang sudah biasa Anda gunakan. Tujuannya adalah menghentikan AI menghasilkan kode atau teks murahan (*slop*): halaman web, teks tulisan, dan komentar kode yang terlihat generik dan jelas-jelas buatan bot AI. Ini adalah sebuah **filter, bukan panduan gaya (style guide)**. antislop tidak pernah mendikte warna, jenis font, atau tata letak Anda. Ia membuang elemen murahan tersebut dan menyerahkan arah desain sepenuhnya kepada Anda.

Baru mengenal antislop? Bacalah panduan ini dari awal hingga akhir sekali saja.

Panduan ini terbagi menjadi empat bagian. **Pemasangan (Install)** memandu cara memasang antislop pada agen Anda. **Pembaruan (Update)** dan **Penghapusan (Remove)** menjelaskan langkah perawatan di kemudian hari. **Referensi (Reference)** memuat fakta-fakta teknis yang dapat Anda lihat sewaktu-waktu: daftar skill, tabel lokasi folder tiap agen, dan batasan apa yang sengaja tidak dilakukan oleh antislop.

Tiga bagian pertama membahas jalur pemasangan yang sama dalam urutan yang sama, sehingga setelah Anda menemukan metode yang Anda pilih di satu bagian, Anda akan tahu posisinya di bagian lainnya. Jika Anda hanya ingin segera memasang, langsung lompat ke [Pemasangan](#pemasangan-install).

## Apa yang Dimaksud dengan "Slop"?

*Slop* adalah ciri visual dan gaya bahasa bawaan (*default*) AI yang klise dan murahan:

- Banner gradien warna memudar yang itu-itu saja di bagian atas, kartu-kartu dengan sudut membulat berlebihan, dan judul klise seperti *"Unlock the power of..."*.
- Teks yang terdengar sangat bersemangat dan hiperbola tetapi tidak memiliki substansi nyata.
- Halaman web yang terlihat bagus di tangkapan layar tetapi mengecewakan pengguna manusia nyata: teks yang menyatu dengan latar belakang (sulit dibaca), atau pengguna keyboard yang terkunci tidak bisa navigasi.

Jika Anda pernah menggunakan AI untuk membuat halaman web atau menulis teks, Anda pasti pernah melihat *slop*. antislop diciptakan untuk menghilangkannya.

## Untuk Apa Saja Anda Dapat Menggunakannya?

Setiap output AI yang rentan menjadi murahan dapat diperbaiki dengan antislop:

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
| **Pemasang CLI (The installer)** | Menyalin folder skill ke dalam proyek Anda atau folder home pengguna | Sebelas agen, tanpa setup rumit selain terminal |
| **Direktori skills.sh** | Menyalin folder yang sama menggunakan alat skills.sh | Agen yang didukung oleh direktori tersebut |
| **Plugin Native (Plugin doors)** | Memuat antislop langsung dari repositori ini tanpa menyalin berkas ke proyek | Claude Code, Antigravity, Codex, Cursor, Kimi Code, Cline |
| **Berkas Tunggal (The single file)** | Satu berkas Markdown yang Anda berikan ke AI apa pun | Apa pun yang dapat membaca teks, termasuk jendela chat HP |

Pilihlah salah satu. Semuanya memuat aturan yang sama persis, sehingga menambahkan cara kedua hanya akan membuat Anda memiliki dua hal yang harus diperbarui.

### Jalur Mana yang Harus Saya Pilih?

- **Pemasang CLI:** Pilih ini jika Anda ingin antislop di satu proyek atau global di seluruh komputer, dan Anda menggunakan salah satu dari 11 agen coding. Ini adalah satu-satunya jalur yang mencakup OpenCode, Cline, Amp, Gemini CLI, Hermes, dan GitHub Copilot, serta satu-satunya yang mendeteksi agen Anda secara otomatis.
- **Direktori skills.sh:** Pilih ini jika Anda sudah terbiasa menggunakan alat `skills.sh` dan menginginkan folder skill tanpa melalui pertanyaan-pertanyaan interaktif pemasang.
- **Plugin Native:** Pilih ini jika Anda menggunakan Claude Code, Antigravity, Codex, Cursor, Kimi Code, atau Cline dan lebih suka tidak menyimpan salinan berkas di dalam proyek Anda. Anda memperbaruinya langsung melalui perintah pembaruan plugin milik agen terkait.
- **Berkas Tunggal:** Pilih ini jika Anda tidak memiliki akses terminal, atau ingin menggunakan antislop di jendela chat browser (ChatGPT web, Claude web) atau di ponsel.

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

### 1. Pemasang CLI (The Installer)

Menyalin folder skill ke folder yang Anda pilih. Pada instalasi level proyek, pemasang ini juga secara otomatis menuliskan blok penunjuk (*pointer*) yang memuat ulang antislop di setiap sesi baru.

**Langkah 1. Masuk ke folder proyek Anda.**
Terminal biasanya dimulai di folder home Anda, jadi arahkan ke lokasi proyek Anda:

```bash
cd ~/projects/my-site
```

Gunakan jalur nyata Anda. Di Windows, contohnya seperti `cd C:\Users\NamaAnda\projects\my-site`. Jika tidak ingin mengetik manual, ketik `cd ` (beri spasi), lalu seret (*drag and drop*) folder proyek Anda dari File Explorer ke jendela terminal.

Ketik `ls` (macOS/Linux) atau `dir` (Windows) untuk memastikan Anda sudah berada di dalam folder proyek yang benar.

**Langkah 2. Jalankan pemasang.**

```bash
npx antislop-ai
```

Eksekusi pertama kali akan mengunduh antislop sementara, beri waktu beberapa detik.

**Langkah 3. Jawab empat pertanyaan interaktif.**
Gunakan tombol panah untuk berpindah opsi, Spasi untuk memilih, dan Enter untuk mengonfirmasi:
- **Extra skills to install (Skill tambahan yang ingin dipasang):** Filter inti selalu terpasang otomatis. Pilih skill tambahan yang sesuai dengan kebutuhan Anda, atau lewati jika hanya butuh inti.
- **Install location (Lokasi instalasi):** *This project* memasang ke folder proyek yang sedang dibuka dan menambahkan blok penunjuk ke file inisialisasi agen. *Everywhere* memasang secara global ke folder home pengguna tanpa blok penunjuk. Untuk pertama kali, pilih *This project*.
- **Which agent(s) (Agen mana yang Anda pakai):** Pemasang akan otomatis menandai agen yang terdeteksi di proyek Anda. Pastikan agen Anda terpilih.
- **Install N skill(s) now?** Pilih Yes.

**Langkah 4. Periksa ringkasan yang dicetak.**

```
◇ Installed 2 skill(s) into 1 agent folder(s).
│ Pointer written to AGENTS.md
antislop is ready. The next agent session loads it.
```

**Langkah 5. Mulai sesi agen yang baru.**
antislop dimuat saat sesi baru dimulai, sehingga jendela sesi yang sedang terbuka saat ini belum membacanya. Tutup sesi obrolan agen Anda dan buka yang baru.

Untuk memastikan antislop aktif, tanyakan hal yang hanya ada di dalam aturan antislop, misalnya: *"Apa bunyi aturan R-02 pada antislop?"*. Jika agen menjawab berdasarkan aturan tersebut, instalasi Anda berhasil.

---

### 2. Direktori Skills (skills.sh)

[skills.sh](https://skills.sh/yanuar1997/anti-slop-ai) adalah direktori terbuka skill agen coding. Jalur ini menggunakan kakas direktori tersebut untuk menyalin folder skill tanpa mengajukan pertanyaan:

```bash
npx skills add yanuar1997/anti-slop-ai
```

Gunakan bendera `--all` untuk memasang semua skill, `-g` untuk instalasi global, atau `--skill <nama>` untuk satu skill spesifik. Jalankan `--list` terlebih dahulu untuk melihat daftar skill yang tersedia.

Metode ini tidak menuliskan blok penunjuk ke file inisialisasi agen. Jika Anda ingin menambahkan blok penunjuk setelahnya, jalankan `npx antislop-ai`, pilih skill dan agen yang sama, lalu pilih opsi **Keep what is there** saat sistem mendeteksi folder sudah ada.

---

### 3. Plugin Native (Plugin Doors)

Plugin adalah fitur langsung dari agen, bukan bawaan antislop. Anda mengarahkan agen ke repositori ini satu kali, dan sejak saat itu agen memuat antislop langsung dari repositori. Tidak ada berkas yang disalin ke dalam proyek Anda. Versi baru diperoleh cukup dengan memperbarui pluginnya.

#### Claude Code

Di dalam sesi Claude Code, jalankan dua baris ini:

```text
/plugin marketplace add https://github.com/yanuar1997/anti-slop-ai
/plugin install antislop@anti-slop-ai
```

#### Antigravity

Jalankan perintah Antigravity CLI:

```bash
agy plugin install https://github.com/yanuar1997/anti-slop-ai
```

Komponen `rules/` miliknya secara otomatis memuat antislop pada setiap sesi, jadi tidak ada berkas penunjuk tambahan yang perlu ditulis.

#### Codex

```bash
codex plugin marketplace add yanuar1997/anti-slop-ai
codex plugin add antislop@anti-slop-ai
```

#### Cursor

Tambahkan repositori sebagai marketplace plugin dengan Cursor Agent CLI:

```bash
agent plugin marketplace add https://github.com/yanuar1997/anti-slop-ai
```

Lalu, di dalam Cursor, buka menu **Customize** di bilah sisi (*sidebar*), cari **antislop**, dan klik **Install** (pilih cakupan proyek atau pengguna).

#### Kimi Code

Di dalam sesi Kimi Code:

```text
/plugins install https://github.com/yanuar1997/anti-slop-ai
```

Setelah instalasi selesai, jalankan `/reload` atau `/new`. Kimi Code memasang plugin per pengguna, sehingga satu instalasi langsung mencakup semua proyek.

#### Cline

Plugin Cline dipasang melalui CLI:

```bash
cline plugin install https://github.com/yanuar1997/anti-slop-ai.git
```

*Perhatian:* Dokumentasi resmi Cline saat ini membatasi plugin hanya untuk SDK, CLI, dan Kanban, dan menyatakan bahwa fitur plugin belum berlaku untuk ekstensi VS Code dan JetBrains. Jika Anda menggunakan Cline di dalam ekstensi editor kode, gunakan metode 1 (Pemasang CLI `npx antislop-ai`).

---

### 4. Berkas Tunggal (The Single File)

Gunakan metode ini jika Anda tidak memiliki terminal atau jika AI Anda hanya berupa antarmuka obrolan web/aplikasi di mana Anda tidak dapat menjalankan perintah terminal.

**1. Unduh berkas `antislop.md` sekali.**
- Lewat browser: buka halaman repositori [di sini](https://github.com/yanuar1997/anti-slop-ai), buka `antislop.md`, lalu klik tombol Download.
- Lewat terminal (jika tersedia):
  ```bash
  curl -o antislop.md https://raw.githubusercontent.com/yanuar1997/anti-slop-ai/main/antislop.md
  ```

**2. Berikan berkas tersebut kepada AI Anda, lalu sampaikan kebutuhan Anda.**
`antislop.md` adalah teks biasa, sehingga semua model AI dapat membacanya. Jika AI Anda dapat membaca file lokal (Claude Code, Cursor, Cline, dll.), letakkan file tersebut di folder kerja proyek Anda. Jika AI Anda berupa jendela obrolan (ChatGPT web, Claude web), buka `antislop.md` di teks editor, salin semua isinya, lalu tempelkan ke obrolan.

Ketikkan instruksi ini kepada AI:
> Baca `antislop.md` dan ikuti instruksi instalasinya. Saya ingin memasang skill UI dan copywriting.

Jika Anda menempelkan isi teks secara langsung, ketik: *"Ikuti petunjuk instalasi yang saya tempelkan di atas. Saya ingin skill UI dan copywriting."*

**3. Jawab pertanyaan dari wizard.**
Wizard akan mengonfirmasi skill apa yang Anda inginkan dan menanyakan kapan antislop harus diterapkan: saat AI sedang bekerja (*during*), atau setelah pekerjaan selesai untuk audit (*after*). Pilih *during* untuk pekerjaan baru.

---

### Penggunaan di Ponsel (Smartphone)

Pemasang CLI, direktori skills, dan pintu plugin semuanya memerlukan terminal, sehingga tidak berjalan langsung di ponsel. Di ponsel, Anda menggunakan metode berkas tunggal:

- **Claude Projects, ChatGPT Projects, atau Gemini Gems:** Semuanya menerima berkas sebagai referensi proyek. Unduh `antislop.md`, lampirkan ke dalam project atau custom instructions, lalu tambahkan instruksi singkat agar AI selalu mematuhinya. Ukuran berkas ~50 KB sangat jauh di bawah batas kuota dokumen referensi platform tersebut.
- **Catatan Penting:** Di dalam agen coding, antislop berfungsi sebagai instruksi terstandar yang dipatuhi secara ketat. Di aplikasi chat ponsel, antislop berfungsi sebagai dokumen konteks panduan, sehingga tidak ada mekanisme otomatis yang menjalankan laporan Delivery Gate untuk Anda. Aturan tetap bekerja memfilter gaya bahasa dan tata letak, namun penegakannya bergantung pada kepatuhan model AI obrolan.

---

## Pembaruan (Update)

Pembaruan antislop tidak berjalan otomatis di latar belakang. Setiap jalur diperbarui dengan menjalankan perintah jalurnya masing-masing, atau dengan menimpa salinan yang sudah ada.

**Bagaimana mengetahui ada versi baru?**
Dua tempat selalu memuat versi terkini: [halaman rilis GitHub](https://github.com/yanuar1997/anti-slop-ai/releases) dan lencana versi di bagian atas berkas [README.md](README.md).

**Versi berapa yang sedang terpasang di komputer Anda?**
Folder `antislop` yang terpasang memuat file `VERSION`. Anda dapat membukanya langsung, atau bertanya pada agen Anda: *"Versi antislop berapa yang sedang terpasang?"*.

### Satu Perintah untuk Kedua Rute Berkas

Pemasang CLI dan direktori skills.sh menulis file yang sama ke folder yang sama. Perintah berikut memperbarui keduanya secara otomatis tanpa perlu menjawab pertanyaan:

```bash
npx antislop-ai --update
```

Perintah ini akan mencari di proyek saat ini dan folder home pengguna, memperbarui setiap folder antislop yang ditemukan, mempertahankan pilihan skill yang sebelumnya sudah dipasang, dan mencetak nomor versi yang diperbarui.

### Pembaruan Tiap Plugin Native

| Platform Agen | Perintah Pembaruan |
|---------------|--------------------|
| **Claude Code** | `claude plugin update antislop@anti-slop-ai` (lalu buka ulang atau jalankan `/reload-plugins`) |
| **Antigravity** | Jalankan ulang: `agy plugin install https://github.com/yanuar1997/anti-slop-ai` |
| **Codex** | `codex plugin marketplace upgrade anti-slop-ai` |
| **Cursor** | `agent plugin marketplace update https://github.com/yanuar1997/anti-slop-ai` (atau via panel Customize) |
| **Kimi Code** | Jalankan ulang: `/plugins install https://github.com/yanuar1997/anti-slop-ai` lalu `/reload` |
| **Cline** | `cline plugin install https://github.com/yanuar1997/anti-slop-ai.git --force` |
| **Berkas Tunggal** | Unduh ulang berkas `antislop.md` terbaru dan gantikan file yang lama |

---

## Penghapusan (Remove)

### Menghapus Pemasang CLI

Dua hal yang perlu dihapus:
1. **Folder skill yang disalin:** Hapus folder `antislop` atau `antislop-*` di dalam folder skill agen Anda (misalnya di `.agents/skills/` atau `.claude/skills/`).
2. **Blok penunjuk di file inisialisasi:** Buka `AGENTS.md`, `CLAUDE.md`, atau `GEMINI.md`, cari blok antara `<!-- antislop:start -->` dan `<!-- antislop:end -->`, lalu hapus blok tersebut. Jika file tersebut tidak memuat aturan lain, Anda dapat menghapus file tersebut.

### Menghapus Plugin Native

- **Claude Code:** `/plugin uninstall antislop@anti-slop`
- **Antigravity:** `agy plugin uninstall antislop` (atau `agy plugin disable antislop` untuk menonaktifkan sementara)
- **Codex:** `codex plugin remove antislop@anti-slop`
- **Cursor:** Hapus dari panel Customize, atau hapus marketplacenya: `agent plugin marketplace remove anti-slop`
- **Kimi Code:** `/plugins remove antislop`
- **Cline:** Hapus folder plugin di `~/.cline/plugins/_installed/`

---

## Referensi Teknis (Reference)

### Di Mana Tiap Agen Membaca antislop?

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

### Apa itu Skill?

Skill adalah modul opsional (berisi berkas `SKILL.md`) yang mendalami satu topik tertentu secara mendalam. Filter inti bekerja secara mandiri; modul skill menambahkan kepatuhan spesifik:
- **antislop-ui:** Tampilan visual, geometri sudut, warna, komponen, animasi.
- **antislop-copywriting:** Judul, tombol aksi, nada bicara, larangan klaim/statistik palsu AI.
- **antislop-human:** Keterbacaan warna, kepatuhan rasio kontras WCAG, navigasi keyboard.
- **antislop-layoutmobile:** Tata letak responsif HP ke desktop, breakpoint, area sentuh minimal 44x44px.
- **antislop-code:** Pembersihan komentar kode klise tanpa mengubah logika kode.
- **antislop-security:** Audit keamanan mendalam, identifikasi kerentanan source-first, threat modeling, pengujian sandbox aman, dan pelaporan defensif terstruktur.

### Apa yang Sengaja Tidak Dilakukan oleh antislop?

antislop tidak pernah mempercantik antarmuka secara sepihak tanpa arahan. antislop membuang apa yang murahan (*slop*); ia tidak menciptakan konsep gaya dari ketiadaan. Jika Anda menginginkan gaya visual tertentu, tuangkan dalam berkas `DESIGN.md` di proyek Anda, dan AI akan membangun antarmuka sesuai dokumen tersebut.

Jika berkas `DESIGN.md` Anda secara eksplisit meminta sesuatu yang dianggap *slop* oleh aturan antislop, sistem tidak akan menuruti secara diam-diam dan juga tidak akan mengabaikan Anda secara sepihak: sistem akan menyebutkan elemen yang diminta, menyebutkan aturan yang dilanggar, dan meminta konfirmasi apakah Anda tetap ingin mempertahankannya.
