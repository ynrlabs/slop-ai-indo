# Pengintaian (Reconnaissance)

### Fase 1: Memetakan Kode Sumber dan Merencanakan Cakupan Audit

Proses induk menginisialisasi berkas `run-metadata.json`, menerapkan gerbang anggaran pra-pengintaian yang ketat sesuai `SKILL.md`, lalu membuat direktori kerja scratch agen dan buku besar cakupan (coverage ledger) bersama sebelum perburuan dimulai. Jika evaluasi gerbang anggaran gagal, catat status belum selesai pada metadata dan jangan luncurkan agen pengintaian apa pun. Pengintaian hanya membaca target kode dan status konfigurasi/build yang tersedia secara lokal. Tahap ini tidak pernah menghubungi endpoint live, penyedia identitas eksternal, registry publik, broker antrian pesan, API cloud, atau layanan bersama lainnya.

Luncurkan beberapa agen riset (`research`) secara paralel. Agen-agen ini mengembalikan fakta terstruktur ke proses induk dan dilarang menulis berkas langsung ke repositori:

**Agen 1a: Produk, Tumpukan Teknologi, dan Operasi Lokal**

```text
Baca kode sumber pada target di <target>. Dilarang menggunakan akses jaringan internet. Kembalikan:
1. Jenis produk, pengguna, operator sistem, dan tindakan-tindakan umum yang sensitif terhadap kepercayaan.
2. Bahasa pemrograman, framework yang dipakai, sistem build, runtime, dan model deployment lokal yang terlihat.
3. Titik masuk (entry points) relatif terhadap repositori dan batas antarsubsistem.
4. Perintah build dan test offline persis yang dapat berjalan dengan dependensi lokal, lokasi penulisan output yang diharapkan, serta input terkontrol yang diproses. Dilarang menjalankannya selama tahap pengintaian.
5. Perangkat lunak pembanding atau protokol standar yang relevan berdasarkan dokumentasi lokal dan dependensi. Jika tidak ada pembanding yang valid, nyatakan secara eksplisit.
6. Ketiadaan toolchain lokal atau batasan lingkungan eksekusi offline.
Kembalikan hanya fakta dari kode sumber disertai rujukan file:line relatif repositori.
```

**Agen 1b: Pelaku (Principals), Otoritas, dan Kontrol Hak Akses**

```text
Baca semua kode sumber yang menetapkan identitas, otorisasi, isolasi, dan hak akses khusus. Petakan:
1. Setiap peran/subjek berkepercayaan lebih rendah dan tindakan yang diizinkan menurut desain.
2. Titik autentikasi atau verifikasi identitas peer di setiap pintu masuk (entry surface).
3. Otorisasi per-resource dan cakupan penyewa (tenant scope) atau pemilik data.
4. Otoritas proses, browser, workload, CI, plugin, model/tool AI, perangkat fisik, atau IPC lokal.
5. Jalur perubahan hak akses khusus, konfirmasi, pencabutan token, pemulihan akun, dan alur fallback.
6. Kontrol mana yang dapat diverifikasi langsung di kode sumber dan kontrol mana yang bergantung pada konfigurasi deployment eksternal yang tidak terlihat.
Kembalikan batas kepercayaan (trust boundaries) dan lokasi kontrol kode disertai rujukan file:line relatif repositori. Jangan membuat asumsi ketersediaan endpoint live.
```

**Agen 1c: Permukaan Pintu Masuk, Salinan Data, dan Titik Akhir (Sinks)**

```text
Inventarisasi setiap titik sumber kode tempat input eksternal atau input berkepercayaan rendah masuk:
- HTTP/browser, protokol RPC/pesan, file/arsip dokumen, CLI/env/konfigurasi, plugin/dependensi/CI, event cloud/selektor IAM, konteks model AI/argumen tool, tautan mobile/deep-link/webview, dan IPC lokal.
Untuk setiap permukaan pintu masuk, telusuri transformasi data utama, salinan data yang disimpan atau diturunkan, dan titik akhir (sink) yang berdampak pada keamanan sistem. Catat batasan kode dan jalur paralel yang menghasilkan efek serupa.
Kembalikan path relatif repositori dan nomor baris. Sajikan secara lengkap, namun dilarang mengeksekusi kode atau mengirimkan input uji coba.
```

**Agen 1d: Visibilitas Deployment dan Eksekusi Lokal**

