-- ============================================================
-- SQL Seed Data Lengkap untuk Portfolio Helmi Salsabila
-- Import file ini di phpMyAdmin cPanel (Database: helsenvi_db)
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Admin User
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `avatar_url`)
VALUES ('user-admin-helmi-001', 'Helmi Salsabila', 'admin@helmisalsabila.com', '$2b$10$u13vX1Z3e0WlX3VnfxwQ8e723WwK4R48N1c37dJk9hL0o5LqV7eWy', 'admin', '/assets/helmi-avatar.png')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `type`, `order_index`) VALUES
('cat-data-analyst', 'Data Analyst', 'data-analyst', 'general', 1),
('cat-marketing', 'Marketing Digital', 'marketing-digital', 'general', 2),
('cat-it-solution', 'IT Solution', 'it-solution', 'general', 3),
('cat-sales', 'Sales', 'sales', 'general', 4),
('cat-system-analyst', 'System Analyst', 'system-analyst', 'article', 5),
('cat-sales-prod', 'Sales Product Digital', 'sales-product-digital', 'product', 6)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. Tags
INSERT INTO `tags` (`id`, `name`, `slug`) VALUES
('tag-it', 'Information Technology', 'information-technology'),
('tag-si', 'Sistem Informasi', 'sistem-informasi'),
('tag-food', 'Food', 'food'),
('tag-travel', 'Traveling', 'traveling'),
('tag-life', 'Life Style', 'life-style'),
('tag-remote', 'Remote Working', 'remote-working'),
('tag-dm', 'Digital Marketing', 'digital-marketing'),
('tag-fulltime', 'Fulltime Work', 'fulltime-work'),
('tag-mom', 'Mom & Baby', 'mom-and-baby')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 4. Services
INSERT INTO `services` (`id`, `category_id`, `title`, `slug`, `thumbnail_url`, `icon_name`, `short_description`, `full_description`, `features`, `tools_used`, `outputs_received`, `target_audience`, `price_starting_at`, `price_subtext`, `is_featured`, `is_active`, `order_index`, `views_count`) VALUES
('srv-01', 'cat-data-analyst', 'Jasa Data Analyst (Python)', 'jasa-data-analyst-python', '/assets/service-data-analyst.jpg', 'bar-chart-2', 'Jasa Data Analyst – Olah Data, Visualisasi & Insight Profesional.', '### Jasa Data Analyst – Olah Data, Visualisasi & Insight Profesional\n\nPunya data tapi bingung mengolahnya jadi insight yang jelas? Saya siap membantu Anda mengubah data menjadi informasi yang rapi, mudah dipahami, dan siap digunakan.\n\nCocok untuk berbagai kebutuhan seperti bisnis, laporan, penelitian, maupun project pribadi.\n\n#### Layanan yang saya tawarkan:\n- Data cleaning & preprocessing\n- Exploratory Data Analysis (EDA)\n- Visualisasi data (grafik/chart)\n- Analisis tren & pola data\n- Insight & kesimpulan data\n- Pengolahan data Excel / CSV\n- Analisis menggunakan Python (opsional)\n\n#### Tools yang digunakan:\n- Python\n- Google Colab\n\n#### Output yang Anda dapatkan:\n- File data yang sudah rapi (Excel / CSV)\n- Visualisasi grafik profesional\n- Insight & summary yang mudah dipahami\n- File analisis (.ipynb)\n\n#### Cocok untuk:\n- Mahasiswa (tugas, skripsi, thesis)\n- Pebisnis / UMKM\n- Startup & freelancer\n- Penelitian & laporan\n- Siapa saja yang memiliki data dan ingin diolah secara profesional', '["Data cleaning & preprocessing", "Exploratory Data Analysis (EDA)", "Visualisasi grafik interaktif", "Insight & kesimpulan data actionable"]', '["Python", "Pandas", "Google Colab", "Seaborn / Matplotlib"]', '["File data bersih (Excel/CSV)", "Visualisasi grafik", "Laporan insight & ringkasan", "Source code analisis (.ipynb)"]', '["Mahasiswa & Peneliti", "Pebisnis & Pemilik UMKM", "Startup & Profesional"]', 150000.00, 'Harga fleksibel sesuai kompleksitas', 1, 1, 1, 240),

