# Perburuan Celah Keamanan (Vulnerability Hunting)

### Fase 2: Menjalankan Gelombang Perburuan Berbasis Cakupan

Proses induk menugaskan unit-unit buku besar berstatus `planned` kepada agen-agen pekerja (`general`). Gunakan jumlah agen hunter terfokus yang memadai untuk mencakup seluruh unit tanpa menggabungkan batas kepercayaan yang tidak berkaitan. Satu hunter dapat memegang beberapa unit yang terkait erat dalam satu subsistem; tidak boleh ada unit yang diabaikan secara diam-diam hanya karena pembatasan jumlah agen: unit yang tidak terjangkau anggaran wajib ditandai secara eksplisit berstatus `deferred` dengan alasan `budget_cannot_reserve_critics_and_validation`.

Ketika anggaran atau profil membatasi jumlah hunter, tugaskan unit berdasarkan urutan prioritas dan catat alasan pengurutannya di buku besar. Urutkan berdasarkan: (1) permukaan pintu masuk tanpa autentikasi atau berkepercayaan paling rendah sebelum pintu masuk terautentikasi; (2) batas kepercayaan yang melindungi aset paling berharga (kredensial, data lintas penyewa/multi-tenant, eksekusi kode, otoritas rilis); (3) celah audit lama, target validasi ulang, dan kode sumber yang berubah sebelum memeriksa ulang kode yang tidak berubah; (4) unit yang kelas serangannya secara historis menghasilkan temuan terkonfirmasi nyata pada tipe target ini daripada yang spekulatif. Jika prioritas sama, urutkan secara leksikografis berdasarkan `coverage_id` agar eksekusi tetap deterministik.

Sebelum peluncuran, proses induk mengubah status unit yang ditugaskan menjadi `in_progress`, menetapkan `agent_id` kanonikal berhuruf kecil, serta membuat folder kerja `scratch/` milik agen dan folder `artifacts/` yang dikelola proses induk. Hunter membaca kode sumber dan konteks dari induk, hanya boleh menulis ke folder `scratch/` unik miliknya, dan mengembalikan tepat satu hasil terstruktur melalui Task tool. Hunter dilarang menulis artefak tersimpan secara langsung atau menyunting kode target, `architecture.md`, `coverage-ledger.json`, `findings.json`, atau berkas milik agen lain.

## Format Instruksi Wajib untuk Agen Hunter

Setiap prompt hunter wajib memuat bagian-bagian berikut dalam urutan ini:

1. Pembuka peran dua kalimat: tujuan hunter adalah menemukan kegagalan invarian keamanan berbasis kode pada unit yang ditugaskan, dan wajib mengembalikan tepat satu objek JSON yang memenuhi kontrak hasil terstruktur di akhir prompt ini.
2. Isi dokumen `architecture.md` secara utuh (verbatim).
3. Daftar ID cakupan yang ditugaskan, subsistem, batas kepercayaan, path awal relatif repositori, dan peta blok penugasan masing-masing unit dari `coverage-ledger.json`.
4. Blok-blok terpilih persis, disalin secara utuh: setiap blok kelas serangan biasa dari `ATTACK-CLASSES.md`, dan dari setiap dokumen pendamping yang terpilih sertakan bagian `Core discipline`, subseksi kelas serangan yang dipilih, `Universal moves`, dan `Validation rules`. Blok biasa bersifat mandiri dan tidak memiliki bagian pendamping seperti `Core discipline`, `Universal moves`, atau `Validation rules`. Dilarang hanya mengirimkan nama blok atau nama dokumen pendamping saja.
5. Daftar blok biasa dan pendamping yang dikecualikan secara eksplisit beserta alasan pengecualiannya.
6. Metode perburuan inti di bawah ini, diikuti oleh blok prosedur promosi berkas.
7. Aturan validasi inti di bawah ini.
8. Pengecualian temuan lama yang sumbernya sama dan telah terkonfirmasi, masing-masing dibatasi pada fingerprint, judul, dan akar masalah, ditambah ID cakupan aktif milik rekan agen lain yang tidak boleh diduplikasi oleh hunter ini.
9. Path scratch/artifact unik, ID agen yang aman, whitelist berkas promosi pra-deklarasi beserta batas byte ukurannya, serta kontrak hasil terstruktur, termasuk blok Hasil hunter terstruktur di bawah ini dan cabang skema `confirmed` serta `needs_validation` dari `report-schema.json` yang disalin secara utuh.

