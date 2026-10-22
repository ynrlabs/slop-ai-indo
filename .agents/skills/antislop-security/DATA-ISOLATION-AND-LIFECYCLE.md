# Perburuan Celah Keamanan Isolasi Data dan Siklus Hidup (Data Isolation & Lifecycle)

#### Kapan menggunakan berkas ini

Gunakan berkas ini saat sistem menyimpan data multi-tenant atau data dengan kontrol akses ketat, menghasilkan salinan pencarian/indeks/cache/analitik, menerbitkan tautan objek, mengekspor atau memulihkan data, memigrasikan skema database, atau menjanjikan perilaku penghapusan, pencabutan hak, dan retensi data. Domain ini menelusuri satu item data melalui setiap salinan dan transisi statusnya. Gunakan `ATTACK-CLASSES.md` untuk kontrol akses di tingkat endpoint dan `CLOUD-AND-DEPLOYMENT.md` untuk kebijakan penyimpanan tingkat penyedia cloud.

Bagi target berukuran besar berdasarkan penyimpanan primer, cache/search, object/blob storage, analitik/logging, ekspor/backup, penghapusan/pencabutan hak, dan migrasi.

## Disiplin Inti (sertakan dalam setiap prompt agen untuk domain ini)

```
- Kolom tenant_id atau owner_id pada suatu baris data bukanlah jaminan isolasi otomatis. Temukan kueri, kunci, path, kebijakan, atau kontrol Row-Level Security (RLS) yang menegakkannya pada setiap operasi baca dan tulis.
- Telusuri salinan turunan (derived copies). Data primer yang telah disanitasi dapat menjadi tidak aman di mesin pencari, cache, analitik, berkas ekspor, preview thumbnail, log, replika, dan backup yang memiliki aturan ACL serta retensi berbeda.
- Penghapusan dan pencabutan hak adalah kontrak siklus hidup data. Periksa salinan saat ini, historis, cache, terindeks, terekspor, terpulihkan, dan antrean kerja dalam batasan janji produk.
- Preferensi privasi atau retensi tidak otomatis menjadi kerentanan keamanan teknis. Tunjukkan batas akses data atau jaminan penghapusan/pencabutan yang dilanggar serta pembaca tanpa otorisasi atau operasi susulan yang tidak sah.
- Gunakan status "confirmed" untuk silsilah data yang terlihat lengkap di kode sumber dan pengujian tenant tiruan lokal. Gunakan "needs_validation" saat kebijakan penyimpanan eksternal, retensi cloud, perilaku CDN, jeda replikasi database, atau akses backup fisik belum dapat diuji langsung.
```

## Kelas Serangan Isolasi Tenant dan Objek (subagent_type: `general`)

**Ketiadaan Penegakan Batasan Tenant atau Pemilik**
Kueri baca, pembaruan, penghapusan, listing, penghitungan, atau batch query mengidentifikasi suatu objek tanpa mengikatnya ke tenant/pemilik yang terautentikasi, atau mempercayai nilai ID dari body permintaan klien. Bandingkan pencarian langsung, relasi bertingkat, background worker, rute admin, impor data, dan jalur API warisan (legacy).

**Tabrakan Kunci Komposit dan Namespace (Namespace Collision)**
Kunci cache, path objek, batasan keunikan database (unique constraint), ID dokumen pencarian, berkas sementara, atau kunci deduplikasi tidak menyertakan tenant ID atau environment. Dua entitas dapat menimpa atau mengambil kunci logis yang sama meskipun catatan aplikasi mencatat pemilik yang berbeda.

**Ketidakcocokan Antara Kebijakan dan Kueri Database**
Kebijakan Row-Level Security (RLS), default scope pada ORM, filter otorisasi aplikasi, dan klien bypass kueri mentah menerapkan predikat filter yang berbeda. Periksa klausa join, fungsi agregasi, alias tabel, database view, transaksi, klien `unscoped`, dan jalur penanganan error yang kehilangan konteks tenant.

