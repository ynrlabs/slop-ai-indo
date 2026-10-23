# antislop: Peta Jalan Pengembangan (Roadmap)

> Bagaimana antislop berevolusi dari satu berkas aturan tunggal menjadi sistem skill/plugin lintas agen yang dapat dipasang. Baru mengenal antislop? Bacalah [panduan pengguna](GUIDE.md) terlebih dahulu. Lihat [README.md](README.md) untuk ikhtisar produk.

---

## Posisi Kita Saat Ini

Rilis terbaru saat ini adalah **v3.2.16**. antislop adalah **sistem terpaket**: sebuah filter inti ramping yang selalu dimuat ditambah lima skill modular pelengkap, yang masing-masing didistribusikan sebagai folder skill agen terstandar (`skills/<nama>/SKILL.md`). Tidak ada README terpisah per modul skill.

- **Filter Inti: 38 Aturan** terbagi dalam tiga tingkatan (*Hard Gate*, *Purpose-Gate*, *Quality Locks*), sebuah *Liveliness Toolkit*, *Delivery Gate* mandatori, dan dua mode penggunaan (*During / After*). Jumlah aturan ini dipertahankan sejak v2.2 dan tingkatannya tidak digeser, namun rincian aturan terus diasah dan disempurnakan seiring waktu. Berkas tunggal `slop-ai-indo.md` tetap menjadi filter lengkap yang dapat Anda salin langsung ke jendela chat apa pun; wizard instalasi di dalamnya berfungsi sebagai jalur pemasangan manual.
- **Tujuh Skill Terstandar:** `antislop` (inti), ditambah `antislop-ui`, `antislop-copywriting`, `antislop-human`, `antislop-layoutmobile`, `antislop-code`, dan `antislop-security`. Setiap skill hanya dimuat saat tugas memerlukannya.
- **Distribusi Multi-Pintu:** Tujuh jalur instalasi dari satu repositori tunggal, dan alat pemeriksa kontras juga disediakan sebagai kakas MCP di dalam plugin. Jalur-jalur tersebut meliputi skrip pemasang lokal (`slop.bat` / `slop.ps1`), direktori skills.sh, dan plugin native untuk Claude Code, Antigravity, Codex, Cursor, dan Kimi Code.
- **Folder Bersama (.agents/skills/):** Antigravity membacanya secara default, Hermes memperlakukannya sebagai tier proyek di samping `.hermes/skills/`, dan Copilot, OpenCode, Codex, serta Kimi Code membacanya sebagai salah satu root pencarian. Pemasang menuliskan jalur resmi yang terdokumentasi untuk setiap agen sehingga instalasi selalu konsisten.

---

## Riwayat Rilis (Release History)

Penomoran versi hingga v3.0.0 mengikuti satu prinsip sederhana agar setiap fokus baru hadir secara terisolasi:

> Setiap kenaikan versi +0.1 merilis tepat satu skill modular baru.

