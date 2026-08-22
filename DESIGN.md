# 🎨 Design System & UI/UX Technical Specifications
# Website Portofolio & Built-in CMS (Helmi Salsabila)

> **Tujuan Dokumen:** Dokumen acuan desain visual dan spesifikasi UI 100% presisi (*pixel-perfect match*) berdasarkan 7 referensi desain terlampir:
> 1. `Home [REVISI].png`
> 2. `Layanan & Portfolio.png`
> 3. `[OPSI 2] Detail Layanan.png`
> 4. `Produk.png`
> 5. `Detail Produk.png`
> 6. `Artikel.png`
> 7. `Detail Artikel.png`

---

## 1. Global Design Tokens & Identity

### 1.1 Color Palette & Variable Mapping

| Token Name | Hex Code | Tailwind Class / CSS Variable | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| **Primary Navy** | `#1E3A5F` / `#162E4A` | `bg-slate-900` / `bg-[#1E3A5F]` | Tombol Utama, Hero Ribbon Stats, Sidebar TOC Active, Heading CTA |
| **Accent Gold/Yellow**| `#F59E0B` / `#EAB308` | `text-amber-500` / `bg-amber-500` | Highlight Headline Hero ("Data & Digital Solutions."), 3D Icon Accents |
| **Teal / Mint Accent**| `#0EA5E9` / `#0D9488` | `text-teal-600` / `border-teal-500` | Bar Judul Bagian (`border-l-4`), Pill Badge Halo Hero, Badge Diskon |
| **Mint Soft Background**| `#F0FDF4` / `#E6FAF8` | `bg-[#E6FAF8]` / `bg-teal-50/70` | Background Searchbar Banner, Box Pricing Promo, Pill Badges |
| **Success Green** | `#16A34A` / `#22C55E` | `text-emerald-600` | Teks Harga Produk & Layanan (`Rp200.000`), Checklist `✓` |
| **Card Background** | `#FFFFFF` | `bg-white` (Light) / `bg-slate-900` (Dark) | Kartu Layanan, Kartu Produk, Kartu Artikel, Box Konten Detail |
| **Border Neutral** | `#E2E8F0` / `#E5E7EB` | `border-slate-200` / `border-gray-200` | Border Kartu, Divider Horizontal, Filter Sidebar Box |
| **Text Primary** | `#0F172A` | `text-slate-900` | Heading H1, H2, H3, Judul Card |
| **Text Secondary** | `#475569` / `#64748B` | `text-slate-600` / `text-slate-500` | Deskripsi, Tanggal Artikel, Subtitle |
| **Dark Stats Ribbon**| `#081627` / `#0F2137` | `bg-[#0B1D33]` | Ribbon Bar 3 Kolom Statistik di Bawah Hero Section |

### 1.2 Typography System
* **Primary Font Family:** `Inter`, `Plus Jakarta Sans`, atau `Outfit` (Google Fonts).
* **Font Weights:**
  * Regular (`400`): Body text, deskripsi, paragraf artikel.
  * Medium (`500`): Navigasi menu, pill filter, meta text.
  * Semibold (`600`): Subheading, judul card, label harga, nama modul.
  * Bold (`700`): H1 Hero headline, judul detail artikel, judul section.
  * Extrabold (`800`): Angka counter statistik (`5+`, `100+`, `100%`).

### 1.3 Iconography & Brand Mark
* **Brand Logo:** Lingkaran hitam solid dengan huruf kapital serif/slab **"H"** warna putih di tengahnya.
* **Icon Set:** **Lucide Icons** (outline style) + Custom 3D Claymorphism Emojis / Assets untuk kartu "Kenapa Memilih Layanan Saya".
* **Theme Toggle Switcher:** Tombol pill di sudut kanan navbar: `☀️ Light ⌵` dengan dropdown Light / Dark Mode.

---

## 2. Layout Structure & Shared Components