Sebuah prompt dapat memilih beberapa blok pendamping sekaligus ketika satu alur kode melintasi beberapa domain keamanan. Pertahankan batasan-batasannya bersama-sama. Ruang lingkup adalah kewajiban cakupan hunter, bukan izin untuk menduplikasi pekerjaan yang dikecualikan. Jika batas kepercayaan baru yang tidak terduga ditemukan, kembalikan dalam array `uncovered` agar proses induk dapat membuat unit buku besar yang stabil dan menugaskannya pada gelombang berikutnya.

#### Metode perburuan inti: sertakan dalam setiap prompt hunter

```text
## Metode Pencarian Kerentanan Defensif

Tujuan Anda adalah menemukan kegagalan invarian keamanan yang berakar pada kode sumber serta perbaikan terkecilnya,
bukan memperluas dampak bahaya di luar batas pengujian. Tetaplah berada dalam lingkup peninjauan kode dan eksekusi lokal yang terikat batas.
Dilarang menghubungi endpoint live yang aktif, API pihak ketiga, registry publik, sistem identitas eksternal,
broker antrian pesan, layanan bersama, atau pengguna lain. Gunakan data tiruan lokal (dummy data) saja.

BACA KODE SECARA MENDALAM. Telusuri setiap input yang ditugaskan melalui tahap parsing, identifikasi,
otorisasi, normalisasi, status, salinan data turunan, hingga titik akhir (sink). Baca jalur alur paralel,
warisan lama, batch, percobaan ulang (retry), pembatalan, migrasi, dan penanganan error yang menghasilkan efek yang sama.
Bandingkan kontrol saudara untuk kesetaraannya, bukan hanya keberadaannya, dan bandingkan apa yang dijamin
oleh suatu komponen dengan apa yang diasumsikan oleh komponen berikutnya.

BEKERJA DARI SEBUAH INVARIAN KONKRET:
1. Sebutkan peran/subjek berkepercayaan rendah dan kapabilitas awalnya.
2. Sebutkan nilai yang diterima, tindakan yang dipicu, transisi status, atau selektor resource.
3. Temukan kontrol keamanan yang seharusnya menolak, mengikat, mengisolasi, membatasi, atau mencabutnya.
4. Telusuri alur kode sumber secara persis setelah keputusan tersebut diambil.
5. Berhenti pada catatan dummy terkecil yang terpengaruh, nilai balik yang salah, efek integritas proses,
   atau efek sumber daya lokal yang dapat diamati secara objektif.
6. Nyatakan perubahan di tingkat kode sumber serta kasus uji regresi yang menegakkan invarian tersebut.

BATASAN KEDALAMAN: telusuri hanya jalur kode yang dapat mencapai batas kepercayaan yang ditugaskan kepada Anda atau
yang jaminan keamanannya diandalkan oleh batas tersebut. Hentikan penyelidikan segera setelah status invarian
telah terbukti (apakah aman atau rentan), dan catat hasilnya ke dalam output terstruktur Anda:
status covered, candidate, atau blocked, atau entri uncovered, alih-alih terus mencari tanpa henti.

UJI JALUR SAD PATH DAN PERBEDAAN DATA. Uji nilai input yang hilang, kosong, nol, negatif, maksimum,
melampaui batas, duplikat, pengkodean campuran, data basi, token dicabut, urutan acak, konkurensi bersamaan,
status migrasi parsial, dependensi gagal, dan rollback hanya jika antarmuka kode menerimanya.
Bandingkan kanonikalisasi dan unit data di setiap serah terima parser atau kebijakan keamanan.
Untuk masalah multi-tahap, perlakukan setiap output sebagai prasyarat dan jangan berasumsi batas berikutnya aman.
Jika ada prasyarat yang tidak terbukti, catat sebagai pemblokir (blocker).

Ketika kandidat tingkat tinggi (high) atau kritis (critical) mengungkap akar masalah yang dapat terjadi berulang,
cari varian leksikal, struktural, dan logis pada path yang dimiliki oleh ID cakupan yang ditugaskan.
Satukan akar masalah yang sama, namun buktikan kondisi dan dampaknya untuk setiap varian secara independen.
Dilarang menyelidiki unit yang dimiliki agen rekan lain. Kembalikan varian yang belum memiliki unit cakupan sebagai uncovered.

GUNAKAN PEMERIKSAAN LOKAL TERSEMPIT YANG DAPAT MEMBUKTIKAN KLAIM. Build target terkontrol,
test, proses eksekusi, browser, emulator, fuzzer, dan pemrosesan fixture hanya boleh berjalan
di dalam sandbox sistem operasi yang disetujui proses induk. Sandbox wajib menonaktifkan jaringan luar,
memulai dari lingkungan kosong dengan whitelist, mengekspos target dan toolchain sebagai read-only,
mengizinkan penulisan hanya ke folder scratch Anda, serta menerapkan batas rendah pada CPU, memori, proses,
ukuran berkas, ruang disk, dan batas waktu eksekusi. Loopback terisolasi hanya diizinkan untuk fixture lokal.
Jika ada kontrol sandbox yang tidak tersedia, dilarang mengeksekusi: kembalikan needs_validation disertai pemblokir persis tersebut.
Utamakan unit test yang sudah ada, harness fungsi minimal, panggilan servis dummy-tenant, fixture kecil berformat salah,
jadwal race condition deterministik, atau evaluasi kebijakan lokal. Dilarang memasang atau mengunduh tool dari internet.

Catat input persis, perintah yang dijalankan, batasan, dan hasil minimum yang diamati. Untuk variabel lingkungan,
catat hanya nama variabel yang di-whitelist serta nilai aman non-rahasia yang diperlukan untuk mereproduksi pemeriksaan.
Jangan pernah merekam variabel lingkungan host, kredensial, status autentikasi, atau path host yang tidak relevan.
Proses terkontrol target hanya menulis ke folder scratch. Setelah sandbox dan semua prosesnya selesai,
hanya kode induk tepercaya yang boleh mempromosikan berkas scratch pra-deklarasi, mengikuti prosedur promosi artefak
yang disertakan secara utuh dalam prompt ini. Anda dan kode target dilarang menulis artefak tersimpan secara langsung.
Jika promosi tidak tersedia atau gagal untuk bukti yang menentukan, kembalikan needs_validation dengan pemblokir promosi yang persis.
Dilarang menguji ketersediaan sistem secara ekstrem, memicu target live, menggunakan kredensial nyata,
menerbitkan artefak ke luar, atau melanjutkan pengujian melampaui efek minimum yang teramati.

Fakta deployment, browser, penyedia cloud, broker, OS, proxy, paket, secret, atau identitas di luar kode sumber
bukanlah bukti pembuktian ke arah mana pun. Jika satu fakta eksternal semacam itu bersifat menentukan, kembalikan catatan
needs_validation disertai observasi yang belum ada dan rencana pemeriksaan aman yang dilakukan oleh pemilik sistem.
```

