---
name: slop-ai-indo-test
description: "Standar penulisan pengujian otomatis untuk AI coding agent: memberantas tes palsu, over-mocking, assertion hampa, dan memastikan cakupan skenario kegagalan nyata."
allowed-tools: Read Write Edit Glob Grep
---
# slop-ai-indo-test

> Anti Slop: Aturan untuk AI Coding Agent. Skill Pengujian Otomatis & Mocking

> Bagian dari sistem antislop. Dibaca bersama dengan `slop-ai-indo.md` (inti). Skill ini menyaring kebiasaan buruk model AI dalam menghasilkan test code (seperti membuat tes hampa demi mengejar coverage, melakukan mocking berlebihan hingga logika asli tidak pernah dieksekusi, atau hanya menguji happy path). Muat skill ini saat tugas menulis unit test, integration test, atau test suite.

## Cara Menggunakan Skill Ini

- Muat bersama `slop-ai-indo.md` setiap kali tugas menulis atau memperbaiki unit test, integration test, atau fixtures.
- Setiap pola memuat: **Ciri (Tell)**, **Alasan (Why)**, dan **Solusi (Fix)**.
- **Prinsip Utama:** Pengujian otomatis bertujuan membuktikan kebenaran perilaku kode saat menghadapi kondisi ideal maupun kondisi kegagalan nyata, bukan sekadar menghasilkan checklist hijau palsu di CI.

---

## Pola Slop Testing & Solusinya

### T-01: Asersi Hampa & Trivial (Testing the Constants)

- **Ciri:** Asersi yang pasti selalu benar tanpa menguji hasil logika sesungguhnya: `expect(true).toBe(true)`, `expect(result).toBeDefined()` tanpa memvalidasi struktur data di dalamnya, atau `$this->assertTrue(true)`.
- **Alasan:** Test suite memberikan rasa aman palsu (*false sense of security*). Jika kode logika diubah total atau rusak, tes ini tetap akan lolos hijau (*pass*).
- **Solusi:** Wajib menguji nilai riil hasil komputasi, struktur respon, kode status, atau mutasi state yang diharapkan (`expect(user.status).toBe('active')`, `$this->assertEquals(200, $response->getStatusCode())`).

### T-02: Over-Mocking Ekstrem (Mocking the Unit Under Test)

- **Ciri:** Melakukan mock terhadap kelas atau metode yang sebenarnya sedang diuji, atau me-mocking seluruh dependensi internal hingga tidak ada baris kode produksi yang benar-benar dieksekusi.
- **Alasan:** Tes hanya menguji apakah mock terpanggil (*testing the mock, not the code*), bukan apakah logika fungsi bekerja dengan benar.
- **Solusi:** Mock hanya dependensi eksternal nyata yang memiliki I/O tak terhindarkan (panggilan API pihak ketiga seperti Stripe/Twilio, koneksi socket, atau jam sistem). Gunakan fakes/in-memory implementations untuk layer database dan repository.

### T-03: Monokultur Happy Path (Lupa Boundary & Failure Testing)

- **Ciri:** Satu test suite hanya memuat 1 atau 2 skenario sukses (*happy path*), tanpa satupun tes yang menguji input null, string kosong, angka negatif, timeout, atau hak akses ditolak.
- **Alasan:** Bug di lingkungan produksi hampir selalu terjadi pada *edge case* dan *failure modes*, bukan pada input yang sempurna.
- **Solusi:** Setiap unit wajib menguji minimal 3 skenario:
  1. *Happy Path:* Input valid menghasilkan output yang benar.
  2. *Validation & Boundary:* Input kosong, melebihi batas, atau tipe salah ditolak dengan rapi.
  3. *Error Handling:* Dependensi eksternal gagal/timeout menghasilkan response error yang anggun.

### T-04: Pengujian Non-Deterministik (Flaky Tests)

- **Ciri:** Tes yang mengandalkan jam real-time (`new Date()`, `Carbon::now()`), nilai acak tanpa seed (`Math.random()`), atau panggilan jaringan live ke internet luar.
- **Alasan:** Tes bisa tiba-tiba gagal sewaktu-waktu di CI server tergantung zona waktu, tanggal pergantian bulan, atau koneksi jaringan lambat (*flaky*).
- **Solusi:** Wajib menggunakan *frozen clock* / fake time (`Carbon::setTestNow(...)`, `vi.setSystemTime(...)`), seed tetap untuk data acak, dan server mock lokal (`nock`, MSW, Http::fake()).

### T-05: Polusi State Antar Tes Tanpa Teardown Bersih

- **Ciri:** Satu test case menyisipkan baris ke database atau memodifikasi variabel global, lalu test case berikutnya mengandalkan keberadaan data tersebut agar lolos.
- **Alasan:** Tes menjadi rapuh dan gagal jika dijalankan secara acak (*random order*) atau paralel.
- **Solusi:** Setiap tes harus independen (*hermetic*). Gunakan database transaction rollback per test (`RefreshDatabase` di Laravel, isolated schema di Postgres/SQLite) dan bersihkan mocks setelah setiap test case (`beforeEach`/`afterEach`).

---
