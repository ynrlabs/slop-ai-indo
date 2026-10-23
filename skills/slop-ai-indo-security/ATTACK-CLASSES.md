# Kelas Serangan Keamanan (Attack Classes)

#### Kelas Serangan: pilih dan pisahkan berdasarkan Fase 1

Pilih kelas serangan yang relevan dengan jenis aplikasi. Tidak setiap kelas serangan berlaku untuk setiap basis kode. Daftar di bawah ini adalah titik awal; tambahkan kelas khusus aplikasi dari temuan Fase 1 dan pisahkan basis kode besar per subsistem. Bingkai pekerjaan sebagai proses menemukan, memvalidasi, memperbaiki, dan memprioritaskan kerentanan. Batasi validasi pada tinjauan kode sumber dan pengujian fixture lokal terikat; dilarang mengembangkan rantai eksploitasi payload yang merusak, menguji ketersediaan pada layanan live, atau mengambil tindakan di lingkungan bersama.

Gunakan status `confirmed` hanya jika bukti kode sumber dan validasi terikat membuktikan seluruh batas dan hasil yang nyata. Gunakan status `needs_validation` jika fakta spesifik terkait deployment, penyedia cloud, platform, identitas, atau runtime belum tersedia; nyatakan fakta yang hilang serta pemeriksaan aman oleh pemilik sistem atau pengujian lokal yang dapat menyelesaikannya.

