# Perburuan Celah Keamanan Habisnya Sumber Daya dan Ketersediaan Layanan (Resource Exhaustion & Availability)

#### Kapan menggunakan berkas ini

Gunakan berkas ini saat permintaan tak tepercaya, pesan antrean, berkas unggahan, status tenant, atau beban kerja agen AI dapat menguras CPU, memori (RAM), ruang disk, koneksi database/jaringan, slot worker, kuota API berbayar, atau kapasitas antrean, atau dapat memicu deadlock/crash pada layanan bersama (shared service). Domain ini membedakan antara celah kerentanan ketersediaan (availability vulnerability) yang dapat ditinjau dari kode sumber versus masalah performa umum. Jangan pernah memvalidasi celah dengan membebani (stress test) layanan produksi atau layanan bersama.

Gunakan `MEMORY-SAFETY-AND-BINARY.md` untuk cacat integritas memori dan `PROTOCOLS-RPC-AND-MESSAGING.md` untuk logika pengiriman broker pesan. Error fatal yang dapat dijangkau dan mematikan layanan bersama dilaporkan di sini meskipun parser dasarnya dibahas di domain lain.

## Disiplin Inti (sertakan dalam setiap prompt agen untuk domain ini)

```
- Tunjukkan alur dari input menuju biaya pemrosesan (input-to-cost), ketiadaan batasan efektif, dan dampaknya terhadap pengguna lain, layanan bersama, fungsi keselamatan, atau tagihan biaya operator. Beban kerja yang membatasi diri di dalam proses pemohon sendiri bukanlah celah layanan.
- Ketiadaan rate limit saja tidak cukup disebut temuan. Periksa batasan ukuran body/pesan/berkas, batas konkurensi, antrean, deadline timeout, batasan database, API gateway hulu, dan kuota per-tenant sebelum menyatakan jalur tidak berbatas.
- Jangan menjalankan uji stres, saturasi, atau pengujian produksi. Gunakan analisis asimtotik (Big-O), fixture batas kecil, mock untuk panggilan berbayar, batas sumber daya lokal yang ketat, dan uji pembatalan deterministik.
- Nyatakan biaya penyerang, kerja yang dilakukan layanan, persistensi beban, cakupan dampak (blast radius), dan pemulihan (recovery). Satu input kecil dengan efek superlinear atau persistent sangat berbeda dengan serangan volume brute-force biasa.
- Gunakan status "confirmed" untuk kegagalan batasan yang terlihat di kode sumber dan didemonstrasikan dengan aman. Gunakan "needs_validation" saat batasan hulu, topologi cloud, autoscaling, kuota API eksternal, atau perilaku pemulihan berada di luar repositori.
```

## Kelas Serangan Amplifikasi Komputasi (subagent_type: `general`)

**Parsing, Pencocokan, atau Evaluasi Superlinear (ReDoS & Algorithmic Complexity)**
Input kecil yang diterima memicu catastrophic regex backtracking (ReDoS), parsing dokumen bersarang (nested JSON/XML/YAML), validasi skema rekursif, evaluasi simbolik, traversal graf tanpa batas, ekspansi template, atau perilaku buruk pada hashing/sorting (HashDoS). Hitung kedalaman/kardinalitas yang diterima dan kompleksitas algoritmanya, lalu buktikan kurva pertumbuhan biaya menggunakan fixture kecil secara lokal.

**Amplifikasi Dekompresi dan Representasi Data (Zip Bomb & XML Bomb)**
Input yang dikompresi, renggang (sparse), bertingkat, atau menggunakan alias (seperti entitas XML atau Billion Laughs) mengembang jauh melampaui ukuran transfer atau ukuran berkas yang diperiksa di awal. Verifikasi batasan ukuran setelah setiap tahap ekspansi pada arsip zip, gambar (decompression bomb), font, dokumen terstruktur, dan tabel kompresi protokol (HPACK/QPACK).

