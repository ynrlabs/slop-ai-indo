# Perburuan Celah Keamanan Rantai Pasok dan Rilis Perangkat Lunak (Supply Chain & Release)

#### Kapan menggunakan berkas ini

Gunakan berkas ini saat proyek menyelesaikan dependensi paket, membangun biner dari kontribusi publik/tak tepercaya, menjalankan alur kerja CI/CD (GitHub Actions, GitLab CI), membuat artefak rilis, menandatangani biner (code signing/cosign), mempromosikan build ke produksi, memuat plugin pihak ketiga, atau memperbarui perangkat lunak yang telah terpasang. Domain ini mencakup integritas serah-terima (trust handoff) mulai dari kode sumber dan pustaka dependensi hingga ke biner yang dijalankan pengguna akhir. Gunakan `MEMORY-SAFETY-AND-BINARY.md` untuk cacat parser pada binary loader lokal dan `CLOUD-AND-DEPLOYMENT.md` untuk wewenang beban kerja saat runtime.

Bagi target besar menjadi resolusi dependensi, isolasi runner CI, asal-usul artefak (provenance), otorisasi rilis, serta kepercayaan updater dan plugin.

## Disiplin Inti (sertakan dalam setiap prompt agen untuk domain ini)

```
- Dependensi yang bersifat mutable atau dependensi yang memiliki CVE lama bukanlah temuan otomatis. Tunjukkan siapa yang dapat memengaruhi resolusi paket, proses build mana yang mengonsumsinya, serta batasan eksekusi atau rilis apa yang dilanggar.
- Pantau integritas pada setiap titik serah-terima: identitas kode sumber, input paket teresolusi, runner pembuat build, digest identitas artefak, hasil pengujian, tanda tangan/atestasi, promosi staging ke produksi, dan pembaruan pada komputer klien.
- Konfigurasi CI/CD adalah kode otorisasi keamanan. Tentukan event pemicu alur kerja (workflow trigger), kode milik siapa yang dieksekusi, rahasia/token apa yang tersedia, dan apa yang diizinkan untuk dipublikasikan atau diubah.
- Checksum hash yang diunduh dari lokasi tak tepercaya yang sama dengan berkas biner tidak memberikan jaminan integritas independen. Temukan root of trust terverifikasi dan perilaku sistem saat validasi gagal.
- Gunakan status "confirmed" untuk kegagalan kontrol alur in-repo dengan validasi lokal yang terukur. Gunakan status "needs_validation" untuk aturan proteksi branch, runner cloud terkelola, registry privat, layanan penandatanganan KMS, atau alur promosi produksi yang tidak terlihat di kode sumber.
```

## Kelas Serangan Dependensi dan Input Proses Build (subagent_type: `general`)

**Kebingungan Sumber Dependensi dan Namespace (Dependency Confusion & Typosquatting)**
Konfigurasi manajer paket (npm, pip, cargo, gomod) dapat memilih namespace publik/privat yang salah, fallback registry tak tepercaya, mirror eksternal, repositori tiruan, atau URL sumber git berbahaya. Tinjau penamaan paket, prioritas registry sumber, penggunaan lockfile dan verifikasi hash sha512/integrity, berkas build alternatif, resolusi khusus platform, serta perbedaan perilaku antara instalasi pertama versus perintah pembaruan.

**Input Proses Build yang Bersifat Mutable dan Tidak Terikat**
Proses build mengonsumsi branch git mengambang, git tag yang dapat ditimpa, submodule tanpa commit hash yang terkunci, alat kompilasi yang diunduh via curl tanpa verifikasi hash, aset buatan remote, include jaringan, action GitHub yang menggunakan tag bergerak (misal: `@v1` alih-alih commit SHA), atau tag image kontainer (seperti `:latest`). Mensyaratkan adanya aktor berhak rendah yang dapat mengubah konten dan jalur menuju luaran rilis terpercaya.

**Celah Asal-Usul Kode yang Digenerasi dan Vendor (Codegen Provenance)**
Skema data, arsip pustaka vendored, klien API hasil generate, berkas lokalisasi, atau biner blob menghasilkan kode yang dapat dieksekusi atau dikirim ke pengguna tanpa melalui gerbang peninjauan dan integritas yang sama ketatnya dengan kode sumber utama. Bandingkan hasil generasi lokal dengan kode yang di-commit dan verifikasi siapa yang mengontrol input generator serta binary generator-nya.

**Penyertaan Berkas Tak Sengaja ke dalam Artefak Build (Build-Context Leak)**
Kunci rahasia API, konfigurasi lingkungan lokal, metadata folder `.git`, berkas uji coba, atau artefak sementara pengembang ikut terpaket ke dalam biner, arsip tarball, atau image Docker karena aturan `.dockerignore` / `.npmignore` yang longgar. Konfirmasikan bahwa artefak rilis akhir benar-benar membocorkan kredensial nyata, data privat, atau konfigurasi istimewa.

## Kelas Serangan Otomasi dan CI/CD (subagent_type: `general`)

**Eksekusi Kode Tak Tepercaya dalam Alur Kerja Berhak Tinggi**
Event Pull Request (misal: `pull_request_target`), komentar issue, fork eksternal, bot dependensi, atau webhook eksternal mengeksekusi kode yang dikontrol kontributor luar dengan akses ke GitHub Secrets, token tulis repositori, izin deployment, atau runner internal yang dipercayai. Bandingkan jenis event pemicu, ref commit yang di-checkout, gerbang persetujuan manual (approval gate), proteksi environment, dan pembatasan izin token (`permissions:` block).

