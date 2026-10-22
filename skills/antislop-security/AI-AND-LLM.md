# Perburuan Celah AI, LLM, dan Agen (AI, LLM, and Agent Hunting)

#### Kapan Menggunakan Berkas Ini

Gunakan berkas ini ketika model bahasa (LLM) terlibat dalam pengambilan keputusan yang sensitif terhadap kepercayaan: chatbot dan asisten AI, pipeline RAG (Retrieval-Augmented Generation), memori persisten agen, perulangan pemanggilan alat (agent tool-calling loops), server dan klien MCP (Model Context Protocol), kode yang menyusun prompt dari input yang tidak tepercaya, atau kode yang mengonsumsi output model dan melakukan aksi berdasarkan output tersebut. Alur data penting yang diperiksa adalah: *konten tidak tepercaya -> model atau memori -> kapabilitas, otoritas, atau sink titik akhir*.

Gunakan modul ini bersamaan dengan `ATTACK-CLASSES.md`, bukan sebagai penggantinya. Lapisan transportasi data, kontrol akses, penyusunan kueri database, penggunaan sistem berkas, dan perenderan output tetap merupakan batas kepercayaan biasa. Berkas ini khusus mencakup lapisan delegasi berbasis model AI. Pisahkan target berukuran besar berdasarkan subsistem pengambilan data (retrieval), memori, pengiriman tool (tool dispatch), integrasi MCP, dan penanganan output.

## Core discipline (include in every agent prompt for this domain)

```
- Prompt injection saja bukanlah sebuah temuan kerentanan. Diperlukan kegagalan batas di tingkat kode: konten mencapai konteks subjek/pengguna lain, menjalankan otoritas yang tidak dimiliki oleh pemohon, membocorkan data yang tidak boleh dibaca, atau mengeksekusi sink berbahaya yang tidak dapat diakses langsung oleh penyerang.
- Output model, memori agen, deskripsi tool, dan respons server MCP adalah input yang tidak tepercaya. Tunjukkan kode sumber yang memberikan otoritas, mempercayai output secara buta, menulis status persisten, atau meneruskannya ke sink.
- Prompt guardrail bukanlah batas keamanan (security boundary). Yang diakui sebagai batas hanyalah pemeriksaan kode deterministik, otorisasi berlingkup resource, isolasi proses, pengikatan aksi (action binding), dan pembatasan kredensial.
- Sebutkan penyerang, subjek yang terpengaruh, identitas eksekusi efektif, resource target, tindakan persis, otoritas yang digunakan, dan dampak nyata yang dapat diamati. Permintaan langsung dari pengguna yang sah untuk menggunakan otoritasnya sendiri bukanlah cacat delegasi hanya karena dieksekusi melalui perantara model AI.
- Otorisasi dan pengikatan aksi (action binding) adalah dua kontrol yang berbeda. Konten yang dikendalikan penyerang yang memicu suatu tindakan di bawah otoritas sah subjek korban adalah kegagalan pengikatan aksi jika korban tidak meminta atau menyetujui tindakan persis tersebut secara sadar.
- Klasifikasikan kandidat sebagai confirmed hanya setelah bukti kode sumber dan validasi lokal terikat membuktikan batas dan hasilnya. Gunakan needs_validation saat perilaku penyedia cloud, deployment, model, renderer, atau identitas eksternal belum dapat diamati secara lokal.
```

## Kelas serangan konteks, retrieval, dan memori (subagent_type: `general`)

**Indirect injection through retrieved or ingested content**
Penyerang dapat menulis dokumen RAG, halaman web yang diindeks, lampiran berkas, email masuk, isi issue tiket, respons tool, atau metadata yang kemudian masuk ke dalam konteks model milik subjek lain. Telusuri siapa yang dapat menulis ke masing-masing sumber, bagaimana proses retrieval membatasi cakupan datanya, sesi siapa yang mengonsumsi data tersebut, dan kapabilitas apa yang aktif di sesi tersebut. Periksa kontrol isolasi, otorisasi resource, dan pengikatan ke niat sadar pengguna penerima secara terpisah. Cacat keamanan di sini adalah ketiadaan kontrol deterministik pada kode, bukan teks persuasif itu sendiri.

**Cross-session or cross-tenant context bleed**
Riwayat percakapan, vektor embedding, hasil retrieval, atau cache prompt menggunakan kunci (key) yang terlalu luas tanpa isolasi. Verifikasi filter penyewa (tenant) dan daftar izin ACL di dalam kueri data itu sendiri serta di setiap cache key. Field tenant yang tersimpan di objek database bukanlah penegakan keamanan jika kueri alternatif, cache bersama, atau alur batch mengabaikannya.

