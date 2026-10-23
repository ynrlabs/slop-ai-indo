# Perburuan Celah Keamanan Protokol, RPC, dan Messaging (Protocols, RPC & Messaging)

#### Kapan menggunakan berkas ini

Gunakan berkas ini saat sistem menggunakan gRPC, transport GraphQL, Cap'n Proto, Apache Thrift, Protocol Buffers (Protobuf), protokol biner kustom, streaming RPC, webhook, broker pesan, message queue (RabbitMQ, SQS), sistem Pub/Sub, atau event bus (Kafka, NATS). Berkas ini mencakup identitas peer, interpretasi pesan logis, perutean (routing), replay pesan, urutan pesan (ordering), dan semantik pengiriman pesan. Gunakan `MEMORY-SAFETY-AND-BINARY.md` untuk keamanan memori parser, `WEB-PROTOCOL-AND-AUTH.md` untuk HTTP framing, dan `RESOURCE-EXHAUSTION-AND-AVAILABILITY.md` untuk dampak penolakan layanan (DoS/availability).

Bagi sistem besar berdasarkan pasangan produsen/konsumen (producer/consumer), peran peer eksternal vs internal, RPC sinkron, streaming, dan jalur pesan asinkron.

## Disiplin Inti (sertakan dalam setiap prompt agen untuk domain ini)

```
- Jaringan "Internal" bukanlah bentuk autentikasi otomatis. Sebutkan identitas peer pada setiap lompatan jaringan (hop) dan tunjukkan bagaimana identitas tersebut dipetakan menjadi prinsipal aplikasi yang digunakan untuk otorisasi.
- Validasi skema membuktikan bentuk pesan (shape), bukan membuktikan asal-usul pesan, wewenang sumber daya, urutan pemrosesan, atau keamanan nilai di dalamnya. Telusuri field yang telah di-decode menuju kebijakan dan efek samping nyata.
- Jaminan broker pesan berbeda dengan jaminan aplikasi. Catat mekanisme retry, urutan pesan (ordering), acknowledgement (ACK), deduplikasi, dan perilaku transaksi sebelum mengevaluasi perubahan status data.
- Ketidakcocokan parser memerlukan dua konsumen nyata, versi skema berbeda, atau representasi wire protocol yang menghasilkan nilai divergen yang relevan secara keamanan.
- Gunakan status "confirmed" untuk jalur kode sumber yang lengkap ditambah pengujian produsen/konsumen lokal terisolasi. Gunakan status "needs_validation" untuk ACL broker, identitas service mesh, langganan topik, atau perilaku kompatibilitas di luar repositori.
```

## Kelas Serangan Framing, Skema, dan Interpretasi Pesan (subagent_type: `general`)

**Ketidakcocokan Batasan Pesan dan Kanonikalisasi**
Komponen sistem tidak sepakat mengenai panjang pesan, kompresi, field duplikat, field tidak dikenal, encoding karakter, lebar numerik, normalisasi, atau preseden antara header/envelope versus body. Bandingkan parser otomatis versus parser manual, gateway, binding bahasa, dan pengonversi versi. Konfirmasikan prinsipal, sumber daya, atau operasi mana yang dievaluasi secara berbeda setelah proses decoding.

**Kebingungan Union, Enum, dan Nilai Bawaan (Default Values)**
Varian yang tidak dikenal, diskriminator yang hilang, nilai nol (zero value), hak akses default, atau pemetaan kompatibilitas mencapai logika bisnis yang berasumsi bahwa semua kasus telah tervalidasi. Tinjau alur dispatch lengkap, cabang default, dan bagaimana konsumen lama menginterpretasikan field baru yang baru ditambahkan.

**Ketidakcocokan Identitas Amplop (Envelope) vs Payload**
Otorisasi menggunakan metadata perutean atau amplop yang tampak terpercaya, sementara handler memproses tenant, akun, subjek, objek, atau pengirim yang bertentangan di dalam body payload. Identifikasi sumber data mana yang otoritatif dan pastikan klien tidak dapat menimpanya.

## Kelas Serangan Identitas RPC dan Otorisasi (subagent_type: `general`)

**Ketidakkonsistenan Interceptor dan Jalur Method RPC**
Interceptor autentikasi/otorisasi diterapkan pada unary method tetapi terlewatkan pada RPC streaming, layanan refleksi gRPC, health check, jalur transkoding gateway (misal: grpc-gateway REST-to-gRPC), layanan kompatibilitas, atau pesan individual di dalam stream panjang. Bandingkan setiap registrasi method dan rute ke operasi yang sama.

**Kebingungan Identitas Peer Terhadap Prinsipal Aplikasi**
Koneksi mTLS, workload identity, metadata bearer token, header identitas terusan, atau kredensial broker mengautentikasi saluran koneksi, namun field yang dikontrol pemanggil menentukan akun atau tenant pengguna akhir. Identitas saluran dan prinsipal yang diklaim harus diikat oleh kebijakan deterministik.

**Celah Otorisasi Streaming dan Pesan Batch**
Aliran stream gRPC, langganan event, pesan batch, atau permintaan bulk diotorisasi hanya satu kali di awal, kemudian pesan-pesan berikutnya menamai sumber daya yang berbeda atau tetap berjalan setelah peran pengguna, keanggotaan, atau token dicabut. Periksa titik di mana cakupan dapat berubah dan ikat langganan ke prinsipal awalnya.