**Penyalahgunaan Izin Blob dan Referensi Bertanda Tangan**
Kunci objek, ID lampiran, ID versi berkas, shared link, atau signed URL mengizinkan operasi atau namespace di luar hak akses prinsipal yang memintanya, atau tetap valid setelah hak akses dasar (ACL) dicabut. Ikat operasi, objek/versi eksak, audience, masa kedaluwarsa, dan batasan tenant.

## Kelas Serangan Data Turunan dan Pengungkapan (subagent_type: `general`)

**Pergeseran ACL pada Pencarian, Cache, dan Pengindeksan**
Hak akses atau siklus hidup data primer berubah tanpa menginvalidasi salinan yang dapat dicari di Elasticsearch, redis cache, thumbnail, feed RSS, preview dokumen, atau salinan indeks. Validasi pemfilteran saat pengambilan data maupun saat penyerapan dokumen (ingestion) dan invalidasi cache.

**Analitik, Log, Trace, dan Diagnostik Sebagai Pembaca Alternatif**
Konten privat atau kredensial rahasia dicatat ke dalam sistem log/analitik yang memiliki akses lebih luas, retensi lebih lama, atau pencampuran data antar-tenant. Konfirmasikan klasifikasi data dan siapa pembaca realistisnya; nama field belaka, pengenal publik, atau konten khusus operator di bawah kebijakan resmi bukanlah temuan kerentanan.

**Oracle Enumerasi dan Agregasi**
Jumlah hitungan data, filter pencarian, pengurutan, pesan error, batasan keunikan, perbedaan timing, perilaku notifikasi, atau pemeriksaan keberadaan membocorkan status objek atau akun privat. Tunjukkan predikat rahasia konkret dan perbedaan yang dapat diamati, bukan sekadar variasi respons acak.

## Kelas Serangan Ekspor, Backup, Pemulihan, dan Migrasi (subagent_type: `general`)

**Perluasan Cakupan pada Ekspor dan Backup**
Fitur ekspor data, snapshot, paket portabilitas data, laporan, atau backup menyertakan data milik tenant lain, field objek yang tidak dapat diakses, data soft-deleted, nilai rahasia, atau riwayat di luar hak akses pemohon. Periksa otorisasi per-item setelah data dipilih dan otorisasi untuk mengunduh artefak hasil ekspor final.

**Perluasan Wewenang pada Impor dan Pemulihan (Restore)**
Proses restore/impor membypass pemeriksaan pemilik, skema, ACL, keunikan, atau aturan validasi, menimpa sumber daya yang ada, atau membuat ulang catatan pada tenant yang tidak berhak ditulis oleh pemohon. Perlakukan isi arsip impor sebagai input tak tepercaya dan otorisasi setiap operasi yang dihasilkan.

**Kebingungan Kepemilikan dan Nilai Default Saat Migrasi Data**
Catatan data lama tidak memiliki kolom tenant/ACL/siklus hidup, ID yang tidak kompatibel bertabrakan, atau peluncuran bertahap (canary) membuat pembaca kode baru dan lama menerapkan nilai default yang berbeda. Tinjau alur backfill data, dual-read/write, kompatibilitas mundur, rollback skema, dan migrasi yang dilanjutkan setelah gagal.

**Pergeseran Batasan Lingkungan Backup dan Replikasi**
Kunci enkripsi, akun penyimpanan cloud, replika lintas wilayah, lingkungan pemulihan bencana (DR), atau snapshot tim support memiliki cakupan identitas atau tenant yang lebih longgar daripada penyimpanan primer. Kode sumber hanya dapat memverifikasi kebijakan in-repo; akses cloud terkelola dan retensi fisik memerlukan status `needs_validation`.

## Kelas Serangan Penghapusan, Pencabutan Hak, dan Siklus Hidup (subagent_type: `general`)

