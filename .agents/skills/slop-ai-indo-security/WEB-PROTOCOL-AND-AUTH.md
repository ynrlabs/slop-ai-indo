# Perburuan Celah Protokol HTTP dan Autentikasi (HTTP-Protocol and Authentication Hunting)

#### Kapan Menggunakan Berkas Ini

Gunakan berkas ini ketika target berkomunikasi melalui HTTP pada batas parsing, caching, autentikasi browser, atau batas identitas: aplikasi web, API, reverse proxy, CDN, gateway, server HTTP kustom, serta layanan yang menerapkan sesi, JWT, OAuth/OIDC, SAML, pemulihan kata sandi, MFA, passkey, API key, atau mTLS. Gunakan modul ini bersamaan dengan `ATTACK-CLASSES.md`: tinjauan kontrol akses menanyakan apakah suatu subjek boleh melakukan operasi; berkas ini menanyakan apakah lapisan HTTP atau identitas dapat membuat bingung subjek mana, request mana, level jaminan mana, atau token mana yang menjadi pemilik operasi tersebut.

Pilih kelas serangan yang relevan dari Fase 1. Pisahkan target berukuran besar menjadi: pembingkaian request dan kebijakan cache, autentikasi browser, identitas terfederasi, autentikasi kuat dan pemulihan, kredensial layanan, dan siklus hidup sesi. Satu server di balik reverse proxy terkelola yang tidak terlihat memiliki permukaan celah HTTP request smuggling yang relatif kecil; sebaliknya, proxy kustom atau parser mandiri memiliki risiko yang jauh lebih besar.

## Core discipline (include in every agent prompt for this domain)

```
- Temuan pembingkaian (framing) dan cache membutuhkan dua penafsiran berbeda atas request, response, atau cache key yang sama. Sebutkan kedua komponen dan nilai ternormalisasi persis di masing-masing sisi.
- Untuk setiap kredensial, temukan verifikasi tanda tangan atau rahasia dan setiap pengikatan (binding) yang diwajibkan untuk perannya: penerbit (issuer), audiens (audience), origin, RP, klien, sesi, subjek/prinsipal, resource, jaminan (assurance), kedaluwarsa, dan status satu kali pakai (one-time state).
- Nilai header Host, Forwarded, X-Forwarded-*, Origin, Referer, target redirect, status callback, dan URL turunan request adalah keputusan berbasis kepercayaan. Telusuri masing-masing ke identitas atau respons yang terpengaruh.
- Ketiadaan header tertentu, atribut cookie, prompt MFA, atau rate limit bukanlah temuan mandiri jika berdiri sendiri. Wajibkan adanya request tidak sah yang diterima, dampak lintas subjek, penurunan level jaminan, atau kebocoran kredensial nyata.
- Tetapkan status confirmed hanya dari bukti kode sumber yang lengkap dan uji coba request/token lokal yang terikat batas. Gunakan needs_validation ketika konfigurasi proxy, IdP, browser, sertifikat, secret, atau deployment memang dibutuhkan namun tidak terlihat di repositori.
```

## Kelas serangan pembingkaian HTTP dan cache (subagent_type: `general`)

**Request framing and desynchronization**
Sisi front-end dan back-end berbeda pendapat mengenai panjang request atau normalisasi header. Periksa kasus beberapa nilai `Content-Length`, `Transfer-Encoding`, downgrade HTTP/2 atau HTTP/3, normalisasi nama header, header koneksi terlarang, dan konversi karakter CR/LF. Buktikan byte mana yang dialokasikan oleh satu komponen ke sebuah request dan byte mana yang dialokasikan oleh peer berikutnya ke request selanjutnya (HTTP request smuggling).

**Web cache poisoning through unkeyed input**
Nilai dari request mengubah konten yang di-cache atau memengaruhi header penting keamanan, namun nilai tersebut tidak disertakan dalam cache key. Bandingkan penyusunan cache key dengan setiap variasi respons, termasuk forwarded host/scheme, cookie terpilih, normalisasi query parameter, header bahasa/perangkat, dan status otorisasi.

**Cache deception and private-response caching**
Perutean cache memperlakukan jalur privat dinamis sebagai aset statis publik, atau meng-cache respons yang identitas dan input otorisasi penggunanya tidak disertakan dalam kebijakan cache. Bandingkan kemampuan caching di edge dengan parsing rute aplikasi, normalisasi sufiks/parameter path, dan direktif cache respons.

