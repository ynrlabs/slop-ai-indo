# Perburuan Celah Keamanan Memori, Biner, dan Kernel (Memory Safety & Binary)

#### Kapan menggunakan berkas ini

Gunakan berkas ini saat sistem memproses byte tak tepercaya dalam konteks bahasa pemrograman memory-unsafe atau konteks berhak istimewa: C/C++/Objective-C, blok `unsafe` pada Rust, FFI (Foreign Function Interface), modul kernel dan driver, parser dan decoder biner, daemon jaringan native, firmware, pemuat biner (binary loader), runtime bahasa, dan JIT engine. Gunakan `PROTOCOLS-RPC-AND-MESSAGING.md` untuk otorisasi protokol dan logika state-machine, dan gunakan berkas ini untuk integritas proses, keamanan memori, batasan ABI, dan perilaku pemuat biner.

Pilih kelas serangan yang relevan dan bagi target besar berdasarkan modul parser, alokator/siklus memori, FFI, konkurensi (thread), loader, runtime, atau antarmuka istimewa.

## Disiplin Inti (sertakan dalam setiap prompt agen untuk domain ini)

```
- Hitung ulang setiap batasan ukuran (bounds) dan masa hidup objek (lifetime) dari input yang dikontrol penyerang dan seluruh pemanggilnya. Validasi terhadap kasus terburuk yang diterima, bukan hanya vektor uji umum.
- Kondisi panic, temuan sanitizer (ASan/MSan/UBSan), atau crash hanyalah bukti cacat jika input tak tepercaya yang realistis dapat mencapainya. Jangan menyimpulkan adanya korupsi memori, eksekusi kode (RCE), atau dampak ketersediaan bersama hanya dari label crash semata.
- Validasi pada harness lokal menggunakan sanitizer, pengujian konkurensi deterministik, target fuzzing yang ada, dan klasifikasi fault berbantuan debugger. Hentikan pengujian begitu invarian yang dilanggar dan dampak teramati terbukti; jangan membuat eksploit pasca-korupsi memori.
- Kode assembly, kode hasil kompilasi JIT, alokator kustom, akses intra-objek, dan pustaka foreign dinamis dapat lolos dari pengawasan sanitizer. Identifikasi instruksi mana yang benar-benar ter-instrumentasi.
- Berikan status "confirmed" hanya setelah bukti kode sumber dan validasi lokal terisolasi membuktikan cacat dan efeknya. Berikan status "needs_validation" saat fakta ABI, alokator, arsitektur CPU, fitur kompilasi, atau keterjangkauan runtime belum diketahui.
```

## Kelas Serangan Batasan, Bilangan Bulat, dan Representasi (subagent_type: `general`)

**Pembacaan atau Penulisan di Luar Batas (Out-of-Bounds Read/Write)**
Panjang, offset, indeks array, atau karakter terminator mencapai buffer tetap atau buffer teralokasi tanpa validasi batas yang benar. Hitung ulang ruang sisa yang tersedia setelah memperhitungkan awalan (prefix), alignment memori, padding, dan terminator null. Periksa kapasitas buffer sumber dan tujuan, serta apakah input yang pendek dibaca sebelum panjang yang dideklarasikan divalidasi.

**Integer Overflow, Underflow, Pemotongan (Truncation), dan Signedness**
Tinjau operasi aritmatika yang dikontrol penyerang sebelum alokasi memori, penyalinan buffer, loop, pengindeksan, dan operasi pointer. Pola berisiko tinggi mencakup pengurangan `a - b` dengan `b > a`, perkalian `count * element_size`, penjumlahan mendekati nilai maksimum tipe data, konversi bilangan negatif ke unsigned, pemotongan panjang 64-bit ke field 32-bit, dan nilai sentinel seperti `-1` yang diinterpretasikan sebagai ukuran sangat besar. Konfirmasikan representasi mana yang akhirnya digunakan oleh alokator.