('srv-02', 'cat-marketing', 'Digital Marketing & Social Media Strategy', 'digital-marketing-social-media-strategy', '/assets/service-marketing.jpg', 'trending-up', 'Tingkatkan jangkauan pasar dan conversion rate bisnis Anda melalui strategi terukur.', '### Digital Marketing & Social Media Strategy\n\nBantu brand dan produk Anda dikenal lebih luas oleh audiens target yang relevan dengan strategi pemasaran digital berbasis data analitik.\n\n#### Layanan yang diberikan:\n- Audit media sosial & competitor analysis\n- Content planning & editorial calendar bulanan\n- Meta Ads & TikTok Ads setup & optimization\n- Analisis performa campaign & reporting', '["Audit & riset kompetitor", "Social media planning & calendar", "Setup Facebook & Instagram Ads", "Analisis performa & evaluasi mingguan"]', '["Meta Ads Manager", "Canva", "Google Analytics", "Notion"]', '["Dokumen audit brand", "Kalender konten 30 hari", "Laporan performa iklan"]', '["Pemilik Brand / Olshop", "Perusahaan B2B & B2C", "Agensi Kreatif"]', 300000.00, 'Mulai dari paket starter', 1, 1, 2, 185),

('srv-03', 'cat-it-solution', 'IT Solution & Custom Web Application', 'it-solution-custom-web-application', '/assets/service-it.jpg', 'code', 'Bangun solusi aplikasi web kustom untuk mengotomasi alur kerja dan operasional bisnis.', '### IT Solution & Custom Web Application\n\nKembangkan aplikasi web internal, sistem kasir/POS, dashboard monitoring, atau portal kustom yang disesuaikan persis dengan alur kerja tim Anda.\n\n#### Keunggulan solusi:\n- Desain modern, bersih, dan responsif (HP & Laptop)\n- Integrasi database cepat dan handal\n- Arsitektur aman dan mudah dikembangkan', '["Full-stack custom development", "Database design & modeling", "REST API integration", "Deployment & domain hosting setup"]', '["Next.js", "React", "TypeScript", "Tailwind CSS", "MySQL"]', '["Aplikasi web live", "Source code repositori", "Panduan penggunaan teknis"]', '["Perusahaan & Bisnis", "Instansi & Organisasi", "Startup Early Stage"]', 1500000.00, 'Penawaran proyek kustom', 1, 1, 3, 310)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 5. Products
INSERT INTO `products` (`id`, `category_id`, `title`, `slug`, `thumbnail_url`, `level_badge`, `badge_text`, `original_price`, `discounted_price`, `discount_percent`, `rating`, `reviews_count`, `total_sales`, `about_product`, `features`, `download_url`, `is_featured`, `is_published`, `order_index`) VALUES
('prd-01', 'cat-sales-prod', 'Template Spreadsheet Financial Planner & Budgeting 2026', 'template-spreadsheet-financial-planner-2026', '/assets/product-financial-planner.jpg', 'Semua Level', 'Best Seller', 99000.00, 49000.00, 51, 4.90, 48, 126, 'Template Google Sheets profesional siap pakai untuk mengatur cashflow harian, tabungan, pelunasan hutang, dan proyeksi investasi bulanan secara otomatis dengan visual grafik yang cantik.', '["Formula otomatis (tanpa perlu coding)", "Dashboard visual grafik interaktif", "Kategori pengeluaran dinamis", "Support Google Sheets & Microsoft Excel"]', 'https://drive.google.com/sample-financial-planner', 1, 1, 1),

('prd-02', 'cat-sales-prod', 'Mastering Data Visualization with Python & Google Colab', 'mastering-data-visualization-python-colab', '/assets/product-python-course.jpg', 'Pemula', 'Populer', 199000.00, 99000.00, 50, 4.95, 32, 84, 'E-Course interaktif dan materi notebook siap jalankan untuk belajar mengolah data mentah menjadi grafik presentasi kelas profesional menggunakan Python, Pandas, dan Seaborn.', '["15+ Notebook studi kasus nyata", "Cheat sheet syntax visualisasi", "Akses grup diskusi eksklusif", "Sertifikat penyelesaian e-course"]', 'https://drive.google.com/sample-python-course', 1, 1, 2)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 6. Product Modules & Lessons
INSERT INTO `product_modules` (`id`, `product_id`, `title`, `order_index`) VALUES
('mod-01', 'prd-02', 'Modul 1: Fondasi Dasar Python untuk Analisis Data', 1),
('mod-02', 'prd-02', 'Modul 2: Eksplorasi & Visualisasi Lanjutan', 2)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

