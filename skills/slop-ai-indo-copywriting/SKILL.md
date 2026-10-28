---
name: slop-ai-indo-copywriting
description: "Skill teks dan copywriting untuk Slop AI Indo. Digunakan saat menulis atau menyunting prosa: judul utama, nada bicara, tombol CTA, dan pencegahan pola penulisan khas AI. Muat bersama berkas inti."
allowed-tools: Read Write Edit Glob Grep
---
# slop-ai-indo-copywriting

> Anti Slop: Aturan untuk AI Coding Agent. Skill Teks & Copywriting

> Bagian dari sistem Slop AI Indo. Dibaca bersama dengan `slop-ai-indo.md` (inti). Skill ini mengulas mendalam aspek teks dan gaya penulisan: judul utama (headline), ajakan bertindak (CTA), nada bicara, proposisi nilai, dan pola-pola klise yang membuat tulisan buatan AI sangat mudah dikenali. Skill ini merujuk ke aturan inti berdasarkan nomor dan tidak pernah menduplikasi atau mengubah penomorannya. Muat skill ini saat tugas melibatkan penulisan atau penyuntingan salinan pemasaran (marketing copy), teks produk, halaman landing page, atau prosa apa pun yang ditujukan untuk dibaca oleh manusia.

## Cara Menggunakan Skill Ini

- Muat bersama `slop-ai-indo.md` setiap kali tugas berhubungan dengan penulisan atau penyuntingan teks. Dokumen inti memegang mekanisme utama (uji tujuan, tiga tingkatan) dan larangan mutlak (R-02, R-15, R-16, R-17, R-18, R-36, R-38). Skill ini memegang rincian khusus copywriting secara mendalam.
- Setiap pola memiliki format seragam: **Pola (The pattern)**, **Mengapa Terbaca Khas AI (Why it reads as AI)**, **Sebelum (Before)** (contoh slop), **Sesudah (After)** (perbaikan nyata), dengan aturan inti yang dirujuk sebagai R-XX.
- Dua aturan wajib berlaku untuk semua hal di bawah ini:
  - **Jangan pernah mengarang fakta** (R-17, R-36, R-38). Penulisan ulang tidak boleh menambahkan fakta, nama, angka, tanggal, kutipan, atau rujukan yang tidak ada dalam teks sumber atau tidak diberikan oleh pengguna. Rincian spesifik harus berasal dari sumber atau pengguna, bukan dari karangan sendiri. Jika suatu kalimat membutuhkan detail nyata agar berfungsi, tanyakan detailnya kepada pengguna atau tulis versi sederhana tanpa mengarang.
  - **Jangan membuat teks terlalu steril dan hambar.** Menghindari pola AI hanyalah separuh pekerjaan. Teks tanpa karakter suara sama jelasnya terlihat seperti buatan mesin dibanding teks yang penuh klise AI (R-37). Jika pengguna menyediakan gaya atau karakter suara tertentu, pertahankan karakter tersebut.

## Nada & Suara Bicara (Tone & Voice)

### Kosakata AI Hampa (Empty AI Vocabulary)

- **Pola:** Menumpuk kata kerja dan kata benda abstrak agar terdengar megah tanpa mengatakan substansi nyata: *unlock (buka potensi), elevate (tingkatkan), empower (berdayakan), delve (selami), showcase (tampilkan), testament (bukti nyata), landscape (lanskap abstrak), journey (perjalanan), robust (tangguh), game-changer, next-level, seamless (mulus), cutting-edge (mutakhir), revolutionary (revolusioner), harness the power of (manfaatkan kekuatan), foster (pupuk secara klise), paramount (sangat penting), beacon (mercusuar harapan), bespoke (solusi khusus klise), seamlessly integrate (terintegrasi dengan mulus), realm (ranah abstrak), tapestry (rajutan abstrak), navigate the complexities of (menavigasi kompleksitas)*.
- **Mengapa terbaca khas AI:** Kata-kata ini muncul dengan frekuensi sangat tinggi dalam data pelatihan model AI. Kata-kata tersebut mencerminkan niat untuk memukau alih-alih memberi informasi, dan merupakan cara tercepat mencap suatu halaman sebagai buatan AI sekilas pandang.
- **Sebelum:**
  > Buka potensi kolaborasi tanpa batas untuk meningkatkan perjalanan tim Anda ke tingkat berikutnya.
- **Sesudah:**
  > Bekerja bersama tim Anda dalam satu ruang kerja bersama.
- **Aturan:** R-16 (kata klise/buzzwords), R-36 (dilarang mengarang klaim).

### Inflasi Makna & Signifikansi (Significance Inflation)