**Kebingungan Satuan Ukuran dan Kedalaman Pointer (Unit Confusion)**
Kode mencampuradukkan satuan byte, jumlah elemen, code units, ukuran page, word CPU, satuan wire network, atau ukuran elemen pointer bertingkat. Bandingkan satuan pada saat parsing, validasi, alokasi, batasan API, dan penyalinan data. Pemeriksaan batas yang menggunakan satuan salah yang sama dengan alokasi tetaplah menghasilkan cacat keamanan.

**Data yang Belum Diinisialisasi (Uninitialized Data)**
Buffer, byte padding memori, field struct, atau kapasitas vektor dikembalikan ke pemanggil, dibandingkan, di-hash, diserialisasi, atau dikirim melintasi batasan kepercayaan sebelum diinisialisasi. Tunjukkan konsumen yang dapat mengamati data tersebut dan panjang luaran yang realistis; alokasi variabel pada stack saja bukanlah kebocoran data.

## Kelas Serangan Masa Hidup, Tipe, dan Konkurensi (subagent_type: `general`)

**Use-After-Free (UAF), Tampilan Usang (Stale View), dan Double Free**
Objek memori telah dibebaskan (free) sementara callback, antrean tunggu, timer, iterator, borrowed slice, atau raw pointer yang di-cache masih dapat mengaksesnya. Tinjau setiap jalur penanganan error, pembatalan, penutupan soket/file, dan pemanggilan `realloc`. Untuk jangkar notifikasi tersemat, setiap jalur pembebasan memori harus mencabut atau membersihkan seluruh observer.

**Type Confusion dan Downcast Tidak Valid**
Tag tipe, vtable C++, diskriminator union, jenis objek, atau foreign handle diperiksa secara berbeda dari representasi yang nantinya dibaca di memori. Cari dynamic cast tanpa pemeriksaan, tag usang setelah penggunaan ulang objek, dan tipe ter-serialisasi yang elemen terverifikasinya berbeda dari elemen yang dikonsumsi. Buktikan pembacaan atau penulisan tipe yang salah secara lokal tanpa memperluas pengujian di luar invarian yang dilanggar.

**Race Condition pada Penghitung Referensi dan Kepemilikan (Refcount Race)**
Operasi retain/release yang non-atomic, pemeriksaan status yang diikuti oleh penggunaan tanpa lock, atau kepemilikan yang tidak konsisten lintas-thread dapat membebaskan atau memutasi objek saat sedang diakses. Bandingkan jalur cepat (fast-path), penanganan error, alur shutdown, dan rute kompatibilitas untuk aturan lock dan kepemilikan yang sama.

**Race Condition Status Bersama dan TOCTOU Memori**
Aliran parser konkuren, cache global, lazy initialization, handler sinyal, dan pelepasan sumber daya dapat menginvalidasi batasan, kebijakan, atau pointer yang telah diverifikasi sebelumnya. Buktikan kondisi race dengan jadwal eksekusi lokal yang deterministik, memory barrier, atau ThreadSanitizer (TSan); skenario spekulatif tanpa transisi status yang relevan secara keamanan tetap berstatus `needs_validation`.

**Urutan Lock, Deadlock, dan Starvation**
Operasi yang dapat dijangkau dari luar mengakuisisi lock dalam urutan yang tidak konsisten atau menahan lock saat menjalankan callback atau I/O yang memblokir. Laporkan sebagai masalah ketersediaan (availability) hanya jika input yang dibatasi dapat menghentikan kemajuan sistem bersama; jika tidak, catat sebagai cacat konkurensi untuk perbaikan bug biasa.

## Kelas Serangan FFI dan Batasan ABI (subagent_type: `general`)

**Ketidakcocokan Kontrak Panjang Pointer dan Kepemilikan Memori**
Pemanggil dan fungsi yang dipanggil tidak sepakat mengenai siapa yang mengalokasikan, membebaskan, mem-pin, atau memutasi buffer, berapa lama suatu pointer tetap valid, atau apakah panjang buffer dihitung dalam byte atau jumlah elemen. Telusuri kedua sisi dari setiap blok `extern`, binding CGo/JNI/Python/native, dan wrapper yang digenerasi otomatis. Periksa penanganan nilai null, panjang nol, memory aliasing, dan retensi callback.

