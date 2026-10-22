# Perburuan Celah Keamanan Desktop, Mobile, dan IPC Lokal (Desktop, Mobile & Local IPC)

#### Kapan menggunakan berkas ini

Gunakan berkas ini saat target audit adalah aplikasi desktop atau mobile, helper dengan hak istimewa (privileged helper), auto-updater, daemon lokal, host webview (Electron/Tauri/WKWebView), penangan deep link (custom URL scheme), host browser native-messaging, atau klien/server IPC lokal. Aktor penyerang tak tepercaya yang realistis dapat berupa dokumen yang diunduh, konten web remote, aplikasi lokal lain, pengguna OS lain, proses di dalam sandbox, atau akun pengguna dengan hak lebih rendah. Nyatakan kapabilitas awal penyerang alih-alih menganggap semua pengguna lokal memiliki wewenang yang sama.

Gunakan `CLIENT-SIDE.md` untuk perilaku webview dari sisi peramban, `MEMORY-SAFETY-AND-BINARY.md` untuk keamanan memori native dan pemuat biner (loader), serta `SUPPLY-CHAIN-AND-RELEASE.md` untuk autentisitas paket pembaruan.

## Disiplin Inti (sertakan dalam setiap prompt agen untuk domain ini)

```
- Tentukan pelaku penyerang lokal atau konten remote yang realistis: aplikasi lain, pengguna OS berbeda, proses anak ter-sandbox, dokumen tak tepercaya, atau origin web remote. Aksi merusak diri sendiri (self-harm) di bawah akun dan wewenang yang sama bukanlah pelanggaran batasan keamanan.
- Path berkas, nama proses, bundle/package ID, dan field pengirim yang diklaim klien bukanlah mekanisme autentikasi peer yang aman. Gunakan kredensial peer level OS (SO_PEERCRED, getpeereid), identitas tanda tangan kode, handle kapabilitas, atau status saluran terlindungi.
- Bridge native atau helper harus mengotorisasi setiap operasi dan sumber daya akhir setelah parsing. UI atau broker terpercaya tidak otomatis membuat argumen yang dipengaruhi penyerang menjadi aman.
- Sandbox OS, tanda tangan kode (code signing), entitlements, izin aplikasi, ACL keychain, kebijakan exported-component, dan dialog persetujuan pengguna adalah kontrol nyata jika dikonfigurasi dan terlihat jelas.
- Gunakan status "confirmed" untuk bukti kode sumber ditambah pengujian lokal/emulator terisolasi. Gunakan "needs_validation" saat penandatanganan aplikasi, penggabungan manifes (manifest merge), versi OS, kebijakan perangkat, ACL installer, atau packaging akhir belum dapat diobservasi langsung.
```

## Kelas Serangan Deep-Link, Callback, dan Navigasi (subagent_type: `general`)

**Ambiguitas Skema Kustom dan Deep-Link**
Aplikasi lain atau halaman web dapat memicu rute deep-link yang memutasi status, mengimpor data, menyelesaikan autentikasi, atau memilih akun tanpa ikatan sesi aktif dan token callback sekali pakai (one-time token). Tinjau normalisasi URI, parameter kueri duplikat, pencocokan skema/host/path, kebijakan exported activity/intent-filter, dan link usang yang dapat di-replay.

**Kebingungan Handoff Aplikasi dan Akun**
Callback OAuth, SSO, magic link, undangan, pairing perangkat, autentikasi tanpa sandi, atau alur pembayaran kembali ke aplikasi yang salah terpasang, profil keliru, tenant lain, atau transaksi tertunda yang berbeda. Ikat status callback ke identitas aplikasi pemrakarsa, sesi saat ini, akun, penyedia identitas, operasi, dan batas waktu kedaluwarsa.

**Kebingungan Wewenang Intent dan Pembukaan Berkas**
Asosiasi ekstensi berkas, share intent, item drag-and-drop, isi clipboard/pasteboard, aksi notifikasi, atau event open-file memicu operasi berhak tinggi tanpa mengonfirmasi tipe konten, kepercayaan pengirim (jika berlaku), niat pengguna aktif, dan target akhir berkas.

## Kelas Serangan Webview dan Bridge Native (subagent_type: `general`)