**Host and forwarded-header trust**
Metadata host atau proxy yang tidak tepercaya menentukan URL absolut, perutean penyewa (tenant routing), callback autentikasi, tautan reset password, cache key, atau alamat IP klien yang digunakan untuk otorisasi. Buktikan siapa yang dapat menyuplai header tersebut dan apakah layer ingress tepercaya menghapus salinan yang dikirimkan oleh klien luar.

**Response-header injection**
Data tidak tepercaya mencapai header `Location`, `Set-Cookie`, CSP, atau header respons lainnya dengan karakter kontrol yang tidak aman (CRLF injection) atau normalisasi yang cacat. Verifikasi apakah framework sudah menolaknya secara otomatis sebelum melaporkan temuan, dan buktikan adanya perubahan respons yang berdampak nyata pada keamanan.

## Kelas serangan sesi browser (subagent_type: `general`)

**Ordinary CSRF**
Browser mengirimkan kredensial ambient (seperti cookie otomatis) ke endpoint pengubah status yang menerima request lintas situs (cross-site) tanpa token anti-CSRF yang efektif, tanpa pengikatan same-site, atau tanpa validasi Origin/Referer yang ketat. Inventarisasi setiap operasi mutasi yang diautentikasi dengan cookie, termasuk form HTML, request mirip JSON, multipart, method-override, dan rute warisan lama. Atribut SameSite hanya efektif untuk cookie dan konteks browser yang benar-benar digunakan; login CSRF dan request subresource lintas situs dapat memiliki kebutuhan pengamanan yang berbeda.

**Session fixation and invalidation**
Pengenal sesi tidak dirotasi saat pengguna login, berganti akun, menyelesaikan tantangan MFA, melakukan impersonasi, atau mengalami perubahan hak akses lainnya; atau pengenal sesi tetap valid setelah pengguna logout, mengganti kata sandi, melakukan pencabutan token, atau penonaktifan akun. Periksa sesi server, refresh token, cookie bertanda tangan, status websocket, salinan cache, dan endpoint fallback.

**Cookie scope and transport**
Cookie sensitif memiliki atribut `Domain` atau `Path` yang terlalu luas, dapat dikirimkan melalui protokol tidak aman (HTTP biasa tanpa `Secure`), atau bertabrakan dengan cookie saudara yang dipilih secara berbeda oleh komponen lain. Ketiadaan flag semata tetap merupakan catatan penguatan sistem (hardening) kecuali jika origin berkepercayaan lebih rendah, posisi jaringan man-in-the-middle, atau jalur browser nyata dapat mencuri atau mengganti kredensial tersebut.

## Kelas serangan identitas terfederasi (subagent_type: `general`)

Tetapkan peran arsitektur terlebih dahulu. Kontrol server otorisasi seperti whitelist redirect dan penerbitan kode otorisasi bukan milik klien relying-party. Cacat verifikasi dan pengikatan adalah milik komponen yang mengonsumsi artefak token tersebut.

**JWT verification and claim binding**
Periksa verifikasi tanda tangan kriptografis, algoritma yang dipin di server dan sumber kunci publik, lalu periksa klaim `exp`, `nbf`, `aud`, dan `iss`. Tinjau `kid`, `jku`, dan `x5u` sebagai selektor kunci yang tidak tepercaya, normalisasi duplikasi/header, dan alur decode-tanpa-verifikasi (decode-without-verify). Token yang valid untuk layanan lain adalah tidak sah di sini meskipun ditandatangani oleh penerbit (issuer) tepercaya yang sama.

**OAuth/OIDC request and callback binding**
Validasi kepemilikan persis `redirect_uri` jika target adalah server otorisasi; parameter `state` yang terikat pada sesi pengguna; pengikatan PKCE dan kode otorisasi jika relevan; verifikasi issuer/audience/signature/nonce pada ID-token; dan pengikatan IdP terpilih pada alur multi-penyedia. Bandingkan rute callback awal, percobaan ulang (retry), tautan mobile/deep-link, dan alur penautan akun.

**SAML signed-object and assertion binding**
Pastikan elemen XML yang tanda tangannya diverifikasi adalah elemen yang sama yang digunakan sebagai penetap identitas pengguna. Periksa alur fallback tanpa tanda tangan, konfigurasi parser XML yang aman (pencegahan XXE), perbedaan kanonikalisasi XML, serta field kesegaran/pengikatan seperti jendela validitas, audiens/penerima, korelasi request, dan pencegahan replay.