**Ketidakcocokan Tata Letak Memori, Alignment, dan Enum**
Kode bahasa foreign menerima struct, bitfield, packed record, signature callback, lebar bilangan bulat, enum, atau konvensi pemanggilan fungsi (calling convention) yang berbeda berdasarkan arsitektur CPU atau compiler flag. Verifikasi atribut `repr(C)`, packing, alignment, endianness, dan tipe data spesifik ABI. Ketidakcocokan deklarasi di dalam repositori dapat dikonfirmasi secara lokal; implementasi biner eksternal yang buram membutuhkan `needs_validation`.

**Pelanggaran Unwinding, Eksepsi, dan Afinitas Thread**
Eksepsi C++ atau panic Rust melintasi batasan ABI yang melarang unwinding, callback dieksekusi setelah proses teardown, atau API yang mensyaratkan thread runtime tertentu dipanggil di thread lain. Tinjau konversi error dan pembatalan operasi. Konfirmasikan apakah proses langsung menghentikan diri (abort aman) atau status memori terkorupsi sebelum menetapkan dampak.

## Kelas Serangan Pemuatan Biner dan Runtime (subagent_type: `general`)

**Kepercayaan Urutan Pencarian Pustaka, Plugin, dan Eksekusi (DLL/SO Hijacking)**
Proses berhak tinggi memuat pustaka bersama (DLL/.so), plugin, image runtime, atau helper dari direktori yang dapat ditulis oleh pihak berhak rendah, atau menyelesaikan nama biner relatif melalui direktori kerja yang dapat dipengaruhi penyerang. Bandingkan kepemilikan direktori instalasi resmi dengan setiap jalur pencarian fallback dan kompatibilitas. Pengguna yang memuat plugin miliknya sendiri ke dalam proses miliknya bukanlah pelanggaran batasan keamanan.

**Ketiadaan Pengikatan Identitas Artefak atau Tanda Tangan Digital**
Pemuat biner (loader) memverifikasi tanda tangan satu berkas atau catatan metadata, tetapi memetakan image yang berbeda ke memori karena resolusi path, penggantian berkas di disk, slice arsitektur multi-biner (fat binary), atau sumber daya tersemat tidak diikat ke pemeriksaan tersebut. Autentisitas kanal rilis dibahas di `SUPPLY-CHAIN-AND-RELEASE.md`; bagian ini mencakup celah antara verifikasi lokal dan pemetaan memori.

**Penanganan Metadata Biner dan Relokasi yang Malformed**
Nilai offset, jumlah entri, header seksi, tabel relokasi, simbol, bytecode, atau metadata debugging dipercayai sebelum pemeriksaan jangkauan nilai dan tumpang tindih memori (overlap). Uji parser biner menggunakan fixture lokal terisolasi dan sanitizer. Bedakan antara korupsi memori versus berkas malformed yang ditolak secara aman oleh parser.

**Ketidakkonsistenan Antara JIT dan Kode Terkompilasi**
Komponen validator, interpreter, optimizer, dan generated code tidak sepakat mengenai tipe data, batasan ukuran, efek samping, atau masa hidup objek. Bandingkan jalur teroptimasi versus non-optimasi menggunakan input lokal yang sama. Buktikan dampak nyata terhadap integritas proses; variasi luaran yang masih berada dalam semantik bahasa bukanlah temuan celah keamanan.

**Keamanan Proses Unload, Reload, dan Teardown**
Pointer fungsi aktif, callback, worker thread, atau tampilan data tetap bertahan setelah modul biner di-unload atau runtime di-reset. Tinjau pembersihan saat proses shutdown dan kegagalan muat modul seketat pemeriksaan pada saat startup.

