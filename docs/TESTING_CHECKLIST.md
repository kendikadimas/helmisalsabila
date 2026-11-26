# Checklist UI Testing - helsenvi.com

URL: https://helsenvi.com
Kredensial admin: minta ke pemilik proyek (jangan ditulis di dokumen ini).
Browser/device yang dipakai: ____________  Tanggal: ____________  Tester: ____________

Catatan temuan: halaman/URL, langkah mengulang, hasil diharapkan vs terjadi, device/browser, screenshot.

## A. Admin (`/admin`)

| # | Skenario | Hasil diharapkan | Pass/Fail | Catatan |
|---|----------|------------------|-----------|---------|
| A1 | Login password salah | Muncul pesan error | | |
| A2 | Login benar | Masuk dashboard | | |
| A3 | Klik "Keluar" | Kembali ke login | | |
| A4 | Buka `/admin` tanpa login | Redirect ke login | | |
| A5 | Dashboard Overview | Total omset & jumlah transaksi tampil, "Buka Website" jalan | | |
| A6 | Layanan: tambah dengan editor visual (bold, list, heading, link) | Tersimpan | | |
| A7 | Layanan: edit layanan lama | Deskripsi rapi, tanpa simbol `##` / `**` | | |
| A8 | Layanan: cek `/layanan/[slug]` setelah simpan | Format tampil benar | | |
| A9 | Layanan: hapus | Hilang dari daftar | | |
| A10 | Produk Digital: tambah & edit termasuk URL Akses Digital | Tersimpan | | |
| A11 | Upload gambar valid (JPG/PNG/WebP/GIF) | Berhasil | | |
| A12 | Upload file non-gambar / file palsu ganti ekstensi | Ditolak | | |
| A13 | Artikel: buat, edit, hapus, cek di publik | Semua berfungsi | | |
| A14 | Kategori, Langkah Kerja, Keunggulan, Testimoni: tambah/edit/hapus | Semua berfungsi | | |
| A15 | Transaksi DOKU | Daftar, status, nominal sesuai | | |
| A16 | Site Settings: ubah & simpan | Perubahan terlihat di publik | | |
| A17 | Sidebar dikelompokkan: Ringkasan, Penjualan, Konten Website, Blog, Sistem | Semua menu tampil & aktif sesuai halaman | | |
| A18 | Voucher: tambah (persen & nominal), edit, nonaktifkan lewat klik status, hapus | Tersimpan, status & kolom Terpakai benar | | |
| A19 | Voucher: kode duplikat / nilai > 100% / tanggal berakhir < mulai | Ditolak dengan pesan jelas | | |
| A20 | Mobile (375px): menu hamburger, tabel, form | Tidak terpotong | | |

## B. Website Publik

| # | Skenario | Hasil diharapkan | Pass/Fail | Catatan |
|---|----------|------------------|-----------|---------|
| B1 | Beranda, Layanan, Produk, Artikel, Portfolio + halaman detail | Tidak ada gambar rusak / error 500 | | |
| B2 | Detail layanan & detail produk | Terbuka normal | | |
| B3 | Tampilan mobile & desktop vs mockup `docs/` | Sesuai | | |

## C. Alur Beli (kritis)

| # | Skenario | Hasil diharapkan | Pass/Fail | Catatan |
|---|----------|------------------|-----------|---------|
| C1 | Pilih produk, isi nama & email, klik bayar | Redirect ke halaman DOKU | | |
| C2 | Selesaikan pembayaran | Status pesanan jadi PAID (via webhook) | | |
| C3 | Cek email konfirmasi & akses produk (termasuk spam) | Email masuk | | |
| C4 | Batalkan / biarkan expired | Tidak PAID, produk tidak bisa diakses | | |
| C5 | Voucher valid (buat dulu di admin) | Total benar, invoice menampilkan baris Diskon | | |
| C6 | Voucher tidak ada / nonaktif / expired / belum mulai | Ditolak dengan pesan jelas | | |
| C7 | Voucher dengan minimal belanja di bawah syarat | Ditolak, pesan menyebut minimal belanja | | |
| C8 | Voucher berkuota 1: pakai di 1 pesanan, coba di pesanan kedua | Pesanan kedua ditolak "Kuota habis" | | |
| C9 | Voucher "Maks. Potongan" diisi | Potongan tidak melebihi batas | | |

## D. Cek Pesanan & Member Area

| # | Skenario | Hasil diharapkan | Pass/Fail | Catatan |
|---|----------|------------------|-----------|---------|
| D1 | `/cek-pesanan` dengan invoice benar | Detail tampil, email disamarkan | | |
| D2 | `/cek-pesanan` hanya dengan email | Ditolak | | |
| D3 | `/cek-pesanan` invoice ngawur | Pesan "tidak ditemukan" | | |
| D4 | `/dashboard` login (email + invoice) invoice PAID | Produk & link akses digital tampil | | |
| D5 | `/dashboard` dengan invoice belum dibayar | Tidak menampilkan produk berbayar milik email yang sama | | |
| D6 | Logout lalu login lagi | Tombol tidak macet loading | | |
| D7 | Akses `/dashboard` tanpa login | Redirect | | |

## E. Keamanan Dasar

| # | Skenario | Hasil diharapkan | Pass/Fail | Catatan |
|---|----------|------------------|-----------|---------|
| E1 | Buka `/admin/...` tanpa login | Redirect | | |
| E2 | Cookie/token customer dipakai ke `/admin` | Ditolak | | |
| E3 | `/api/health` | 200 OK | | |
| E4 | Console browser | Tidak ada `ChunkLoadError` / 404 chunk (hard refresh dulu) | | |