INSERT INTO `product_lessons` (`id`, `module_id`, `title`, `duration`, `order_index`) VALUES
('les-01', 'mod-01', 'Pengenalan Lingkungan Google Colab & Import Library', '15 Menit', 1),
('les-02', 'mod-01', 'Teknik Data Cleaning & Filtering dengan Pandas', '25 Menit', 2),
('les-03', 'mod-02', 'Merancang Bar Chart & Line Chart yang Komunikatif', '30 Menit', 1),
('les-04', 'mod-02', 'Mengekspor Grafik High-Resolution untuk Laporan', '20 Menit', 2)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 7. Articles
INSERT INTO `articles` (`id`, `author_id`, `category_id`, `title`, `slug`, `excerpt`, `content`, `featured_image`, `reading_time_min`, `views_count`, `is_popular`, `is_trending`, `trending_rank`, `is_published`, `published_at`) VALUES
('art-01', 'user-admin-helmi-001', 'cat-data-analyst', 'Cara Memilih Visualisasi Data yang Tepat untuk Presentasi Eksekutif', 'cara-memilih-visualisasi-data-yang-tepat', 'Banyak orang membuat grafik yang rumit tapi sulit dipahami manajemen. Simak panduan praktis memilih jenis chart yang tepat.', '<h2>Pendahuluan</h2><p>Menampilkan data bukan sekadar memasukkan angka ke dalam diagram pie atau chart warna-warni. Tantangan utamanya adalah bagaimana data tersebut bisa <strong>berbicara</strong> dan membantu pemangku kepentingan mengambil keputusan dengan cepat.</p><h3>1. Gunakan Bar Chart untuk Perbandingan Kategori</h3><p>Ketika Anda membandingkan lebih dari 3 kategori, hindari pie chart. Bar chart horizontal jauh lebih nyaman dibaca mata manusia.</p><h3>2. Line Chart untuk Tren Berkelanjutan</h3><p>Tren pendapatan per kuartal atau performa traffic harian selalu paling efektif digambarkan dengan diagram garis berkesinambungan.</p><h3>Kesimpulan</h3><p>Kunci presentasi yang sukses adalah kesederhanaan. Fokus pada pesan utama yang ingin disampaikan oleh angka Anda.</p>', '/assets/article-data-viz.jpg', 4, 320, 1, 1, 1, 1, NOW()),

('art-02', 'user-admin-helmi-001', 'cat-it-solution', 'Mengapa Next.js dan Tailwind Jadi Pilihan Utama Pengembangan Web Modern di 2026', 'nextjs-tailwind-pilihan-pengembangan-web-2026', 'Kombinasi performa Server-Side Rendering Next.js dengan fleksibilitas Utility-first Tailwind CSS memberikan efisiensi tinggi.', '<h2>Evolusi Web Modern</h2><p>Dalam dunia pengembangan web yang bergerak sangat dinamis, kecepatan loading dan efisiensi penulisan kode adalah prioritas nomor satu.</p><h3>Keunggulan App Router Next.js</h3><p>Dengan App Router, server-side caching dan dynamic rendering dapat dikonfigurasi per komponen, memangkas ukuran JavaScript bundle yang harus diunduh klien di peramban.</p><h3>Desain Responsif Cepat dengan Tailwind</h3><p>Menulis CSS langsung pada markup HTML menghilangkan friksi perpindahan antar file styling serta mencegah timbulnya dead CSS code di produksi.</p>', '/assets/article-nextjs.jpg', 5, 215, 1, 0, NULL, 1, NOW()),