- **Pola:** Kalimat bombastis seperti "masa depan dari X", "menandai momen penting", "sebuah bukti nyata dari", "merevolusi cara", "era baru dalam".
- **Mengapa terbaca khas AI:** Klaim tersebut tidak memiliki bukti nyata, dan kalimatnya akan terbaca sama saja apa pun jenis produk yang sedang dibahas. Ini hanyalah upacara basa-basi di ruang yang seharusnya diisi oleh konten berbobot.
- **Sebelum:**
  > Platform kami menandai momen penting dalam evolusi produktivitas kerja tim, mengantarkan era baru dalam berkolaborasi.
- **Sesudah:**
  > Platform kami memangkas waktu rapat status kerja tim Anda.
- **Aturan:** R-36 (dilarang mengarang klaim), C-5 (utamakan bukti daripada klaim kosong).

### Klaim Hampa dan Bukti Sosial Palsu Tanpa Bukti (Empty Claims and Social Proof with No Evidence)

- **Pola:** "Dipercaya oleh ribuan tim di seluruh dunia", "teknologi terdepan di industri", "standar kelas dunia", "sangat disukai pelanggan di mana pun", tanpa ada satu pun nama atau bukti yang dapat diverifikasi.
- **Mengapa terbaca khas AI:** Klaim kepercayaan tanpa bukti adalah sebuah pengakuan kelemahan. Kalimat ini mengisi ruang yang seharusnya ditempati oleh nama klien asli, angka metrik nyata, atau studi kasus terverifikasi.
- **Sebelum:**
  > Dipercaya oleh ribuan tim di seluruh dunia. Teknologi terdepan di industri yang dicintai oleh pelanggan di mana pun berada.
- **Sesudah:**
  > Digunakan oleh tim operasional di [cantumkan nama klien, hanya jika nyata]. Jika tidak ada nama klien nyata, hapus seluruh klaim tersebut.
- **Aturan:** R-17 (data dan metrik), R-18 (testimoni), R-36 (dilarang mengarang klaim), C-5.

### Atribusi Samar Lempar Batu Sembunyi Tangan (Weasel Attributions)

- **Pola:** "Para ahli sepakat", "pengamat industri menyatakan", "banyak orang melaporkan", "analis terkemuka percaya", tanpa menyebutkan siapa pihak yang dimaksud.
- **Mengapa terbaca khas AI:** Atribusi ini digunakan agar klaim tanpa sumber terasa berbobot dan berwibawa. Jika sumber otoritas itu nyata, sebutkan namanya secara gamblang; jika tidak ada, jangan beri klaim tersebut jubah kehormatan palsu.
- **Sebelum:**
  > Para ahli menyatakan bahwa pendekatan ini secara dramatis meningkatkan konversi penjualan.
- **Sesudah:**
  > [Sebutkan nama sumber risetnya atau hapus kalimat tersebut. Contoh dengan sumber nyata: "Dalam laporan riset tahun 2024 oleh [nama lembaga riset], pendekatan ini meningkatkan konversi sebesar [angka nyata]."]
- **Aturan:** R-36, C-5.

### Gaya Otoritas Semu yang Sok Bijak (Persuasive Authority Tropes)

- **Pola:** "Pada intinya", "pertanyaan sesungguhnya adalah", "apa yang benar-benar penting", "secara fundamental", "isu terdalam yang dihadapi".
- **Mengapa terbaca khas AI:** Frasa-frasa ini berpura-pura menembus kebisingan menuju kebenaran filosofis mendalam, padahal hanya mengulang poin biasa dengan upacara kata yang berlebihan.
- **Sebelum:**
  > Pada intinya, apa yang benar-benar penting adalah apakah tim Anda sanggup bergerak lebih cepat.
- **Sesudah:**
  > Kemampuan tim Anda untuk bergerak lebih cepat bergantung pada seberapa cepat Anda dapat menggabungkan perubahan kode.
- **Aturan:** R-36.

### Kalimat Penutup Khas Chatbot (Chatbot Closers)

- **Pola:** "Semoga penjelasan ini membantu!", "Beri tahu saya jika Anda memiliki pertanyaan lain", "Apakah Anda ingin saya membahas lebih dalam tentang bagian ini?", "Dengan senang hati!".
- **Mengapa terbaca khas AI:** Ini adalah artefak percakapan chatbot, bukan salinan teks produk. Pola ini muncul ketika output obrolan AI langsung disalin-tempel mentah-mentah ke dalam deliverable produk.
- **Sebelum:**
  > Berikut adalah rincian harga langganan kami. Semoga ini membantu! Beri tahu saya jika Anda ingin saya menjelaskan paket tertentu.
- **Sesudah:**
  > Berikut adalah rincian harga langganan kami. Paket Pemula mencakup akses untuk tiga pengguna dan dukungan komunitas.
- **Aturan:** R-36.

### Pembuka Sok Akrab yang Dibuat-buat (Fake-Candid Openers)