### 2.1 Navigation Bar (Header)
* **Tinggi:** `h-20` (`80px`), Sticky dengan `backdrop-blur-md bg-white/90 z-50 border-b border-slate-100`.
* **Struktur Kiri-ke-Kanan:**
  1. **Brand Mark (Kiri):** Logo bulat "H".
  2. **Nav Links (Tengah-Kanan):**
     * `Beranda` (`/`)
     * `Layanan & Portfolio` (`/layanan`)
     * `Produk` (`/produk`)
     * `Artikel` (`/blog`)
     * *Active State:* Teks tebal `#0F172A` dengan underline halus atau warna navy.
  3. **Theme Switcher (Kanan):** Dropdown pill border tipis `☀️ Light ⌵`.

### 2.2 Global Footer
* **Struktur 4 Kolom:**
  * **Kolom 1 (Identitas):** Logo Bulat "H", Nama "Helmi Salsabila", Subtitle *"Your Reliable Partner for Digital & Data Solutions"*.
  * **Kolom 2 (Kontak Resmi):** Icon Telepon (`+62 69233221`), Icon Pin Lokasi (*"Based in Tangerang, Indonesia"* atau *"Bandung, Jawa Barat"*).
  * **Kolom 3 (Navigasi Perusahaan):** Link ke *Layanan & Portfolio*, *Artikel*, *Produk*.
  * **Kolom 4 (Kontak & Sosial Media):** Deretan icon sosial media bulat/outline (LinkedIn, YouTube, Facebook, Instagram, Threads, TikTok).
* **Bottom Bar:** Divider horizontal tipis + `Copyright 2026 Helmi Salsabila | All right reserved` rata tengah.

### 2.3 Section Heading Style Standar
Setiap awal section menggunakan aksen garis vertikal teal di sebelah kiri:
```html
<div class="mb-6">
  <div class="flex items-center gap-3">
    <div class="w-1.5 h-6 bg-teal-500 rounded-full"></div>
    <h2 class="text-2xl font-bold text-slate-900">Judul Section</h2>
  </div>
  <p class="text-sm text-slate-500 mt-1 pl-4.5">Deskripsi singkat penjelasan section...</p>
</div>
```

---

## 3. Spesifikasi Rinci Per Halaman (7 View Mockup)

---

### View 1: Homepage (`Home [REVISI].png`)

```
+-----------------------------------------------------------------------------------+
| [H] Logo                         Beranda  Layanan & Portfolio  Produk  Artikel [Light v] |
+-----------------------------------------------------------------------------------+
|  [ Halo, Saya Helmi Salsabila 👋 ]                                                |
|  Your Reliable Partner for                                       [ FOTO HELMI ]   |
|  Data & Digital Solutions. (Yellow Accent)                                        |
|  Masalah ditemukan. Solusi diarahkan. Pilihan terbaik direkomendasikan.           |
|  [ Kontak Saya 💬 ]                                                              |
|  Ikuti Saya di : [in] [ig] [threads]                                              |
+-----------------------------------------------------------------------------------+
| [ 5+ Tahun Pengalaman ]   |   [ 100+ Klien Sudah Percaya ]   |   [ 100% Selesai ] | (Dark Ribbon)
+-----------------------------------------------------------------------------------+
| | Layanan & Portfolio                                                             |
| [ Card 1 ]                      [ Card 2 ]                     [ Card 3 ]         |
|                                                                                   |
|                           [ Lihat Semua Layanan -> ]                              |
+-----------------------------------------------------------------------------------+
| | Produk Saya                                                                     |
| [ Product 1 ]                   [ Product 2 ]                  [ Product 3 ]      |
|                                                                                   |
|                            [ Lihat Semua Produk -> ]                              |
+-----------------------------------------------------------------------------------+
| | Testimoni Klien                                                                 |
| [ "..." Regina - FOOM ]         [ "..." Regina - FOOM ]        [ "..." Regina ]   |
|                                                                   [ < ] [ > ]     |
+-----------------------------------------------------------------------------------+
| | Artikel                                                                         |
| [Semua] [Tech] [IT Solution] [Data Analyst] [System Analyst]                      |
| [ Article 1 ]                   [ Article 2 ]                  [ Article 3 ]      |
|                                                                                   |
|                            [ Lihat Semua Artikel ]                                |
+-----------------------------------------------------------------------------------+
| | Kenapa Memilih Layanan Saya?                                                    |
| [ 🔒 Aman & Terpercaya ] [ 🏅 Kualitas Terbaik ] [ 💰 Terjangkau ] [ 🤝 Client ]  |
+-----------------------------------------------------------------------------------+
| [ Siap untuk Memulai Bekerjasama? ] | [ 01 Hubungi Saya & Sampaikan Kebutuhan   ] |
| [ Kontak Saya Sekarang ✉ ]          | [ 02 Kesepakatan, Penawaran & Pembayaran  ] |
|                                     | [ 03 Pengerjaan, Review & Revisi          ] |
|                                     | [ 04 Pelunasan & Pengiriman Hasil Akhir   ] |
+-----------------------------------------------------------------------------------+
| FOOTER (4 Kolom)                                                                  |
+-----------------------------------------------------------------------------------+
```