```text
Baca berkas test, definisi build, manifes dependensi, pengemasan paket, dan konfigurasi lingkungan lokal. Kembalikan:
1. Test offline berukuran kecil atau fixture pengujian yang ada yang dapat memvalidasi batas kepercayaan dengan data tiruan (dummy data) di dalam sandbox ketat bawaan sistem operasi.
2. Proses yang dapat menggunakan namespace jaringan loopback terisolasi tanpa dependensi bersama atau koneksi eksternal.
3. Perintah yang berpotensi mengunduh dependensi dari internet, menerbitkan artefak, menghubungi API berbayar/pihak ketiga, atau memengaruhi status bersama; tandai perintah tersebut sebagai DILARANG untuk proses audit ini.
4. Kontrol dan lampiran deployment yang tidak dapat dipastikan lewat kode sumber sehingga wajib berstatus needs_validation jika bersifat krusial.
5. Jalur kode sumber aktif yang pasti untuk setiap mode deployment hanya jika repositori memilihnya secara deterministik.
6. Apakah platform lokal mampu menegakkan lingkungan kosong dengan whitelist ketat, tanpa jaringan keluar, mount target/toolchain berstatus read-only, penulisan hanya ke folder scratch terisolasi, serta batasan CPU, memori, proses, ukuran berkas, dan batas waktu eksekusi yang jelas. Ketiadaan kontrol isolasi ini membatalkan eksekusi pengujian target secara otomatis.
7. Apakah kode induk tepercaya dapat memvalidasi berkas scratch pra-deklarasi melalui path-confined traversal tanpa mengikuti symlink, pengecekan berkas reguler non-blocking, pembuatan berkas destinasi reguler eksklusif, serta batas ukuran per-berkas dan batas kumulatif yang tegas. Ketiadaan kontrol promosi ini melarang penggunaan berkas scratch sebagai bukti temuan.
```

Tambahkan agen pengintaian terfokus untuk subsistem atau mode deployment unik yang belum terpetakan oleh keempat agen di atas. Dilarang mengabaikan area tersebut secara diam-diam: jika gerbang anggaran di `SKILL.md` tidak mencukupi untuk meluncurkan agen tambahan, jangan jalankan apa pun untuk area tersebut, inisialisasi area tersebut sebagai unit buku besar berstatus `deferred` dengan alasan `budget_cannot_reserve_critics_and_validation`, dan buka celah cakupan tersebut secara transparan di dalam laporan akhir.

## Masukan dari Riwayat Audit Sebelumnya

Sebelum memilih lingkup kerja, proses induk membaca seluruh riwayat `coverage-ledger.json` dan `findings.json` yang tersedia untuk repositori yang sama:

- Bandingkan lokasi kode sumber, kontrol keamanan, kondisi prasyarat, dan identitas turunan kode dari setiap catatan temuan sebelumnya terhadap kode sumber saat ini.
- Bawa temuan berstatus `confirmed` dari riwayat lama ke kandidat saat ini dengan sidik jari (fingerprint) identik HANYA jika kode sumber relevan, kondisi, dan bukti kualifikasinya masih berlaku sama persis. Tautkan ke unit `planned` saat ini dengan atribut `prior_status: "prior_confirmed_same_source"` dan masukkan HANYA akar penyebab tersebut ke daftar pengecualian perburuan hunter. Agen verifikator Fase 3 yang memverifikasi ulang temuan tersebut menjadi pemilik penugasan unit; pemeriksaan ulang kode sumber menjadi langkah pertama dan mengubah unit ke status `candidate` dengan fingerprint bawaan.
- Bangun unit validasi ulang terencana `prior_confirmed_changed_source` ketika ada bagian kode sumber atau kondisi terkait yang telah berubah. Jangan mengecualikan akar penyebab tersebut dari perburuan hunter dan jangan berasumsi kesimpulan lama masih berlaku.
- Bangun unit kerja saat ini untuk setiap unit lama yang berstatus `needs_validation`, `deferred`, `blocked`, `out_of_scope`, atau mengalami perubahan kode sumber. Status-status ini adalah masukan prioritas tinggi, bukan alasan untuk supresi atau deduplikasi.
- Bawa temuan `needs_validation` lama yang masih terblokir dengan fingerprint yang sama hanya setelah kode sumber saat ini mendukung alur penelusurannya. Tautkan ke unit `planned` saat ini dengan `prior_status: "prior_needs_validation"`; catatan tersebut tetap membawa informasi pemblokir yang belum tuntas.
- Perlakukan temuan lama yang ditolak (`rejected`) sebagai klaim usang kecuali jika bukti saat ini mengubah alur penelusuran yang sebelumnya gagal. Penolakan lama hanya menekan klaim persis yang sama, bukan membatalkan review unit cakupan secara keseluruhan.
- Catat buku besar yang hilang atau tidak kompatibel alih-alih menganggapnya sebagai cakupan yang sudah kosong.

