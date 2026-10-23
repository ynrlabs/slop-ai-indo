# Perburuan Celah Keamanan Cloud dan Penerapan (Cloud & Deployment)

#### Kapan menggunakan berkas ini

Gunakan berkas ini saat repositori mendefinisikan identitas cloud, infrastruktur sebagai kode (IaC), kontainer, Kubernetes, service mesh, fungsi serverless, edge worker, ingress, penyimpanan objek (S3/GCS), layanan terkelola, atau konfigurasi khusus lingkungan (environment). Domain ini berfokus pada apakah komponen yang di-deploy menerima identitas, isolasi, keterjangkauan jaringan, rahasia/kredensial, dan kebijakan yang semestinya. Berkas kode sumber sering kali hanya mencerminkan niat awal daripada fakta lingkungan hidup, sehingga pisahkan cacat yang terbukti dari kode sumber versus hal yang membutuhkan validasi penerapan langsung.

Gunakan `SUPPLY-CHAIN-AND-RELEASE.md` untuk kepercayaan alur build dan promosi rilis, `WEB-PROTOCOL-AND-AUTH.md` untuk semantik proxy HTTP, dan `DATA-ISOLATION-AND-LIFECYCLE.md` untuk batasan tenant penyimpanan data.

## Disiplin Inti (sertakan dalam setiap prompt agen untuk domain ini)

```
- Jangan menyimpulkan adanya celah eksposur publik hanya dari berkas manifes semata. Tentukan lingkungan mana yang menggunakannya, overlay atau nilai bawaan apa yang memodifikasinya, dan apakah jalur kode tersebut benar-benar aktif.
- Petakan identitas setiap beban kerja (workload) ke operasi dan sumber daya spesifik. Kebijakan yang terlalu luas hanyalah temuan jika input berhak rendah dapat memicu aksi tanpa otorisasi.
- Ingress, proxy, service mesh, layanan metadata, dan admission controller adalah batas pertahanan nyata; perhitungkan kontrol tersebut saat konfigurasi dan kaitannya terlihat jelas.
- Referensi ke nama rahasia bukanlah kebocoran rahasia. Tunjukkan pembaca berhak rendah, luaran publik, artefak build, jalur log, atau fallback yang tidak aman.
- Gunakan status "confirmed" untuk konfigurasi in-repo yang aktif dan validasi kebijakan/rendering lokal. Gunakan "needs_validation" untuk kebijakan akun cloud, konfigurasi jaringan live, admission controller runtime, metadata cloud hosting, atau konfigurasi drift yang memerlukan konfirmasi pemilik sistem.
```

## Kelas Serangan Identitas Beban Kerja dan IAM (subagent_type: `general`)

**Penyalahgunaan Izin Identitas Beban Kerja (Workload Identity Overreach)**
Identitas workload, pod, fungsi, edge worker, atau node dapat bertindak terhadap tenant, akun, sumber daya, atau API di luar peran semestinya, dan input permintaan atau pekerjaan tak tepercaya dapat memilih target tersebut. Tinjau kondisi kebijakan cloud, pola ARN/resource, asosiasi service account, pemetaan namespace, dan kredensial fallback.

**Kebingungan Peran Lintas-Akun atau Lintas-Tenant**
Asumsi peran (role assumption), external ID, pertukaran token, federasi workload, atau kebijakan sumber daya menerima klaim identitas yang tidak terikat secara ketat pada akun asal, audience, repositori, namespace, atau workload yang valid. Buktikan baik kebijakan trust maupun klaim yang dikontrol pemanggil.

**Otorisasi Aplikasi Didelegasikan ke Metadata Cloud Tanpa Verifikasi**
Aplikasi mempercayai header identitas, tag, label, account ID, atau metadata sumber daya yang disuplai pemanggil tanpa memverifikasi bahwa data tersebut berasal dari control plane cloud atau proxy terpercaya. IAM cloud dan otorisasi logika aplikasi adalah dua lapisan pemeriksaan yang terpisah.