**Amplifikasi Kueri Database dan Layanan Hilir (N+1 & Unbounded Query)**
Satu permintaan kecil memicu pemindaian tabel menyeluruh (full table scan), join patologis, fan-out kueri besar-besaran, pengurutan/agregasi tanpa batas, atau puluhan pemanggilan layanan hilir karena kedalaman kueri GraphQL, kardinalitas filter, paginasi, atau ekspansi field tidak dibatasi. Pastikan bahwa otorisasi pengguna tidak secara sengaja mengizinkan cakupan data sebesar itu.

## Kelas Serangan Akumulasi Sumber Daya (subagent_type: `general`)

**Akumulasi Kardinalitas dan Buffering Tanpa Batas**
Body permintaan, chunk stream yang tidak berurutan, berkas unggahan, sesi aktif, kunci cache unik, label metrik Prometheus, field log, langganan WebSocket, atau pekerjaan tertunda menumpuk di memori tanpa batas per-item dan batas agregat. Temukan logika pembersihan dan kedaluwarsa saat klien terputus (disconnect), timeout, pembatalan permintaan, atau kegagalan parsing parsial.

**Kebocoran File Descriptor, Handle, dan Sumber Daya Sementara**
Pekerjaan yang malformed atau dibatalkan melewatkan pembersihan dan menahan soket jaringan, file descriptor, database cursor, timer aktif, subprocess, berkas sementara di disk, atau referensi objek di heap. Buktikan kebocoran berulang melalui iterasi lokal terisolasi dan tunjukkan dampaknya terhadap kolam koneksi (pool) bersama.

**Pekerjaan Terlepas Setelah Pembatalan Permintaan (Detached Work)**
Client timeout, koneksi terputus, pembatalan job, atau otorisasi gagal mengembalikan kendali ke gateway tetapi membiarkan kueri database, inferensi model AI, panggilan jaringan, atau background worker tetap berjalan sampai selesai. Telusuri propagasi pembatalan (cancellation token / context propagation) dan batas waktu deadline di setiap lapisan.

## Kelas Serangan Kuota dan Penjadwalan (subagent_type: `general`)

**Ketimpangan Beban Kerja Pra-Autentikasi (Pre-Auth Work Imbalance)**
Parsing yang mahal, pencarian kunci kriptografi, operasi dekripsi berat, dekompresi data, atau panggilan API eksternal terjadi sebelum autentikasi diverifikasi dan sebelum gerbang pembatas ukuran/laju awal. Bandingkan usaha minimal pemohon terhadap biaya yang ditanggung layanan bersama dan periksa kontrol di tingkat reverse proxy.

**Celah Akuntansi dan Reset Kuota Layanan**
Pencatatan kuota menggunakan IP, rute, tenant, prefix kunci, task ID, atau dimensi lain yang dapat dimanipulasi penyerang, sehingga memungkinkan suatu prinsipal lolos dari anggaran kuotanya atau menghabiskan kuota milik pengguna lain. Tinjau integer overflow, race condition terdistribusi, pengiriman ulang (retry), rekoneksi cepat, dan pergantian akun.

**Kelaparan Worker, Kolam Koneksi, dan Prioritas (Starvation)**
Pekerjaan berprioritas rendah atau pekerjaan yang dikontrol penyerang menahan lock bersama, antrean worker, kolam koneksi database, giliran event-loop, atau prioritas scheduler yang dibutuhkan oleh pengguna lain. Tunjukkan jalur yang membypass keadilan antrean (fair queuing/concurrency fairness) atau menahan slot melebihi batas waktu deadline-nya.

## Kelas Serangan Kegagalan dan Pemulihan (subagent_type: `general`)

**Error Fatal yang Dapat Dijangkau atau Deadlock Bersama**
Input tak tepercaya mencapai pemanggilan `panic`, abort, assertion gagal, uncaught exception, `process.exit`, siklus penguncian (deadlock), atau loop tak terbatas di dalam proses bersama. Konfirmasikan cakupan supervisor proses dan apakah hanya satu worker terisolasi atau seluruh layanan yang menjadi tidak tersedia. Worker terisolasi yang di-restart dapat memitigasi dampak tetapi tidak menghapus cacat kode dasarnya.

