-- ============================================================
-- MASTER SQL SCHEMA & SEED DATA UNTUK HELMISALSABILAL / HELSENVI
-- Presisi 100% cocok dengan Drizzle ORM (src/db/schema.ts)
-- Jalankan file ini di phpMyAdmin (Database: helsenvi_db)
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `article_tags`;
DROP TABLE IF EXISTS `articles`;
DROP TABLE IF EXISTS `service_galleries`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `product_galleries`;
DROP TABLE IF EXISTS `product_lessons`;
DROP TABLE IF EXISTS `product_modules`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `tags`;
DROP TABLE IF EXISTS `testimonials`;
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `work_steps`;
DROP TABLE IF EXISTS `value_propositions`;
DROP TABLE IF EXISTS `users`;

-- 1. Users
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','editor') NOT NULL DEFAULT 'admin',
  `avatar_url` varchar(500),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categories
CREATE TABLE `categories` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `type` enum('service','product','article','general') NOT NULL DEFAULT 'general',
  `order_index` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tags
CREATE TABLE `tags` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tags_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Services (Layanan & Portfolio)
CREATE TABLE `services` (
  `id` varchar(36) NOT NULL,
  `category_id` varchar(36),
  `title` varchar(200) NOT NULL,
  `slug` varchar(250) NOT NULL,
  `thumbnail_url` varchar(500) NOT NULL,
  `icon_name` varchar(100),
  `short_description` varchar(300) NOT NULL,
  `full_description` longtext NOT NULL,
  `features` json,
  `tools_used` json,
  `outputs_received` json,
  `target_audience` json,
  `price_starting_at` decimal(12,2),
  `is_featured` boolean NOT NULL DEFAULT false,
  `is_active` boolean NOT NULL DEFAULT true,
  `order_index` int NOT NULL DEFAULT 0,
  `views_count` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `services_slug_unique` (`slug`),
  CONSTRAINT `services_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Service Galleries
CREATE TABLE `service_galleries` (
  `id` varchar(36) NOT NULL,
  `service_id` varchar(36) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `caption` varchar(255),
  `order_index` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `service_galleries_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Products (Produk Digital)
CREATE TABLE `products` (
  `id` varchar(36) NOT NULL,
  `category_id` varchar(36),
  `title` varchar(200) NOT NULL,
  `slug` varchar(250) NOT NULL,
  `thumbnail_url` varchar(500) NOT NULL,
  `level_badge` varchar(100) NOT NULL DEFAULT 'Semua Level',
  `original_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_percent` int NOT NULL DEFAULT 0,
  `discounted_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_sales` int NOT NULL DEFAULT 0,
  `about_product` longtext NOT NULL,
  `what_you_get` json,
  `suitable_for` json,
  `live_demo_url` varchar(500),
  `purchase_link_external` varchar(500),
  `is_featured` boolean NOT NULL DEFAULT false,
  `is_published` boolean NOT NULL DEFAULT true,
  `order_index` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  CONSTRAINT `products_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Product Galleries
CREATE TABLE `product_galleries` (
  `id` varchar(36) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `order_index` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `product_galleries_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Product Modules
CREATE TABLE `product_modules` (
  `id` varchar(36) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `module_number` varchar(10) NOT NULL DEFAULT '01',
  `title` varchar(200) NOT NULL,
  `order_index` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `product_modules_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Product Lessons
CREATE TABLE `product_lessons` (
  `id` varchar(36) NOT NULL,
  `module_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `lesson_type` varchar(50) NOT NULL DEFAULT 'document',
  `order_index` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `product_lessons_module_id_product_modules_id_fk` FOREIGN KEY (`module_id`) REFERENCES `product_modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Articles
CREATE TABLE `articles` (
  `id` varchar(36) NOT NULL,
  `author_id` varchar(36) NOT NULL,
  `category_id` varchar(36),
  `title` varchar(255) NOT NULL,
  `slug` varchar(300) NOT NULL,
  `excerpt` varchar(500) NOT NULL,
  `content` longtext NOT NULL,
  `featured_image` varchar(500) NOT NULL,
  `reading_time_min` int NOT NULL DEFAULT 3,
  `views_count` int NOT NULL DEFAULT 0,
  `is_popular` boolean NOT NULL DEFAULT false,
  `is_trending` boolean NOT NULL DEFAULT false,
  `trending_rank` int,
  `is_published` boolean NOT NULL DEFAULT false,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `articles_slug_unique` (`slug`),
  CONSTRAINT `articles_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `articles_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Article Tags
CREATE TABLE `article_tags` (
  `article_id` varchar(36) NOT NULL,
  `tag_id` varchar(36) NOT NULL,
  PRIMARY KEY (`article_id`, `tag_id`),
  CONSTRAINT `article_tags_article_id_articles_id_fk` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `article_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Testimonials
CREATE TABLE `testimonials` (
  `id` varchar(36) NOT NULL,
  `client_name` varchar(150) NOT NULL,
  `client_company` varchar(150) NOT NULL,
  `avatar_url` varchar(500),
  `company_logo_url` varchar(500),
  `quote` text NOT NULL,
  `rating` int NOT NULL DEFAULT 5,
  `is_active` boolean NOT NULL DEFAULT true,
  `order_index` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Site Settings
CREATE TABLE `site_settings` (
  `id` int NOT NULL DEFAULT 1,
  `site_name` varchar(150) NOT NULL,
  `hero_title` varchar(255) NOT NULL,
  `hero_subtitle` text NOT NULL,
  `bio_description` text NOT NULL,
  `avatar_url` varchar(500),
  `resume_cv_url` varchar(500),
  `contact_phone` varchar(50) NOT NULL,
  `contact_address` varchar(255) NOT NULL,
  `saweria_url` varchar(500),
  `stats_counters` json,
  `social_links` json,
  `meta_title` varchar(255),
  `meta_description` varchar(500),
  `og_image_url` varchar(500),
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Work Steps
CREATE TABLE `work_steps` (
  `id` varchar(36) NOT NULL,
  `step_number` varchar(10) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `order_index` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Value Propositions
CREATE TABLE `value_propositions` (
  `id` varchar(36) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `icon_3d_name` varchar(100) NOT NULL,
  `order_index` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DATA INITIALIZATION (SEEDING)
-- ============================================================

-- 1. Admin User (Password: admin123)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `avatar_url`) VALUES
('user-admin-helmi-001', 'Helmi Salsabila', 'admin@helmisalsabila.com', '$2a$10$.FR2komfLP7QAbHQWRAo5eWfoLDz8F2LSIpAX7fnMDTWiLFl5ejSe', 'admin', '/assets/helmi-avatar.png');

-- 2. Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `type`, `order_index`) VALUES
('cat-data-analyst', 'Data Analyst', 'data-analyst', 'service', 1),
('cat-marketing', 'Marketing Digital', 'marketing-digital', 'service', 2),
('cat-it-solution', 'IT Solution', 'it-solution', 'service', 3),
('cat-sales', 'Sales', 'sales', 'general', 4),
('cat-system-analyst', 'System Analyst', 'system-analyst', 'article', 5),
('cat-sales-prod', 'Sales Product Digital', 'sales-product-digital', 'product', 6);

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
('tag-mom', 'Mom & Baby', 'mom-and-baby');

-- 4. Services
INSERT INTO `services` (`id`, `category_id`, `title`, `slug`, `thumbnail_url`, `icon_name`, `short_description`, `full_description`, `features`, `tools_used`, `outputs_received`, `target_audience`, `price_starting_at`, `is_featured`, `is_active`, `order_index`, `views_count`) VALUES
('srv-01', 'cat-data-analyst', 'Jasa Data Analyst (Python)', 'jasa-data-analyst-python', '/assets/service-data-analyst.jpg', 'bar-chart-2', 'Jasa Data Analyst – Olah Data, Visualisasi & Insight Profesional.', '### Jasa Data Analyst – Olah Data, Visualisasi & Insight Profesional\n\nPunya data tapi bingung mengolahnya jadi insight yang jelas? Saya siap membantu Anda mengubah data menjadi informasi yang rapi, mudah dipahami, dan siap digunakan.\n\nCocok untuk berbagai kebutuhan seperti bisnis, laporan, penelitian, maupun project pribadi.\n\n#### Layanan yang saya tawarkan:\n- Data cleaning & preprocessing\n- Exploratory Data Analysis (EDA)\n- Visualisasi data (grafik/chart)\n- Analisis tren & pola data\n- Insight & kesimpulan data\n- Pengolahan data Excel / CSV\n- Analisis menggunakan Python (opsional)\n\n#### Tools yang digunakan:\n- Python\n- Google Colab\n\n#### Output yang Anda dapatkan:\n- File data yang sudah rapi (Excel / CSV)\n- Visualisasi grafik profesional\n- Insight & summary yang mudah dipahami\n- File analisis (.ipynb)\n\n#### Cocok untuk:\n- Mahasiswa (tugas, skripsi, thesis)\n- Pebisnis / UMKM\n- Startup & freelancer\n- Penelitian & laporan\n- Siapa saja yang memiliki data dan ingin diolah secara profesional', '["Data cleaning & preprocessing", "Exploratory Data Analysis (EDA)", "Visualisasi grafik interaktif", "Insight & kesimpulan data actionable"]', '["Python", "Pandas", "Google Colab", "Seaborn / Matplotlib"]', '["File data bersih (Excel/CSV)", "Visualisasi grafik", "Laporan insight & ringkasan", "Source code analisis (.ipynb)"]', '["Mahasiswa & Peneliti", "Pebisnis & Pemilik UMKM", "Startup & Profesional"]', 150000.00, 1, 1, 1, 240),

('srv-02', 'cat-marketing', 'Digital Marketing & Social Media Strategy', 'digital-marketing-social-media-strategy', '/assets/service-marketing.jpg', 'trending-up', 'Tingkatkan jangkauan pasar dan conversion rate bisnis Anda melalui strategi terukur.', '### Digital Marketing & Social Media Strategy\n\nBantu brand dan produk Anda dikenal lebih luas oleh audiens target yang relevan dengan strategi pemasaran digital berbasis data analitik.\n\n#### Layanan yang diberikan:\n- Audit media sosial & competitor analysis\n- Content planning & editorial calendar bulanan\n- Meta Ads & TikTok Ads setup & optimization\n- Analisis performa campaign & reporting', '["Audit & riset kompetitor", "Social media planning & calendar", "Setup Facebook & Instagram Ads", "Analisis performa & evaluasi mingguan"]', '["Meta Ads Manager", "Canva", "Google Analytics", "Notion"]', '["Dokumen audit brand", "Kalender konten 30 hari", "Laporan performa iklan"]', '["Pemilik Brand / Olshop", "Perusahaan B2B & B2C", "Agensi Kreatif"]', 300000.00, 1, 1, 2, 185),

('srv-03', 'cat-it-solution', 'IT Solution & Custom Web Application', 'it-solution-custom-web-application', '/assets/service-it.jpg', 'code', 'Bangun solusi aplikasi web kustom untuk mengotomasi alur kerja dan operasional bisnis.', '### IT Solution & Custom Web Application\n\nKembangkan aplikasi web internal, sistem kasir/POS, dashboard monitoring, atau portal kustom yang disesuaikan persis dengan alur kerja tim Anda.\n\n#### Keunggulan solusi:\n- Desain modern, bersih, dan responsif (HP & Laptop)\n- Integrasi database cepat dan handal\n- Arsitektur aman dan mudah dikembangkan', '["Full-stack custom development", "Database design & modeling", "REST API integration", "Deployment & domain hosting setup"]', '["Next.js", "React", "TypeScript", "Tailwind CSS", "MySQL"]', '["Aplikasi web live", "Source code repositori", "Panduan penggunaan teknis"]', '["Perusahaan & Bisnis", "Instansi & Organisasi", "Startup Early Stage"]', 1500000.00, 1, 1, 3, 310);

-- 5. Service Galleries
INSERT INTO `service_galleries` (`id`, `service_id`, `image_url`, `caption`, `order_index`) VALUES
('sg-01', 'srv-01', '/assets/service-data-analyst.jpg', 'Preview Dashboard Python Colab', 1),
('sg-02', 'srv-02', '/assets/service-marketing.jpg', 'Preview Social Media Campaign', 1),
('sg-03', 'srv-03', '/assets/service-it.jpg', 'Preview Custom Web Application', 1);

-- 6. Products
INSERT INTO `products` (`id`, `category_id`, `title`, `slug`, `thumbnail_url`, `level_badge`, `original_price`, `discount_percent`, `discounted_price`, `total_sales`, `about_product`, `what_you_get`, `suitable_for`, `live_demo_url`, `purchase_link_external`, `is_featured`, `is_published`, `order_index`) VALUES
('prd-01', 'cat-sales-prod', 'Template Spreadsheet Financial Planner & Budgeting 2026', 'template-spreadsheet-financial-planner-2026', '/assets/product-financial-planner.jpg', 'Semua Level', 99000.00, 51, 49000.00, 126, 'Template Google Sheets profesional siap pakai untuk mengatur cashflow harian, tabungan, pelunasan hutang, dan proyeksi investasi bulanan secara otomatis dengan visual grafik yang cantik.', '["Formula otomatis (tanpa perlu coding)", "Dashboard visual grafik interaktif", "Kategori pengeluaran dinamis", "Support Google Sheets & Microsoft Excel"]', '["Pekerja profesional", "Ibu rumah tangga", "Freelancer & Pemilik Bisnis"]', 'https://docs.google.com/spreadsheets/d/sample', 'https://saweria.co/helmisalsabila', 1, 1, 1),

('prd-02', 'cat-sales-prod', 'Mastering Data Visualization with Python & Google Colab', 'mastering-data-visualization-python-colab', '/assets/product-python-course.jpg', 'Pemula', 199000.00, 50, 99000.00, 84, 'E-Course interaktif dan materi notebook siap jalankan untuk belajar mengolah data mentah menjadi grafik presentasi kelas profesional menggunakan Python, Pandas, dan Seaborn.', '["15+ Notebook studi kasus nyata", "Cheat sheet syntax visualisasi", "Akses grup diskusi eksklusif", "Sertifikat penyelesaian e-course"]', '["Mahasiswa & Fresh Graduate", "Data Analyst Pemula", "Professional yang ingin upgrade skill"]', 'https://colab.research.google.com/sample', 'https://saweria.co/helmisalsabila', 1, 1, 2);

-- 7. Product Modules
INSERT INTO `product_modules` (`id`, `product_id`, `module_number`, `title`, `order_index`) VALUES
('mod-01', 'prd-02', '01', 'Modul 1: Fondasi Dasar Python untuk Analisis Data', 1),
('mod-02', 'prd-02', '02', 'Modul 2: Eksplorasi & Visualisasi Lanjutan', 2);

-- 8. Product Lessons
INSERT INTO `product_lessons` (`id`, `module_id`, `title`, `lesson_type`, `order_index`) VALUES
('les-01', 'mod-01', 'Pengenalan Lingkungan Google Colab & Import Library', 'document', 1),
('les-02', 'mod-01', 'Teknik Data Cleaning & Filtering dengan Pandas', 'document', 2),
('les-03', 'mod-02', 'Merancang Bar Chart & Line Chart yang Komunikatif', 'document', 1),
('les-04', 'mod-02', 'Mengekspor Grafik High-Resolution untuk Laporan', 'document', 2);

-- 9. Articles
INSERT INTO `articles` (`id`, `author_id`, `category_id`, `title`, `slug`, `excerpt`, `content`, `featured_image`, `reading_time_min`, `views_count`, `is_popular`, `is_trending`, `trending_rank`, `is_published`, `published_at`) VALUES
('art-01', 'user-admin-helmi-001', 'cat-data-analyst', 'Cara Memilih Visualisasi Data yang Tepat untuk Presentasi Eksekutif', 'cara-memilih-visualisasi-data-yang-tepat', 'Banyak orang membuat grafik yang rumit tapi sulit dipahami manajemen. Simak panduan praktis memilih jenis chart yang tepat.', '<h2>Pendahuluan</h2><p>Menampilkan data bukan sekadar memasukkan angka ke dalam diagram pie atau chart warna-warni. Tantangan utamanya adalah bagaimana data tersebut bisa <strong>berbicara</strong> dan membantu pemangku kepentingan mengambil keputusan dengan cepat.</p><h3>1. Gunakan Bar Chart untuk Perbandingan Kategori</h3><p>Ketika Anda membandingkan lebih dari 3 kategori, hindari pie chart. Bar chart horizontal jauh lebih nyaman dibaca mata manusia.</p><h3>2. Line Chart untuk Tren Berkelanjutan</h3><p>Tren pendapatan per kuartal atau performa traffic harian selalu paling efektif digambarkan dengan diagram garis berkesinambungan.</p><h3>Kesimpulan</h3><p>Kunci presentasi yang sukses adalah kesederhanaan. Fokus pada pesan utama yang ingin disampaikan oleh angka Anda.</p>', '/assets/article-data-viz.jpg', 4, 320, 1, 1, 1, 1, NOW()),

('art-02', 'user-admin-helmi-001', 'cat-it-solution', 'Mengapa Next.js dan Tailwind Jadi Pilihan Utama Pengembangan Web Modern di 2026', 'nextjs-tailwind-pilihan-pengembangan-web-2026', 'Kombinasi performa Server-Side Rendering Next.js dengan fleksibilitas Utility-first Tailwind CSS memberikan efisiensi tinggi.', '<h2>Evolusi Web Modern</h2><p>Dalam dunia pengembangan web yang bergerak sangat dinamis, kecepatan loading dan efisiensi penulisan kode adalah prioritas nomor satu.</p><h3>Keunggulan App Router Next.js</h3><p>Dengan App Router, server-side caching dan dynamic rendering dapat dikonfigurasi per komponen, memangkas ukuran JavaScript bundle yang harus diunduh klien di peramban.</p><h3>Desain Responsif Cepat dengan Tailwind</h3><p>Menulis CSS langsung pada markup HTML menghilangkan friksi perpindahan antar file styling serta mencegah timbulnya dead CSS code di produksi.</p>', '/assets/article-nextjs.jpg', 5, 215, 1, 0, NULL, 1, NOW()),

('art-03', 'user-admin-helmi-001', 'cat-marketing', '5 Kesalahan Umum Pemilik Bisnis Saat Menjalankan Iklan Berbayar', '5-kesalahan-umum-iklan-berbayar-digital', 'Sudah bakar uang iklan tapi konversi tetap minim? Kenali penyebab utamanya dan langkah perbaikannya.', '<h2>Fokus pada Konversi, Bukan Sekadar Tayangan</h2><p>Banyak pengiklan pemula terjebak pada metrik kesombongan (vanity metrics) seperti jumlah likes dan views, tanpa memperhatikan funnel konversi sesungguhnya.</p><h3>1. Halaman Landing Page Tidak Sesuai Iklan</h3><p>Pastikan pesan pada iklan (copywriting dan gambar) selaras langsung dengan halaman produk yang dibuka calon pelanggan.</p><h3>2. Penargetan Terlalu Luas</h3><p>Menargetkan jutaan orang tanpa kriteria minat dan demografi yang jelas hanya akan menguras saldo iklan Anda dalam sekejap.</p>', '/assets/article-marketing.jpg', 3, 178, 0, 1, 2, 1, NOW());

-- 10. Article Tags
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES
('art-01', 'tag-it'),
('art-01', 'tag-si'),
('art-02', 'tag-it'),
('art-02', 'tag-remote'),
('art-03', 'tag-dm');

-- 11. Testimonials
INSERT INTO `testimonials` (`id`, `client_name`, `client_company`, `avatar_url`, `company_logo_url`, `quote`, `rating`, `is_active`, `order_index`) VALUES
('tst-01', 'Budi Santoso', 'Kopi Senja Nusantara', '/assets/client-budi.jpg', NULL, 'Analisis data penjualan dari Mas Helmi sangat membuka mata kami. Kami jadi tahu produk mana yang menghasilkan margin terbesar dan mana yang justru membebani inventori.', 5, 1, 1),
('tst-02', 'Dewi Anggraini', 'EduTech Indonesia', '/assets/client-dewi.jpg', NULL, 'Kerja sama yang sangat memuaskan. Solusi web yang dibangun cepat, responsif, dan tim supportnya sangat komunikatif dalam memberikan rekomendasi terbaik.', 5, 1, 2),
('tst-03', 'Rian Pratama', 'Logistik Maju Bersama', '/assets/client-rian.jpg', NULL, 'Dashboard spreadsheet otomatisnya benar-benar menghemat waktu rekap tim kami hingga 5 jam per minggu. Recommended banget!', 5, 1, 3);

-- 12. Site Settings
INSERT INTO `site_settings` (`id`, `site_name`, `hero_title`, `hero_subtitle`, `bio_description`, `avatar_url`, `resume_cv_url`, `contact_phone`, `contact_address`, `saweria_url`, `stats_counters`, `social_links`, `meta_title`, `meta_description`, `og_image_url`)
VALUES (
  1,
  'Helmi Salsabila',
  'Data & Digital Solutions.',
  'Masalah ditemukan. Solusi diarahkan. Pilihan terbaik direkomendasikan.',
  'Your Reliable Partner for Digital & Data Solutions',
  '/assets/helmi-photo.png',
  '/resume-helmi.pdf',
  '+6269233221',
  'Tangerang, Banten, Indonesia',
  'https://saweria.co/helmisalsabila',
  '{"years": "5+", "clients": "100+", "projects": "100%"}',
  '{"linkedin": "https://linkedin.com/in/helmisalsabila", "instagram": "https://instagram.com/helmisalsabila", "threads": "https://threads.net/@helmisalsabila", "youtube": "https://youtube.com/@helmisalsabila", "facebook": "https://facebook.com/helmisalsabila", "tiktok": "https://tiktok.com/@helmisalsabila", "dribbble": "https://dribbble.com"}',
  'Helmi Salsabila | Your Reliable Partner for Data & Digital Solutions',
  'Portofolio & Solusi Data Analytics, Digital Marketing, IT Solutions, dan Produk Digital berstandar tinggi.',
  '/assets/og-image.jpg'
);

-- 13. Work Steps
INSERT INTO `work_steps` (`id`, `step_number`, `title`, `description`, `order_index`) VALUES
('stp-01', '01', 'Konsultasi & Diskusi Kebutuhan', 'Sampaikan permasalahan, sasaran, atau ide proyek yang ingin Anda wujudkan secara terbuka.', 1),
('stp-02', '02', 'Perancangan Solusi & Kesepakatan', 'Kami formulasikan solusi terukur, estimasi timeline, dan penawaran transparan tanpa biaya tersembunyi.', 2),
('stp-03', '03', 'Eksekusi & Iterasi Berkala', 'Pengerjaan dilakukan dengan standar kualitas tinggi disertai update progress berkala.', 3),
('stp-04', '04', 'Delivery Hasil & Panduan', 'Penyerahan file, source code, atau hasil analisis disertai panduan lengkap siap pakai.', 4);

-- 14. Value Propositions
INSERT INTO `value_propositions` (`id`, `title`, `description`, `icon_3d_name`, `order_index`) VALUES
('val-01', 'Proses Aman & Terpercaya', 'Setiap pekerjaan dijalankan dengan kesepakatan yang jelas sejak awal. Data dan file Anda juga dijaga kerahasiaannya.', 'lock', 1),
('val-02', 'Kualitas Hasil Terbaik', 'Setiap detail dikerjakan dengan teliti & penuh tanggung jawab, memastikan hasilnya benar-benar sesuai kebutuhan.', 'medal', 2),
('val-03', 'Harga Terjangkau', 'Harga terjangkau sesuai cakupan pekerjaan, tanpa biaya tersembunyi maupun mengorbankan kualitas.', 'banknote', 3),
('val-04', 'Dipercaya Banyak Client', 'Rekam jejak pengerjaan dari berbagai klien menjadi bukti nyata konsistensi kualitas dan layanan yang diberikan.', 'handshake', 4);

SET FOREIGN_KEY_CHECKS = 1;
