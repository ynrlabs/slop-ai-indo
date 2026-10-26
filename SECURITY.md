# Keamanan (Security)

Slop AI Indo adalah sekumpulan skill agen *open source*. Semua yang dilakukannya berada di dalam repositori ini, dan Anda dapat membaca setiap berkas sebelum memasangnya. Repositori ini juga dipindai oleh auditor keamanan pihak ketiga di skills.sh (Socket, Snyk, dan Gen Agent Trust Hub). Halaman ini menjelaskan apa yang ditandai oleh audit tersebut dan mengapa setiap perilaku tersebut memang disengaja, sehingga sebuah peringatan tidak pernah menjadi misteri.

## Apa yang Dikatakan Hasil Audit

Per rilis terbaru, Gen Agent Trust Hub menilai sistem dengan predikat **Warn (MEDIUM)** pada dua temuan. Keduanya menggambarkan fitur yang justru merupakan esensi produk. Temuan ketiga telah diselesaikan. Rinciannya di bawah ini.

### Temuan 1: Menulis ke file inisialisasi agen (*agent entry files*)

Laporan mencatat bahwa sistem menambahkan blok penunjuk (*pointer block*) ke file inisialisasi agen seperti `CLAUDE.md` atau `AGENTS.md`. Inilah cara bagaimana filter yang berjalan pada semua hal tetap termuat: file inisialisasi mencantumkan skill yang terpasang, sehingga sesi berikutnya dapat langsung membacanya. Blok penunjuk ini:

- Berupa rujukan markdown statis. Blok ini hanya mencantumkan skill yang terpasang dan tidak membawa konten yang dapat dieksekusi (*executable*).
- Hanya ditulis setelah Anda memberikan persetujuan. Pemasang interaktif (*installer*) maupun wizard manual akan selalu bertanya terlebih dahulu.
- Ditambahkan di akhir file inisialisasi pada instalasi pertama, dan diperbarui di tempat yang sama pada eksekusi berikutnya. Bagian lain dari file Anda tidak akan disentuh: teks Anda, baris kosong, blok kode, dan pemisah baris dibiarkan apa adanya, dan satu-satunya baris yang pernah dihapus adalah komentar penanda milik slop-ai-indo sendiri.
- Berada di [cli/lib/install.mjs](cli/lib/install.mjs) untuk pemasang CLI, dan di dalam wizard pada [slop-ai-indo.md](slop-ai-indo.md) untuk jalur manual.

Menghapus perilaku ini akan membatalkan janji inti produk: filter yang selalu aktif secara otomatis, bukan filter yang harus Anda ingat untuk dipanggil secara manual. Semua aturan yang selalu aktif dan menuliskan referensi ke file inisialisasi mengikuti pola ini.

### Temuan 2: Merujuk ke skrip eksternal (*external script*)

Laporan mencatat bahwa skill human merujuk ke skrip Python, `contrast-check.py`. Ini adalah alat pemeriksa kontras (*contrast checker*), sebuah alat aksesibilitas yang memvalidasi kontras warna terhadap rasio WCAG. Skrip ini:

- Disertakan sebagai berkas lokal di dalam folder skill, [skills/slop-ai-indo-human/contrast-check.py](skills/slop-ai-indo-human/contrast-check.py). Anda yang mengambilnya secara lokal; agen tidak pernah mengunduh apa pun dari jaringan internet.
- Hanya memeriksa pasangan warna yang Anda masukkan. Skrip ini tidak memiliki akses jaringan dan tidak membaca data lainnya.
- Hanya berjalan ketika pemeriksaan kontras membutuhkan kalkulasi WCAG, yang merupakan tujuan utama dari skill human.

Plugin ini juga menyediakan tool contrast MCP, `contrast-mcp.py`, dengan karakteristik yang sama: berkas lokal, tanpa akses internet, tanpa data di luar pasangan warna yang divalidasi.

### Temuan 3: Membaca konten eksternal

Sebuah temuan mencatat bahwa pembacaan `DESIGN.md` untuk arahan desain. Inti aturan kini menegaskan batasannya secara eksplisit: `DESIGN.md` adalah data yang diterapkan, bukan instruksi yang harus dipatuhi sebagai perintah sistem. Agen hanya mengekstrak kolom desain (identitas, kepribadian, palet warna, tipografi, suasana/mood, dials) dan memperlakukan apa pun yang terbaca seperti perintah sebagai konten biasa, bukan sebagai instruksi eksekusi. Lihat [slop-ai-indo.md](slop-ai-indo.md).

## Apa yang Tidak Pernah Dilakukan Slop AI Indo

- Tidak pernah mengunduh atau mengeksekusi kode dari jaringan internet di tengah sesi.
- Tidak pernah membaca, mengirim, atau mencatat kredensial maupun data pribadi.
- Hanya mengubah berkas dengan persetujuan Anda, dan hanya untuk menambahkan blok penunjuk miliknya sendiri.
- Sepenuhnya *open source*. Anda dapat membaca skill, installer, dan skrip pemeriksa sebelum memasangnya.

## Penilaian yang Telah Bersih (Cleared)

Socket sebelumnya memberikan peringatan pada perintah instalasi yang disebutkan oleh wizard. Wizard kini tidak lagi menyebutkan perintah instalasi atau path repositori di dalam teksnya, dan pemeriksaan Socket kini telah lulus (PASS).

## Audit Keamanan Defensif Mandiri (`slop-ai-indo-security`)

Ekosistem Slop AI Indo menyertakan modul audit keamanan mendalam `slop-ai-indo-security`. Modul ini mengimplementasikan alur tinjauan kerentanan source-first yang sepenuhnya defensif:
- Berjalan secara terisolasi tanpa memicu akses jaringan keluar yang tidak sah.
- Validasi berbasis sandbox loopback lokal dan skema laporan terstandar (`report-schema.json`).
- Menegakkan prinsip write-isolation yang ketat antara agen hunter, validator, dan laporan akhir.
- Membantu developer menemukan celah keamanan nyata (injeksi, bypass autentikasi, SSRF, IDOR, race condition, dan lifecycle data) sebelum kode dirilis.