- **Pola:** "Jujur saja?", "Mari kita akui bersama", "Sebenarnya begini ceritanya", "Bicara jujur", yang digunakan sebagai jeda teatrikal sebelum menyampaikan poin sederhana biasa.
- **Mengapa terbaca khas AI:** Seseorang yang jujur biasanya langsung menyampaikan poinnya tanpa drama pembuka. Jeda buatan ini adalah bentuk keintiman palsu yang dibuat-buat oleh AI.
- **Sebelum:**
  > Apakah produk ini sepadan dengan harganya? Jujur saja? Semua tergantung pada seberapa sering Anda menggunakannya.
- **Sesudah:**
  > Kelayakan harga produk ini bergantung pada seberapa sering Anda menggunakannya.
- **Aturan:** R-36.

### Pengumuman Penunjuk Arah (Signposting Announcements)

- **Pola:** "Mari kita selami lebih dalam", "Berikut hal-hal yang perlu Anda ketahui", "Dalam artikel ini kita akan membahas", "Tanpa basa-basi lagi".
- **Mengapa terbaca khas AI:** Mengumumkan apa yang akan Anda lakukan alih-alih langsung melakukannya adalah komentar meta yang tidak perlu. Hal ini memperlambat pembaca dan memberikan kesan teks skenario tutorial sekolah.
- **Sebelum:**
  > Mari kita selami cara kerja caching di Next.js. Berikut adalah hal-hal penting yang perlu Anda ketahui.
- **Sesudah:**
  > Next.js mengelola caching data di beberapa lapisan, mencakup memoization request, data cache, dan router cache.
- **Aturan:** R-36.

### Huruf Kapital Semua untuk Penekanan (All-Caps Emphasis)

- **Pola:** Seluruh kalimat, klausa, atau frasa ditulis dalam HURUF BESAR SEMUA di tengah paragraf untuk berteriak mencari penekanan: "Peluncuran sudah siap dan KITA HARUS BERGERAK SEKARANG sebelum kesempatan tertutup."
- **Mengapa terbaca khas AI:** Menggunakan huruf kapital untuk penekanan adalah jalan pintas kasar yang diambil model AI untuk menciptakan urgensi palsu alih-alih menyusun kalimat yang memiliki bobot penekanan alami. Pada teks panjang, ini terbaca seperti teriakan kasar dan merusak alur baca.
- **Sebelum:**
  > Ini adalah kesempatan terakhir kita untuk memenangkan klien ini, dan KITA HARUS BERTINDAK SEGERA sebelum mereka memilih pesaing.
- **Sesudah:**
  > Ini adalah kesempatan terakhir kita untuk mendapatkan klien ini. Jika kita tidak merespons hari ini, mereka akan memilih penyedia lain.
- **Aturan:** R-36. (R-06 mengatur label huruf kapital ringkas dengan tracking spasi longgar sebagai elemen desain; pola di sini adalah pelanggaran dalam teks paragraf).
- **Pengecualian wajar:** Judul utama halaman yang memang bergaya uppercase, atau satu kata singkatan resmi. Yang dilarang adalah menulis kalimat penuh dalam huruf besar untuk memaksakan emosi dramatis.

### Kalimat Pasif Tanpa Pelaku (Actorless Passive)

- **Pola:** Kalimat pasif dengan subjek pelaku yang dihilangkan secara sengaja: "keputusan telah diambil untuk menutup paket gratis", "halaman harga telah diperbarui", "kesalahan telah terjadi".
- **Mengapa terbaca khas AI:** Model AI sering kali tidak tahu siapa yang bertindak dalam konteks dunia nyata, sehingga AI menulis kalimat yang menghindari penyebutan pelaku. Tim manusia yang meluncurkan produk tahu persis siapa yang melakukannya. Menghilangkan pelaku juga menghapus rasa tanggung jawab dari kalimat.
- **Sebelum:**
  > Halaman penetapan harga telah diperbarui untuk mencerminkan skema paket baru.
- **Sesudah:**
  > Kami memperbarui halaman penetapan harga untuk menampilkan skema paket baru.
- **Aturan:** R-02 (teks harus terasa alami, hidup, dan manusiawi).
- **Pengecualian wajar:** Kalimat pasif adalah pilihan yang tepat jika pelaku memang belum diketahui, tidak relevan, atau sengaja disembunyikan untuk keamanan sistem ("server berhasil direstart otomatis pada pukul 03.00"). Yang dilarang adalah kebiasaan pasif default yang menyembunyikan identitas tim.

### Subjek Benda Mati dengan Kata Kerja Manusia (Inanimate Subject, Human Verb)