**Kebingungan Antara Origin Navigasi dan Bridge Native**
Frame remote atau frame yang dikontrol penyerang dapat mengakses bridge JavaScript-ke-Native yang seharusnya hanya disediakan untuk konten terpaket lokal. Validasi origin pada saat pemanggilan dan setelah setiap navigasi, redirect, pembuatan subframe iframe, jendela popup, dan halaman error/fallback. Pemeriksaan awalan URL sederhana dan pemeriksaan pada pemuatan awal saja sangat tidak memadai.

**Kapabilitas Bridge Native yang Terlalu Luas (Over-Broad Bridge)**
Konten web dapat memilih sembarang berkas, mengeksekusi perintah shell, memanggil method IPC, membaca kredensial, atau melakukan aksi sistem melalui bridge generik. Periksa whitelist method, normalisasi argumen, wewenang tenant/user, keharusan adanya gestur/konfirmasi pengguna, dan data sensitif yang dikembalikan pada return value.

**Akses Universal dan Akses Berkas Lokal pada Webview**
Konten web remote dapat membaca berkas lokal aplikasi, skema kustom istimewa, atau origin internal karena izin akses berkas (`allowFileAccessFromFileURLs`, `allowUniversalAccessFromFileURLs`), mixed content, interface debugging, atau protokol kustom menggabungkan origin secara tidak terduga. Ketiadaan pengaturan ketat tanpa adanya konten privat yang dapat dijangkau hanyalah catatan pengerasan.

## Kelas Serangan IPC Lokal dan Komponen Terekspor (subagent_type: `general`)

**Celah Autentikasi Peer pada IPC**
Unix socket, named pipe, Apple XPC, Android Binder, D-Bus, native messaging ekstensi browser, RPC lokal, shared memory, atau listener loopback menerima koneksi dari peer berhak rendah tanpa memeriksa kredensial OS, tanda tangan kode, token sandbox, atau kepemilikan saluran. Tunjukkan method atau pengungkapan data berharga di balik saluran tersebut.

**Ketidakcocokan Antara Prinsipal yang Diklaim vs Identitas Saluran**
Proses/saluran yang terautentikasi adalah milik aplikasi atau pengguna A, tetapi field payload permintaan menentukan pengguna B, tenant lain, profil lain, atau kapabilitas lain. Ikat setiap method dan sumber daya ke kredensial peer OS yang sebenarnya, bukan ke pengenal yang dideklarasikan oleh pemanggil.

**Penyalahgunaan Layanan, Activity, Receiver, atau Provider Terekspor**
Komponen aplikasi mobile (`exported=true`) atau endpoint otomasi lokal dapat dipanggil dari luar dan menjalankan operasi yang seharusnya hanya untuk internal aplikasi itu sendiri. Tinjau manifes akhir (merged AndroidManifest.xml), intent filter, tingkat izin tanda tangan (signature permission), pembatasan path URI, dan alias tersembunyi. Jika status manifes pasca-packaging tidak diketahui, gunakan status `needs_validation`.

**Kebingungan Siklus Hidup dan Korelasi IPC**
ID permintaan yang dapat ditebak, handle yang digunakan ulang, saluran usang, file descriptor yang terwarisi, path socket yang dapat ditulis oleh siapa saja (world-writable), atau perilaku restart proses memungkinkan suatu peer menjawab, membatalkan, atau membajak operasi peer lain. Tinjau izin pembuatan dan pembersihan berkas socket, lock file, port, dan memory mapping.

## Kelas Serangan Privileged-Helper dan Berkas Lokal (subagent_type: `general`)

**Privileged Helper Sebagai Confused Deputy**
Pemanggil berhak rendah dapat meminta helper berhak tinggi (root/administrator) untuk mengeksekusi perintah tertentu, memodifikasi berkas, menjalankan service, mengubah konfigurasi pengguna, atau pengaturan sistem tanpa otorisasi per-operasi. Tinjau aturan helper sudo/polkit/UAC/XPC dan pastikan helper memvalidasi argumen yang telah dinormalisasi secara independen.

**Kepercayaan Path Instalasi, Pembaruan, dan Perbaikan (Repair Path)**
Installer atau service perbaikan berhak tinggi membaca manifes, skrip, paket aplikasi, symlink, direktori kerja, atau status perbaikan yang dapat ditulis oleh aktor berhak rendah setelah otorisasi diberikan. Ikat otorisasi ke konten berkas yang tidak dapat diubah (immutable digest) dan path tujuan yang terlindungi.

