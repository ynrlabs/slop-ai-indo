---
name: slop-ai-indo-backend
description: "Arsitektur backend, API, query database, dan sanitasi logika server untuk AI coding agent: mencegah silent catch, query N+1, endpoint tanpa validasi, dan kebocoran data."
allowed-tools: Read Write Edit Glob Grep
---
# slop-ai-indo-backend

> Anti Slop: Aturan untuk AI Coding Agent. Skill Arsitektur Backend & API

> Bagian dari sistem antislop. Dibaca bersama dengan `slop-ai-indo.md` (inti). Skill ini menyaring kebiasaan buruk model AI dalam menulis kode server, handler API, interaksi database, dan error handling (seperti menelan error diam-diam, endpoint tanpa validasi, query tanpa limit, atau kebocoran kredensial). Muat skill ini saat tugas melibatkan pengembangan backend, controller, service layer, atau API.

## Cara Menggunakan Skill Ini

- Muat bersama `slop-ai-indo.md` setiap kali tugas menyentuh arsitektur server, API controller, model database, atau middleware.
- Setiap pola memuat: **Ciri (Tell)**, **Alasan (Why)**, dan **Solusi (Fix)**.
- **Prinsip Utama:** Kode backend yang baik mengutamakan kebenaran (*correctness*), ketahanan (*resilience*), dan keamanan (*security*), bukan sekadar kode yang bisa dijalankan (*"asal jalan"*).

---

## Pola Slop Backend & Solusinya

### B-01: Menelan Error Diam-Diam (Silent Catch & Error Swallowing)

- **Ciri:** Menangkap exception tanpa penanganan konkret, seperti `catch (Exception $e) {}` di PHP/Laravel, `catch (e) {}` kosong di Node.js/Go, atau `except: pass` di Python.
- **Alasan:** Menyembunyikan bug kritis saat produksi, mempersulit debugging, dan membuat status aplikasi tampak sukses padahal proses internal gagal total.
- **Solusi:** Tangani error secara eksplisit: catat log terstruktur dengan konteks aman (`logger.error(...)`), dan teruskan atau kembalikan response error informatif yang terstruktur.

### B-02: Endpoint Tanpa Skema Validasi Input (Unvalidated Payloads)

- **Ciri:** Mengambil parameter langsung dari request (`$request->all()`, `req.body.xyz`) tanpa validasi tipe data, format, dan batasan panjang.
- **Alasan:** Membuka celah injection, memory exhaustion, Type Confusion, dan inkonsistensi database. AI sering mengabaikan validasi demi menghasilkan kode yang cepat selesai.
- **Solusi:** Wajib menggunakan skema validasi deklaratif di layer awal (FormRequest di Laravel, Zod/Joi di Node/TS, Pydantic di Python). Tolak request dengan HTTP `422 Unprocessable Content` atau `400 Bad Request`.

### B-03: Query Database Mentah dengan Penggabungan String (SQL Concatenation)

- **Ciri:** Menggabungkan variabel pengguna langsung ke query string: `DB::select("SELECT * FROM users WHERE email = '" . $email . "'")` atau template literals `db.query(\`SELECT * FROM items WHERE id = \${id}\`)`.
- **Alasan:** Penyebab nomor satu kerentanan SQL Injection.
- **Solusi:** Wajib menggunakan parameterized queries, prepared statements, atau ORM query builder terstandar (seperti Eloquent, Prisma, Drizzle, TypeORM, SQLAlchemy).

### B-04: Status HTTP 200 untuk Response Gagal & Kebocoran Stack Trace

- **Ciri:** Mengembalikan status HTTP `200 OK` dengan payload `{ success: false, error: "Database connection failed at line 140..." }` atau membuang dump stack trace utuh ke response client.
- **Alasan:** Membingungkan sistem caching, monitoring API, dan API client. Menampilkan internal stack trace membocorkan struktur kode, path direktori, dan versi pustaka kepada penyerang.
- **Solusi:** Gunakan kode status HTTP semantik (400, 401, 403, 404, 422, 500). Jangan pernah membocorkan stack trace internal atau database query ke client publik; simpan detail teknis hanya di log privat server.

### B-05: Koleksi Data Tanpa Paginasi (Unbounded Queries)

- **Ciri:** Menampilkan koleksi data dengan `SELECT * FROM table` atau ORM `User::all()` tanpa klausa batasan (`LIMIT`, cursor, atau paginate).
- **Alasan:** Begitu volume data membesar di produksi, kueri ini menyebabkan *out-of-memory crash* (OOM) dan latency spike tinggi.
- **Solusi:** Wajib menerapkan paginasi dengan batas atas maksimum (misal: default 20, batas maksimal 100 per halaman).

### B-06: Antipattern Query N+1

- **Ciri:** Mengambil entitas utama dalam satu kueri, lalu melakukan kueri relasi di dalam loop secara berulang: `foreach ($users as $user) { $orders = $user->orders; }`.
- **Alasan:** Membuat puluhan hingga ribuan koneksi kueri database yang lambat dan membebani server secara tidak perlu.
- **Solusi:** Wajib melakukan eager loading relasi (`User::with('orders')->get()` di Laravel, `include: { orders: true }` di Prisma).

### B-07: Mutasi Multi-Langkah Tanpa Transaksi ACID

- **Ciri:** Melakukan serangkaian operasi tulis ke database (misal: potong saldo, buat order, kirim notifikasi) tanpa membungkusnya dalam database transaction.
- **Alasan:** Jika langkah kedua gagal, data berada dalam status korup / tidak konsisten (saldo terpotong tetapi order tidak terbuat).
- **Solusi:** Bungkus mutasi multi-langkah dalam transaksi database (`DB::transaction(...)` di Laravel, `prisma.$transaction(...)` di Node.js).

### B-08: Kredensial & Kunci Rahasia Hardcoded

- **Ciri:** Menulis API key, secret JWT, username database, atau password langsung di dalam controller atau file konfigurasi repositori.
- **Alasan:** Rawan terunggah ke version control publik dan dieksploitasi penyerang.
- **Solusi:** Wajib membaca rahasia dari environment variables (`.env`, secret manager). Berikan nilai default hanya untuk lingkungan development lokal non-sensitif.

---

## Delivery Gate: Evaluasi Backend Mandatori

Sebelum menyerahkan kode backend ke pengguna, agen wajib memverifikasi:
1. [ ] Apakah semua endpoint memvalidasi input sebelum memprosesnya?
2. [ ] Apakah semua kueri database menggunakan parameter binding?
3. [ ] Apakah ada blok `catch` kosong atau error yang ditelan tanpa log?
4. [ ] Apakah relasi database terbebas dari query N+1?
5. [ ] Apakah mutasi data penting dibungkus dalam transaksi database?