- **Pola:** Memberikan kehendak, akal budi, dan perasaan manusiawi kepada benda mati atau konsep abstrak: "data memberitahu kita", "desain memutuskan", "roadmap ingin berfokus pada retensi", "dashboard kami memahami kebutuhan Anda".
- **Mengapa terbaca khas AI:** Kalimat terdengar aktif tanpa menyebutkan manusia mana pun, sehingga lolos dari pemeriksa kalimat pasif namun tetap menyembunyikan pelaku nyata. Kalimat ini juga memberikan pujian berlebihan pada produk, karena dashboard tidak pernah benar-benar "memahami" apa pun seperti otak manusia.
- **Sebelum:**
  > Dashboard kami memahami apa yang dibutuhkan tim Anda dan menampilkan angka-angka yang relevan secara cerdas.
- **Sesudah:**
  > Dashboard langsung menampilkan tiga metrik utama yang dipantau tim Anda setiap pagi.
- **Aturan:** R-02, R-16 (gunakan bahasa konkret dan spesifik daripada klaim bombastis).
- **Pengecualian wajar:** Kata kerja produk umum yang sudah lazim tetap diperbolehkan: "laporan menampilkan", "formulir mengirimkan data", "filter menyaring daftar". Yang dilarang adalah kata kerja yang membutuhkan pikiran dan jiwa: memahami, mengetahui, memutuskan, menginginkan, peduli.

## Ritme & Struktur Tulisan (Rhythm & Structure)

### Penggunaan Hukum Tiga Kata Berlebihan (Rule of Three Overuse)

- **Pola:** Memaksakan setiap ide atau daftar ke dalam kelompok berisi tepat tiga kata atau tiga frasa agar terdengar lengkap dan puitis: "inovasi, inspirasi, dan wawasan".
- **Mengapa terbaca khas AI:** Daftar di dunia nyata memiliki jumlah item sesuai dengan kebutuhan konten sebenarnya. Trio yang dipaksakan di setiap paragraf adalah tanda ritme mekanis khas AI yang muncul di seluruh bagian secara seragam.
- **Sebelum:**
  > Peserta dapat menikmati sesi keynote, diskusi panel, dan peluang networking. Anda akan pulang dengan membawa inovasi, inspirasi, dan wawasan industri.
- **Sesudah:**
  > Acara ini mencakup sesi presentasi, diskusi panel, serta waktu untuk berbincang santai antarsesi.
- **Aturan:** R-05 (struktur halaman yang dinamis), R-36.

### Paralelisme Negatif dan Ekor Penolakan (Negative Parallelism and Tailing Negations)

- **Pola:** Rumus kalimat "Bukan hanya X, tapi juga Y", "Tidak sekadar X, melainkan Y", serta frasa penolakan pendek yang ditempelkan di ujung kalimat sebagai penekanan: "tanpa tebak-tebakan", "tanpa gerakan sia-sia".
- **Mengapa terbaca khas AI:** Struktur kalimat ini adalah formula hafalan yang digunakan model AI agar terdengar tegas dan meyakinkan, terlepas dari apakah penekanan tersebut beralasan atau tidak.
- **Sebelum:**
  > Ini bukan sekadar dashboard, ini adalah pusat komando. Pilihan opsi muncul dari item yang dipilih, tanpa tebak-tebakan.
- **Sesudah:**
  > Dashboard menampilkan data yang Anda pilih, dan opsi menu langsung menyesuaikan dengan item tersebut secara jelas.
- **Aturan:** R-36.

### Rumus Pepatah Klise (Aphorism Formulas)

- **Pola:** "X adalah bahasa dari Y", "X adalah mata uang dalam Z", "X bukanlah sebuah alat melainkan sebuah cermin", "Efisiensi menjadi sebuah jebakan ketika".
- **Mengapa terbaca khas AI:** Rumus kalimat daur ulang yang terdengar sangat bijak dan mendalam tetapi tidak menambahkan ketepatan informasi apa pun. Kalimat ini hanya melambaikan tangan ke arah gagasan tanpa pernah menyatakannya secara lugas.
- **Sebelum:**
  > Simetri adalah bahasa dari rasa percaya. Efisiensi berubah menjadi jebakan saat tim melupakan sentuhan manusia.
- **Sesudah:**
  > Tata letak simetris terasa lebih mudah dipahami oleh pengguna. Tim kerja terkadang mengoptimalkan alur kerja secara berlebihan hingga mengabaikan cara kerja manusia yang sesungguhnya.
- **Aturan:** R-36.

### Drama Staccato (Staccato Drama)

- **Pola:** Deretan fragmen kalimat pendek deklaratif yang dipaksakan beruntun untuk menciptakan klimaks teatrikal buatan: "Tidak ada preferensi. Tidak ada beban masa lalu. Tidak ada nostalgia."
- **Mengapa terbaca khas AI:** Satu kalimat pendek sesekali untuk penekanan adalah teknik wajar; tetapi rentetan beberapa fragmen pendek berturut-turut terdengar sangat dibuat-buat seperti monolog panggung.
- **Sebelum:**
  > Lalu aturan lama lenyap. Tanpa template. Tanpa pengaturan default. Tanpa rasa aman.
- **Sesudah:**
  > Aturan lama tidak lagi berlaku, dan setiap halaman dirancang ulang dari awal.