#### Komponen Kunci Homepage:
1. **Hero Section:**
   * Pill Badge atas: Background `#E6FAF8`, border `#99F6E4`, teks `#0F766E`.
   * H1 Headline: `text-4xl lg:text-5xl font-extrabold text-slate-900` dengan span warna emas `#F59E0B`.
   * CTA Button: `bg-[#1E3A5F] hover:bg-[#162E4A] text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium`.
   * Foto Kanan: Background garis geometris melengkung lembut dengan foto subjek berjas hitam rapi.
2. **Ribbon Bar Statistik:**
   * Container `bg-[#0B1D33] text-white py-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-700/60 rounded-xl my-8`.
   * Nilai angka `text-3xl font-extrabold text-[#F59E0B]`, label di bawahnya `text-sm text-slate-300`.
3. **Carousel Testimoni Klien:**
   * Icon petik dua `“` berwarna teal di pojok kiri atas card.
   * Footer card testimoni: Avatar bulat + Nama Klien + Logo Perusahaan (contoh: *FOOM*).
   * Tombol navigasi slide di pojok kanan bawah: `[←] [→]` dengan indikator titik dot aktif.
4. **Kenapa Memilih Layanan Saya:**
   * 4 Kolom Card dengan icon 3D Claymorphism: *Proses Aman & Terpercaya*, *Kualitas Hasil Terbaik*, *Harga Terjangkau*, *Dipercaya Banyak Client*.
5. **CTA Box "Siap untuk Memulai Bekerjasama?":**
   * Grid 2 kolom berbingkai rapi (`border border-slate-200 rounded-2xl p-8 bg-white`).
   * Kolom kanan berisi 4 box card proses kerja bernomor (`01`, `02`, `03`, `04`) dengan border outline abu-abu lembut.

---

### View 2: Halaman Layanan & Portfolio (`Layanan & Portfolio.png`)

```
+-----------------------------------------------------------------------------------+
| HEADER BANNER (Soft Aqua Tint):                                                   |
|   Layanan & Portfolio                                                             |
|   Solusi profesional untuk berbagai kebutuhan data dan digital Anda               |
|   [  🔍 Cari nama layanan...                                                    ] |
+-----------------------------------------------------------------------------------+
| FILTER SIDEBAR (Kiri 25%)      | LIST LAYANAN GRID (Kanan 75%)                    |
| Filter             Perbarui 🔄 |                                                  |
| ⌵ Kategori                     | [ Card 1 ]        [ Card 2 ]        [ Card 3 ]   |
|   [ ] Data Analyst             | [ Card 4 ]        [ Card 5 ]        [ Card 6 ]   |
|   [ ] Marketing Digital        | [ Card 7 ]        [ Card 8 ]        [ Card 9 ]   |
|   [ ] IT Solution              | [ Card 10]        [ Card 11]        [ Card 12]   |
|   [ ] Sales                    | [ Card 13]        [ Card 14]        [ Card 15]   |
| ⌵ Harga                        |                                                  |
|   ( ) Gratis (5)               |--------------------------------------------------|
|   ( ) Berbayar (812)           | Menampilkan 1-15 dari 1.250 data                 |
| ⌵ Urutkan                      | < Previous  [1]  2  3 ... 67  68  Next >         |
|   ( ) Paling Populer           |                                                  |
|   ( ) Paling Baru              |                                                  |
+-----------------------------------------------------------------------------------+
```