Cantumkan seluruh path dan rujukan kode sumber yang digunakan di dalam `run-metadata.json`. Ringkas konsekuensi cakupannya saja di dalam `architecture.md`.

## Ringkasan Arsitektur dan Pemilihan Dokumen Pendamping

Proses induk menyusun dokumen `<output-dir>/architecture.md`, dengan batas ketat sekitar 1.000 kata. Dokumen ini wajib mencakup:

1. Ringkasan produk, daftar peran/subjek (principals), tingkat otoritas normal, dan aset-aset yang dilindungi.
2. Garis dasar perangkat lunak pembanding dari Agen 1a jika berakar dari fakta sumber: trade-off keamanan apa yang diterima oleh pembanding tersebut. Gunakan untuk mengkalibrasi tingkat keparahan, jangan pernah untuk menepis temuan yang terbukti nyata. Abaikan baris ini jika tidak ada pembanding yang relevan.
3. Tumpukan teknologi, jalur deployment yang terlihat di kode, dan batasan uji coba offline.
4. Permukaan pintu masuk input dan alur penting dari sumber hingga titik akhir (sink).
5. Batas kepercayaan (trust boundaries) dan kontrol keamanan kode terkuat di setiap batas.
6. Path awal penelusuran relatif repositori.
7. Celah cakupan lama, target validasi ulang yang kodenya berubah, serta pengecualian temuan yang sumbernya identik.
8. Ringkasan singkat pemilihan dokumen pendamping dari [ATTACK-CLASSES.md](ATTACK-CLASSES.md): file terpilih dan batas kepercayaan kode yang mewajibkannya.

Simpan blok kelas serangan biasa tingkat penugasan, blok pendamping terpilih, dan blok yang dikecualikan beserta alasannya di setiap unit buku besar, bukan di `architecture.md`. Hal ini menjaga batas panjang arsitektur tetap valid pada audit skala besar dan memastikan peta instruksi hunter dapat diperiksa secara otomatis oleh mesin validator.

Dilarang memilih file pendamping hanya karena nama bahasa pemrograman atau dependensi muncul di proyek. Pilih dokumen pendamping semata-mata karena tahap pengintaian menemukan batas sensitif yang dijelaskan pada bagian `When to use this file` di dokumen tersebut. Jangan mengecualikan batas yang terlihat hanya karena ada agen lain yang mengulas kelas terkait.

## Buku Besar Cakupan Deterministik (Deterministic Coverage Ledger)

Proses induk menulis berkas `<output-dir>/coverage-ledger.json` sebagai array JSON tingkat atas. Turunkan satu unit kerja untuk setiap kombinasi nyata antara permukaan pintu masuk, batas kepercayaan, subsistem, dan kelas serangan biasa atau pendamping yang relevan, sesuai tingkat kedalaman profil run (profil `quick` menggunakan satu identitas subsistem menyeluruh; profil `deep` menambahkan pemetaan siklus hidup / lifecycle).

Setiap dimensi memiliki label yang mudah dibaca manusia dan nilai stabil berbasis kode pada properti `canonical_refs`. Gunakan rujukan kanonikal yang sama untuk objek sumber yang sama di seluruh sesi audit meskipun label tampilannya diubah. Rujukan yang sesuai mencakup path pintu masuk relatif repositori ditambah lingkup ekspor, rute atau pesan yang didefinisikan dalam kode, kontrol kode sumber yang menetapkan batas kepercayaan, path paket repositori, dan rujukan blok kelas serangan persis. Rujukan blok berupa nama berkas `FILE.md#` ditambah nama kelas persis seperti yang tertulis tebal atau sebagai heading di berkas tersebut: sebuah pengenal stabil yang dicocokkan dengan teks berkas, bukan tautan HTML hasil render. Untuk blok bagian pendamping, gunakan teks judul sebelum kualifikasi kurung (contoh: `Core discipline`). Dilarang menurunkan rujukan dengan mengubah huruf kecil atau membuat slug dari label tampilan secara sembarangan.