- **Aturan:** R-36.

### Perputaran Sinonim Menghindar (Synonym Cycling)

- **Pola:** Menggonta-ganti kata bersinonim secara dipaksakan semata-mata demi menghindari pengulangan kata: "antarmuka ini cepat, prosesnya lekas, alurnya gesit".
- **Mengapa terbaca khas AI:** Model AI dilatih untuk menghindari penalti repetisi kata (repetition penalty). Penulis manusia asli lebih memilih mengulang kata yang paling tepat jika kata tersebut memang paling jelas dan tidak membingungkan.
- **Sebelum:**
  > Proses checkout kami cepat. Transaksinya lekas. Pengalamannya gesit.
- **Sesudah:**
  > Proses checkout selesai dalam tiga langkah mudah.
- **Aturan:** R-36.

### Rentang Skala Palsu (False Ranges)

- **Pola:** Menyebutkan rentang "dari X hingga Y" di mana X dan Y bukan berada pada satu skala ukuran yang masuk akal: "dari tahap orientasi hingga skala global", "dari klik pertama hingga faktur pembayaran akhir, dan segalanya di antaranya".
- **Mengapa terbaca khas AI:** Rentang tersebut hanyalah bingkai kata yang terdengar luas dan hebat padahal tidak menjelaskan cakupan fungsional yang konkret.
- **Sebelum:**
  > Dari sentuhan pertama hingga faktur akhir, dan segala hal di antaranya.
- **Sesudah:**
  > Mengelola penawaran harga, pembuatan faktur tagihan, serta pengingat pembayaran otomatis.
- **Aturan:** R-36.

## Kejujuran & Bukti Nyata (Honesty & Evidence)

### Detail Spesifik Rekayasa (Fabricated Specifics)

- **Pola:** Mengarang angka statistik, kutipan testimoni, nama tokoh, tanggal peluncuran, atau fitur produk yang tampak realistis padahal fiktif murni.
- **Mengapa terbaca khas AI:** Kebohongan yang tampak spesifik jauh lebih berbahaya dibanding klaim samar, karena rekayasa tersebut tampak jujur padahal palsu. Ini adalah cacat fatal yang tidak boleh ada dalam salinan produk.
- **Sebelum:**
  > Dipercaya oleh lebih dari 10.000 tim. "Slop AI Indo memangkas waktu review kode kami hingga separuhnya." - Sarah Chen, VP of Engineering di PT Maju Mundur.
- **Sesudah:**
  > Jika tidak ada klien atau testimoni nyata, jangan tuliskan angka atau kutipan fiktif. Jelaskan fungsi nyata dari produk tersebut. Setiap metrik nyata wajib memiliki sumber data yang dapat dipertanggungjawabkan (R-17, R-36).
- **Aturan:** R-17, R-18, R-36, R-38, C-5.

### Menambal Celah Informasi dengan Spekulasi (Speculative Gap-Filling)

- **Pola:** Ketika penulis tidak mengetahui suatu fakta sejarah atau teknis, ia menulis kalimat yang mengakui ketidaktahuannya lalu menambalnya dengan tebakan spekulatif: "perusahaan ini kemungkinan didirikan pada akhir era 1990-an", "pendirinya memilih untuk menjaga profil tetap rendah".
- **Mengapa terbaca khas AI:** Tebakan spekulasi yang dibungkus seolah-olah fakta sejarah. AI tidak menemukan data akurat di pengetahuannya, lalu mencoba menutupi celah tersebut dengan praduga umum.
- **Sebelum:**
  > Meskipun rincian spesifiknya terbatas, sang pendiri kemungkinan besar memulai dari garasi kecil dan berkembang lewat promosi dari mulut ke mulut.
- **Sesudah:**
  > Informasi pendirian awal tidak terdokumentasi dalam arsip kami. (Atau hapus kalimat tersebut seluruhnya. Sebutkan tahun pendirian hanya jika ada sumber resmi yang mencatatnya.)
- **Aturan:** R-17, R-36.

### Kesimpulan Positif Berbunga-bunga (Generic Positive Conclusion)

- **Pola:** Kalimat penutup klise seperti "Masa depan tampak cerah", "Masa-masa menyenangkan menanti kita di depan", "Ini adalah langkah besar menuju masa depan yang lebih baik".
- **Mengapa terbaca khas AI:** Kalimat perpisahan penuh senyuman yang tidak merangkum fakta apa pun dan tidak menjanjikan komitmen konkret apa pun. Kalimat ini hanya memperpanjang teks dengan optimisme kosong.
- **Sebelum:**
  > Masa depan tampak cerah bagi para pelanggan kami seiring langkah kami melanjutkan perjalanan menuju keunggulan tanpa batas.