#### Spesifikasi Elemen Layanan Card:
* **Thumbnail Image:** Aspect ratio `16:10`, rounded top corners `rounded-t-xl`, object-cover.
* **Body:**
  * Judul Layanan: `text-base font-bold text-slate-900 line-clamp-2 mt-3`.
  * Bottom Row: Teks *"Harga Mulai"* (`text-xs text-slate-500`) berdampingan dengan `Rp200.000` (`text-sm font-bold text-emerald-600`).
* **Sidebar Filter:** Box filter putih `bg-white rounded-xl border border-slate-200 p-4` dengan accordion collapsible per kelompok filter.

---

### View 3: Detail Layanan (`[OPSI 2] Detail Layanan.png`)

```
+-----------------------------------------------------------------------------------+
| Beranda / Layanan & Portfolio / Detail                                            |
+-----------------------------------------------------------------------------------+
| MAIN CONTENT (Kiri 65%)                         | STICKY SIDEBAR (Kanan 35%)      |
|                                                 | +-----------------------------+ |
| +-------------------------+ +--------+ +------+ | | 🔒 [ Jaminan Jasa Aman ]    | |
| |                         | | Thumbs | | Thmb | | | Kerjakan kebutuhan Anda... | |
| |   LARGE PREVIEW IMAGE   | +--------+ +------+ | |                             | |
| |                         | | Thumbs | | +5 G | | | Harga Mulai     Rp200.000   | |
| +-------------------------+ +--------+ +------+ | |                             | |
|                                                 | | [    Pakai Layanan Ini    ] | |
| 3 Headphone JBL Terbaik 2026 dengan Suara Bass! | | [       Bagikan 🔗        ] | |
| ----------------------------------------------- | +-----------------------------+ |
| | Deskripsi                                     |                                 |
| Paragraf pembuka penjelasan layanan...          |                                 |
| Layanan yang saya tawarkan: (bullet points)     |                                 |
| Tools yang digunakan:                           |                                 |
| Output yang Anda dapatkan:                      |                                 |
| Cocok untuk: (Target audiens)                   |                                 |
| Keunggulan layanan saya: (Checklist ✓)          |                                 |
| Catatan: "Silakan diskusi terlebih dahulu..."   |                                 |
+-------------------------------------------------+---------------------------------+
| | Layanan Terkait Lainnya                                                         |
| [ Related Card 1 ]          [ Related Card 2 ]          [ Related Card 3 ]        |
+-----------------------------------------------------------------------------------+
```

#### Spesifikasi Komponen Detail Layanan:
1. **Galeri Multi-Gambar:**
   * 1 Gambar Utama besar di sisi kiri.
   * 4 Gambar thumbnail vertikal di sisi kanan, dengan thumbnail ke-4 memiliki overlay gelap `+5 Gambar` jika ada lebih dari 5 lampiran portofolio.
2. **Sticky Sidebar Kartu Transaksi:**
   * Container dengan aksen soft teal `bg-[#EAF8F8]/60 border border-[#BDEBE7] rounded-2xl p-6 sticky top-24`.
   * Badge icon gembok & perisai kuning/hijau.
   * Tombol CTA utama `Pakai Layanan Ini` mengarahkan langsung ke modal order / WhatsApp redirect terintegrasi dengan pesan template otomatis.

---

### View 4: Halaman Produk Digital (`Produk.png`)

