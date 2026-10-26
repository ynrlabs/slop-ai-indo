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

### B-09: Desain URL Spageti & Identifier di Query String (Ugly Query-String URLs)

- **Ciri:** Menggunakan query string acak-acakan (`?`) untuk routing halaman atau identifier entitas utama, seperti `/article.php?id=123`, `/dashboard?page=settings`, atau `/users?action=edit&id=5`.
- **Alasan:**
  1. Desain usang yang merusak SEO, keterbacaan manusia, dan estetika enterprise.
  2. Mengekspos identifier database mentah yang mempermudah serangan manipulasi parameter (IDOR / Insecure Direct Object Reference).
  3. Mengundang celah SQL Injection akibat kebiasaan mengambil parameter GET secara ceroboh lalu disambung langsung ke query database tanpa sanitasi.
- **Solusi:**
  - Wajib gunakan Clean / Pretty URLs semantik berbasis RESTful path dan slug:
    - Gunakan slug atau Route Model Binding: `/articles/{article:slug}` (misal: `/articles/panduan-keamanan-web`) alih-alih `?id=123`.
    - Gunakan pola RESTful: `/users/{user}/edit` alih-alih `?action=edit&id=5`.
    - Gunakan UUID atau public identifier untuk endpoint publik jika ID numerik tidak boleh ditebak.
  - Query string (`?`) HANYA diizinkan untuk parameter opsional non-routing: penyaringan (filter), pengurutan (sort), pencarian (search), dan paginasi (misal: `/products?category=elektronik&sort=termurah&page=2`).
  - Seluruh parameter (baik path param maupun query param) wajib diproses dengan validasi skema dan prepared statements / ORM parameter binding (Eloquent, Prisma, dll.) untuk menjamin keamanan mutlak dari SQL Injection.

### B-10: Fat Controller & Percampuran Tanggung Jawab (Fat Controller Antipattern)

- **Ciri:** Menumpuk seluruh logika di dalam satu method controller (100+ baris): validasi inline `$request->validate([...])`, manipulasi database berlapis, upload berkas, pengiriman email/notifikasi, dan format data sekaligus.
- **Alasan:** Melanggar prinsip Single Responsibility (SRP). Kode menjadi spageti, rapuh, tidak dapat digunakan kembali (reusable), dan mustahil diuji secara terisolasi via unit testing.
- **Solusi:**
  - Terapkan pola **Skinny Controller**: Controller hanya berperan sebagai pengatur lalu lintas HTTP (terima request -> delegasikan ke Action/Service -> kembalikan Response).
  - Ekstrak validasi ke **Dedicated Form Request** (misal: `StoreOrderRequest`, `UpdateProfileRequest`) dengan deklarasi aturan yang rapi.
  - Ekstrak proses bisnis dan mutasi data ke **Action Class** (misal: `CreateOrderAction`, `ProcessPaymentAction`) dengan satu method publik (`execute()` atau `handle()`).

### B-11: Kebocoran Model Mentah ke Response Publik (Raw Model Response Leaks)

- **Ciri:** Mengembalikan model database secara langsung ke response client: `return response()->json($user)` atau `return $order`.
- **Alasan:**
  1. **Celah Keamanan & Kebocoran Privasi:** Kolom internal database seperti `remember_token`, hash password lama, IP address audit, atau kolom terhapus (`deleted_at`) dapat bocor tanpa sengaja jika `$hidden` model tidak lengkap.
  2. **Kontrak API Rapuh:** Perubahan nama kolom database langsung merusak aplikasi mobile atau frontend client.
  3. **Format Tidak Konsisten:** Format tanggal (ISO 8601 vs timestamp) dan penamaan atribut menjadi tidak seragam antar-endpoint.
- **Solusi:**
  - Wajib membungkus setiap response entitas dengan **API Resource** (seperti Laravel `JsonResource`) atau Data Transfer Object (DTO).
  - Deklarasikan secara eksplisit field apa saja yang diizinkan keluar ke publik:
    ```php
    return OrderResource::make($order);
    ```

### B-12: Percabangan Piramida Bersarang (Arrow Anti-Pattern vs Guard Clauses)

- **Ciri:** Struktur `if-else` bertingkat yang menjorok dalam (3 hingga 5 level nesting kurung kurawal), seperti `if ($user) { if ($active) { if ($hasStock) { ... } } }`.
- **Alasan:** Membebani beban kognitif pembaca (*cyclomatic complexity* tinggi) dan menyembunyikan logika utama ("happy path") di balik tumpukan kurung kurawal.
- **Solusi:**
  - Gunakan **Guard Clauses / Early Return**: Periksa kondisi kegagalan atau pengecualian di baris awal fungsi, lalu segera `return` atau `throw exception`.
  - Batasi kedalaman indentasi logika maksimal **2 tingkat**. Happy path harus berjalan lurus di tingkat terluar fungsi.

---