- **Sesudah:**
  > (Hapus kalimat tersebut. Akhiri tulisan pada fakta konkret terakhir, atau sebutkan rencana pembaruan fitur nyata yang memang sudah dijadwalkan.)
- **Aturan:** R-36.

## Higienitas & Format Markdown (Hygiene & Markdown)

### Em Dashes

- **The pattern:** Karakter em dash (`—`) yang digunakan sebagai sisipan penjelas atau penghubung kalimat: *"institutions — not the people — continue"*.
- **Why it reads as AI:** Karakter ini adalah salah satu tanda paling khas dan berulang pada teks buatan AI, dan aturan inti Slop AI Indo melarangnya secara keras.
- **Rule:** Aturan R-02 melarang karakter em dash dalam teks keluaran apa pun. Ganti setiap kemunculannya dengan opsi berikut: titik (mulai kalimat baru), koma (sisipan ringkas), titik dua (memulai penjelasan), tanda kurung (keterangan tambahan), atau susun ulang struktur kalimatnya. Periksa juga tanda em dash berjarak (` — `) maupun tanda hubung ganda (` -- `) yang digunakan dengan maksud yang sama.
- **Before:**
  > Kebijakan ini — yang diumumkan tanpa peringatan — berdampak pada ribuan pekerja.
- **After:**
  > Kebijakan ini, yang diumumkan tanpa peringatan, berdampak pada ribuan pekerja.
- **Before:**
  > Anda tidak akan menulis "Belanda, Eropa" sebagai alamat surat — namun kesalahan label ini terus terjadi.
- **After:**
  > Anda tidak akan menulis "Belanda, Eropa" sebagai alamat surat, namun kesalahan pelabelan ini masih terus berlanjut.
- **Pengecualian wajar:** Banyak editor dan jurnalis profesional yang memang sengaja menggunakan em dash dalam karya sastra mereka. Karakter em dash bukanlah bukti tunggal AI secara otomatis jika berdiri sendiri. Tanda ini menjadi bukti kuat ketika muncul bersamaan dengan klise-klise AI lainnya.
- **Sampel gaya pengguna:** Jika pengguna memberikan contoh tulisan asli miliknya yang kebetulan menggunakan em dash, sampel tersebut diperlakukan sebagai preferensi manusia (R-37). Tanyakan secara sopan kepada pengguna apakah karakter tersebut ingin dipertahankan atau diselaraskan.

### Huruf Tebal Berlebihan (Boldface Overuse)

- **Pola:** Setiap kata kunci atau istilah teknis ditebalkan secara mekanis dan beruntun di setiap kalimat: **"OKR**, **KPI**, dan **BMC**".
- **Mengapa terbaca khas AI:** Ketika semua hal ditebalkan, tidak ada lagi yang benar-benar menonjol. Halaman tampak seperti berteriak di depan mata pembaca.
- **Sebelum:**
  > Aplikasi ini menggabungkan **OKR**, **KPI**, dan **alat strategi visual** untuk memudahkan perencanaan bisnis Anda.
- **Sesudah:**
  > Aplikasi ini menggabungkan OKR, KPI, dan alat strategi visual untuk memudahkan perencanaan bisnis Anda.
- **Aturan:** R-36.
- **Pengecualian dokumentasi:** Label penanda struktural teknis dalam aturan dokumentasi Slop AI Indo (seperti penanda `**FORBIDDEN**` atau `**REQUIRED**`) adalah konvensi format pedoman teknis dan dikecualikan dari larangan ini.

### Tanda Petik Berlebihan (Excessive Quotation Marks)

- **Pola:** Teks bertabur tanda kutip di mana-mana: mengutip kata-kata lazim yang tidak perlu dikutip, memberi tanda kutip sinis pada istilah biasa, dan menjadikan tanda petik sebagai alat penekanan kata.
- **Mengapa terbaca khas AI:** Model AI sering menggunakan tanda kutip untuk menciptakan jarak ironis atau penekanan tanpa perlu menyusun kalimat yang matang. Teks yang penuh tanda petik terasa ragu-ragu dan tidak meyakinkan.
- **Sebelum:**
  > "Solusi" ini membantu "menyederhanakan" "alur kerja" Anda sehingga Anda bisa "berfokus" pada "hal yang penting."
- **Sesudah:**
  > Solusi ini menyederhanakan alur kerja Anda agar Anda dapat berfokus pada pekerjaan utama.
- **Aturan:** R-36.
- **Pengecualian wajar:** Kalimat dialog, kutipan langsung dari tokoh nyata, nama karya buku atau film tetap mempertahankan tanda kutip aslinya. Yang dilarang adalah tanda kutip yang menggantikan fungsi bobot kalimat.

### Daftar Berisi Judul Sebaris (Inline-Header Lists)