Turunkan `coverage_id` tanpa slug yang menghilangkan data (lossy):

1. Pastikan setiap rujukan berformat Unicode NFC dengan nilai skalar yang valid, konten terlihat, tanpa karakter kontrol, tanpa pemisah paragraf/baris, dan tanpa spasi di sekitarnya.
2. Encode byte UTF-8 menggunakan persen encoding RFC 3986: biarkan hanya karakter `A-Z a-z 0-9 - . _ ~` tanpa escape, dan gunakan huruf kapital `%HH` untuk setiap byte lainnya.
3. Gabungkan rujukan `surface`, `boundary`, `subsystem`, dan `attack_class` yang sudah di-encode menggunakan pemisah `::`; tambahkan rujukan `lifecycle` di akhir jika tersedia.

Gunakan nilai kanonikal tetap `profile/quick/all-in-scope-subsystems` untuk dimensi subsistem pada profil cepat (quick). Jangan sertakan nomor gelombang (wave), nama agen, status kelulusan, tingkat keparahan, atau nomor baris ke dalam rujukan atau ID. Urutkan seluruh unit secara leksikografis berdasarkan `coverage_id` sebelum setiap penugasan. Gagalkan proses jika ada ID yang duplikat. Jika ID duplikat memiliki kolom semantik yang berbeda, perlakukan hal itu sebagai tabrakan identitas kanonikal; dilarang menggabungkan atau menimpa berkas secara diam-diam. Validator juga akan menolak satu tupel semantik yang diwakili oleh rujukan kanonikal yang berbeda.

Setiap unit buku besar mencatat data berikut:

```json
{
  "coverage_id": "...",
  "canonical_refs": {
    "surface": "src/router.ts#POST /users/:id",
    "boundary": "src/authz.ts#requireOwner",
    "subsystem": "packages/api",
    "attack_class": "ATTACK-CLASSES.md#Access control"
  },
  "surface": "...",
  "boundary": "...",
  "subsystem": "...",
  "attack_class": "...",
  "starting_paths": ["repo/relative/path"],
  "ordinary_attack_class_block": "ATTACK-CLASSES.md#Access control",
  "selected_companion_blocks": ["FILE.md#section"],
  "excluded_blocks": [{"block": "FILE.md#section", "reason": "..."}],
  "prior_status": "new|prior_confirmed_same_source|prior_confirmed_changed_source|prior_needs_validation|prior_deferred|prior_blocked|prior_out_of_scope|prior_covered_same_source|prior_covered_changed_source|prior_rejected_claim_changed|none",
  "attempts": [],
  "wave": 1,
  "status": "planned",
  "agent_id": null,
  "reviewed_paths": [],
  "local_checks": [],
  "result_fingerprints": [],
  "unresolved": []
}
```

Jika dimensi `lifecycle` relevan, tambahkan properti `canonical_refs.lifecycle` dan `lifecycle` untuk teks manusia. Atribut `ordinary_attack_class_block` bernilai null hanya jika tidak ada blok kelas biasa yang berlaku. Daftar dokumen pendamping terpilih mencakup setiap kelas yang relevan ditambah bagian `Core discipline`, `Universal moves`, dan `Validation rules` miliknya; `excluded_blocks` mencatat setiap blok yang dipertimbangkan namun tidak dipilih beserta fakta kode sumber yang menjadi alasan pengecualiannya.

Proses induk dapat menambahkan kolom pencatatan tambahan selama kolom semantik di atas tetap stabil. Pada properti `prior_status`, nilai `new` menandai permukaan baru yang pertama kali ditemukan dalam sesi ini saat buku besar lama yang kompatibel tersedia; `none` menandai unit saat tidak ada buku besar lama yang kompatibel. Unit lama yang berstatus `deferred`, `blocked`, `out_of_scope`, atau mengalami perubahan kode diinisialisasi sebagai unit kerja `planned` saat ini jika berada di dalam lingkup audit. Unit lama yang kodenya sama persis dan sudah berstatus covered tetap terlihat di buku besar saat ini; prioritaskan penugasan untuk kode yang berubah, alur siklus hidup penting, dan potensi konflik, lalu gunakan kritik cakupan untuk memutuskan apakah unit tersebut memerlukan peninjauan ulang.