## Kelas serangan MFA, passkey, dan transisi akun (subagent_type: `general`)

**MFA enrollment and assurance downgrade**
Pendaftaran faktor baru, penggantian perangkat, penonaktifan, pembuatan kode cadangan pemulihan, penambahan perangkat tepercaya, dan login fallback membutuhkan jaminan autentikasi awal yang sesuai kebijakan. Pastikan faktor pertama yang valid tidak dapat mendaftarkan atau mengganti faktor kedua tanpa re-autentikasi segar yang diwajibkan kebijakan, serta faktor yang dinonaktifkan atau basi benar-benar berhenti mengotorisasi sesi.

**Step-up binding and bypass**
Tantangan autentikasi bertingkat (step-up challenge) yang berhasil justru meningkatkan hak sesi, akun, penyewa, tindakan, atau request API yang salah; atau rute alternatif mengabaikan pemeriksaan jaminan tersebut. Ikat tantangan keamanan ke subjek pengguna, sesi aktif, target jaminan, operasi atau resource saat diwajibkan, masa kedaluwarsa, dan penyelesaian satu kali pakai. Bandingkan alur antarmuka UI, API langsung, proses batch, pemulihan, dan alur yang dilanjutkan.

**WebAuthn and passkey verification**
Saat registrasi, ikat nilai challenge, RP ID, origin yang diharapkan, kredensial publik, user/userHandle, algoritma, dan verifikasi pengguna (user verification) yang diwajibkan ke sesi yang menginisiasinya. Saat autentikasi, verifikasi challenge, RP/origin, keanggotaan kredensial, tanda tangan digital, dan kehadiran/verifikasi pengguna yang sah. Periksa alur penemuan akun dan penautan untuk mencegah kebingungan userHandle atau pemetaan kredensial-ke-akun yang salah. Penghitung tanda tangan (signature counter) hanya bermakna jika produk memperlakukan regresi nilai sebagai sinyal kloning perangkat.

**Account linking and identity collision**
Menambahkan IdP baru, passkey, alamat email, nomor telepon, perangkat, atau akun eksternal ke akun yang sudah ada wajib memerlukan sesi terautentikasi aktif, bukti kepemilikan terverifikasi atas identitas baru, step-up autentikasi yang diwajibkan, dan status callback yang terikat pada akun yang memulai penautan. Tinjau alur pelepasan tautan (unlink), penautan ulang, dan penerimaan undangan untuk mencegah tabrakan identitas terverifikasi atau tabrakan tenant.

**Password reset and broader recovery**
Token pemulihan akun, alur pemulihan oleh customer support/admin, kode cadangan (backup codes), migrasi perangkat, serta pergantian email atau telepon sering kali menjadi jalur autentikasi paling lemah. Verifikasi keacakan token secara kriptografis, pengikatan pengguna/tindakan, masa kedaluwarsa, status satu kali pakai, pembatasan laju (rate limiting), kepercayaan URL pengiriman, dan pembatalan token serta sesi lama. Respons berbeda yang hanya mengungkapkan keberadaan akun publik bukanlah temuan keamanan otomatis.

## Kelas serangan API-key dan mTLS (subagent_type: `general`)

**API-key scope and resource binding**
Kunci API mengautentikasi akses ke penyewa, resource, tindakan, atau lingkungan yang lebih luas daripada yang diberikan oleh rekaman di sisi server, atau parameter request menimpa pengikatan tersebut. Tinjau pencarian kunci, verifikasi prefiks/rahasia penuh, kerancuan tipe antara publishable key dan secret key, pemeriksaan scope hak akses, rotasi kunci, cache pencabutan, dan endpoint operasi massal.

**API-key exposure and unsafe transport**
Kunci rahasia muncul di dalam bundle JavaScript klien, URL, pengalihan redirect, log server, penanganan error, artefak build, atau respons yang dapat diakses oleh subjek berhak rendah. Pengenal publik yang disebut sebagai "key" bukanlah sebuah rahasia. Konfirmasikan tipe kunci dan otoritas apa yang diperoleh jika kunci tersebut bocor.