**Badai Pengiriman Ulang (Retry Storm) dan Amplifikasi Fail-Open**
Timeout, error dependensi eksternal, pesan yang diproses sebagian, atau kegagalan health check memicu pengiriman ulang serentak tanpa jitter acak, batas maksimum (retry ceiling), circuit breaker, atau deduplikasi. Buktikan bahwa satu titik kegagalan terbatas dapat memicu akumulasi beban kerja massal yang melumpuhkan sistem.

**Pemblokiran Kepala Antrean (Head-of-Line Blocking) Akibat Catatan Beracun**
Satu pesan atau catatan beracun (poison message) terus-menerus gagal di bagian paling depan antrean bersama, partisi Kafka, pemindaian startup, proses migrasi, atau loop pemulihan, sehingga memblokir pemrosesan pesan valid di belakangnya. Tinjau kebijakan karantina/skip, pergeseran offset, dan apakah tenant lain berbagi antrean yang sama.

**Pemulihan Tidak Aman dan Rollback Kapasitas**
Jalur restart layanan, pemulihan backup, fallback sistem, atau pembersihan data membangun ulang status tanpa batas, mengabaikan kuota aktif, atau memulihkan kembali input beracun yang seketika mengulang kegagalan. Kebenaran mekanisme pemulihan adalah bagian tak terpisahkan dari ketersediaan sistem.

## Langkah Kerja Universal

- Buat tabel alur input-ke-sumber-daya: ukuran/kardinalitas awal yang diterima, kerja pra-autentikasi, fan-out ke layanan hilir, persistensi beban, kolam bersama yang dipakai, pemilik batas kuota dan pembersihan, serta alur pemulihan.
- Bandingkan batasan agregat dengan batasan per-objek. Sepuluh ribu pesan valid berukuran 1 byte dapat lolos dari batas per-pesan namun dapat melumpuhkan memori tingkat proses atau batas tenant.
- Validasi hanya di lingkungan uji terisolasi dengan batasan CPU, memori, dan waktu yang ketat serta titik pertumbuhan kecil. Mock seluruh panggilan eksternal dan panggilan berbayar; hentikan pengujian begitu batas yang hilang atau kegagalan pembatalan terbukti.

## Aturan Validasi (terapkan sebelum melaporkan temuan apa pun di domain ini)

1. Sebutkan input tak tepercaya, usaha yang dikeluarkan pemohon, amplifikasi kerja atau sumber daya yang tertahan di layanan, cakupan dampak bersama (blast radius), serta mekanisme pemulihan. Ketiadaan batas kuota tanpa dampak bersama konkret hanyalah saran pengerasan (hardening).
2. Konfirmasikan bahwa tidak ada batasan reverse proxy hulu, parser, antrean, tenant, atau framework yang terlihat di kode sumber yang mencegah jalur serangan tersebut. Kontrol produksi yang tidak terlihat di kode sumber membutuhkan status `needs_validation`.
3. Untuk perilaku superlinear, tentukan kompleksitas algoritmik yang diterima dan pertumbuhan lokal yang terbatas. Untuk kebocoran sumber daya, buktikan retensi berulang setelah pembersihan seharusnya terjadi. Untuk jalur error fatal, identifikasi isolasi proses dan supervisor.
4. Berikan prioritas pada usaha penyerang yang sangat rendah, keterjangkauan tanpa autentikasi, cakupan lintas-tenant, persistensi masalah, dan pemulihan yang buruk; jangan pernah memvalidasi dengan benar-benar melumpuhkan ketersediaan layanan live.
5. Berikan status `confirmed` hanya jika terdapat bukti lokal yang aman dan dampak bersama yang nyata. Berikan status `needs_validation` jika ada batasan reverse proxy hulu, topologi cloud, kuota eksternal, atau observasi pemulihan yang harus dikonfirmasi pemilik sistem.