('art-03', 'user-admin-helmi-001', 'cat-marketing', '5 Kesalahan Umum Pemilik Bisnis Saat Menjalankan Iklan Berbayar', '5-kesalahan-umum-iklan-berbayar-digital', 'Sudah bakar uang iklan tapi konversi tetap minim? Kenali penyebab utamanya dan langkah perbaikannya.', '<h2>Fokus pada Konversi, Bukan Sekadar Tayangan</h2><p>Banyak pengiklan pemula terjebak pada metrik kesombongan (vanity metrics) seperti jumlah likes dan views, tanpa memperhatikan funnel konversi sesungguhnya.</p><h3>1. Halaman Landing Page Tidak Sesuai Iklan</h3><p>Pastikan pesan pada iklan (copywriting dan gambar) selaras langsung dengan halaman produk yang dibuka calon pelanggan.</p><h3>2. Penargetan Terlalu Luas</h3><p>Menargetkan jutaan orang tanpa kriteria minat dan demografi yang jelas hanya akan menguras saldo iklan Anda dalam sekejap.</p>', '/assets/article-marketing.jpg', 3, 178, 0, 1, 2, 1, NOW())
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 8. Testimonials
INSERT INTO `testimonials` (`id`, `client_name`, `client_role`, `client_company`, `avatar_url`, `rating`, `content`, `is_featured`, `order_index`) VALUES
('tst-01', 'Budi Santoso', 'Founder', 'Kopi Senja Nusantara', '/assets/client-budi.jpg', 5, 'Analisis data penjualan dari Mas Helmi sangat membuka mata kami. Kami jadi tahu produk mana yang menghasilkan margin terbesar dan mana yang justru membebani inventori.', 1, 1),
('tst-02', 'Dewi Anggraini', 'Digital Marketing Lead', 'EduTech Indonesia', '/assets/client-dewi.jpg', 5, 'Kerja sama yang sangat memuaskan. Solusi web yang dibangun cepat, responsif, dan tim supportnya sangat komunikatif dalam memberikan rekomendasi terbaik.', 1, 2),
('tst-03', 'Rian Pratama', 'Operations Manager', 'Logistik Maju Bersama', '/assets/client-rian.jpg', 5, 'Dashboard spreadsheet otomatisnya benar-benar menghemat waktu rekap tim kami hingga 5 jam per minggu. Recommended banget!', 1, 3)
ON DUPLICATE KEY UPDATE `client_name` = VALUES(`client_name`);

-- 9. Work Steps
INSERT INTO `work_steps` (`id`, `step_number`, `title`, `description`, `order_index`) VALUES
('stp-01', 1, 'Konsultasi & Diskusi Kebutuhan', 'Sampaikan permasalahan, sasaran, atau ide proyek yang ingin Anda wujudkan secara terbuka.', 1),
('stp-02', 2, 'Perancangan Solusi & Kesepakatan', 'Kami formulasikan solusi terukur, estimasi timeline, dan penawaran transparan tanpa biaya tersembunyi.', 2),
('stp-03', 3, 'Eksekusi & Iterasi Berkala', 'Pengerjaan dilakukan dengan standar kualitas tinggi disertai update progress berkala.', 3),
('stp-04', 4, 'Delivery Hasil & Panduan', 'Penyerahan file, source code, atau hasil analisis disertai panduan lengkap siap pakai.', 4)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 10. Value Propositions
INSERT INTO `value_propositions` (`id`, `icon_name`, `title`, `description`, `order_index`) VALUES
('val-01', 'lock', 'Proses Aman & Terpercaya', 'Setiap pekerjaan dijalankan dengan kesepakatan yang jelas sejak awal. Data dan file Anda juga dijaga kerahasiaannya.', 1),
('val-02', 'medal', 'Kualitas Hasil Terbaik', 'Setiap detail dikerjakan dengan teliti & penuh tanggung jawab, memastikan hasilnya benar-benar sesuai kebutuhan.', 2),
('val-03', 'banknote', 'Harga Terjangkau', 'Harga terjangkau sesuai cakupan pekerjaan, tanpa biaya tersembunyi maupun mengorbankan kualitas.', 3),
('val-04', 'handshake', 'Dipercaya Banyak Client', 'Rekam jejak pengerjaan dari berbagai klien menjadi bukti nyata konsistensi kualitas dan layanan yang diberikan.', 4)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 11. Site Settings
INSERT INTO `site_settings` (`id`, `site_name`, `tagline`, `hero_title`, `hero_subtitle`, `contact_email`, `contact_phone`, `contact_address`, `saweria_url`, `stats_counters`, `social_links`, `meta_title`, `meta_description`, `og_image_url`)
VALUES (
  1,
  'Helmi Salsabila',
  'Data & Digital Solutions',
  'Data & Digital Solutions.',
  'Masalah ditemukan. Solusi diarahkan. Pilihan terbaik direkomendasikan.',
  'contact@helsenvi.com',
  '+628123456789',
  'Tangerang, Banten, Indonesia',
  'https://saweria.co/helmisalsabila',
  '{"years": "5+", "clients": "100+", "projects": "100%"}',
  '{"linkedin": "https://linkedin.com", "instagram": "https://instagram.com", "threads": "https://threads.net", "dribbble": "https://dribbble.com"}',
  'Helmi Salsabila | Your Reliable Partner for Data & Digital Solutions',
  'Portofolio & Solusi Data Analytics, Digital Marketing, IT Solutions, dan Produk Digital berstandar tinggi.',
  '/assets/og-image.jpg'
)
ON DUPLICATE KEY UPDATE `site_name` = VALUES(`site_name`);

SET FOREIGN_KEY_CHECKS = 1;