**mTLS peer and application-identity confusion**
Proses mempercayai header identitas sertifikat klien dari sembarang peer jaringan, memverifikasi rantai sertifikat tetapi memetakan teks subject yang dapat dipengaruhi penyerang ke akun yang salah, atau menerima sertifikat untuk domain kepercayaan, extended usage, audiens, atau kebijakan validitas yang keliru. Jika proxy tepercaya menghentikan terminasi mTLS, pastikan hanya proxy tersebut yang dapat terhubung, proxy menghapus header identitas yang masuk dari klien luar, dan backend mengikat identitas yang telah disanitasi ke dalam request.

**Certificate lifecycle fallback**
Sertifikat yang kedaluwarsa, dicabut, hilang, atau gagal diperpanjang menyebabkan sistem fallback diam-diam ke mode bearer-only atau operasi anonim tanpa autentikasi; atau koneksi pooled yang berumur panjang mempertahankan otorisasi setelah sertifikat dicabut. Ketiadaan data pencabutan deployment membuat temuan berstatus `needs_validation`; cabang fail-open yang tertulis langsung di kode repositori dapat dikonfirmasi dari kode sumber.

## Universal moves (apply across the above)

- Telusuri alur penerbitan (issue) -> penyimpanan (store) -> pengiriman (transmit) -> penggunaan (consume) -> penyegaran (refresh) -> pencabutan (revoke) untuk setiap kredensial dan tantangan keamanan. Bandingkan alur normal, error, percobaan ulang (retry), migrasi data, sistem lama, dan alur pergantian akun.
- Inventarisasi setiap pintu masuk menuju identitas yang sama dan setiap rute menuju operasi sensitif yang sama. Kebijakan keamanan efektif ditentukan oleh jalur paralel yang paling lemah, bukan oleh antarmuka pengguna yang paling rapi.
- Bandingkan normalisasi antara parser, proxy, router, cache, dan aplikasi secara berdampingan. Untuk validasi lokal, masukkan fixture request terikat yang identik ke masing-masing komponen alih-alih mengirimkan trafik ke server live.
- Untuk alur pemulihan dan penautan akun, gambarkan diagram graf akun sebelum dan sesudah tindakan. Setiap sisi transisi wajib menyebutkan subjek pengguna aktif, bukti identitas baru, level jaminan yang diwajibkan, pengikatan callback/sesi, dan efek pembatalan hak akses.

## Validation rules (apply before reporting ANY finding here)

1. Terapkan gerbang visibilitas kode sumber. Rantai proxy, cache key di edge, kebijakan IdP eksternal, kepercayaan sertifikat OS, perilaku cookie browser tertentu, secret produksi, dan mode autentikasi deployment mungkin berada di luar repositori kode. Catat sebagai kandidat `needs_validation` yang presisi alih-alih berasumsi sepihak tentang perilaku infrastruktur yang tidak terlihat.
2. Untuk temuan pembingkaian (framing) dan cache, sebutkan kedua komponen dan perbedaan parsing/key yang terjadi. Buktikan dampak lintas-request, lintas-pengguna, atau kebocoran respons privat menggunakan fixture lokal yang terikat batas.
3. Untuk temuan token, MFA, passkey, penautan akun, pemulihan kata sandi, API key, dan mTLS, kutip baris kode verifikasi dan sebutkan pengikatan subjek/sesi/resource/origin/audiens/tindakan/jaminan yang hilang. Buktikan bahwa server menerima transisi atau kredensial yang tidak valid tersebut.
4. Untuk temuan CSRF, sebutkan kredensial ambient yang digunakan, rute pengubah status, bentuk request lintas situs yang diterima, kebijakan cookie browser, dan pemeriksaan efektif yang hilang. Tindakan yang berstatus read-only murni dan rute yang mewajibkan bearer token non-ambient tidak memenuhi syarat sebagai temuan kerentanan.
5. Verifikasi pengaturan default framework dan library yang digunakan. Jika versi paket atau konfigurasi bawaan tidak diketahui di kode, gunakan status `needs_validation`; jangan turunkan klaim kritis yang belum terverifikasi menjadi temuan terkonfirmasi berbobot rendah.
6. Kembalikan status `confirmed` hanya jika ada alur kode sumber lengkap dan identitas tidak sah, status rusak, atau kebocoran data yang dapat diamati secara langsung. Untuk `needs_validation`, sebutkan fakta yang hilang serta rencana pemeriksaan aman lokal atau observasi oleh pemilik sistem yang dapat menyelesaikannya.
