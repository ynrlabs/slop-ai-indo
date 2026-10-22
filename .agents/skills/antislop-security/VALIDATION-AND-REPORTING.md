# Validasi, Output Terstruktur, Verifikasi, dan Pelaporan

### Fase 3: Memvalidasi Setiap Kandidat Secara Independen

Setelah gelombang kritikus cakupan menyatakan bersih atau setelah penghentian dini yang dicatat secara eksplisit, konsolidasikan kandidat Fase 2 dan temuan terkonfirmasi lama yang sumbernya sama berdasarkan fingerprint stabil dan akar masalahnya. Serahkan setiap kandidat unik berstatus `confirmed` dan `needs_validation` kepada agen verifikator baru (`general`) yang tidak ikut memburu kandidat tersebut. Temuan lama yang dibawa mengikuti alur verifikasi yang sama meskipun hunter mengecualikan akar masalah tersebut. Verifikator boleh membaca artefak hunter atau artefak lama, namun wajib membaca ulang setiap lokasi kode sumber saat ini dan menjalankan ulang secara independen setiap pemeriksaan menentukan yang dapat direproduksi secara aman.

Berikan setiap verifikator ID unik kanonikal huruf kecil dan folder `<output-dir>/agents/<verifier-id>/scratch/` beserta folder `artifacts/` yang dikelola proses induk. Verifikator hanya boleh menulis ke `scratch/` dan dilarang menulis artefak tersimpan secara langsung. Verifikator hanya menerima kandidat terkait, pemeriksaan dan path artefak dari unit buku besar yang tertaut, fakta arsitektur yang dibutuhkan untuk menafsirkan alur, blok validasi pendamping yang persis, blok prosedur promosi berkas di bawah ini, batasan eksekusi sumber/lokal, cabang skema `confirmed`, `needs_validation`, dan `rejected` dari `report-schema.json` yang disalin secara utuh, serta rekaman audit lama dengan fingerprint yang sama. Verifikator dilarang menerima kesimpulan verifikator lainnya.

#### Format Instruksi untuk Verifikator Kandidat

```text
Anda tidak menulis kandidat ini. Cobalah untuk membantahnya menggunakan kode sumber repositori dan bukti lokal
yang terikat batas. Dilarang menghubungi endpoint live atau layanan eksternal/bersama. Jalankan kode terkontrol
target hanya di dalam sandbox sistem operasi yang disetujui: tanpa jaringan eksternal, lingkungan kosong dengan
whitelist, target dan toolchain berstatus read-only, penulisan hanya ke folder scratch, serta batas rendah
pada sumber daya dan batas waktu jam dinding (wall-clock). Jika ada kontrol sandbox yang tidak tersedia, dilarang
mengeksekusi; pertahankan kapabilitas yang hilang tersebut sebagai pemblokir needs_validation. Perlakukan setiap
entri pada folder scratch sebagai data terkontrol target setelah eksekusi. Setelah sandbox dan semua prosesnya selesai,
hanya kode induk tepercaya yang boleh mempromosikan berkas scratch pra-deklarasi, mengikuti prosedur promosi berkas
yang disertakan secara utuh dalam prompt ini. Anda dan kode target dilarang menulis artefak tersimpan secara langsung.
Jika promosi tidak tersedia atau gagal, jangan gunakan berkas tersebut sebagai bukti.

1. Verifikasi setiap berkas alur (trace) dan bukti, nomor baris positif, cakupan scope, dan deskripsinya.
   Pastikan entri pertama adalah titik masuk berkepercayaan rendah yang nyata dan entri terakhir adalah titik akhir
   (sink) atau efek batas kepercayaan yang diklaim.
2. Rekonstruksi kontrol validasi, identitas, otorisasi, normalisasi, siklus hidup, framework, dan pembatasan
   terkuat yang terlihat di kode sumber pada alur tersebut. Jika ringkasan arsitektur menyebutkan garis dasar
   perangkat pembanding, catat apakah ia memiliki pola serupa: sebagai kalibrasi, bukan alasan untuk menepis temuan.
3. Untuk kandidat yang diajukan berstatus confirmed, reproduksi hasil observasi minimum secara independen jika
   memungkinkan. Verifikasi input, bentuk antarmuka, kondisi prasyarat, serta subjek/aset tiruan (dummy) yang terdampak.
   Dilarang menyimpulkan dampak yang lebih besar atau melanjutkan pengujian melampaui efek minimum.
4. Verifikasi bahwa kemungkinan (likelihood), dampak (impact), keyakinan (confidence), dan perbaikan kode sumber
   yang diajukan hanya sesuai dengan apa yang dibuktikan oleh bukti nyata.
5. Untuk kandidat yang diajukan berstatus needs_validation, putuskan apakah pemblokir tersebut benar-benar berada
   di luar observasi kode/lokal. Jika kode sumber membantah alur tersebut, tolak (rejected). Jika fakta yang hilang
   tetap bersifat menentukan, pertahankan status needs_validation dan buat rencana pengujian lokal serta observasi
   oleh pemilik sistem secara persis dan non-destruktif.
6. Pertahankan fingerprint yang sama untuk akar masalah turunan sumber yang sama di setiap status.

Kembalikan tepat satu objek JSON tanpa teks obrolan di sekitarnya:
{"decision": "confirmed|needs_validation|rejected", "record": { ... }}
di mana properti record wajib cocok persis dengan cabang skema verdict dari keputusan yang diambil.
Catatan yang diperbaiki menggantikan rumusan kalimat milik hunter.
```

