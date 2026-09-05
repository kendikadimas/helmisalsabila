# Panduan Lengkap Deploy Next.js ke cPanel Shared Hosting

Berdasarkan tutorial Dev.to: [Run NextJS App in shared-hosting cPanel domain](https://dev.to/saad4software/run-nextjs-app-in-shared-hosting-cpanel-domain-1d4g)

---

## 1. Persiapan Database di cPanel

Karena cPanel shared hosting sudah menyertakan MySQL/MariaDB:
1. Buka **cPanel** > **MySQL® Databases**.
2. Buat database baru (misal: `cpaneluser_helmi`).
3. Buat user database baru (misal: `cpaneluser_dbuser`) dan buat password yang kuat.
4. Hubungkan user ke database dengan checklist **ALL PRIVILEGES**.
5. Buka **phpMyAdmin** di cPanel > pilih database tersebut > klik tab **Import** > upload file `cpanel-database-schema.sql` yang sudah disediakan di folder proyek ini.

---

## 2. Setup Node.js App di cPanel

1. Buka cPanel > cari menu **Setup Node.js App** (di bawah kategori *Software*).
2. Klik tombol **CREATE APPLICATION**.
3. Isi form berikut:
   - **Node.js version**: Pilih versi **18.x**, **20.x**, atau **22.x** (tertinggi yang tersedia).
   - **Application mode**: Pilih **Production**.
   - **Application root**: Isi nama folder lokasi aplikasi (contoh: `helmisalsabila` atau `app`).
   - **Application URL**: Pilih domain atau subdomain Anda.
   - **Application startup file**: Ketik `app.js`.
4. Klik tombol **CREATE** di kanan atas.
5. cPanel akan membuat template awal. Catat perintah virtual environment yang muncul di atas halaman (misal: `source /home/username/nodevenv/...`).

---

## 3. Menyiapkan File Siap Upload dari Komputer Lokal

Karena shared hosting memiliki resource CPU/RAM terbatas, proses **build WAJIB dilakukan di komputer lokal**:

1. Jalankan build di lokal:
   ```bash
   npm run build
   ```
2. Siapkan file-file berikut untuk di-zip (jangan masukkan folder `node_modules`):
   - `.next/` (pastikan folder `.next/cache` dikosongkan agar ukuran zip kecil)
   - `public/`
   - `src/`
   - `app.js` (file entrypoint yang sudah dibuat)
   - `package.json`
   - `package-lock.json`
   - `next.config.js`
   - `.env` (isi dengan konfigurasi database cPanel)
3. Contoh isi `.env` di cPanel:
   ```env
   DATABASE_URL="mysql://cpaneluser_dbuser:password_anda@localhost:3306/cpaneluser_helmi"
   JWT_SECRET="masukkan_32_karakter_acak_rahasia_untuk_admin_jwt"
   NEXT_PUBLIC_APP_URL="https://domain-anda.com"
   NODE_ENV="production"
   PORT=3000
   ```

---

## 4. Upload & Install Dependencies di cPanel

1. Buka **File Manager** di cPanel.
2. Masuk ke folder application root yang dibuat di Langkah 2 (misal: `/home/username/helmisalsabila`).
3. Upload file zip yang sudah Anda siapkan, lalu klik kanan > **Extract**.
4. Kembali ke menu **Setup Node.js App**:
   - Klik ikon pensil (**Edit**) pada aplikasi Anda.
   - Klik tombol **Run NPM Install** di bagian *Detected configuration files*.
   - *(Atau via cPanel Terminal)*: copy perintah virtualenv, paste di terminal, lalu jalankan `npm install --omit=dev`.
5. Klik tombol **RESTART** di bagian atas menu Node.js App.

---

## 5. Kredensial Default Admin CMS

Setelah database di-import:
- **URL Admin**: `https://domain-anda.com/admin/login`
- **Email**: `admin@helmisalsabila.com`
- **Password**: `admin123` *(segera ganti setelah berhasil login)*