**Kebingungan Korelasi Balasan dan Callback**
ID korelasi yang dapat ditebak, digunakan ulang, atau bocor lintas-tenant memungkinkan suatu respons, webhook, pembatalan, atau acknowledgment memuaskan operasi tertunda milik pemanggil lain. Ikat setiap permintaan yang belum selesai ke peer terautentikasi, tenant, jenis operasi, dan siklus hidupnya.

## Kelas Serangan Isolasi Broker dan Antrean Pesan (subagent_type: `general`)

**Celah Cakupan Topik, Routing Key, dan Langganan**
Penerbit (publisher) atau pelanggan (subscriber) dapat memilih topik, pola wildcard, consumer group, partisi, antrean balasan (reply queue), atau rute dead-letter milik tenant lain. Periksa ACL yang ditegakkan broker (jika terlihat di konfigurasi) dan pembentukan namespace di sisi aplikasi. Teks tenant di dalam payload pesan bukanlah bentuk isolasi.

**Pengungkapan Data Melalui Antrean Gagal (Dead-Letter) dan Diagnostik**
Pesan yang dialihkan ke dead-letter queue (DLQ), topik error, sistem tracing, atau dasbor operator memuat rahasia atau payload lintas-tenant yang dapat diakses oleh konsumen dengan hak lebih rendah. Tinjau kebijakan dan redaksi data pada jalur penanganan kegagalan, bukan hanya pada pengiriman normal.

**Produsen Tak Tepercaya Diperlakukan Sebagai Control Plane**
Body pesan dapat menyatakan dirinya sebagai event admin, callback penyedia pihak ketiga, catatan replikasi, atau instruksi migrasi data tanpa produsen dan jenis event yang diautentikasi secara independen. Verifikasi tanda tangan digital serta pengikatan sumber/akun/audience sebelum menjalankan aksi istimewa.

## Kelas Serangan Replay, Urutan, dan Transaksi (subagent_type: `general`)

**Pengiriman Duplikat dan Celah Idempotensi**
Upaya pengiriman ulang (retry/redelivery) mengulang efek samping bisnis karena deduplikasi tidak ada, terjadi setelah mutasi data selesai, atau menggunakan kunci deduplikasi yang bertabrakan antar-tenant. Konfirmasikan model pengiriman broker (at-least-once) dan efek samping yang tidak bersifat idempoten secara alami.

**Penerimaan Pesan Usang dan Tidak Berurutan (Out-of-Order Messages)**
Status data lama, keanggotaan yang telah dicabut, pekerjaan yang telah dibatalkan, atau status otorisasi sebelum peningkatan hak tiba setelah status yang lebih baru dan menimpanya. Tinjau pemeriksaan nomor urut/versi, status tombstone, perubahan partisi pesan, dan alur replay data.

**Cacat Urutan Acknowledgment dan Komit Database**
Pengiriman sinyal acknowledgment (ACK) terjadi sebelum transaksi database tersimpan secara permanen (commit), sehingga berisiko menghilangkan pekerjaan penting saat crash. Sebaliknya, komit database terjadi sebelum ACK yang tidak andal, sehingga memicu mutasi duplikat saat retry. Evaluasi pola transactional outbox/inbox dan pemulihan kegagalan.

**Transisi Parsial pada Konsumen Majemuk (Multi-Consumer Inconsistency)**
Beberapa worker secara bersama-sama mengimplementasikan satu transisi otorisasi atau transaksi bisnis, tetapi kegagalan parsial pada salah satu worker menyebabkan hanya sebagian data yang terkomit. Identifikasi invarian data yang harus menjadi permanen secara atomik atau sediakan mekanisme kompensasi (saga rollback).

## Langkah Kerja Universal

- Gambarkan diagram alir produsen → broker/transport → gateway → konsumen → database untuk setiap jenis pesan. Pada setiap titik, catat peer terautentikasi, field tenant/sumber daya otoritatif, validasi skema, dan efek samping data.
- Kirimkan fixture kecil yang sama ke setiap versi skema dan binding bahasa yang ada di repositori. Uji pesan duplikat, field hilang, field tak dikenal, nilai batas, pesan ter-replay, dan pesan acak tanpa membebani sistem.
- Bandingkan rute normal, retry, dead-letter, replay, migrasi, refleksi, streaming, dan rute transkoding gateway. Kebijakan keamanan harus tetap tegak melintasi perubahan protokol transport.

## Aturan Validasi (terapkan sebelum melaporkan temuan apa pun di domain ini)

1. Sebutkan produsen atau peer yang realistis, pesan yang diterima, identitas saluran terautentikasi, prinsipal/sumber daya yang terdampak, serta mutasi data atau pengungkapan rahasia yang tidak sah.
2. Untuk klaim ketidakcocokan parser, sebutkan kedua parser/konsumen dan nilai hasil decode yang berbeda. Penolakan yang aman oleh salah satu sisi menggugurkan status konfirmasi temuan.
3. Untuk klaim urutan/replay pesan, tentukan jaminan pengiriman broker yang sebenarnya dan reproduksi kegagalan invarian menggunakan transport memori/lokal yang terisolasi.
4. Untuk otorisasi dan isolasi, verifikasi seluruh interceptor, ACL broker, gateway, dan lapisan konsumen yang terlihat di kode sumber. Ketergantungan pada konfigurasi eksternal yang tidak terlihat menjadikan temuan berstatus `needs_validation`.
5. Berikan status `confirmed` hanya jika siklus hidup pesan terbukti lengkap beserta efek samping nyata yang teramati. Berikan status `needs_validation` jika ada fakta konfigurasi broker, identitas service mesh, rute antrean, atau perilaku pengiriman yang belum dapat dipastikan.