Salin prosedur promosi artefak ini secara utuh ke setiap prompt verifikator kandidat:

```text
Prosedur promosi artefak (hanya untuk kode induk tepercaya):
Rujukan ini hanya untuk informasi Anda: proses induk yang menjalankan langkah ini; Anda tidak pernah menjalankannya.

Sebelum eksekusi, proses induk membuka dan mempertahankan deskriptor direktori tepercaya yang tidak dapat diwariskan
untuk folder scratch/ dan artifacts/ milik agen, serta mencatat whitelist berkas artefak relatif-scratch yang diharapkan
beserta batasan byte per-berkas dan kumulatif yang tegas. Jangan pernah memberikan deskriptor tersebut kepada agen atau sandbox.
Setelah sandbox dan seluruh prosesnya selesai, kode induk tepercaya mempromosikan setiap berkas yang di-whitelist secara terpisah:

1. Validasi path relatif yang dideklarasikan: tolak path absolut, kosong, `.`, `..`, atau komponen symlink.
2. Telusuri setiap komponen induk dari deskriptor root scratch yang dipertahankan menggunakan operasi direktori
   relatif tanpa mengikuti link (no-follow); jangan pernah membuka kembali berdasarkan path teks.
3. Buka komponen daun (leaf) secara no-follow dan non-blocking.
4. Verifikasi dengan `fstat` bahwa berkas tersebut adalah berkas reguler dengan link count tepat satu dan berada
   dalam batas ukuran byte per-berkas dan kumulatif yang dicatat.
5. Terapkan batasan tersebut kembali saat membaca dari deskriptor tersebut.
6. Salin persis ukuran yang telah diverifikasi, ulangi `fstat`, dan tolak jika ada perubahan identitas, tipe,
   link count, atau ukuran berkas.
7. Untuk destinasi, telusuri setiap komponen induk dari deskriptor root artifacts yang dipertahankan menggunakan
   operasi relatif no-follow; pastikan setiap komponen yang ada adalah direktori nyata, dan buat direktori baru
   secara eksklusif sebelum membuka dan memverifikasinya secara no-follow.
8. Buat komponen daun secara eksklusif tanpa mengikuti link, verifikasi bahwa berkas destinasi yang terbuka adalah
   berkas reguler dengan link count tepat satu, lalu salin dari deskriptor sumber yang telah diverifikasi tanpa
   membuka kembali kedua path.
9. Gunakan API yang setara dan aman dari race condition pada sistem operasi non-POSIX.
10. Jangan pernah menyalin secara rekursif atau menggunakan glob pada folder scratch, mengekstrak arsip ke dalam artifacts,
    atau mempromosikan symlink, FIFO, socket, device, direktori, berkas hard-link, berkas yang berubah saat dibaca,
    atau berkas yang melampaui batas ukuran.
11. Jika ada pemeriksaan yang tidak tersedia, tidak dapat ditegakkan, atau gagal, buang entri scratch tersebut;
    jika entri tersebut adalah bukti yang menentukan, pertahankan status needs_validation disertai pemblokir promosi yang persis.
```

