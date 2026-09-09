# 📦 Order & Invoice Tracker (Supabase + GitHub + Vercel)

Aplikasi tracking nomor order dan invoice yang simpel, cepat, dan modern. Terhubung langsung dengan **Supabase PostgreSQL Cloud Database**, siap dipublikasikan ke **GitHub** dan **Vercel**.

---

## 🌟 Fitur Utama

- **Pencatatan Order & Invoice**: No. Order, No. Invoice, Customer, Tanggal, Nominal, Status, Catatan.
- **Cloud Database (Supabase)**: Data tersimpan terpusat di PostgreSQL cloud dan sinkron secara real-time.
- **Lokal Fallback**: Jika belum terhubung ke Supabase, data otomatis tersimpan di `LocalStorage` browser.
- **Search & Filter**: Pencarian instan berdasarkan order/invoice/nama customer dan filter status.
- **Ekspor CSV**: Mencadangkan data ke format file Spreadsheet CSV.
- **Siap Vercel Deployment**: Langsung dapat dideploy secara gratis dalam hitungan detik.

---

## 🛠️ Langkah 1: Persiapan Supabase (Cloud Database)

1. Buka situs [supabase.com](https://supabase.com) dan buat akun gratis / login dengan GitHub.
2. Klik **New Project** dan buat project baru (misal: `OrderTrackerDB`).
3. Setelah project selesai dibuat:
   - Masuk ke menu **SQL Editor** di panel kiri Supabase.
   - Klik **New Query**, lalu **salin dan tempelkan** isi file [`schema.sql`](./schema.sql).
   - Klik tombol **Run** (Ctrl + Enter) untuk membuat tabel `orders` dan memasukkan data awal.
4. Dapatkan **API Credentials**:
   - Masuk ke menu **Project Settings** (ikon roda gigi) -> **API**.
   - Salin **Project URL** (contoh: `https://xyzproject.supabase.co`)
   - Salin **anon / public key** (contoh: `eyJhbGciOi...`).
5. Buka aplikasi `index.html`, klik tombol **Koneksi Supabase**, lalu tempelkan URL dan Key yang sudah disalin.

---

## 🚀 Langkah 2: Upload ke GitHub

1. Buka [github.com/new](https://github.com/new) dan buat repositori baru (misal: `order-invoice-tracker`).
2. Di halaman repositori baru yang sudah dibuat, klik link **"uploading an existing file"**.
3. Drag & drop seluruh file dalam folder proyek ini:
   - `index.html`
   - `schema.sql`
   - `vercel.json`
   - `README.md`
   - `.gitignore`
4. Klik **Commit changes**.

---

## 🌐 Langkah 3: Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Klik **Add New...** -> **Project**.
3. Pilih repositori **`order-invoice-tracker`** dari akun GitHub Anda.
4. Klik **Deploy** (Tanpa perlu mengubah pengaturan apa pun).
5. Dalam beberapa detik, Vercel akan memberikan link domain publik Anda (contoh: `https://order-invoice-tracker.vercel.app`)!

---

## 📄 Lisensi
Free & Open Source for everyone.