```
+-----------------------------------------------------------------------------------+
| HEADER BANNER (Soft Aqua Tint):                                                   |
|   Produk                                                                          |
|   Temukan produk digital menarik yang sesuai dengan kebutuhan Anda                |
|   [  🔍 Cari nama produk...                                                     ] |
+-----------------------------------------------------------------------------------+
| FILTER SIDEBAR (Kiri 25%)      | LIST PRODUK GRID (Kanan 75%)                     |
| Filter             Perbarui 🔄 |                                                  |
| ⌵ Kategori                     | [ Product 1 ]     [ Product 2 ]     [ Product 3 ]|
| ⌵ Harga                        | [ Product 4 ]     [ Product 5 ]     [ Product 6 ]|
| ⌵ Urutkan                      | [ Product 7 ]     [ Product 8 ]     [ Product 9 ]|
|                                |--------------------------------------------------|
|                                | Menampilkan 1-15 dari 1.250 data                 |
|                                | < Previous  [1]  2  3 ... 67  68  Next >         |
+-----------------------------------------------------------------------------------+
```

#### Spesifikasi Card Produk:
* **Mockup Image:** 3D Book Cover / Digital Box Card mockup dengan shadow lembut.
* **Judul:** `[LIFETIME ACCESS] - PERSONAL BRANDING BUI..` (`font-bold text-slate-900`).
* **Footer Card:** `Rp200.000` (kiri, hijau tebal) dan `Terjual : 1.200` (kanan, abu-abu).

---

### View 5: Detail Produk Digital (`Detail Produk.png`)

```
+-----------------------------------------------------------------------------------+
| Beranda / Produk / Detail                                                         |
+-----------------------------------------------------------------------------------+
| CONTAINER PRODUK BOX (Bordered Card):                                             |
| +--------------------------+----------------------------------------------------+ |
| | [ 3D COVER PRODUCT ]     | 📊 Semua Level                                     | |
| |                          | [LIFETIME ACCESS] - PERSONAL BRANDING BUILDER      | |
| |                          | +------------------------------------------------+ | |
| |                          | | [Diskon 10%]   Rp350.000   Rp200.000           | | |
| |                          | +------------------------------------------------+ | |
| | [Thumb] [Thumb] [Thumb]  | [              Beli Produk Ini                   ] | |
| |                          | [                 Bagikan 🔗                     ] | |
| +--------------------------+----------------------------------------------------+ |
| --------------------------------------------------------------------------------- |
| | Tentang Produk                                                                  |
| Deskripsi detail produk, materi, yang didapatkan, cocok untuk...                  |
| --------------------------------------------------------------------------------- |
| | List Materi                                                                     |
| [ 01 — Personal Branding Fundamentals                                          ] |
|    📄 Apa itu personal branding?                                                  |
|    📄 Mengapa personal branding penting?                                          |
| [ 02 — Menentukan Personal Brand                                               ] |
| [ 03 — Menyusun Profil Profesional                                             ] |
+-----------------------------------------------------------------------------------+
```

#### Spesifikasi Accordion List Materi:
* Modul box border rounded `border border-slate-200 rounded-xl p-5 mb-4`.
* Judul Modul: `01 — Personal Branding Fundamentals` (`font-semibold text-slate-900`).
* Sub-materi item: Icon file `📄` + Judul materi + Tag preview jika tersedia.

---

### View 6: Halaman Blog / Artikel (`Artikel.png`)

```
+-----------------------------------------------------------------------------------+
| HEADER BANNER (Soft Aqua Tint):                                                   |
|   Artikel                                                                         |
|   Kumpulan tulisan, insight, dan pengalaman yang saya bagikan untuk Anda          |
|   [  🔍 Cari judul artikel ...                                                  ] |
+-----------------------------------------------------------------------------------+
| | Artikel Populer                                                                 |
| +------------------------------------+ +----------------------------------------+ |
| | [ HERO BANNER ARTIKEL 1 ]          | | [ HERO BANNER ARTIKEL 2 ]              | |
| | 3 Headphone JBL Terbaik 2026       | | 7 Headphone JBL Terbaik 2026           | |
| | 3 Agustus 2026                     | | 3 Agustus 2026                         | |
| +------------------------------------+ +----------------------------------------+ |
|                                                                                   |
| | Semua Artikel                                                                   |
| [Semua Kategori] [Technology] [IT Solution] [Digital Marketing] [Data Analyst]... |
|                                                                                   |
| [ Article 1 ]              [ Article 2 ]               [ Article 3 ]              |
| [ Article 4 ]              [ Article 5 ]               [ Article 6 ]              |
|                                                                                   |
| Menampilkan 1-15 dari 1.250 data        < Previous  [1]  2  3 ... 67 68  Next >   |
+-----------------------------------------------------------------------------------+
```