Verifikator hanya boleh menaikkan status `needs_validation` menjadi `confirmed` setelah membuktikan alur kode secara lengkap dan memperoleh hasil observasi terikat secara independen. Turunkan kandidat konfirmasi menjadi `needs_validation` jika ada fakta deployment atau runtime tertentu yang masih belum diketahui. Gunakan status `rejected` ketika kode sumber, perilaku lokal, kontrol penangkal yang terlihat, ketiadaan dampak nyata, atau prasyarat yang mustahil membantah klaim tersebut. Status `needs_validation` tidak boleh menjadi tempat penampungan ide-ide spekulatif.

Proses induk memeriksa bahwa setiap verifikator mengembalikan fingerprint yang sama kecuali jika verifikator menemukan akar masalah yang benar-benar berbeda. Gabungkan perbaikan teks, catat keputusan di setiap unit buku besar terkait, dan pastikan hanya ada satu rekaman final per fingerprint. Buang hasil verifikator yang rusak formatnya atau terbungkus teks obrolan tanpa mencoba memperbaikinya secara manual; jalankan ulang kandidat tersebut dengan verifikator baru jika anggaran mencukupi, jika tidak kandidat tersebut tetap menjadi kandidat buku besar yang belum tuntas di bawah aturan audit tidak lengkap.

Jika bukti verifikator memperbarui pemeriksaan buku besar, atur `agent_id` pemeriksaan tersebut dengan ID kanonikal verifikator dan cantumkan `reviewed_paths` relatif repositori yang tidak kosong. Pertahankan `reviewed_paths` di tingkat unit sama dengan gabungan dari seluruh pemeriksaan. Gunakan `method: "source"` dengan `artifact: null` untuk tinjauan murni kode sumber. Gunakan `method: "local"` hanya dengan berkas yang berhasil dipromosikan oleh kode induk tepercaya di bawah folder `agents/<check.agent_id>/artifacts/`. Unit mempertahankan agen pemilik penugasan aslinya, sehingga pemeriksaan milik hunter dan verifikator dapat hidup berdampingan secara independen.

Jika anggaran total agen tidak mencukupi untuk memvalidasi setiap kandidat, tetapkan status run menjadi incomplete dan ikuti aturan anggaran deterministik di `SKILL.md`. Kandidat yang belum tervalidasi hanya disimpan di dalam buku besar dan tidak boleh dimasukkan ke dalam `findings.json` dengan status apa pun.

### Fase 4: Menulis dan Memvalidasi `findings.json`

Proses induk menulis seluruh rekaman yang telah diputuskan secara independen ke dalam berkas `<output-dir>/findings.json`, diurutkan berdasarkan fingerprint. Format mencakup:

- `confirmed`: kerentanan berakar kode sumber dengan bukti eksekusi lokal yang lengkap, kondisi prasyarat, remediasi spesifik, tingkat keparahan (likelihood/impact/overall), dan keyakinan (confidence).
- `needs_validation`: kandidat berakar kode sumber dengan pemblokir persis yang belum tuntas serta minimal satu rencana pemeriksaan lokal atau observasi deployment yang aman oleh pemilik sistem.
- `rejected`: kandidat berakar kode sumber yang terbukti salah selama tahap validasi, disimpan agar audit di masa depan tidak mengulang klaim yang tidak berdasar tanpa adanya perubahan bukti.

Baca skema `report-schema.json` sebelum menulis berkas. Skema menggunakan aturan `additionalProperties: false`; dilarang membawa kolom wrapper milik hunter ke dalam rekaman temuan. Jaga kontrak status ini secara tegas:

- Rekaman `confirmed` menggunakan kolom `root_cause`, `intended_behavior`, `conditions`, `execution`, `remediation`, `severity`, dan `confidence`. Dilarang menggunakan `claimed_root_cause`, `blockers`, `validation_plan`, atau `reason`. Properti `execution` bersifat netral-target dan menggunakan antarmuka native target: input API/HTTP, perintah CLI, pemanggilan pustaka kode, pesan, fixture berkas, aksi browser, kebijakan yang dirender, atau harness lokal. Properti `observed_result` tidak boleh kosong dan wajib memuat fakta nyata.
- Rekaman `needs_validation` menggunakan kolom `claimed_root_cause`, `trace`, `evidence`, `blockers`, dan minimal satu kolom `validation_plan.local` atau `validation_plan.deployment` yang tidak kosong. Dilarang memuat kolom keparahan, eksekusi, remediasi, atau akar masalah terkonfirmasi.
- Rekaman `rejected` menggunakan kolom `claimed_root_cause`, `trace`, `evidence`, dan `reason`. Dilarang memuat kolom keparahan, eksekusi, remediasi, pemblokir, atau rencana validasi.

Setiap rekaman memiliki fingerprint stabil, judul, deskripsi, dan path kode sumber relatif repositori. Alur penelusuran (trace) multi-tahap dimulai dengan `entrypoint`, diakhiri dengan `sink`, dan menggunakan label `propagation` di antara keduanya. Alur dengan satu entri menggunakan `entrypoint` atau `sink`. Tingkat keparahan keseluruhan (overall severity) tidak boleh melampaui dampak yang terbukti secara nyata.

Jalankan perintah pengujian:

```sh
node <skill-dir>/validate-findings.cjs <output-dir>/findings.json
node <skill-dir>/validate-coverage-ledger.cjs <output-dir>/coverage-ledger.json
```

Perbaiki setiap kesalahan struktural dan semantik sebelum melanjutkan. Validator temuan menolak input di atas 5 MiB, lebih dari 1.000 temuan tingkat atas, atau lebih dari 64 tingkat nesting, serta membatasi laporan galat maksimal 100 pesan. Keberhasilan validator membuktikan kepatuhan format dan konsistensi buku besar.

### Fase 5: Memverifikasi Rekaman Akhir dengan Pandangan Segar (Fresh Eyes)

Luncurkan satu verifikator baru (`research`) per rekaman akhir `confirmed` dan `needs_validation` secara paralel. Verifikator ini memeriksa rekaman terstruktur, bukan tulisan narasi hunter, dan tetap berada di dalam batas kode sumber dan bukti lokal.

Pada sesi profil cepat (`quick`), Fase 3 dan Fase 5 digabungkan: verifikator Fase 3 langsung melakukan pemeriksaan rekaman ini dan mengembalikan rekaman akhir sesuai skema, sehingga setiap kandidat ditinjau oleh satu peninjau independen yang segar. Seluruh profil lainnya memisahkan kedua fase ini. Dilarang melewatkan peninjauan independen atas rekaman `confirmed` pada profil apa pun.

Untuk rekaman `confirmed`, wajibkan verifikator memeriksa:

1. Setiap path alur/bukti relatif repositori, nomor baris, cakupan scope, dan operasi yang dijelaskan.
2. Antarmuka pintu masuk yang nyata dan bentuk input lokal yang persis.
3. Setiap kondisi prasyarat, tahapan parser/kebijakan, lapisan penangkal yang terlihat di kode, dan hasil observasi lokal nyata.
4. Subjek/aset yang terdampak dan demonstrasi dampak nyata.
5. Pemisahan keparahan: kemungkinan yang realistis, dampak yang terbukti, dan keparahan keseluruhan yang tidak melebihi dampak nyata.
6. Strategi remediasi dan setiap `code_changes`, termasuk apakah perbaikan kode benar-benar menegakkan invarian tanpa sekadar memindahkan kepercayaan.

Untuk rekaman `needs_validation`, wajibkan verifikator memeriksa:

1. Alur kode sumber adalah nyata dan hanya mendukung `claimed_root_cause` yang dinyatakan.
2. Setiap pemblokir yang dicantumkan bersifat menentukan dan belum dapat dijawab secara lokal.
3. Kandidat menyebutkan batas kepercayaan dan potensi hasil konkret daripada kekhawatiran umum yang abstrak.
4. Minimal satu kolom rencana validasi hadir dan persis. Bagian `local` menggunakan fixture terikat; bagian `deployment` meminta pemilik sistem untuk mengamati konfigurasi, identitas, rute, atau runtime nyata. Dilarang mengarang rencana untuk konteks yang tidak berlaku, dan dilarang mengirimkan trafik audit ke server deployment aktif.
5. Fingerprint cocok dengan catatan audit lama atau aktif untuk akar masalah yang sama.

Setiap verifikator mengembalikan tepat satu objek JSON: `{"decision":"verified","fingerprint":"..."}` atau `{"decision":"replace","reason":"...","record":{...}}`, tanpa teks obrolan di sekitarnya. Rekaman pengganti wajib mematuhi cabang skema `confirmed`, `needs_validation`, atau `rejected`. Perlakukan hasil Fase 5 yang rusak formatnya dengan cara yang sama seperti di Fase 3: buang tanpa perbaikan manual dan jalankan ulang dengan verifikator baru jika anggaran memungkinkan.

Dilarang langsung menerapkan penggantian Fase 5 sebagai hasil akhir jika perubahan tersebut mempromosikan rekaman ke status yang lebih kuat (termasuk promosi ke `confirmed`), atau mengubah akar masalah, alur penelusuran, input eksekusi, hasil teramati, dampak, atau tingkat keparahan secara materiil. Berikan rekaman pengganti tersebut kepada verifikator independen baru yang belum pernah terlibat sebelumnya. Verifikator baru memeriksa ulang kode sumber dan mereproduksi hasil lokal secara independen, lalu mengembalikan keputusan `verified` atau penggantian lainnya. Terapkan penggantian materiil hanya setelah verifikasi segar ini berhasil. Jika terjadi sengketa berkelanjutan dan anggaran habis, hapus rekaman dari `findings.json`, simpan unitnya sebagai kandidat belum tuntas di buku besar, dan tetapkan status `run_status: "incomplete"` dengan `incomplete_reason` yang persis. Perbaikan redaksional ringan atau koreksi nomor baris boleh langsung diterapkan jika tidak mengubah makna atau bukti.

Setelah setiap penggantian diterapkan, jalankan ulang kedua skrip validator dan perbarui keputusan di buku besar. Jika verifikator akhir menemukan akar masalah yang terpisah, berikan fingerprint baru dan kirimkan melalui validasi kandidat independen sebelum disertakan. Tetapkan `run_status: "complete"` HANYA jika setiap kandidat di buku besar memiliki disposisi akhir independen dan setiap rekaman yang disimpan lolos dari evaluasi Fase 5.

Dilarang hanya memverifikasi rekaman `confirmed`. Penyerahan status `needs_validation` yang keliru membuang-buang waktu pemilik sistem dan dapat melestarikan premis yang salah.

### Fase 6: Menghasilkan Laporan Netral Target dari Rekaman Akhir

Hanya setelah Fase 5 lolos untuk setiap rekaman yang disimpan di dalam `findings.json`, susun dokumen prosa dari rekaman akhir, buku besar, dan catatan `hardening` hunter. Sesi audit yang belum lengkap boleh melaporkan rekaman yang telah diverifikasi secara independen, namun wajib mengidentifikasi setiap kandidat buku besar yang belum tuntas dan dilarang menyajikannya sebagai temuan resmi. Dokumen prosa tidak boleh mengubah status kelulusan, tingkat keparahan, pemblokir, atau dampak yang terbukti.

#### `REPORT.md`

Tulis dokumen yang memuat:

1. Profil run, lingkup audit, anggaran (jika ada) dengan jumlah agen terpakai versus terencana, rujukan kode sumber, pernyataan eksekusi sandbox sumber dan lokal murni, penggunaan audit lama, serta cakupan yang ditunda (deferred) dan di luar lingkup (out-of-scope). Sebutkan temuan lama yang dibawa dan target validasi ulang. Sesi audit profil cepat (`quick`), terbatas lingkup, terbatas anggaran, atau tidak lengkap wajib menyatakan secara lugas bahwa ini adalah tinjauan parsial. Jika validasi kandidat menghabiskan anggaran ketat, nyatakan bahwa audit belum lengkap dan cantumkan setiap fingerprint dan unit yang belum divalidasi; jangan sebut kandidat tersebut sebagai temuan resmi. Jika anggaran mencegah berjalannya kritikus wajib, nyatakan kritikus mana yang tidak berjalan dan jangan membuat klaim cakupan bersih.
2. Satu ringkasan singkat postur keamanan sistem.
3. Tabel temuan terkonfirmasi: tingkat keparahan, judul, batas kepercayaan yang terdampak, dan satu baris hasil observasi.
4. Setiap temuan terkonfirmasi: lokasi kode sumber di repositori, peran/subjek berkepercayaan rendah, reproduksi terikat native target, kondisi prasyarat, hasil nyata, dampak, alasan prioritas, dan perbaikan kode sumber terkecil.
5. Tabel `NEEDS VALIDATION` terpisah. Sajikan judul setiap petunjuk celah, alur penelusuran repositori, pemblokir persis, langkah lanjutan lokal terikat, serta pemeriksaan deployment aman oleh pemilik sistem. Dilarang memberikan tingkat keparahan atau menyebutnya sebagai kerentanan terkonfirmasi.
6. Catatan penguatan sistem (hardening) dan pola pertahanan kode sumber yang positif secara terpisah.
7. Ringkasan cakupan dari buku besar: jumlah unit covered, candidate, blocked, dan deferred, ditambah pengecualian penting dan kesimpulan kritikus akhir.

Dilarang mendeskripsikan rekaman yang ditolak (`rejected`) sebagai temuan kerentanan. Sebutkan fingerprint-nya hanya jika diperlukan untuk menjelaskan perbedaan pendapat audit sebelumnya atau keputusan cakupan.

#### `FINDINGS-DETAIL.md`

Untuk setiap rekaman terkonfirmasi dengan tingkat keparahan `medium`, `high`, atau `critical`, salin alur kode sumber lengkap dan reproduksi lokal netral target:

- alur penelusuran (trace) dan bukti berurutan relatif repositori;
- penyerang/subjek tiruan dan aset tiruan yang terpengaruh;
- input native, pemanggilan fungsi, atau fixture dan instruksi terikat yang persis;
- output teramati dan invarian keamanan yang dibuktikannya;
- kondisi prasyarat dan pembatasan lingkungan;
- remediasi di tingkat kode sumber serta kasus uji regresinya.

#### `NEEDS-VALIDATION.md`

Untuk setiap rekaman yang belum tuntas, salin alur kode sumber, bukti terverifikasi, pemblokir persis, batas kepercayaan yang terdampak, serta rencana penyelesaian lokal terikat atau observasi pemilik sistem yang relevan. Simpan sebagai petunjuk celah terprioritas tanpa tingkat keparahan. Dilarang mengubahnya menjadi panduan uji coba live atau mengasumsikan fakta deployment yang belum diketahui.

HTTP hanyalah salah satu antarmuka native yang memungkinkan, bukan sebuah keharusan default. Temuan pada pustaka kode (library) menggunakan pemanggilan fungsi, parser menggunakan fixture berkas, CLI menggunakan perintah terminal, aplikasi desktop menggunakan tindakan IPC atau manipulasi berkas, dan infrastruktur menggunakan kebijakan yang dirender secara lokal. Dilarang menuntut keberadaan endpoint jaringan, akun eksternal, atau lingkungan live yang tidak dimiliki oleh target proyek.

Jaga agar laporan tetap proporsional dengan bukti nyata. Sesi audit yang bersih dapat memiliki nol rekaman terkonfirmasi. Nyatakan hasil tersebut beserta batasan cakupan dan validasi yang tersisa tanpa perlu mengarang temuan tingkat LOW yang tidak berdasar.