## Kelas Serangan Kernel dan Antarmuka Berhak Tinggi (subagent_type: `general`)

**Batasan Penyalinan Memori Pengguna dan Pembacaan Berulang (Double Fetch)**
Panggilan sistem (syscall), ioctl, driver, atau parser kernel mengambil fakta terpercaya dari memori pengguna (user space), lalu membaca kembali alamat yang sama yang bersifat mutable. Salin seluruh permintaan ke kernel space sekali saja atau validasi ulang salinan berikutnya. Audit juga batasan ukuran, arah transfer data, dan pemeriksaan hak akses pada setiap fungsi penyalinan data pengguna (`copy_from_user`).

**Konsistensi Siklus Hidup dan Dispatch Objek Berhak Istimewa**
Objek yang dapat dijangkau dari luar memiliki operasi retain/release yang tidak seimbang, proses teardown tanpa pengurasan observer, indeks tabel/selector tanpa pemeriksaan batas, atau jalur kompatibilitas duplikat yang kehilangan fungsi pengaman. Bandingkan setiap jalur pemanggilan fungsi dan pembebasan objek secara berdampingan.

**Antarmuka Berwewenang Besar dengan Otorisasi Lemah**
Device node (`/dev/*`), socket admin lokal, helper daemon, atau API manajemen memvalidasi format data tetapi tidak memeriksa wewenang pemanggil terhadap sumber daya target. Pastikan kepemilikan antarmuka nyata dan keterjangkauannya; aturan izin berkas atau sandbox di luar repositori menjadikan temuan ini berstatus `needs_validation`.

## Langkah Kerja Universal

- Audit perbaikan bug dan jalur duplikat untuk bentuk aliran source-to-sink yang serupa. Pemeriksaan pada satu pemanggil, arsitektur tertentu, peran protokol, feature flag, atau rute kompatibilitas tidak otomatis melindungi fungsi serupa di tempat lain.
- Buat tabel untuk setiap batas parser atau FFI: panjang/tipe yang diterima, representasi terverifikasi, pemilik alokasi memori, konsumen data, thread eksekusi, dan alur pembebasan memori. Sebagian besar temuan native terjadi akibat satu ketidaksesuaian di dalam tabel tersebut.
- Gunakan korpus uji yang ada dan fixture batas berukuran kecil yang dibuat secara lokal. Simpan output exact dari sanitizer/runtime beserta properti input yang memicunya; hindari konsumsi sumber daya berlebihan dan jangan pernah menguji target live.

## Aturan Validasi (terapkan sebelum melaporkan temuan apa pun di domain ini)

1. Tentukan titik masuk tak tepercaya yang realistis dan operasi pasti yang melanggar invarian batasan ukuran, tipe data, siklus hidup memori, ABI, konkurensi, pemuat biner, atau wewenang kernel.
2. Klasifikasikan efek teramati: pembacaan tidak valid, penulisan tidak valid, alias memori usang, objek salah, luaran belum terinisialisasi, pemuatan biner tidak sah, deadlock, atau penghentian proses yang aman. Jangan mengklaim dampak yang lebih parah daripada apa yang teramati.
3. Jalankan test harness lokal paling minimal, unit test yang ada, sanitizer, atau fuzzer untuk mereproduksi efek tersebut. Pastikan sanitizer mencakup operasi yang mengalami fault dan catat arsitektur CPU serta konfigurasi build.
4. Untuk konkurensi, gunakan penjadwalan deterministik atau log thread sanitizer. Untuk pemuatan biner, buktikan identitas yang diverifikasi berbeda dari identitas yang dimuat ke memori dan sebutkan aktor berhak rendah yang dapat menulisnya.
5. Berikan status `confirmed` hanya jika terdapat input pasti, penelusuran kode sumber, dan hasil observasi nyata. Berikan status `needs_validation` jika ada fakta keterjangkauan runtime, ABI, flag kompilasi, konfigurasi deployment, atau arsitektur spesifik yang belum dapat dipastikan.