Properti `attempts` adalah arsip append-only untuk penugasan berbasis bukti yang dibuka kembali oleh kritik cakupan (coverage critic). Sebelum penugasan ulang, masukkan data unit lama secara persis: `wave`, `status`, `agent_id`, `reviewed_paths`, `local_checks`, `result_fingerprints`, dan `unresolved`, ditambah `reassignment_reason` yang beralasan kuat dari sang kritikus. Hanya status `blocked`, `covered`, dan `candidate` yang boleh diarsipkan. Upaya yang diarsipkan mempertahankan invarian status dan bukti yang sama seperti unit aktif, menggunakan nomor gelombang yang meningkat tajam di bawah gelombang saat ini, serta mempertahankan agen pemilik dan artefak aslinya. Penugasan berikutnya menaikkan nilai `wave`, menggunakan agen pemilik baru yang segar, dan memulai dengan bukti aktif yang bersih. Jika profil atau sisa anggaran mencegah penugasan baru, naikkan `wave` dan gunakan status aktif `deferred` dengan agen bernilai null, bukti kosong, dan alasan penghentian yang jelas. Dilarang menyalin pemeriksaan atau artefak dari pemilik arsip ke dalam status aktif baru. Status terminal aktif di masa mendatang hanya memuat bukti dari upaya pengujian yang baru; arsip tetap tidak boleh diubah.

Tegakkan tabel aturan status ini secara mutlak:

| Status | Unit `agent_id` | `reviewed_paths` / `local_checks` | `result_fingerprints` | `unresolved` |
|---|---|---|---|---|
| `planned` | null | kosong | kosong | kosong |
| `not_applicable`, `out_of_scope`, `deferred` | null | kosong | kosong | alasan tidak boleh kosong |
| `in_progress` | ID pemilik kanonikal | kosong | kosong | kosong |
| `blocked` | ID pemilik kanonikal | keduanya memuat bukti parsial milik pemilik | kosong | alasan pemblokir tidak boleh kosong |
| `covered` | ID pemilik kanonikal | keduanya tidak boleh kosong | kosong | kosong |
| `candidate` | ID pemilik kanonikal | keduanya tidak boleh kosong | tidak boleh kosong | opsional |

Format ID agen kanonikal wajib cocok dengan pola `^[a-z0-9][a-z0-9_-]{0,63}$` dan bukan merupakan nama perangkat sistem operasi Windows (seperti CON, PRN, AUX, NUL). Penggunaan huruf kecil adalah mutlak sehingga satu buku besar tidak dapat memuat alias beda huruf besar-kecil. Properti `agent_id` pada unit mencatat pemilik penugasan kerja. Setiap rekaman pemeriksaan mencatat `agent_id` miliknya sendiri serta `reviewed_paths` yang tidak kosong; properti `reviewed_paths` di tingkat unit adalah gabungan pasti dari semuanya. Pemeriksaan murni kode menggunakan `artifact: null`. Pemeriksaan lokal membutuhkan berkas reguler yang dipromosikan hanya oleh kode induk tepercaya tepat di bawah folder `agents/<check.agent_id>/artifacts/`. Hal ini memungkinkan catatan pemeriksaan milik hunter dan verifier hidup berdampingan secara aman dalam satu unit. Path scratch sementara, berkas di root output, symlink, berkas khusus, dan artefak milik agen lain tidak diakui sebagai bukti temuan yang sah.

Buku besar cakupan adalah satu-satunya klaim bukti audit yang sah. Ringkasan arsitektur umum, jumlah agen, atau kalimat generik seperti "autentikasi telah diperiksa" bukanlah bukti cakupan audit. Fase 2 hanya menutup status unit berdasarkan path yang benar-benar ditinjau dan pemeriksaan lokal yang dilaporkan dalam hasil terstruktur agen hunter.

Jalankan perintah pengujian:
`node <skill-dir>/validate-coverage-ledger.cjs <output-dir>/coverage-ledger.json`
setelah inisialisasi awal, setelah setiap pembaruan proses induk, dan sebelum Fase 6 dimulai. Validator akan menolak input di atas 5 MiB, nesting melebihi 64 level, lebih dari 10.000 unit, lebih dari 1.000 entri dalam koleksi bersarang, atau melampaui 500.000 nilai terjelajah, serta membatasi laporan galat maksimal 100 error. Perbaiki setiap kesalahan format sebelum menugaskan pekerjaan atau membuat klaim cakupan audit apa pun.