**Kepemilikan Berkas Lokal dan TOCTOU (Time-of-Check to Time-of-Use)**
Aplikasi memeriksa suatu berkas/path, lalu rentan terhadap penggantian berkas, manipulasi symlink, mount point, atau normalisasi huruf besar-kecil selama operasi baca/tulis istimewa berlangsung. Gunakan operasi berbasis descriptor (seperti `openat`, `fstat`) dan verifikasi kepemilikan akhir. Fokuskan `MEMORY-SAFETY-AND-BINARY.md` pada pemrosesan parsing setelah berkas berhasil dibuka.

**Ketidakcocokan Batasan Brankas Kredensial dan Rahasia Lokal**
Item di iOS Keychain, Android Keystore, berkas token, backup lokal, log aplikasi, clipboard, preview notifikasi, atau konfigurasi lokal dapat dibaca oleh aplikasi lain, profil lain, atau pengguna lain dengan wewenang lebih rendah. Teks polos yang hanya dapat dibaca oleh akun OS pemilik yang sama bukanlah kerentanan otomatis; tunjukkan pembaca berhak rendah dan kekuatan kredensial yang bocor.

## Kelas Serangan Status Aplikasi dan Siklus Hidup Perangkat (subagent_type: `general`)

**Kebocoran Saat Ganti Akun, Logout, dan Pemulihan Perangkat**
Data cache, background worker, widget, notifikasi, database SQLite lokal, storage webview, atau persetujuan biometrik tetap bertahan setelah pengguna logout atau berganti akun dan muncul di bawah akun pengguna berikutnya. Tinjau perilaku backup/restore dan dukungan multi-profil.

**Kebingungan Aksi Tertunda dan Kehadiran Pengguna (User Presence)**
Notifikasi interaktif, widget, jalan pintas (shortcut), share sheet, prompt biometrik, atau operasi tertunda (deferred action) mengotorisasi tindakan yang berbeda dari yang ditampilkan kepada pengguna, mengeksekusi setelah kedaluwarsa, atau memakai status tertunda milik profil lain. Ikat konfirmasi ke aksi yang dinormalisasi, sumber daya terkait, akun aktif, dan status aplikasi yang sedang berada di layar depan (foreground).

## Langkah Kerja Universal

- Buat daftar lengkap setiap proses, komponen aplikasi, endpoint lokal, skema URI kustom, asosiasi ekstensi berkas, origin webview, dan helper istimewa. Catat identitas OS, hak runtime, pemanggil yang diizinkan, dan operasi yang dapat dipanggil.
- Baca artefak packaging akhir: manifes gabungan, entitlements, aturan installer, registrasi native messaging, protokol kustom, dan pembentukan ACL. Deklarasi di kode sumber mentah sering kali ditimpa saat proses build.
- Lakukan validasi menggunakan profil tiruan dan berkas uji coba non-sensitif pada mesin pengujian atau emulator terisolasi. Jangan pernah berinteraksi dengan aplikasi pengguna lain, kredensial pribadi, atau layanan cloud produksi.

## Aturan Validasi (terapkan sebelum melaporkan temuan apa pun di domain ini)

1. Sebutkan kapabilitas awal penyerang, batasan prinsipal OS/aplikasi yang dilompati, saluran masuk yang digunakan, argumen atau status yang diterima, serta operasi atau pengungkapan data yang tidak sah.
2. Konfirmasikan kontrol sandbox OS, kredensial peer, code signing, entitlements, izin aplikasi, dialog persetujuan pengguna, dan kontrol installer yang berlaku. Jika fakta packaging akhir tidak diketahui, gunakan status `needs_validation`.
3. Untuk bridge webview, buktikan kontrol navigasi/origin sekaligus sink native istimewa. Untuk IPC, buktikan autentikasi peer dan otorisasi per-sumber daya. Untuk helper istimewa, verifikasi path tujuan akhir yang telah dinormalisasi.
4. Pastikan pengujian lokal tetap terisolasi dan menggunakan data tiruan. Hentikan pengujian begitu batasan keamanan terbukti dilanggar; jangan memperluas pengujian ke arah persistensi atau modifikasi sistem yang lebih luas.
5. Berikan status `confirmed` hanya jika rantai bukti kode sumber dan pengujian lokal lengkap. Berikan status `needs_validation` jika ada fakta OS, manifes build, tanda tangan digital, ACL, atau siklus hidup perangkat yang memerlukan konfirmasi pemilik sistem.