| Versi | Apa yang Dirilis |
|-------|------------------|
| **v2.1.0** | Penambahan dua mode penggunaan (*During / After*) dan banner v3.0.0. |
| **v2.1.1** | Standarisasi repositori (penyederhanaan cermin dokumen). |
| **v2.2.0** | Skill modular pertama: `antislop-ui` (UI / visual). Filter inti ditambah First-Run Install Wizard. |
| **v2.3.0** | Penambahan `antislop-copywriting` (penulisan teks, judul, dan tone). |
| **v2.4.0** | Penambahan `antislop-human` (aksesibilitas, kontras warna, disertai skrip pemeriksa kontras). |
| **v2.4.1** | Penambahan `GUIDE.md`: panduan bahasa lugas bagi pengguna baru antislop. |
| **v2.4.2** | Perbaikan polaritas checklist skill (#9) dan pembersihan dokumentasi. |
| **v2.5.0** | Penambahan `antislop-layoutmobile` (tata letak responsif HP ke desktop). |
| **v3.0.0** | Pemaketan sistem skill/plugin: folder `skills/`, dua pintu distribusi, skrip installer lokal (`slop.bat`), pemeriksa kontras sebagai tool MCP, lisensi MIT. |
| **v3.0.1** | Perbaikan Snyk W012 (tanpa curl di runtime pada modul terpaket), kejelasan dokumentasi. |
| **v3.0.2** | Penyesuaian launcher python adaptif (`python3` di macOS/Linux, `python` di Windows). |
| **v3.1.0** | Penambahan `antislop-code` (pembersihan komentar kode klise AI); pola Data Pengisi dan Emoji Dekoratif. |
| **v3.1.1** | Pemasang CLI berhenti menyalin README per-skill ke proyek; wizard menghapus perintah install langsung (membersihkan peringatan Socket di skills.sh). |
| **v3.1.2** | Pemasang CLI menanyakan agen target secara interaktif agar folder mendarat di lokasi yang tepat. |
| **v3.1.3** | Batasan `DESIGN.md` ditegaskan (berkas eksternal adalah data untuk diterapkan, bukan perintah untuk dipatuhi); penjelasan audit `SECURITY.md`. |
| **v3.2.0** | Pemasang CLI mendukung hingga 7 agen (menambahkan OpenCode, Cursor, Gemini CLI, Hermes). |
| **v3.2.1** | Penutupan celah slop UI: bento grid berantakan, icon Lucide berlebihan, border neon, jendela terminal palsu. |
| **v3.2.2** | Pintu plugin Antigravity: repositori root menjadi plugin (`plugin.json` + rujukan `rules/slop-ai-indo.md`). |
| **v3.2.3** | Pintu plugin Codex: manifes `.codex-plugin/plugin.json` merujuk ke folder `skills/`. |
| **v3.2.4** | Pengetatan aturan R-35 menjadi uji klik interaktif (*click-through smoke test*): setiap elemen interaktif wajib diuji dan hasilnya dicatat di laporan Delivery Gate. |
| **v3.2.5** | Pintu plugin Cursor: manifes `.cursor-plugin/` dengan 6 skill dan pointer aturan `.mdc`. |
| **v3.2.6** | Babak kontribusi komunitas: runtime Python launcher untuk tool MCP kontras, penulisan pointer aman, smoke test yang ketat, dan section kontributor. |
| **v3.2.7** | Identifikasi pola slop baru: "Two-State Layout" (tanpa breakpoint menengah), "Over-Explained Comment", dan "Decorative Status Dot". Protokol konflik R-37 untuk `DESIGN.md`. |
| **v3.2.8** | Babak perbaikan dan validasi ulang menyeluruh terhadap dokumentasi resmi setiap vendor agen. Pemindahan jalur instalasi global Antigravity ke `~/.gemini/config/skills/`. |
| **v3.2.9** | Hermes mendapatkan cakupan level proyek dan verifikasi perintah `hermes skills trust`. Restrukturisasi panduan pengguna. Penambahan perbandingan gambar visual di README. |
| **v3.2.10** | Penambahan GitHub Copilot sebagai target installer. Penanganan tabrakan nama skill pada agen yang membaca multi-folder. Koreksi aturan em-dash R-02. |
| **v3.2.11** | Sinkronisasi folder global Codex ke `$HOME/.agents/skills`. Penambahan chart riwayat bintang (*star history*) di README. |
| **v3.2.12** | Integrasi Kimi Code: manifes `.kimi-plugin/plugin.json` yang memuat 6 skill dan pointer `systemPromptPath`. |
| **v3.2.13** | Penamaan versi otomatis pada disk (`skills/antislop/VERSION`) sehingga agen dan CLI dapat membaca versi yang terpasang secara pasti. Perbaikan parser pemisah markdown code-fence. |
| **v3.2.14** | Pintu integrasi Cline: konfigurasi root `package.json` untuk `cline plugin install`. |
| **v3.2.15** | Integrasi Amp: pembacaan direktori `.agents/skills/` level proyek dan `~/.config/agents/skills/` level pengguna. |
| **v3.2.16** | Fitur pembaruan otomatis untuk seluruh instalasi lokal dan global. Deteksi status plugin lokal (Claude, Codex, Antigravity, Cursor) dengan petunjuk perintah pembaruan presisi. |
| **v3.3.0** | **Rilis Saat Ini.** Integrasi modul skill `antislop-security` (audit keamanan menyeluruh, source-first hunting, verifikasi sandbox aman, skema ledger & temuan). |

---

## Rencana Selanjutnya (What's Next)

Dua aturan menjaga antrean pengembangan tetap jujur:
1. **Maksimal satu agen baru per versi:** Setiap rilis hanya membuka paling banyak satu pintu agen baru, sehingga potensi masalah terisolasi.
2. **Babak pemeliharaan tidak merilis agen baru:** Didedikasikan khusus untuk membayar hutang teknis, validasi ulang terhadap perubahan dokumentasi vendor, dan perbaikan laporan komunitas.

| Versi Target | Item | Rincian / Makna |
|--------------|------|-----------------|
| **v3.2.17** | Pi Coding Agent | Penambahan baris installer, pointer `AGENTS.md`, dan rujukan `package.json` root. |
| **v3.2.18** | Oh My Pi | Katalog marketplace dan verifikasi skema update Oh My Pi. |
| **v3.2.19** | Babak Pemeliharaan (Maintenance) | Pengujian langsung instalasi Cline & Kimi Code, serta opsi penyimpanan preferensi mode penggunaan. |

### Rencana Jangka Panjang (Tanpa Janji Versi)
- **Katalog Terbuka OpenAI:** Integrasi bundel skill untuk direktori ChatGPT & Codex.
- **Kiro & Roo Code:** Verifikasi mekanisme pembacaan folder aturan (`.roo/rules/` vs `.roo/skills/`).
- **antislop-compact:** Eksperimen varian berkas ringkas independen untuk penggunaan cepat.
- **Kandidat Skill Tambahan:** Eksplorasi modul `antislop-docs` dan `antislop-identity`.

---

## Hal yang Berada di Luar Cakupan (Not in Scope)

antislop tetap berpegang teguh sebagai **penyaring (filter), bukan panduan gaya (style guide)**:
- Tidak memaksakan estetika tunggal, tidak membatasi framework tertentu, dan tidak melarang tren desain secara membabi-buta.
- Tidak pernah mempercantik antarmuka secara sepihak; arah visual dan keindahan adalah hak prerogatif Anda di dalam `DESIGN.md`.
- Tidak terbatas hanya pada pembuatan halaman web: filter yang sama berlaku untuk teks tulisan (`antislop-copywriting`) dan komentar kode (`antislop-code`).