#### Prosedur promosi artefak: salin bagian ini secara utuh ke setiap prompt hunter

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
4. Verifikasi dengan `fstat` bahwa berkas tersebut adalah berkas reguler dengan jumlah tautan (link count) tepat satu
   dan berada dalam batas ukuran byte per-berkas dan kumulatif yang dicatat.
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
    jika entri tersebut adalah bukti yang menentukan, pertahankan status `needs_validation` disertai pemblokir promosi yang persis.
```

#### Aturan validasi inti: sertakan dalam setiap prompt hunter

```text
## Gerbang Kandidat (Candidate Gate)

1. Sebuah kandidat temuan memerlukan penelusuran alur kode sumber relatif repositori yang lengkap dan bukti nyata
   untuk akar masalah yang diklaim, termasuk kontrol terkuat yang terlihat di kode sumber.
2. Catatan confirmed yang diajukan memerlukan hasil observasi lokal yang terikat batas, dampak nyata yang melintasi
   batas kepercayaan yang dinyatakan, kondisi prasyarat yang lengkap, dan tidak ada lapisan penangkal yang terlihat di kode.
3. Dilarang membesar-besarkan dampak crash menjadi eksekusi kode jarak jauh, beban kerja normal menjadi gangguan ketersediaan
   layanan bersama, atau tindakan antar peran yang sama menjadi eskalasi hak akses.