## Kelas Serangan Ingress, Jaringan, dan Control-Plane (subagent_type: `general`)

**Keterjangkauan Layanan atau Manajemen Tak Terduga**
Ingress, service listener, security group, anotasi load balancer, pemetaan port, atau binding server mengekspos endpoint admin, debug, metrik, node, control plane, atau API internal ke jaringan dengan tingkat kepercayaan lebih rendah. Ketiadaan kontrol firewall jaringan saja berstatus `needs_validation`; namun rute publik dalam kode yang mengarah langsung ke handler sensitif dapat berstatus `confirmed`.

**Bypass Identitas Proxy Terpercaya dan Service Mesh**
Backend menerima identitas terusan (forwarded identity), subjek mTLS, atau metadata otorisasi dari pihak di luar ingress/sidecar yang semestinya, atau port alternatif/jalur health check lama membypass isolasi service mesh. Verifikasi pembersihan header (header stripping), keterjangkauan langsung antar-peer, dan perilaku fail-open saat proxy tidak tersedia.

**Keterjangkauan Layanan Metadata dan Internal (SSRF ke Metadata)**
URL, tujuan jaringan, atau pemilihan protokol tak tepercaya mencapai layanan metadata instans/kontainer (misal: 169.254.169.254), soket control plane, atau API internal menggunakan kredensial workload. Telusuri penguraian URL dan penanganan redirect di bawah `ATTACK-CLASSES.md`; di sini fokuskan pada batasan jaringan yang diterapkan, versi metadata (IMDSv2 vs IMDSv1), dan batasan identitas.

## Kelas Serangan Kontainer dan Orkestrasi (subagent_type: `general`)

**Eksposur Kapabilitas Host atau Control-Plane**
Workload berhak rendah dapat memilih mode privileged, kapabilitas Linux (misal: `CAP_SYS_ADMIN`), namespace host, host path mount, soket runtime kontainer (`docker.sock`, `containerd.sock`), atau token service account yang melompat ke wewenang node/control plane. Ketiadaan profil seccomp atau filesystem read-only hanyalah catatan pengerasan, kecuali jika ada operasi yang dapat dieksekusi melintasi batasan tersebut.

**Ketidakkonsistenan Jalur Kebijakan dan Admission Controller**
Satu rute deployment menegakkan identitas image, namespace, kuota sumber daya, rahasia, atau kebijakan hak istimewa, sementara controller lain, job batch, alur upgrade, restore cadangan, atau jalur kompatibilitas mengabaikannya. Konfirmasikan rute alternatif dan objek yang akhirnya diterapkan.

**Kebingungan Kepercayaan Namespace dan Label**
Kebijakan jaringan (NetworkPolicy), admission, rahasia, atau identitas workload bergantung pada label, anotasi, nama, atau namespace yang dapat diatur oleh pihak berhak rendah. Bandingkan siapa yang mengontrol selector dengan wewenang apa yang diberikan oleh kecocokan label tersebut.

## Kelas Serangan Konfigurasi dan Siklus Hidup Rahasia (subagent_type: `general`)

**Pergeseran Preseden Kontrol Keamanan (Precedence Drift)**
Nilai pengembangan (development values), default helm chart, variabel lingkungan, argumen baris perintah, feature flags, injeksi sidecar, atau overlay per-region menonaktifkan autentikasi, enkripsi transport (TLS), batasan tenant, atau pencatatan audit di lingkungan produksi. Render konfigurasi final untuk setiap lingkungan yang dirawat, bukan hanya berkas dasarnya.

**Eksposur Rahasia Melintasi Batasan Beban Kerja**
Rahasia dan kredensial bocor ke log, laporan crash, argumen proses (process table), variabel lingkungan bersama, volume yang terpasang luas, luaran build, service discovery, atau API baca yang dapat diakses oleh workload atau tenant lain. Periksa jenis rahasia dan tingkat wewenangnya; endpoint publik atau Key ID biasa bukanlah kredensial rahasia.