#### Spesifikasi Elemen Artikel:
1. **Artikel Populer (Top 2 Featured Cards):**
   * Grid 2 kolom dengan kartu besar full image background + gradient overlay gelap di bagian bawah (`bg-gradient-to-t from-black/80 via-black/30 to-transparent`).
   * Judul artikel putih bold kontras (`text-xl font-bold text-white`) + tanggal rilis di bawahnya.
2. **Filter Kategori Horizontal:**
   * Deretan tombol pill yang dapat di-scroll horizontal pada mobile screen.
   * Active State: Border `#1E3A5F`, background `#F1F5F9`, text `#1E3A5F` tebal.

---

### View 7: Detail Artikel (`Detail Artikel.png`)

```
+-----------------------------------------------------------------------------------+
| Beranda / Artikel / Detail Artikel                                                |
+-----------------------------------------------------------------------------------+
| MAIN ARTICLE BODY (Kiri 65%)                    | SIDEBAR WIDGETS (Kanan 35%)     |
|                                                 | Bagikan  [wa] [fb] [threads] [🔗]|
| 3 Headphone JBL Terbaik 2026 dengan Suara Bass! | ------------------------------- |
| 3 Agustus 2026, 19:26 WIB | 3 min read          | | Table of Content              |
| 👤 Penulis: Helmi Salsabila  👁 Sudah Dibaca 1000x | [ 01 3 Headphone JBL Terbaik...]|
|                                                 | [ 02 Mengenal Teknologi...     ]|
| +---------------------------------------------+ | Lihat Lebih Banyak ⌵            |
| |                                             | | ------------------------------- |
| |          FEATURED ARTICLE IMAGE             | | | Artikel Populer               |
| |                                             | | [TRENDING #1] Judul artikel...  |
| +---------------------------------------------+ | [TRENDING #2] Judul artikel...  |
|                                                 | [TRENDING #3] Judul artikel...  |
| Paragraf konten artikel dengan typography rapi  | | ------------------------------- |
| Heading 2, Heading 3, code blocks, quote...    | | | Eksplore Tag                  |
| Inline item showcase (Image + Price badge)...   | | [Information Tech] [Food] ... |
|                                                 | +-------------------------------+ |
| +---------------------------------------------+ |                                   |
| | ☕ Suka dengan artikel Helmi Salsabila?     | |                                   |
| | Yuk beri dukungan donasi...   [ Saweria ]   | |                                   |
| +---------------------------------------------+ |                                   |
| Bagikan: [wa] [fb] [threads] [🔗 Salin Link]    |                                   |
| ----------------------------------------------- |                                   |
| | Artikel Terkait Lainnya                       |                                   |
| [ Related 1 ]     [ Related 2 ]   [ Related 3 ] |                                   |
+-------------------------------------------------+-----------------------------------+
```

#### Spesifikasi Widget Sidebar Artikel:
1. **Top Share Row:** Tombol share instan ke WhatsApp, Facebook, Threads, dan Copy Link button.
2. **Table of Content (TOC) Box:**
   * Active Heading bernomor dengan highlight navy gelap (`bg-[#1E3A5F] text-white rounded-lg p-3`).
   * Inactive Heading berbingkai outline putih/slate (`border border-slate-200 text-slate-700`).
3. **Artikel Populer (Trending Badges):**
   * List artikel dengan badge kecil `TRENDING #1`, `TRENDING #2`, `TRENDING #3` warna teal/navy + tanggal posting.
4. **Eksplore Tag:**
   * Tag badges rounded pill berbingkai tipis abu-abu yang mengarah ke pencarian filter artikel.
5. **Saweria / Donasi Box:**
   * Box interaktif di akhir artikel dengan tombol aksen `#1E3A5F` bertuliskan **"Saweria"** untuk monetisasi kreator.

---

## 4. Admin CMS Specification (`/admin`)