**Persistent memory poisoning**
Konten yang dikendalikan penyerang atau rangkuman buatan model ditulis ke dalam memori persisten yang di kemudian hari memengaruhi tugas pengguna lain, sesi pengguna lain, atau sesi berhak tinggi. Tinjau siapa yang boleh membuat, memperbarui, menggabungkan, dan menghapus memori agen; lacak asal-usul data (provenance) dan cakupan tenant-nya; apakah observasi berkepercayaan rendah berubah menjadi instruksi permanen; dan apakah proses retrieval membedakan preferensi pengguna dari kebijakan keamanan tool. Memori yang sengaja disimpan oleh pengguna untuk keperluannya sendiri bukanlah temuan lintas batas.

**Prompt role and provenance confusion**
Penyusunan prompt memungkinkan teks tidak tepercaya meniru pesan sistem (system message), giliran percakapan sebelumnya, hasil eksekusi tool, aturan kebijakan, atau rekaman memori. Periksa konkatenasi string biasa, riwayat pesan tanpa tipe data terstruktur, field role yang dapat dikontrol pemanggil, dan serialisasi data yang menghilangkan label sumber aslinya. Buktikan bahwa pemalsuan peran tersebut mengubah keputusan kepercayaan deterministik atau mencapai kapabilitas yang bermakna.

## Kelas serangan tool dan tindakan (subagent_type: `general`)

**Tool-argument injection into a downstream sink**
Argumen yang dihasilkan oleh model diteruskan ke kueri SQL, perintah shell, sistem berkas, pemanggilan URL (SSRF), atau API berhak istimewa tanpa validasi di sisi handler kode. Perlakukan skema tool sebagai parser input awal, lalu telusuri setiap field dari pemanggilan fungsi hingga ke titik akhir (sink). Output terstruktur hanya membatasi bentuk data; ia tidak menegakkan otorisasi hak akses, keamanan path direktori, validitas URL, atau semantik kueri database.

**Excessive agency and confused-deputy authority**
Agen menggunakan identitas layanan bersama (service account) atau kredensial luas, sementara handler tool tidak memeriksa ulang izin subjek pemohon pada resource yang dimaksud. Verifikasi identitas eksekusi efektif dan apakah pemanggil dapat melakukan operasi persis tersebut melalui antarmuka produk yang normal. Kredensial bersama yang menegakkan pembatasan kueri per pengguna secara ketat bukanlah sebuah cacat.

**Action-confirmation and approval binding**
Pengguna menyetujui satu tindakan yang dideskripsikan, tetapi eksekusi nyatanya dapat menggunakan argumen yang telah berubah, resource yang berbeda, subjek yang berbeda, atau pada giliran percakapan model berikutnya. Cacat pengikatan aksi (action-binding) juga terjadi ketika konten yang dikendalikan penyerang memicu efek samping di bawah otoritas sah korban tanpa permintaan atau persetujuan sadar korban, meskipun otorisasi umum mengizinkan korban melakukannya. Tinjau apakah konfirmasi persetujuan mengikat nama tool ternormalisasi, objek argumen lengkap, pemohon, target, jumlah/kuantitas, batas kedaluwarsa, dan keanggotaan batch. Periksa alur percobaan ulang dan sesi yang dilanjutkan: satu persetujuan tidak boleh mengotorisasi mutasi data yang telah berubah atau tindakan duplikat.

**Tool-schema and dispatcher disagreement**
Skema tool menerima alias nama, field ekstra tambahan, kunci duplikat, konversi tipe otomatis (coercion), objek bersarang bebas, atau nilai di luar rentang yang ditafsirkan secara berbeda oleh dispatcher atau handler fungsi. Bandingkan validasi skema, kanonikalisasi, binding yang digenerasi, dan nilai default pada handler. Lakukan validasi ulang saat nilai-nilai tersebut berubah menjadi selektor resource atau opsi kritis keamanan.

**Unbounded delegated action loops**
Satu permintaan terbatas dapat memicu antrian pemborosan biaya API berulang, pengiriman pesan massal, mutasi data, atau pekerjaan API eksternal tanpa adanya batas anggaran per request, otorisasi per tindakan, kontrol pembatalan, atau penanganan idempotensi. Buktikan dampaknya pada biaya bersama operator, kuota sistem, pengguna lain, atau status persisten. Dilarang menguji dengan menghabiskan kuota layanan live; gunakan pembuktian perhitungan di tingkat kode dan perulangan lokal yang dibatasi ketat.

## Kelas serangan kepercayaan MCP dan sub-agen (subagent_type: `general`)

**Sub-agent and MCP trust inheritance**
Tugas yang didelegasikan menerima sesi penuh, kredensial lengkap, seluruh rekaman memori, atau kapabilitas penuh alih-alih hak akses paling minim yang dibutuhkan (least privilege). Periksa subjek dan tenant yang dibawa ke setiap pemanggilan, penyempitan kapabilitas, audiens kredensial, dan apakah hasil delegasi tetap diperlakukan sebagai input tidak tepercaya saat diterima kembali.

**MCP server and tool identity confusion**
Panggilan atau hasil eksekusi dirutekan berdasarkan nama server, nama tool, ID request, URI resource, atau alias pilihan model yang dapat dipengaruhi penyerang alih-alih berdasarkan koneksi terotentikasi dan request aktif yang sah. Periksa apakah dua server dapat mengklaim identitas tool atau resource yang sama, apakah proses rekoneksi mengubah pengikatan koneksi, dan apakah respons dari satu server dapat memuaskan panggilan tertunda milik server lainnya.