**Bypass Soft-Delete dan Penanda Penghapusan (Tombstone)**
Pencarian langsung, kueri search engine, penelusuran relasi tabel, tautan objek langsung, prosesor latar belakang, atau pemulihan data mengabaikan filter soft-delete dan mengembalikan atau mengeksekusi catatan yang sudah dihapus/dicabut. Periksa apakah ID yang sudah dihapus secara lunak dapat didaftarkan kembali sebelum seluruh referensinya musnah.

**Penggunaan Salinan Usang Setelah Otorisasi Dicabut**
Penghapusan anggota organisasi, pembaruan ACL, penarikan izin akses (consent), pencabutan rahasia API, atau penurunan peran pengguna tidak menginvalidasi sesi aktif, cache memori, langganan event, background job, atau data materialisasi yang terus mengizinkan operasi mendatang.

**Pelampauan Batas Retensi Data oleh Antrean Kerja**
Penghapusan selesai pada database primer sementara pemroses antrean (queue), mekanisme retry, tugas ekspor, atau analitik membuat ulang atau mempertahankan data melampaui batasan waktu retensi yang dijanjikan. Temukan penghapusan idempoten dan propagasi status tombstone ke seluruh subsistem.

**Pemulihan Memasukkan Kembali Status Tidak Valid (Restore Re-injection)**
Backup data, fitur undo, pembatalan hapus (undelete), atau pemulihan replika mengembalikan data, kredensial, keanggotaan, atau izin akses yang sudah tidak lagi diizinkan oleh kebijakan saat ini. Pastikan sistem mengotorisasi ulang data yang dipulihkan dan menerapkan kembali perubahan siklus hidup yang terjadi setelah snapshot diambil.

## Langkah Kerja Universal

- Pilih satu jenis data terlindungi dan gambarkan diagram alir operasi tulis primer, kueri baca, cache, pengindeksan pencarian, event, ekspor, backup, penghapusan, dan pemulihan. Tandai identitas prinsipal dan batasan tenant pada setiap titik.
- Bandingkan dua tenant tiruan melalui pemanggilan method service lokal yang sama, lalu ulangi pengujian setelah perubahan ACL, penghapusan data, pergantian akun, dan restore. Jangan pernah menggunakan data pengguna nyata.
- Mulailah pemeriksaan dari klien bypass kueri, job latar belakang, skrip migrasi, batasan keunikan global, dan kunci cache. Jalur-jalur ini sering kali lupa menyertakan konteks identitas sesi yang biasanya dibawa oleh endpoint interaktif.

## Aturan Validasi (terapkan sebelum melaporkan temuan apa pun di domain ini)

1. Sebutkan penyerang atau prinsipal berhak rendah, data/status terlindungi, pemilik/tenant yang dirugikan, salinan data alternatif atau operasi yang dieksekusi, serta pengungkapan data atau mutasi yang tidak sah.
2. Cantumkan baik kebijakan resmi sistem maupun jalur kode yang mengabaikan atau bertentangan dengan kebijakan tersebut. Pastikan tidak ada lapisan perlindungan lain yang sudah menegakkan kondisi tenant/siklus hidup tersebut.
3. Gunakan tenant dummy lokal dan data tiruan non-sensitif untuk membuktikan akses lintas-tenant atau pelanggaran siklus hidup data. Hentikan pengujian pada bukti minimal yang dapat diamati.
4. Jika temuan bergantung pada perilaku cache eksternal, penyimpanan objek cloud, replikasi server, sistem analitik, atau kebijakan retensi fisik, beri status `needs_validation` dan sebutkan observasi yang harus dipastikan oleh pemilik sistem.
5. Berikan status `confirmed` hanya jika silsilah data terbukti lengkap beserta dampak batasan isolasi konkret. Berikan status `needs_validation` jika ada fakta penyimpanan, ACL, invalidasi, retensi, atau restore yang belum dapat diverifikasi secara lokal.