Untuk mendukung 100% tampilan di atas agar dapat diedit secara dinamis, Admin CMS menyediakan antarmuka:

### 4.1 Dashboard Overview (`/admin`)
* Kartu Metrik: Total Layanan Aktif, Total Produk Digital, Total Artikel Blog, Total Pengunjung/Views.
* Quick Action: Tambah Layanan Baru, Tambah Produk Baru, Tulis Artikel Baru.

### 4.2 Layanan Manager (`/admin/services`)
* Form Input:
  * Judul Layanan
  * Slug (Auto-generated)
  * Thumbnail Gambar Utama + Upload Galeri Multi-Gambar (untuk showcase portofolio)
  * Harga Mulai (`Rp`)
  * Deskripsi Lengkap (Markdown / Rich-Text dengan formatting checklist `✓`, tools used, target audiens)
  * Status Aktif & Urutan Tampilan (*Order Index*)

### 4.3 Produk Manager (`/admin/products`)
* Form Input:
  * Judul Produk Digital
  * Kategori (*Personal Branding, Web App, UI/UX, dll*)
  * 3D Cover Mockup Upload + Galeri Preview
  * Harga Asli & Harga Diskon (dengan kalkulasi otomatis persentase diskon)
  * Level Badge (*Semua Level, Pemula, Mahir*)
  * Jumlah Terjual (Manual offset / auto increment)
  * Builder List Materi (Dukungan pembuatan Bab `01`, `02`, `03` dan list sub-materi)

### 4.4 Artikel / Blog Manager (`/admin/articles`)
* Form Input:
  * Judul Artikel
  * Featured Banner Image
  * Category Selector & Multiple Tag Input (Pills)
  * WYSIWYG TipTap Editor (Mendukung TOC auto-generator, inline images, format callout box, heading level 1-4)
  * Status: *Draft* / *Published*
  * SEO Meta: Custom Slug, Excerpt, Estimasi Reading Time

### 4.5 Site Settings & Identity (`/admin/settings`)
* Form Input:
  * Hero Headline & Subtitle
  * Counter Stats Banner (`5+`, `100+`, `100%`)
  * Data Kontak (No. WhatsApp, Alamat Kota/Provinsi)
  * Link Akun Sosial Media (LinkedIn, YouTube, Facebook, Instagram, Threads, TikTok, Saweria)
  * Testimoni Manager (Tambah/edit testimoni klien, nama, avatar, dan logo brand).

---

## 5. Checklist Verifikasi Kesesuaian Desain 100%

- [ ] **Navbar:** Logo lingkaran "H" + 4 Menu Link + Theme Switcher `☀️ Light ⌵`.
- [ ] **Hero:** Headline dengan highlight kuning "Data & Digital Solutions." + Pill badge "Halo, Saya Helmi Salsabila 👋".
- [ ] **Stats Ribbon:** Dark Navy bar dengan 3 kolom stat (`5+`, `100+`, `100%`).
- [ ] **Kenapa Memilih Layanan:** 4 kartu dengan icon 3D Claymorphism.
- [ ] **CTA Bekerjasama:** Split 2 kolom dengan 4 step berurutan (`01` s/d `04`).
- [ ] **Layanan & Portfolio:** Banner pencarian aqua + Sidebar filter + Card harga hijau `Rp200.000`.
- [ ] **Detail Layanan:** Galeri 1 besar + 4 kecil dengan overlay `+5 Gambar` + Sticky sidebar jaminan jasa aman.
- [ ] **Produk:** Grid mockup 3D cover + label harga + stat terjual (`Terjual : 1.200`).
- [ ] **Detail Produk:** Top box diskon + List materi bertingkat bab `01`, `02`, `03`.
- [ ] **Artikel:** Banner pencarian + Top 2 Artikel Populer besar + Filter kategori tags.
- [ ] **Detail Artikel:** Banner featured image + Sticky TOC + Trending #1 #2 #3 + Saweria widget donasi.
- [ ] **Footer:** 4 Kolom lengkap dengan nomor kontak resmi, alamat, link navigasi, dan 6 icon sosial media.