4. Jika suatu fakta penting tidak terlihat di kode atau tidak dapat diamati secara lokal, gunakan status needs_validation.
   Sebutkan pemblokir yang persis; jangan berikan tingkat keparahan (severity) atau kesimpulan yang berspekulasi.
5. Best practice yang belum diterapkan namun tidak memengaruhi subjek/aset nyata diklasifikasikan sebagai penguatan sistem
   (hardening) atau dikecualikan, bukan sebuah temuan kerentanan. Kandidat yang terbantahkan oleh kode sumber bukanlah needs_validation.
6. Gunakan fingerprint turunan sumber yang sama untuk akar masalah yang sama di setiap status.
   Format fingerprint wajib cocok dengan pola `^[A-Za-z0-9][A-Za-z0-9._:/@+-]*$` dan dilarang memuat nomor baris,
   nomor gelombang, nama agen, tingkat keparahan, atau status kelulusan.
7. Kembalikan array kandidat kosong jika tidak ada yang lolos dari gerbang evaluasi ini.
```

## Batas Validasi Lokal

Eksekusi lokal ditujukan semata-mata untuk konfirmasi bukti, bukan untuk memperluas dampak serangan:

- **Hanya diizinkan di dalam sandbox sistem operasi yang ditentukan:** build offline dengan dependensi lokal; proses loopback terisolasi dengan data tiruan; pengujian unit dan integrasi; pemrosesan fixture kecil; sanitizer kompilator; uji fuzzer/regresi terbatas; pengujian konkurensi deterministik; pengujian browser/emulator lokal dengan akun dummy; evaluasi kebijakan dan manifes lokal dengan identitas tiruan; mocking panggilan API eksternal.
- **DILARANG KERAS:** trafik ke server live atau lingkungan deployment; permintaan ke layanan yang tidak dimulai khusus untuk pengujian terisolasi ini; instalasi dependensi lewat jaringan internet; akun atau kredensial produksi nyata; data produksi; antrian bersama, runner CI bersama, registri paket, layanan penandatanganan rilis; penerbitan berkas; uji beban stres, pemborosan biaya cloud; segala tindakan lanjutan setelah tercapainya hasil batas data dummy minimum.

Sandbox dimulai dari lingkungan kosong, tidak memberikan akses jaringan luar atau path host yang dapat ditulisi kepada kode target, dan menegakkan batas sumber daya dan waktu yang rendah untuk setiap pengujian. Output pada folder scratch tetap diperlakukan sebagai data terkontrol target setelah proses keluar. Promosikan berkas hanya melalui prosedur host no-follow berkas reguler dengan ukuran terikat yang ketat. Ketiadaan kapabilitas sandbox atau promosi tidak menghapus kandidat yang berakar dari kode sumber; nyatakan pemblokir persis tersebut di dalam status `needs_validation`.

## Kontrak Hasil Terstruktur Hunter

Kembalikan tepat satu objek JSON, tanpa teks obrolan di sekitarnya:

```json
{
  "units": [
    {
      "coverage_id": "satu ID yang ditugaskan",
      "disposition": "covered|candidate|blocked",
      "reviewed_paths": ["repo/relative/path"],
      "checks": [
        {
          "agent_id": "pemilik kanonikal dari pemeriksaan ini",
          "reviewed_paths": ["repo/relative/path yang ditinjau pemeriksaan ini"],
          "invariant": "kontrol spesifik yang diperiksa untuk unit ini",
          "method": "source|local",
          "result": "fakta yang dibuktikan oleh kode sumber atau pengujian terbatas",
          "artifact": "agents/<agent-id>/artifacts/file untuk local, atau null untuk source"
        }
      ],
      "candidate_fingerprints": [],
      "unresolved": []
    }
  ],
  "candidates": [],
  "hardening": ["catatan konkret non-temuan penguatan sistem"],
  "uncovered": [
    {
      "surface": "...",
      "boundary": "...",
      "subsystem": "...",
      "attack_class": "...",
      "starting_paths": ["repo/relative/path"],
      "reason": "alasan mengapa area ini memerlukan unit cakupan deterministik sendiri"
    }
  ]
}
```

Setiap entri pada `candidates` mengikuti skema resmi laporan, kecuali bahwa ia menggunakan kolom `proposed_verdict` sebagai pengganti `verdict`:

- `proposed_verdict: "confirmed"`: sertakan setiap kolom yang diwajibkan oleh cabang `confirmed` dari `report-schema.json` selain `verdict`: `fingerprint`, judul, deskripsi, `root_cause`, `intended_behavior`, `trace` berurutan, `evidence`, `conditions`, instruksi `execution` netral target, `remediation`, `severity`, dan `confidence`. Instruksi eksekusi hanya mendeskripsikan pengujian lokal terikat yang sudah berhasil dilakukan. Kolom `payloads` memuat input pengujian minimum, fixture, atau pemanggilan fungsi lokal. `observed_result` mencatat output lokal nyata yang teramati. Tingkat keparahan keseluruhan dilarang melampaui dampak yang teramati langsung.
- `proposed_verdict: "needs_validation"`: sertakan setiap kolom yang diwajibkan oleh cabang skema tersebut selain `verdict`: `fingerprint`, judul, deskripsi, `claimed_root_cause`, `trace` berurutan, `evidence`, array `blockers` yang tidak kosong, dan `validation_plan` dengan minimal satu langkah `local` atau `deployment`. Dilarang mengarang konteks yang tidak dapat diterapkan. Dilarang menyertakan kolom keparahan, eksekusi, remediasi, atau akar masalah terkonfirmasi. Langkah `deployment` adalah rencana pemeriksaan aman yang diamati oleh pemilik sistem, bukan permintaan untuk menyerang target live.

Setiap ID cakupan yang ditugaskan wajib muncul tepat satu kali di dalam array `units`. Unit berstatus `covered` membutuhkan pemilik penugasan, array `reviewed_paths` dan `checks` yang tidak kosong, tidak ada fakta yang belum tuntas, dan tidak memiliki kandidat celah. Unit berstatus `candidate` memiliki bukti pemilik yang sama dan merupakan satu-satunya status yang membawa tautan fingerprint temuan. Unit `blocked` adalah tinjauan parsial dengan path, pemeriksaan, dan fakta pemblokir yang tidak kosong namun belum memiliki fingerprint temuan. Seluruh path kode sumber adalah path relatif terhadap repositori, bukan path absolut.

## Konsolidasi Proses Induk dan Pembaruan Buku Besar

Proses induk memvalidasi setiap hasil unit, memetakannya ke tepat satu `coverage_id` yang ditugaskan, dan memperbarui unit buku besar terkait. Tolak ID yang duplikat atau tidak ada, ID agen yang tidak aman, pemeriksaan kode yang membawa artefak, serta artefak lokal yang tidak dipromosikan oleh kode induk tepercaya ke dalam sub-folder artifacts milik agen tersebut. Salin `reviewed_paths`, rekaman `checks` ke dalam `local_checks`, path artefak tertaut, fingerprint kandidat, dan fakta yang belum tuntas ke dalam buku besar. Simpan daftar saran `hardening` dari masing-masing hunter di kolom pencatatan induk agar Fase 6 dapat menyajikannya dalam laporan akhir.

Kesimpulan hunter yang gagal atau tidak didukung bukti valid membuat unit tersebut tetap berstatus `planned` untuk ditugaskan ulang. Unit yang tidak tersentuh karena batas anggaran/profil diubah menjadi unit `deferred` yang tidak ditugaskan dengan bukti kosong dan alasan penundaan yang jelas; dilarang menyembunyikan bukti parsial di dalam status `deferred`. Jalankan `validate-coverage-ledger.cjs` setelah setiap pembaruan; buku besar yang tidak valid tidak boleh digunakan untuk penugasan berikutnya.

Konsolidasikan entri kandidat berdasarkan fingerprint lalu berdasarkan akar masalah. Satu akar masalah yang mengekspos beberapa pintu masuk atau efek disatukan menjadi satu kandidat dengan alur penelusuran (trace) terlengkap dan terkuat. Kontrol hilang yang independen menggunakan fingerprint terpisah. Catat duplikasi fingerprint di unit buku besar terkait dan jangan kirimkan kandidat duplikat ke tahap validasi.

## Gelombang Kritik Cakupan (Coverage-Critic Waves)

Segera setelah setiap gelombang perburuan hunter selesai, gunakan jatah reservasi untuk menjalankan satu agen kritikus cakupan pasca-gelombang (`research`). Kritikus ini menerima `architecture.md`, buku besar cakupan lengkap termasuk peta blok penugasan, status dan fingerprint kandidat aktif, serta ringkasan celah buku besar audit lama. Kritikus membaca kode sumber namun dilarang menulis berkas atau menjalankan target. Wajib mengembalikan format JSON berikut:

```json
{
  "missing_units": [
    {
      "surface": "...",
      "boundary": "...",
      "subsystem": "...",
      "attack_class": "...",
      "starting_paths": ["repo/relative/path"],
      "selected_companion_blocks": ["FILE.md#section"],
      "excluded_blocks": [{"block": "FILE.md#section", "reason": "..."}],
      "reason": "alasan celah cakupan berbasis fakta kode"
    }
  ],
  "reassign_ids": ["id-lama-yang-belum-selesai-dengan-tuntas"],
  "resolved_prior_leads": ["fingerprint"],
  "stop": false
}
```

Kritikus memeriksa apakah ada titik masuk yang belum dipetakan, jalur paralel yang terlewat, mode siklus hidup yang hilang, kelas pendamping terpilih yang belum dibuatkan unitnya, pengecualian yang tidak beralasan, unit yang ditutup tanpa pemeriksaan nyata, serta celah dari audit sebelumnya yang belum ditangani. Kritikus mengusulkan perbaikan cakupan audit, bukan temuan kerentanan baru. Nilai `stop: true` adalah penilaian kritikus bahwa seluruh cakupan sudah tuntas; namun keputusan apakah gelombang berikutnya berjalan ditentukan oleh logika proses induk.

Proses induk menolak unit usulan yang berada di luar lingkup audit, menurunkan ID kanonikal untuk unit yang disetujui, dan melakukan deduplikasi terhadap unit yang sudah ada. Untuk setiap `reassign_id` yang sah dan memiliki bukti aktif `blocked`, `covered`, atau `candidate`, arsipkan rekaman terminal tersebut ke dalam array `attempts` milik unit disertai alasan penugasan ulang `reassignment_reason` dari sang kritikus. Naikkan nomor `wave` aktif; hunter berikutnya wajib merupakan agen baru yang segar dan menerima unit `in_progress` dengan bukti aktif yang bersih. Hasil akhir hunter yang baru hanya menuliskan bukti barunya ke kolom aktif; rekaman arsip lama tidak boleh diubah.

Urutkan ID dan validasi buku besar sebelum penugasan berikutnya. Pada profil `standard` dan `deep`, ketika kritikus pasca-gelombang melaporkan tidak ada lagi `missing_units` atau `reassign_ids` dan tidak ada lagi unit `planned` yang tersisa, gunakan jatah reservasi terpisah untuk menjalankan satu kritikus pembersihan akhir (final-clean critic). Nyatakan cakupan audit selesai HANYA jika kritikus pembersihan akhir tersebut juga tidak menemukan celah pekerjaan baru. Jika batas anggaran memaksa penghentian dini, tandai setiap unit yang belum tersentuh sebagai `deferred`, pertahankan alasan kritikus, dan buka celah tersebut secara transparan di dalam laporan akhir. Dilarang menggunakan penghentian diam-diam sebagai klaim cakupan audit yang lengkap.
