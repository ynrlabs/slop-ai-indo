# Perburuan Celah Keamanan Sisi Klien dan Peramban (Client-Side & Browser)

#### Kapan menggunakan berkas ini

Gunakan berkas ini saat keputusan kepercayaan penting atau perenderan data tak tepercaya terjadi di dalam peramban (browser): aplikasi satu halaman (SPA), ekstensi peramban, webview tersemat, service worker, aplikasi offline, serta kode yang merender konten yang dapat dipengaruhi penyerang ke dalam DOM, menerima pesan lintas-jendela (cross-window), atau memakai penyimpanan peramban. Jalur-jalur ini mencakup sumber yang tidak pernah dilihat oleh server, seperti fragmen URL (#), `window.name`, `postMessage`, dan konten cache sebelumnya.

Gunakan bersama `ATTACK-CLASSES.md`. Berkas ini mencakup sumber dan sink peramban, batasan origin, persistensi peramban, dan oracle status lintas-situs. Gunakan `DESKTOP-MOBILE-AND-LOCAL-IPC.md` untuk sisi native dari bridge webview, dan `WEB-PROTOCOL-AND-AUTH.md` untuk CSRF sisi server, sesi, dan callback autentikasi.

## Disiplin Inti (sertakan dalam setiap prompt agen untuk domain ini)

```
- Kandidat celah sisi klien membutuhkan sumber yang dapat dikontrol (source) dan sink yang mengeksekusi atau membocorkan data. Sebutkan keduanya dan buktikan data yang dipengaruhi penyerang sampai ke sink.
- Dampak harus mencapai sesi korban, origin lain, atau persistensi bersama. Self-injection dan pengungkapan data milik penyerang sendiri bukanlah temuan keamanan.
- Pelesapan karakter framework (escaping), Same-Origin Policy (SOP), CSP, COOP/CORP, cakupan service worker, dan default noopener modern adalah kontrol nyata. Verifikasi mekanisme tersebut sebelum menetapkan dampak.
- Penyimpanan dan cache peramban dibagi per origin dan dapat bertahan melampaui siklus login. Identifikasi siapa yang menulis, siapa yang membaca, serta siklus akun, tenant, atau worker mana yang membersihkan tiap data.
- Gunakan status "confirmed" hanya jika ada bukti source lengkap ditambah pengujian peramban lokal terisolasi. Gunakan "needs_validation" jika perilaku renderer, izin ekstensi, header produksi, atau kebijakan peramban tertentu diperlukan namun belum dapat diuji.
```

## Kelas Serangan DOM dan Status Objek (subagent_type: `general`)

**DOM-based XSS**
Telusuri kolom `location`, `document.referrer`, `window.name`, data pesan, storage, dan status dokumen yang dikontrol peramban menuju ke `innerHTML`, `outerHTML`, `document.write`, API evaluasi string, URL yang dapat dieksekusi, API HTML jQuery, atau celah pelolosan framework (escape hatches). Interpolasi yang sudah lolos sanitasi bawaan framework bukanlah temuan.

**DOM Clobbering**
Atribut `id` atau `name` yang disuntikkan penyerang membayangi (shadowing) variabel global, properti formulir, objek konfigurasi, atau flag inisialisasi yang dipercayai oleh kode. Tunjukkan jalur markup yang mempertahankan atribut tersebut sekaligus penggunaan nilai yang telah ter-clobber untuk aksi keamanan penting.

**Prototype Pollution dan Rantai Gadget (Gadget Chain)**
Kunci yang dikontrol penyerang mencapai penulisan rekursif seperti deep merge atau penugasan path objek dan memodifikasi prototype (`Object.prototype`). Kemudian gadget yang dapat dijangkau mengonsumsi properti terpolusi tersebut untuk mengubah otorisasi, eksekusi, navigasi, atau perenderan. `JSON.parse` biasa, shallow copy, atau polusi tanpa adanya gadget yang mengeksekusi bukanlah temuan yang valid.

## Kelas Serangan Komunikasi Lintas-Origin dan Jaringan (subagent_type: `general`)

**Kepercayaan Origin dan Sumber pada `postMessage`**
Handler menjalankan aksi sensitif dengan `event.data` tanpa memeriksa whitelist origin secara persis atau tanpa memeriksa `event.source` yang diharapkan ketika banyak frame berbagi origin. Pada sisi pengirim, data sensitif yang dikirim ke target `*` mencapai frame tak tepercaya yang menyematkannya. Pencocokan substring yang lemah, awalan, akhiran, atau regex tanpa anchor bukanlah validasi origin yang aman.

**Penyalahgunaan Permintaan WebSocket Lintas-Situs (CSWSH)**
Handshake pembaruan WebSocket menerima cookie ambient dari origin tak tepercaya tanpa pemeriksaan `Origin` atau token spesifik saluran, memungkinkan sesi korban membaca atau memanipulasi data. Konfirmasikan perilaku upgrade handshake dan handler pesan yang relevan secara keamanan.

**Kepercayaan CORS dengan Kredensial (Credentialed CORS)**
Server merefleksikan atau mencocokkan header `Origin` secara longgar sambil mengizinkan kredensial (`Access-Control-Allow-Credentials: true`) dan mengembalikan data sensitif. Karakter wildcard mentah `*` bersama kredensial ditolak oleh spesifikasi peramban; laporkan hanya jika server benar-benar merefleksikan origin penyerang dan membocorkan data privat atau memicu mutasi status.

## Kelas Serangan Service Worker dan Penyimpanan Peramban (subagent_type: `general`)

**Pendaftaran Service Worker dan Pengambilalihan Cakupan (Scope Takeover)**
Konten yang dapat dipengaruhi penyerang menjadi skrip worker yang terdaftar, mengontrol jalur yang menerima cakupan `Service-Worker-Allowed` yang terlalu luas, atau mengubah skrip impor tanpa kontrol integritas. Verifikasi URL skrip akhir, MIME type respons, origin, scope, dan siapa yang mengontrol setiap skrip yang diimpor. Worker normal pada origin yang sama dengan scope yang tepat bukanlah cacat keamanan.

**Kebingungan Cache dan Identitas pada Service Worker**
Worker menyimpan cache respons terpersonalisasi tanpa menyertakan status akun, tenant, otorisasi, atau mode permintaan dalam kebijakannya, lalu menyajikannya setelah pengguna berganti akun atau logout. Tinjau perutean fetch event, penamaan kunci cache, fallback navigasi, pembersihan cache, dan apakah jalur offline/error mengembalikan respons pengguna lain sebelumnya.

**Kebocoran Penyimpanan Peramban dan Otorisasi Usang (Stale Authorization)**
Token, respons privat, draf data, atau keputusan otorisasi tertinggal di `localStorage`, `sessionStorage`, IndexedDB, Cache Storage, storage ekstensi, atau state klien dan dapat dibaca oleh akun lain atau komponen dengan hak lebih rendah pada origin yang sama. Menyimpan token saja bukanlah temuan; harus ada skenario pembaca realistis dengan hak lebih rendah, atau token tetap dapat digunakan setelah sesi dicabut/logout.

**Kebingungan Broadcast dan Penyimpanan Lintas-Konteks**
Event `storage`, `BroadcastChannel`, shared worker, atau cache seluruh origin membawa identitas atau perintah antar tab tanpa mengikatnya ke sesi aktif saat ini. Periksa alur pergantian akun, jendela privat vs publik, pergantian tenant, dan tab usang yang dapat menimpa status autentikasi yang lebih baru.

## Kelas Serangan Kebocoran Informasi Lintas-Situs (subagent_type: `general`)

**XS-Leaks dan Oracle Status Lintas-Origin**
Halaman penyerang dapat membedakan status terlindungi lintas-origin melalui event muat/gagal sumber daya, status frame/window, perilaku pengalihan (redirect), timing respons, status cache, atau ukuran respons saat peramban menyertakan kredensial korban. Tunjukkan satu predikat pembawa rahasia konkret, seperti apakah objek privat, peran, atau akun tertentu ada. Variasi timing acak atau ketersediaan sumber daya publik bukanlah temuan valid.

**Kebocoran Status Window dan Opener**
Metadata atau hasil navigasi jendela lintas-origin membocorkan status terlindungi, atau relasi opener/named-window yang dipertahankan memungkinkan halaman penyerang memengaruhi navigasi jendela yang memiliki hak istimewa. Periksa COOP, proteksi frame, atribut `noopener`, origin eksak, dan apakah status yang teramati bersifat rahasia.

## Kelas Serangan Rekayasa UI dan Navigasi (subagent_type: `general`)

**Clickjacking**
Aksi pengubah status yang dapat disematkan dalam iframe tidak memiliki header `Content-Security-Policy: frame-ancestors`, `X-Frame-Options`, atau isolasi UI yang memadai. Tunjukkan aksi sensitif yang dapat diselesaikan sepenuhnya dalam kondisi ter-frame; ketiadaan header pada halaman yang hanya bersifat membaca data (read-only) hanyalah catatan pengerasan (hardening), bukan temuan kerentanan langsung.

**Manipulasi Navigasi Sisi Klien (Open Redirect / Script Navigation)**
Sumber masukan klien mengontrol pengalihan atau navigasi tanpa validasi skema dan tujuan yang ketat, termasuk tujuan berbahaya berskema `javascript:` atau `data:`. Reverse tabnabbing hanya berlaku jika kode secara eksplisit mempertahankan `window.opener`, menggunakan `window.open` tanpa isolasi, atau menargetkan lingkungan tanpa `noopener` implisit.

## Langkah Kerja Universal

- Mulailah dari sink DOM, navigasi, worker, pesan, dan storage, lalu telusuri mundur ke sumber data sisi klien maupun kontrol server. Catat kebijakan keamanan peramban yang seharusnya menghentikan aliran tersebut.
- Uji pergantian akun, logout, pembaruan worker, fallback offline, dan status tab lama menggunakan origin pengujian lokal dan akun uji coba. Jangan gunakan data pengguna produksi, origin publik, atau layanan bersama.
- Untuk XS-Leaks, cantumkan hanya predikat yang terbukti melalui kode sumber dan perilaku peramban lokal. Kemudian identifikasi header respons atau perubahan cara perenderan yang dapat menutup celah oracle tersebut.

## Aturan Validasi (terapkan sebelum melaporkan temuan apa pun di domain ini)

1. Sebutkan sumber data (source), titik eksekusi/eksposur (sink), kebijakan peramban yang berlaku, origin/sesi yang terdampak, serta mutasi atau pembocoran data yang dapat diamati.
2. Untuk prototype pollution, buktikan penulisan rekursif dan gadget yang relevan secara keamanan. Untuk DOM clobbering, buktikan markup bertahan dari sanitasi dan nilai yang ter-clobber benar-benar dipakai oleh logika program.
3. Untuk service worker dan storage, buktikan jangkauan siklus hidup (lifecycle): penulisan data atau entri cache yang dikontrol penyerang harus terbukti dapat menjangkau akun berbeda, tenant lain, atau status otorisasi berikutnya.
4. Untuk pengiriman pesan, CORS, WebSocket, dan XS-Leaks, tunjukkan validasi origin/source yang lemah serta data terlindungi atau aksi yang terekspos. Pastikan bahwa CSP, COOP/CORP, atribut cookie, dan kebijakan SameSite tidak memblokirnya terlebih dahulu.
5. Berikan status `confirmed` hanya jika terdapat alur klien yang lengkap beserta bukti lokal terisolasi. Berikan status `needs_validation` disertai rincian header produksi, izin ekstensi, versi peramban, atau perilaku renderer yang harus diverifikasi oleh pemilik sistem.