**Pembaruan Kredensial dan Fallback Saat Gangguan**
Kegagalan me-mount, memperbarui, merotasi, atau mencabut kredensial workload menyebabkan kredensial usang tetap aktif atau menyebabkan aplikasi beralih menerima mode identitas yang kurang aman. Tinjau inisialisasi aplikasi, pemeriksaan kesiapan (readiness probe), rekoneksi, dan perilaku cache klien.

## Kelas Serangan Penyimpanan Terkelola, Event, dan Edge (subagent_type: `general`)

**Kebingungan Kebijakan Objek dan URL Bertanda Tangan (Signed URLs)**
Kebijakan bucket/kontainer penyimpanan, prefix objek, origin CDN, atau signed URL gagal mengikat prinsipal, operasi yang diizinkan, namespace objek, audience, atau batas kedaluwarsa. Tinjau operasi listing/versi dan jalur penulisan data di samping jalur pembacaan.

**Kebingungan Identitas Sumber Event**
Fungsi serverless atau worker mempercayai field di dalam body event sebagai identitas sumber tanpa memvalidasi amplop bertanda tangan penyedia, langganan topik, akun, region, dan status replay. Bandingkan jalur push, pull, retry, dan antrean pesan gagal (dead-letter queue).

**Ketidakcocokan Batasan Runtime Edge vs Asal**
Runtime edge atau serverless mengasumsikan rahasia, API, filesystem, isolasi, atau kebijakan tenant yang berbeda dari server asal, dan fallback ke origin mengubah wewenang atau perilaku caching. Konfirmasikan konfigurasi mana yang memilih setiap jalur eksekusi.

## Langkah Kerja Universal

- Render setiap konfigurasi lingkungan yang dipelihara dan buat matriks port eksternal, identitas workload, peer jaringan, rahasia yang di-mount, dan sumber daya cloud. Perbedaan antar-lingkungan memerlukan penjelasan pemilik atau kebijakan sistem.
- Telusuri permintaan, objek, label, atau event berhak rendah menuju kebijakan cloud. Tunjukkan kredensial workload mana yang melakukan operasi akhir dan kondisi apa yang seharusnya membatasinya.
- Bandingkan jalur deployment normal, migrasi, restore, pemeliharaan node, failover, dan emulator lokal. Tinjau perilaku sistem ketika service mesh, admission controller, layanan identitas, atau layanan rahasia mengalami gangguan.

## Aturan Validasi (terapkan sebelum melaporkan temuan apa pun di domain ini)

1. Tentukan jalur kode sumber yang aktif dan objek konfigurasi efektif yang diterapkan; jika tidak dapat dipastikan, gunakan status `needs_validation` dan sebutkan manifes renderan atau konfigurasi live apa yang belum terkonfirmasi.
2. Sebutkan pemanggil/workload berhak rendah, identitas cloud atau aplikasi, selector yang dapat dikontrol, sumber daya yang terdampak, serta operasi atau pengungkapan data yang tidak sah.
3. Verifikasi konfigurasi bawaan (default) penyedia cloud dan orkestrator pada versi tepat yang digunakan. Jangan berasumsi adanya IP publik, metadata yang terbuka, firewall longgar, atau ketiadaan admission controller tanpa bukti konfigurasi.
4. Validasi lokal dapat berupa rendering template, evaluasi kebijakan rego/IAM, inspeksi namespace kontainer/user pada lingkungan terisolasi, atau emulator lokal dengan identitas tiruan. Jangan pernah memindai endpoint produksi live atau mengubah sumber daya cloud bersama.
5. Berikan status `confirmed` hanya jika terdapat alur kode aktif yang lengkap dan pelanggaran batasan keamanan yang konkret. Berikan status `needs_validation` disertai rincian kebijakan cloud, attachment identitas, overlay lingkungan, topologi jaringan, atau bukti drift yang harus diamati oleh pemilik sistem.