**MCP metadata and schema as policy**
Deskripsi tool, metadata resource, prompt, saran completion, atau skema yang disuplai oleh peer server MCP diperlakukan secara keliru sebagai kebijakan keamanan atau penetap otorisasi. Field-field tersebut hanya berfungsi memandu model, bukan memberikan kapabilitas hak akses. Temukan whitelist deterministik, pemeriksaan identitas server, dan otorisasi handler kode yang tetap menjadi pemegang keputusan mutlak saat terjadi konflik metadata.

## Kelas serangan perenderan output dan pengungkapan data (subagent_type: `general`)

**Insecure output rendering**
Output model mencapai titik akhir (sink) HTML, Markdown, template engine, URL, atau perintah terminal yang dapat dieksekusi tanpa proses encoding dan kebijakan keamanan yang diwajibkan oleh sink tersebut. Untuk perenderan di browser, verifikasi resource yang dimuat otomatis, CSP, atau sanitasi sesuai [CLIENT-SIDE.md](CLIENT-SIDE.md); perilaku perender di luar repositori membuat kandidat berstatus `needs_validation`.

**Sensitive context extraction**
Konteks prompt yang disusun memuat kredensial rahasia, data milik pengguna lain, kode sumber privat, atau nilai kebijakan yang memberikan akses istimewa, dan output yang dipengaruhi pengguna membocorkan informasi tersebut ke luar. Periksa kode perakitan prompt dan alur pengambilan datanya. Pengungkapan instruksi umum atau perilaku yang tidak melintasi batas privasi data bukanlah sebuah temuan kerentanan.

## Universal moves (apply across the above)

- Gambarkan empat peta sistem terlebih dahulu: setiap identitas eksekusi, setiap kapabilitas yang ada, setiap sumber konteks/memori yang dapat ditulisi, dan setiap tujuan keluaran data. Kemudian hubungkan subjek di awal dengan otoritas di akhir alur.
- Mulai dari tool yang menimbulkan efek samping nyata (side-effecting tools) lalu telusuri mundur melalui dispatcher, skema, konfirmasi pengguna, konteks model, proses retrieval, dan konsumsi data. Mulai dari pembacaan memori persisten lalu telusuri setiap pihak yang memiliki hak tulis ke memori tersebut.
- Bandingkan jalur langsung, antrian (queue), percobaan ulang (retry), kelanjutan sesi (resume), operasi batch, dan alur delegasi untuk tindakan yang sama. Gerbang keamanan terkuat wajib diterapkan setelah argumen final selesai disusun dan sebelum setiap efek samping dieksekusi.

## Validation rules (apply before reporting ANY finding here)

1. Sebutkan batas kepercayaan yang dilanggar dan hasil konkret yang teramati: penyerang, subjek yang terdampak atau resource bersama yang dirugikan, identitas eksekusi, target, serta tindakan tidak sah atau kebocoran data yang tidak diminta.
2. Untuk klaim otoritas confused-deputy, buktikan bahwa tool tidak memiliki otorisasi pemohon-dan-resource dan bahwa penyerang tidak dapat melakukan tindakan tersebut melalui jalur normal. Untuk klaim pengikatan aksi (action-binding), buktikan bahwa konten terkontrol penyerang memicu tindakan di bawah otoritas subjek terdampak yang tidak diminta atau disetujui secara sadar oleh subjek tersebut.
3. Untuk klaim memori atau retrieval, kutip baris penulisan data yang dikendalikan penyerang dan pembacaan lintas subjek atau keputusan istimewa berikutnya. Rekaman bersama tanpa adanya konsumen aktif yang dapat menjangkaunya tidak memenuhi syarat temuan.
4. Untuk pengikatan aksi, tentukan permintaan sadar atau objek persetujuan ternormalisasi (jika ada), lalu bandingkan dengan objek yang digunakan oleh handler fungsi. Buktikan tindakan tidak diminta, mutasi data, duplikasi, atau perubahan otoritas yang dapat diamati secara lokal tanpa mengeksekusi serangan yang merusak. Untuk ketidaksesuaian skema, bandingkan objek ternormalisasi yang divalidasi dengan objek milik handler.
5. Untuk klaim identitas MCP, verifikasi koneksi terotentikasi, korelasi request, namespace tool, dan kredensial efektif. Berikan status `needs_validation` jika identitas server eksternal atau perutean deployment memang diperlukan.
6. Kembalikan temuan `confirmed` hanya jika ada alur penelusuran kode sumber yang lengkap dan hasil yang bermakna. Kembalikan `needs_validation` untuk fakta batas kepercayaan spesifik yang belum tuntas dan sebutkan pemeriksaan lokal terikat atau observasi oleh pemilik sistem yang diperlukan untuk menyelesaikannya.