- **Pola:** Item daftar poin yang selalu diawali judul tebal diikuti tanda titik dua, di mana judul tersebut hanya mengulang apa yang dijelaskan di kalimatnya: "- **Pengalaman Pengguna:** Pengalaman pengguna telah ditingkatkan".
- **Mengapa terbaca khas AI:** Judul tersebut hanya menduplikasi informasi. Ini adalah kebiasaan format malas dari AI, bukan struktur penulisan yang kaya.
- **Sebelum:**
  > - **Pengalaman Pengguna:** Antarmuka kini jauh lebih mudah digunakan.
  > - **Performa:** Waktu pemuatan halaman menjadi lebih kencang.
  > - **Keamanan:** Semua data dienkripsi dengan standar tinggi.
- **Sesudah:**
  > Pembaruan ini menyempurnakan navigasi antarmuka, mempercepat waktu muat halaman, serta mengenkripsi seluruh pertukaran data secara otomatis.
- **Aturan:** R-36.
- **Pengecualian dokumentasi:** Format `- **Ciri:**` / `- **Alasan:**` / `- **Solusi:**` yang menstrukturkan panduan aturan Slop AI Indo adalah konvensi dokumentasi teknis dan dikecualikan.

### Emoji di Judul, Label Formulir, dan Tombol (Emojis in Headings & UI)

- **Pola:** Menempelkan hiasan emoji di depan judul halaman, judul modal, label seksi form/fieldset, atau tombol aksi: `🚀 Peluncuran`, `✏️ Edit Konfigurasi Budget`, `📅 Horizon Periode`, `🛡️ Mode Penegakan`, `💾 Simpan Konfigurasi`.
- **Mengapa terbaca khas AI:** Emoji tersebut tidak membawa informasi substantif baru. Emoji tersebut hanya menjadi dekorasi visual murahan khas postingan media sosial otomatis yang merusak wibawa aplikasi profesional.
- **Sebelum:**
  > ✏️ **Edit Konfigurasi Kontrol Budget: 2026**  
  > 📅 **Horizon Periode Kontrol Pagu**  
  > 💾 **Simpan Konfigurasi**
- **Sesudah:**
  > **Edit Konfigurasi Kontrol Budget: 2026**  
  > **Horizon Periode Kontrol Pagu**  
  > **Simpan Konfigurasi** (atau sertakan ikon SVG line 16px monokrom jika library ikon sudah terpasang)
- **Aturan:** R-36.

### Frasa Pengisi Bertele-tele (Filler Phrases)

- **Pola:** Menggunakan frasa panjang seperti "Dalam rangka untuk" alih-alih cukup "Untuk", "Sehubungan dengan adanya kenyataan bahwa" untuk "Karena", "Pada titik waktu saat ini" untuk "Saat ini", atau "Penting untuk dicatat bahwa" yang tidak memiliki arti apa pun.
- **Mengapa terbaca khas AI:** Frasa pengisi menggembungkan panjang kalimat tanpa menambah makna. Ini adalah bantalan kata yang ditambahkan model AI agar terdengar formal dan berbobot.
- **Sebelum:**
  > Dalam rangka untuk mencapai target ini, sangat penting untuk dicatat bahwa kita membutuhkan pasokan data yang lebih banyak.
- **Sesudah:**
  > Untuk mencapai target ini, kita membutuhkan lebih banyak data.
- **Aturan:** R-36.

### Pagar Pembatas Penenang Berlebihan (Excessive Hedging)

- **Pola:** Menumpuk berbagai kata penenang dan keraguan dalam satu klaim: "berpotensi mungkin saja barangkali bisa terjadi".
- **Mengapa terbaca khas AI:** Keraguan berlebih di setiap kalimat membuat tulisan terdengar mengelak dan tidak percaya diri. Cukup gunakan satu kata pengandaian jika memang diperlukan.
- **Sebelum:**
  > Hal ini secara potensial mungkin saja barangkali menjadi faktor penyebab mengapa fitur tersebut kurang diminati pengguna.
- **Sesudah:**
  > Hal ini mungkin menjadi alasan fitur tersebut jarang digunakan.
- **Aturan:** R-36.

## Hal yang BUKAN Merupakan Indikator AI (Jangan Asal Disunting)

Seorang penulis manusia yang profesional bisa saja menggunakan beberapa pola penulisan di atas tanpa keterlibatan AI sama sekali. Sebelum menyunting, pastikan Anda tidak merusak tulisan manusia yang sah. Ciri-ciri berikut **bukanlah** bukti tunggal tulisan AI jika berdiri sendiri:

- **Tata bahasa yang rapi dan konsisten.** Banyak penulis profesional menulis dengan kaidah bahasa yang sangat tertib dan presisi. Tulisan rapi bukan berarti buatan AI.
- **Perpaduan gaya santai dan formal.** Variasi ini sering kali menandakan kepribadian manusia asli yang fleksibel.
- **Tulisan yang terkesan datar atau lugas.** Tulisan AI memiliki ciri khas klise tertentu. Tulisan teknis yang kering tanpa klise tersebut adalah tulisan lugas biasa, bukan slop AI.
- **Kosakata teknis atau istilah baku.** AI terlalu sering menggunakan kata-kata hiasan kosong tertentu (lihat Kosakata AI Hampa), bukan semua kata baku. Jangan mengganti istilah teknis yang tepat hanya karena terdengar formal.
- **Kata transisi umum yang muncul wajar.** Satu atau dua kata penghubung seperti "namun" atau "selain itu" adalah hal lumrah. Kata-kata tersebut baru mencurigakan jika ditumpuk di setiap awal kalimat secara berulang.
- **Satu kalimat pendek penegas.** Penulis manusia sering menggunakan satu kalimat pendek untuk mendaratkan poin penting.
- **Klaim tanpa sitasi.** Banyak artikel di internet yang tidak mencantumkan catatan kaki akademis. Ketiadaan sitasi bukanlah bukti otomatis teks buatan AI.
- **Teks kutipan pihak kedua.** Jangan menyunting atau mengubah frasa yang berada di dalam tanda kutip langsung, judul karya, nama merek, atau contoh kasus yang sedang dibahas.

**Perhatikan kumpulan tanda (klaster), bukan tanda tunggal yang terisolasi.** Satu tanda strip atau frasa formal tidak membuktikan apa pun. Namun, jika ada kata-kata hiasan kosong, ditambah hukum tiga kata, klaim tanpa bukti, dan kesimpulan positif generik, itu adalah konfirmasi tulisan AI.

## Ciri Tulisan Manusia Asli (Pertahankan Bagian Ini)

Cenderung pertahankan keaslian tulisan saat Anda menemukan tanda-tanda berikut. Tanda-tanda ini mencerminkan pengalaman manusia nyata, dan penyuntingan berlebihan akan merusak jiwa dari tulisan tersebut:

- **Detail spesifik yang unik dan sulit dikarang.** Alamat kantor nyata, kutipan wawancara yang unik, atau anekdot lapangan. AI cenderung meratakan detail; manusia menyimpan detail yang unik.
- **Perasaan campur aduk dan keraguan yang tulus.** "Menurut saya ini sudah cukup baik, tapi bagian navigasinya masih terasa mengganjal." AI cenderung menghasilkan opini yang selalu positif dan mulus.
- **Rujukan budaya, istilah lokal, atau konteks waktu tertentu.** Bahasa gaul yang tepat, lelucon internal komunitas, atau analogi yang terikat pada peristiwa tertentu.
- **Variasi panjang kalimat yang dinamis.** Tulisan manusia yang hidup berganti-ganti antara kalimat panjang yang detail dan kalimat pendek yang tajam. Tulisan AI cenderung memiliki panjang kalimat yang seragam dan monoton.
- **Komentar spontan dan koreksi diri sendiri.** "(Saya tadinya ingin menulis 'hampir selalu', tapi kenyataannya ini memang selalu terjadi.)"

## Kalibrasi Suara Penulis (Opsional)

Jika pengguna menyediakan contoh tulisan asli dari dirinya, selaraskan gaya penulisan Anda dengan contoh tersebut sebelum mulai menyunting:

1. Baca contoh tulisan tersebut terlebih dahulu. Perhatikan rata-rata panjang kalimatnya, kekayaan kosakatanya, cara membuka paragraf, tanda baca favoritnya, dan frasa yang sering digunakan.
2. Tirukan kebiasaan penulisan tersebut alih-alih sekadar menghapus pola AI secara membabi buta. Jangan menaikkan kasta kata santai menjadi terlalu kaku jika pengguna memang menyukai gaya santai.
3. Contoh tulisan asli pengguna memiliki kedudukan lebih tinggi dibanding panduan gaya skill ini, kecuali aturan mutlak R-02.

## Siklus Draf, Audit, Final (Draft, Audit, Final)

Jalankan alur kerja ini sebelum menyerahkan hasil penulisan:

1. **Draf (Draft):** Tulis atau susun ulang teks dengan menerapkan pola-pola perbaikan di atas. Pastikan teks terbaca mengalir wajar saat dibaca dengan suara keras, memiliki variasi ritme kalimat, mengutamakan fakta konkret, dan menjaga nada bicara yang tepat.
2. **Audit:** Ajukan dua pertanyaan kritis dan jawab secara singkat: "Apa hal yang paling membuat tulisan ini tampak seperti buatan AI?" dan "Apakah tulisan ini menyebutkan fakta, nama, angka, tanggal, atau kutipan yang tidak ada di sumber aslinya?" Karangan fiktif adalah cacat fatal meskipun terdengar meyakinkan.
3. **Final:** Perbaiki teks berdasarkan hasil audit. Periksa kembali apakah ada karakter em dash yang terselip (R-02). Jika masih ada em dash di teks keluaran biasa, draf belum boleh diserahkan.