> **Target native / biner / kernel** (C/C++/Rust-unsafe, modul kernel, parser dan decoder, FFI, runtime konkuren, loader biner, JIT, firmware): gunakan kelas memory-safety, integer/ABI, konkurensi, binary-loader, dan antarmuka berhak akses khusus di [MEMORY-SAFETY-AND-BINARY.md](MEMORY-SAFETY-AND-BINARY.md).
>
> **Target AI / LLM / agen** (chatbot, RAG, memori persisten, agen pemanggil tool, server/klien MCP, penyusunan prompt, atau aksi terkontrol model): gunakan kelas context, memory-poisoning, action-binding, tool-schema, MCP-identity, dan output di [AI-AND-LLM.md](AI-AND-LLM.md).
>
> **Target HTTP, web, dan identitas** (aplikasi web biasa, API, reverse proxy, CDN, gateway, parser HTTP kustom, sesi, CSRF, JWT, OAuth/OIDC, SAML, MFA, passkey, pemulihan/penautan akun, API key, atau mTLS): gunakan [WEB-PROTOCOL-AND-AUTH.md](WEB-PROTOCOL-AND-AUTH.md).
>
> **Target sisi klien dan browser** (SPA, ekstensi browser, embedded webview, service worker, penyimpanan browser, perpesanan lintas jendela, CORS, WebSocket, atau rendering DOM): gunakan [CLIENT-SIDE.md](CLIENT-SIDE.md).
>
> **Target rantai pasok dan rilis** (resolusi dependensi, input tergenerasi, CI, rilis/penandatanganan/promosi, pembaruan, plugin, atau ekstensi): gunakan [SUPPLY-CHAIN-AND-RELEASE.md](SUPPLY-CHAIN-AND-RELEASE.md).
>
> **Target cloud dan deployment** (IAM, infrastructure as code, container/Kubernetes, service mesh, serverless/edge, ingress, event penyedia cloud, atau konfigurasi runtime): gunakan [CLOUD-AND-DEPLOYMENT.md](CLOUD-AND-DEPLOYMENT.md).
>
> **Target protokol, RPC, dan pesan** (gRPC, transport GraphQL, Protobuf/Cap'n Proto/Thrift, protokol kustom, antrian, broker, pub/sub, webhook, atau streaming RPC): gunakan [PROTOCOLS-RPC-AND-MESSAGING.md](PROTOCOLS-RPC-AND-MESSAGING.md).
>
> **Target ketersediaan dan kehabisan sumber daya** (pekerjaan tidak tepercaya yang dapat menguras CPU, memori, disk, koneksi, worker, antrian, kuota bersama, atau biaya tagihan operator): gunakan [RESOURCE-EXHAUSTION-AND-AVAILABILITY.md](RESOURCE-EXHAUSTION-AND-AVAILABILITY.md).
>
> **Target isolasi data dan siklus hidup** (penyimpanan multi-tenant, cache/pencarian, tautan objek, analitik, ekspor/backup, migrasi, penghapusan, retensi, atau pemulihan data): gunakan [DATA-ISOLATION-AND-LIFECYCLE.md](DATA-ISOLATION-AND-LIFECYCLE.md).
>
> **Target desktop, mobile, dan IPC lokal** (aplikasi native, deep link, jembatan webview, komponen tereksploitasi, helper istimewa, daemon lokal, socket Unix/XPC/Binder/D-Bus): gunakan [DESKTOP-MOBILE-AND-LOCAL-IPC.md](DESKTOP-MOBILE-AND-LOCAL-IPC.md).

**Injection** (subagent_type: `general`)
Telusuri input tidak tepercaya dari titik masuk hingga ke titik akhir berbahaya (dangerous sink). Definisi "sink berbahaya" bergantung pada jenis aplikasi:
- Aplikasi web: kueri SQL, output HTML mentah, perintah shell, template engine, path berkas, pengalihan HTTP, deserialisasi data
- Pustaka kode (library): fungsi apa pun yang memproses data masukan pemanggil tanpa validasi: operasi buffer, parser, format string
- Alat CLI: penyusunan perintah shell, penanganan path berkas, interpolasi variabel lingkungan
- Layanan backend: penyusunan kueri data, serialisasi pesan, log injection, kueri LDAP/XPATH
- Sisi klien (browser/JS): DOM XSS, prototype pollution, kepercayaan `postMessage`/origin, dan kelas browser lainnya: dicakup oleh dokumen pendamping [CLIENT-SIDE.md](CLIENT-SIDE.md) saat dipilih

Jangan berhenti pada jalur langsung yang tampak nyata. Cari injeksi tidak langsung (second-order injection): data disimpan dengan aman terlebih dahulu, lalu diambil dan digunakan dalam konteks berbahaya oleh bagian kode yang berbeda. Periksa injeksi melalui nama field objek, key dictionary, header HTTP, dan metadata: bukan hanya dari nilai isi. Periksa injeksi ke sistem sekunder (log server, cache, indeks pencarian, sistem analitik).

**Access control** (subagent_type: `general`)
Verifikasi bahwa pemanggil tidak dapat melakukan tindakan di luar batas otoritasnya. Lebih dari sekadar memeriksa apakah pemeriksaan izin itu ada: verifikasi bahwa kode memeriksa izin yang *tepat* untuk resource yang *tepat* melalui mekanisme yang *tepat*:
- Apakah ada jalur alternatif menuju perubahan status yang sama namun memeriksa izin yang berbeda (lebih lemah)?
- Bisakah field di dalam body request menimpa batasan yang seharusnya ditegakkan oleh sistem izin?
- Apakah ada endpoint yang membatasi autentikasi tetapi lupa memeriksa otorisasi peran?
- Apakah resource yang sama memiliki beberapa jalur akses dengan pemeriksaan yang tidak konsisten?
- Bagaimana dengan operasi massal (bulk/batch/ekspor/impor): apakah operasi tersebut menegakkan izin per item secara konsisten?

Untuk model hak akses yang kompleks, pisahkan menjadi agen khusus untuk bypass autentikasi vs logika otorisasi bisnis.

**Resource and file handling** (subagent_type: `general`)
- Path traversal (membaca atau menulis di luar direktori yang diizinkan): termasuk melalui symlink, urutan encoding khusus, dan null byte
- SSRF (membuat aplikasi mengambil URL yang dikendalikan penyerang): termasuk melalui pengalihan redirect, DNS rebinding, dan perbedaan parser URL
- Deserialisasi yang tidak aman, ekstraksi arsip (zip slip), penanganan berkas sementara (temp file)
- Keamanan memori (jika relevan): buffer overflow, use-after-free, integer overflow
- Race condition pada operasi berkas (TOCTOU antara waktu periksa dan waktu pakai)

**Cryptography and secrets** (subagent_type: `general`)
- Pengacakan acak yang lemah (pseudo-random) untuk nilai kritis keamanan (token sesi, kunci enkripsi, nonce)
- Kredensial rahasia yang di-hardcode di kode sumber, rahasia di log sistem, pesan error, URL, atau respons sisi klien
- Derivasi kunci yang cacat, ketiadaan verifikasi HMAC, penggunaan ulang nonce
- Serangan timing side-channel pada perbandingan rahasia/token
- Penyalahgunaan primitif kriptografi (mode cipher ECB, enkripsi tanpa autentikasi, IV statis)
- Apa yang terjadi jika operasi kriptografi gagal? Apakah alur penanganan error fallback ke mode tanpa enkripsi?

**Business logic** (subagent_type: `general`)
Buru kesalahan logika secara cermat: pemindai otomatis standar tidak dapat menemukannya, padahal logika yang cacat menghasilkan temuan berbobot tinggi. Untuk setiap alur kerja utama:
- **Pelanggaran mesin status (State machine violations)**: Bisakah pengguna melewati tahapan alur? Melangkah mundur? Mencapai status yang tidak valid? Apa yang terjadi jika alur yang sudah selesai diputar ulang? Bagaimana jika terjadi kegagalan parsial: jika langkah 2 dari 3 gagal, apakah langkah 1 di-rollback?
- **Race condition berdampak bisnis**: Operasi bersamaan yang menghasilkan status tidak sah (double-spend saldo, double-approve persetujuan, lost updates). Fokus pada operasi yang memeriksa lalu bertindak (check-then-act) secara non-atomik.
- **Manipulasi angka dan kuantitas**: Nilai negatif, nilai nol, overflow bilangan, kehilangan presisi desimal, pemaksaan konversi tipe (type coercion) antara string dan angka.
- **Pelanggaran batas akses**: Bukan sekadar "apakah pemeriksaan izin ada", melainkan "apakah itu pemeriksaan yang tepat untuk aturan bisnis terkait?" Bisakah input pada satu operasi melewati batasan yang ditegakkan pada operasi lain untuk efek yang sama?
- **Asumsi kepercayaan implisit**: Data dari database, konfigurasi, komponen lain, atau plugin dianggap aman karena "kita sudah memvalidasinya saat data masuk pertama kali." Bagaimana jika ada jalur kode lain yang menulis data tersebut tanpa validasi?
- **Logika berbasis waktu**: Pemeriksaan kedaluwarsa, penjadwalan cron, jendela rate-limit, perbedaan jam server (clock skew). Apa yang terjadi tepat pada momen batas waktu? Bagaimana dengan perbedaan zona waktu antarkomponen?
- **Perilaku default dan fallback**: Bagaimana postur keamanan ketika konfigurasi tidak ada? Ketika fitur dimatikan? Ketika dependensi eksternal mati? Saat sistem berada di tengah proses migrasi data?

**Feature abuse and data leakage** (subagent_type: `general`)
Fitur sah yang disalahgunakan untuk tujuan yang tidak diinginkan. Cari cacat dalam desain, bukan hanya pada sintaks kode:
- **Ekspor dan backup sebagai jalur pencurian data (exfiltration)**: Bisakah pengguna berhak rendah memicu ekspor, snapshot, atau backup yang memuat data di atas hak aksesnya? Bisakah mereka mengekspor data milik pengguna lain? Apakah ekspor memuat draf privat atau konten terhapus? Riwayat revisi yang seharusnya sudah dibersihkan?
- **Impor dan restore sebagai jalur injeksi**: Bisakah impor menimpa data pengguna lain? Bisakah ia membuat rekaman data yang melewati validasi normal? Bisakah ia menyuntikkan konten ke koleksi data yang tidak memiliki hak tulis? Apakah ia mematuhi model izin yang sama seperti antarmuka pengguna?
- **Pencarian, filter, dan pengurutan sebagai oracle**: Bisakah kueri pencarian mengungkap apakah suatu konten ada meskipun pengguna tidak dapat membukanya secara langsung? Apakah parameter filter memungkinkan pengguna menebak status, peran, atau field rahasia? Apakah pengurutan berdasarkan field tersembunyi membocorkan nilainya melalui urutan hasil?
- **Enumerasi melalui efek samping**: Apakah pesan error berbeda antara "data tidak ditemukan" dan "akses ditolak"? Apakah ada perbedaan waktu respons (timing leak)? Perbedaan ukuran respons? Perbedaan kode status HTTP? Bisakah penyerang menginventarisasi daftar pengguna lewat alur reset password, undangan, atau registrasi?
- **Kebocoran pratinjau, draf, dan staging**: Apakah token pratinjau dibatasi pada satu item atau membuka akses luas? Bisakah konten draf ditemukan melalui pencarian internal, RSS feed, sitemap, atau endpoint API listing? Bisakah header cache menyebabkan CDN menyajikan konten privat ke publik?
- **Notifikasi dan webhook sebagai SSRF**: Bisakah pengguna mengatur URL notifikasi, webhook, atau callback yang diambil oleh server? Apakah URL tersebut divalidasi terhadap jaringan lokal internal? Bagaimana jika terjadi pengalihan redirect?

**Chained vulnerabilities and trust boundaries** (subagent_type: `general`)
Perilaku yang tampak aman dan terisolasi secara individu dapat menjadi kerentanan fatal saat komponen lain atau tahapan siklus hidup lain mengandalkan jaminan yang lebih kuat:
- **Kegagalan batas multi-tahap**: Petakan apa saja yang boleh dibaca, ditulis, dipanggil, dan disimpan oleh peran berhak rendah, lalu hubungkan hanya output konkret ke keputusan kepercayaan berikutnya. Buktikan setiap prasyarat dan jangan mengasumsikan efek hilir.
- **Kesenjangan kepercayaan antarkomponen**: Komponen A memvalidasi input lalu meneruskannya ke komponen B. Bandingkan jaminan persis yang dihasilkan A dengan apa yang diasumsikan oleh B, termasuk pemotongan panjang teks, pemaksaan tipe, normalisasi karakter, cakupan tenant, dan akses plugin.
- **Penggunaan sekunder (Second-order use)**: Data yang aman saat disimpan bisa menjadi berbahaya di konteks berikutnya. Nama field menjadi JSON path, slug menjadi path berkas lokal, teks lolos masuk ke raw rendering, atau string tersimpan berubah menjadi URL, regex, template, atau ekspresi kebijakan keamanan.
- **Pelebaran cakupan dan kapabilitas**: Token, API key, plugin, OAuth, MCP, atau kapabilitas AI menjadi lebih luas setelah delegasi, penyegaran token, caching, pergantian peran, atau komposisi fungsi. Sebutkan operasi konkret yang seharusnya tidak dimiliki oleh subjek tersebut.
- **Waktu dan urutan peristiwa**: Tinjau proses inisialisasi, migrasi, soft-delete, masa berlaku cache/pencabutan token, jeda periksa/pakai, dan jeda validasi/konsumsi data. Buktikan bahwa data basi benar-benar diterima sebelum melaporkan temuan.
- **Rollback dan pemulihan**: Fitur pembatalan hapus (undelete), pemulihan backup, pengembalian revisi, dan pembatalan transaksi wajib menerapkan kepemilikan, validasi, dan otorisasi saat ini. Buktikan status tidak valid mana yang berhasil dipulihkan.

**Wildcard** (subagent_type: `general`)
Anda tidak diberikan kategori tertentu. Temukan kerentanan di luar kelas standar yang sudah ditugaskan.

Baca kode yang terlihat membosankan atau tampak tidak terhubung dengan fitur keamanan. Telusuri fitur yang belum selesai, eksperimental, kompatibilitas lama, dan fitur fallback darurat, dengan tetap menerapkan persyaratan batas konkret dan validasi yang sama seperti kelas lainnya.

Gunakan titik awal penelusuran ini:
- Kode apa yang paling aneh di repositori ini? Mengapa ia ada? Apa yang terjadi jika kode itu disalahgunakan?
- Apakah ada fitur yang terasa setengah jadi, eksperimental, atau ditempelkan terburu-buru? Fitur semacam itu biasanya memiliki keamanan paling lemah karena paling sedikit mendapatkan review.
- Apa yang terjadi jika Anda menggunakan API dengan cara yang tidak pernah dilakukan oleh tampilan frontend? Tampilan antarmuka membatasi pengguna biasa, tetapi endpoint API tidak membatasinya. Panggilan API apa yang memungkinkan tetapi tidak pernah dipicu oleh klien resmi?
- Apakah ada endpoint, parameter, header, atau fitur tersembunyi yang tidak terdokumentasi? Periksa pendaftaran rute (routes), middleware, dan file konfigurasi untuk hal-hal yang tidak ada di dokumen panduan.
- Apa yang terjadi jika Anda menggabungkan fitur yang tidak dirancang untuk berjalan bersamaan? Lokalisasi bahasa + pratinjau + caching. Impor data + plugin + webhook. OAuth + impersonasi akun + API key.
- Apakah ada hal menarik di riwayat commit git? Perbaikan keamanan yang di-revert, pemeriksaan auth yang dikomentari, secret yang pernah di-commit lalu dihapus (namun masih ada di riwayat git).
- Tindakan akun sah mana yang memengaruhi pengguna lain, integritas bersama, ketersediaan sistem, atau biaya tagihan operator? Verifikasi pembatasan, kuota, otorisasi, dan pemulihan di sekitar tindakan tersebut.
- Operasi mana yang tidak dapat dibatalkan (irreversible) atau membutuhkan konfirmasi bertingkat? Ikat otorisasi dan persetujuan ke subjek, tindakan, dan resource final.
- Asumsi apa yang dibuat oleh kode tentang lingkungan eksekusinya? Bahwa database selalu lokal, bahwa jam server selalu akurat, bahwa respon DNS selalu tepercaya, bahwa sistem berkas membedakan huruf besar-kecil?
- Periksa berkas pengujian: apa yang **tidak** diuji oleh developer? Bandingkan kasus ekstrem yang dipikirkan developer (ada pengujiannya) dengan kasus yang terlewat (tanpa pengujian).

Telusuri anomali di dalam lingkup penugasan Anda hingga status invarian dapat dipastikan. Jika suatu kode tampak janggal, baca sampai Anda dapat menyatakan apakah kode tersebut aman atau rentan. Jika sebuah fungsi memiliki komentar yang menjelaskan mengapa ia aman, verifikasi kebenaran penjelasan tersebut. Jika sebuah variabel bernama `temp`, `hack`, atau `legacy`, baca dengan sangat teliti.

**Obvious things** (subagent_type: `general`)
Agen lain memburu celah yang rumit dan samar. Agen ini bertugas memeriksa eksposur keamanan mendasar yang sering terlewat karena semua orang berasumsi sudah diperiksa oleh orang lain:
- Apakah ada kata sandi, API key, token, atau secret yang di-hardcode di kode sumber? (lakukan pencarian teks untuk kata `password`, `secret`, `apikey`, `token`, `Bearer`, `-----BEGIN`, atau kata sandi default umum)
- Apakah ada komentar TODO/FIXME/HACK/XXX yang merujuk pada masalah keamanan? (`TODO: add auth`, `FIXME: validate input`, `HACK: skip permission check`)
- Apakah mode debug / mode pengembang terlindungi dengan benar? Bisakah ia diaktifkan di server produksi melalui environment variable, query parameter, atau request header?
- Apakah ada kredensial dummy/test/seed yang masih aktif dan berfungsi di server produksi?
- Apakah ada endpoint `/debug`, `/admin`, `/test`, `/status`, `/health`, `/metrics`, `/env`, `/.env`, atau `/config` yang tidak dilindungi autentikasi?
- Apakah ada file `.env`, `.env.local`, `credentials.json`, `*.pem`, `*.key` yang tidak sengaja ter-commit ke dalam repositori git?
- Apakah berkas `.gitignore` benar-benar melindungi secret, direktori unggahan, dan konfigurasi lokal?
- Apakah versi dependensi dikunci (pinned)? Apakah ada CVE kerentanan publik yang diketahui di pohon dependensi? (periksa file lockfile)
- Apakah ada penggunaan `eval()`, `exec()`, `child_process`, `Function()`, `vm.runInContext`, atau `import()` dinamis yang menerima input luar?
- Apakah header CORS diatur ke `*` secara sembarangan? Apakah `Access-Control-Allow-Credentials` digabungkan dengan origin wildcard `*`?
- Apakah cookie sesi tidak memiliki atribut keamanan `HttpOnly`, `Secure`, atau `SameSite`?
- Apakah ada pengalihan terbuka (open redirect)? (parameter seperti `redirect`, `return`, `next`, `url`, `goto`, `continue` yang langsung diteruskan ke fungsi pengalihan tanpa validasi whitelist)
- Apakah koneksi TLS ditegakkan secara ketat? Apakah ada endpoint yang dapat diakses melalui HTTP biasa tanpa enkripsi?
- Apakah pesan error di server produksi membocorkan stack trace, path internal server, atau query SQL?

Agen ini tidak perlu berimajinasi kreatif. Agen ini harus teliti, sistematis, dan memeriksa apa adanya. Periksa setiap item. Laporkan setiap hasil temuannya.

**Penting**: Untuk setiap temuan yang dilaporkan agen ini, agen wajib memverifikasi alur kode lengkapnya, bukan sekadar penampakan di permukaan saja. Jika cookie tidak memiliki atribut `HttpOnly`, periksa apakah cookie tersebut benar-benar memuat data sensitif keamanan dan apakah JavaScript memang perlu membacanya berdasarkan desain arsitektur. Jika pesan error memuat nama field, periksa apakah field tersebut pernah diisi dengan data sensitif pengguna. Sebuah peringatan linter bukanlah temuan kerentanan: buktikan dampak nyatanya sebelum melaporkannya.