**Kebingungan Perintah dan Ekspresi pada Alur Kerja (Script Injection)**
Nama branch yang dikontrol penyerang, pesan commit, judul issue, nama artefak, nilai matrix, atau output langkah kerja sebelumnya disisipkan langsung ke dalam perintah shell `run:`, ekspresi template `${{ ... }}`, path berkas, atau parameter istimewa tanpa sanitasi kanonikal.

**Pencampuran Kepercayaan Cache, Artefak, dan Ruang Kerja CI**
Pekerjaan (job) berhak rendah dapat mengisi cache dependensi, artefak sementara, workspace bersama, atau luaran build yang nantinya dipulihkan dan dieksekusi atau dirilis oleh job berhak lebih tinggi. Tinjau kunci dan namespace cache, identitas pembuat artefak, pengikatan digest SHA256, retensi data, dan apakah langkah promosi rilis menyelesaikan ulang paket berdasarkan nama mutable.

**Wewenang Otomasi yang Berlebihan (CI Identity Overreach)**
Job CI menerima token dengan izin di luar kebutuhan operasi, repositori, environment, atau durasi yang semestinya, dan input job tak tepercaya dapat memilih sumber daya yang terdampak. Ketiadaan prinsip least-privilege saja hanyalah catatan pengerasan; tunjukkan tindakan istimewa yang dapat dicapai penyerang.

## Kelas Serangan Rilis dan Pembaruan Perangkat Lunak (subagent_type: `general`)

**Substitusi Build-ke-Promosi (Bait-and-Switch Rilis)**
Tahap pengujian, peninjauan kode, penandatanganan digital, dan publikasi merujuk pada git tag, nama berkas, channel rilis, atau ID artefak yang bersifat mutable alih-alih merujuk pada digest hash kriptografis yang tidak dapat diubah (immutable digest). Periksa setiap langkah penyalinan, repackaging, penggabungan arsitektur multi-platform, dan rantai provenance antara proses build dan rilis final.

**Celah Otorisasi Rilis dan Kebijakan Penandatanganan Kode**
Rilis aplikasi atau tanda tangan digital diterima dari alur kerja yang salah, repositori fork, branch non-utama, environment pengujian, peran kunci privat yang salah, atau ketiadaan ambang batas multi-tanda tangan (threshold). Tinjau klaim identitas di dalam atestasi SLSA/Sigstore dan pastikan klien memvalidasi klaim tersebut, bukan hanya mengecek keabsahan tanda tangan kriptografi secara buta. Rotasi kunci, masa kedaluwarsa, dan pencabutan sertifikat harus bersifat fail-closed.

**Kebingungan Metadata Pembaruan dan Rollback Perangkat Lunak**
Mekanisme auto-updater memverifikasi byte payload pembaruan tetapi tidak mengikat nomor versi, ID produk, platform arsitektur, saluran pembaruan (channel), direktori tujuan, masa berlaku, atau pencegahan penurunan versi (anti-rollback), atau updater menerima metadata dan payload dari transaksi terotorisasi yang berbeda. Verifikasi instalasi atomik dan perilaku pemulihan kegagalan.

**Perluasan Kepercayaan Plugin dan Ekstensi**
Paket ekstensi/plugin memperoleh wewenang host di luar cakupan izin yang dideklarasikan, penerbit berhak rendah dapat menggantikan identitas penerbit resmi, atau skrip pengait instalasi/pembaruan (lifecycle hooks) dieksekusi sebelum pemeriksaan keaslian dan kapabilitas selesai. Pemasangan plugin secara sengaja oleh pengguna yang sama ke dalam ruang penggunanya sendiri bukanlah pelanggaran batasan hak istimewa.

## Langkah Kerja Universal

- Telusuri mundur mulai dari digest rilis final atau pembaruan yang terpasang menuju setiap kode sumber, input hasil generate, kredensial build, runner pekerja, cache, hasil pengujian, dan keputusan otorisasi rilis.
- Bandingkan event alur kerja tak tepercaya dan alur kerja terlindungi secara berdampingan. Tandai setiap saluran persistensi yang menghubungkan keduanya dan wajibkan penggunaan identitas permanen (digest) serta kepercayaan produsen.
- Tinjau skenario kunci privat dicabut, unduhan gagal di tengah jalan, atestasi tidak ditemukan, rilis sebagian platform, rollback versi darurat, dan kegagalan registry. Kebijakan saat terjadi kegagalan (failure policy) adalah pilar penentu integritas rilis.

## Aturan Validasi (terapkan sebelum melaporkan temuan apa pun di domain ini)

1. Sebutkan aktor berhak rendah, sumber/cache/artefak/metadata yang dapat dimanipulasi, job terpercaya atau updater yang mengonsumsinya, serta akibat publikasi tidak sah, penyisipan kode berbahaya, kebocoran rahasia, atau eksekusi perintah istimewa.
2. Buktikan pergantian identitas artefak pada titik serah-terima yang rusak. Nama mutable yang berbeda atau digest yang tidak terikat harus terbukti mencapai konsumen riil.
3. Verifikasi konfigurasi bawaan manajer paket, platform hosting repositori (GitHub/GitLab), registry paket, dan sistem penandatanganan pada versi yang digunakan. Kontrol cloud yang tidak dapat diobservasi langsung dari kode sumber memerlukan status `needs_validation`.
4. Jaga validasi lokal tetap aman dan terisolasi: gunakan repositori tiruan uji coba, penanda kredensial dummy, registry lokal, dan namespace artefak non-produksi. Jangan pernah memublikasikan paket atau mengubah rilis produksi nyata.
5. Berikan status `confirmed` hanya jika serah-terima kode sumber terlihat utuh dan dampak hasil terbukti nyata. Berikan status `needs_validation` jika ada fakta proteksi branch, runner cloud, registry privat, layanan penandatanganan digital, atau deployment yang harus diverifikasi oleh pemilik sistem.
