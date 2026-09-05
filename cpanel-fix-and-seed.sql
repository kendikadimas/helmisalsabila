-- ============================================================
-- SQL PATCH & SEED LENGKAP UNTUK HELMISALSABILA / HELSENVI
-- Menyesuaikan skema tabel persis dengan Drizzle ORM & mengisi data
-- Jalankan query ini di phpMyAdmin (Database: helsenvi_db)
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Update Categories agar terdeteksi di filter Layanan & Produk
INSERT INTO `categories` (`id`, `name`, `slug`, `type`, `order_index`) VALUES
('cat-data-analyst', 'Data Analyst', 'data-analyst', 'service', 1),
('cat-marketing', 'Marketing Digital', 'marketing-digital', 'service', 2),
('cat-it-solution', 'IT Solution', 'it-solution', 'service', 3),
('cat-sales', 'Sales', 'sales', 'general', 4),
('cat-system-analyst', 'System Analyst', 'system-analyst', 'article', 5),
('cat-sales-prod', 'Sales Product Digital', 'sales-product-digital', 'product', 6)
ON DUPLICATE KEY UPDATE 
  `name` = VALUES(`name`),
  `type` = VALUES(`type`);

-- 2. Sesuaikan Tabel Products agar memiliki kolom yang dicari oleh Drizzle ORM
DROP TABLE IF EXISTS `product_galleries`;
DROP TABLE IF EXISTS `product_lessons`;
DROP TABLE IF EXISTS `product_modules`;
DROP TABLE IF EXISTS `products`;

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

CREATE TABLE `product_lessons` (
  `id` varchar(36) NOT NULL,
  `module_id` varchar(36) NOT NULL,
  `title` varchar(200) NOT NULL,
  `duration` varchar(50),
  `order_index` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `product_lessons_module_id_product_modules_id_fk` FOREIGN KEY (`module_id`) REFERENCES `product_modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_galleries` (
  `id` varchar(36) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `order_index` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `product_galleries_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Masukkan Data Layanan (Services)
INSERT INTO `services` (`id`, `category_id`, `title`, `slug`, `thumbnail_url`, `icon_name`, `short_description`, `full_description`, `features`, `tools_used`, `outputs_received`, `target_audience`, `price_starting_at`, `is_featured`, `is_active`, `order_index`, `views_count`) VALUES
('srv-01', 'cat-data-analyst', 'Jasa Data Analyst (Python)', 'jasa-data-analyst-python', '/assets/service-data-analyst.jpg', 'bar-chart-2', 'Jasa Data Analyst – Olah Data, Visualisasi & Insight Profesional.', '### Jasa Data Analyst – Olah Data, Visualisasi & Insight Profesional\n\nPunya data tapi bingung mengolahnya jadi insight yang jelas? Saya siap membantu Anda mengubah data menjadi informasi yang rapi, mudah dipahami, dan siap digunakan.\n\nCocok untuk berbagai kebutuhan seperti bisnis, laporan, penelitian, maupun project pribadi.\n\n#### Layanan yang saya tawarkan:\n- Data cleaning & preprocessing\n- Exploratory Data Analysis (EDA)\n- Visualisasi data (grafik/chart)\n- Analisis tren & pola data\n- Insight & kesimpulan data\n- Pengolahan data Excel / CSV\n- Analisis menggunakan Python (opsional)\n\n#### Tools yang digunakan:\n- Python\n- Google Colab\n\n#### Output yang Anda dapatkan:\n- File data yang sudah rapi (Excel / CSV)\n- Visualisasi grafik profesional\n- Insight & summary yang mudah dipahami\n- File analisis (.ipynb)\n\n#### Cocok untuk:\n- Mahasiswa (tugas, skripsi, thesis)\n- Pebisnis / UMKM\n- Startup & freelancer\n- Penelitian & laporan\n- Siapa saja yang memiliki data dan ingin diolah secara profesional', '["Data cleaning & preprocessing", "Exploratory Data Analysis (EDA)", "Visualisasi grafik interaktif", "Insight & kesimpulan data actionable"]', '["Python", "Pandas", "Google Colab", "Seaborn / Matplotlib"]', '["File data bersih (Excel/CSV)", "Visualisasi grafik", "Laporan insight & ringkasan", "Source code analisis (.ipynb)"]', '["Mahasiswa & Peneliti", "Pebisnis & Pemilik UMKM", "Startup & Profesional"]', 150000.00, 1, 1, 1, 240),

('srv-02', 'cat-marketing', 'Digital Marketing & Social Media Strategy', 'digital-marketing-social-media-strategy', '/assets/service-marketing.jpg', 'trending-up', 'Tingkatkan jangkauan pasar dan conversion rate bisnis Anda melalui strategi terukur.', '### Digital Marketing & Social Media Strategy\n\nBantu brand dan produk Anda dikenal lebih luas oleh audiens target yang relevan dengan strategi pemasaran digital berbasis data analitik.\n\n#### Layanan yang diberikan:\n- Audit media sosial & competitor analysis\n- Content planning & editorial calendar bulanan\n- Meta Ads & TikTok Ads setup & optimization\n- Analisis performa campaign & reporting', '["Audit & riset kompetitor", "Social media planning & calendar", "Setup Facebook & Instagram Ads", "Analisis performa & evaluasi mingguan"]', '["Meta Ads Manager", "Canva", "Google Analytics", "Notion"]', '["Dokumen audit brand", "Kalender konten 30 hari", "Laporan performa iklan"]', '["Pemilik Brand / Olshop", "Perusahaan B2B & B2C", "Agensi Kreatif"]', 300000.00, 1, 1, 2, 185),

('srv-03', 'cat-it-solution', 'IT Solution & Custom Web Application', 'it-solution-custom-web-application', '/assets/service-it.jpg', 'code', 'Bangun solusi aplikasi web kustom untuk mengotomasi alur kerja dan operasional bisnis.', '### IT Solution & Custom Web Application\n\nKembangkan aplikasi web internal, sistem kasir/POS, dashboard monitoring, atau portal kustom yang disesuaikan persis dengan alur kerja tim Anda.\n\n#### Keunggulan solusi:\n- Desain modern, bersih, dan responsif (HP & Laptop)\n- Integrasi database cepat dan handal\n- Arsitektur aman dan mudah dikembangkan', '["Full-stack custom development", "Database design & modeling", "REST API integration", "Deployment & domain hosting setup"]', '["Next.js", "React", "TypeScript", "Tailwind CSS", "MySQL"]', '["Aplikasi web live", "Source code repositori", "Panduan penggunaan teknis"]', '["Perusahaan & Bisnis", "Instansi & Organisasi", "Startup Early Stage"]', 1500000.00, 1, 1, 3, 310)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 4. Masukkan Data Produk Digital
INSERT INTO `products` (`id`, `category_id`, `title`, `slug`, `thumbnail_url`, `level_badge`, `original_price`, `discount_percent`, `discounted_price`, `total_sales`, `about_product`, `what_you_get`, `suitable_for`, `live_demo_url`, `purchase_link_external`, `is_featured`, `is_published`, `order_index`) VALUES
('prd-01', 'cat-sales-prod', 'Template Spreadsheet Financial Planner & Budgeting 2026', 'template-spreadsheet-financial-planner-2026', '/assets/product-financial-planner.jpg', 'Semua Level', 99000.00, 51, 49000.00, 126, 'Template Google Sheets profesional siap pakai untuk mengatur cashflow harian, tabungan, pelunasan hutang, dan proyeksi investasi bulanan secara otomatis dengan visual grafik yang cantik.', '["Formula otomatis (tanpa perlu coding)", "Dashboard visual grafik interaktif", "Kategori pengeluaran dinamis", "Support Google Sheets & Microsoft Excel"]', '["Pekerja profesional", "Ibu rumah tangga", "Freelancer & Pemilik Bisnis"]', 'https://docs.google.com/spreadsheets/d/sample', 'https://saweria.co/helmisalsabila', 1, 1, 1),

('prd-02', 'cat-sales-prod', 'Mastering Data Visualization with Python & Google Colab', 'mastering-data-visualization-python-colab', '/assets/product-python-course.jpg', 'Pemula', 199000.00, 50, 99000.00, 84, 'E-Course interaktif dan materi notebook siap jalankan untuk belajar mengolah data mentah menjadi grafik presentasi kelas profesional menggunakan Python, Pandas, dan Seaborn.', '["15+ Notebook studi kasus nyata", "Cheat sheet syntax visualisasi", "Akses grup diskusi eksklusif", "Sertifikat penyelesaian e-course"]', '["Mahasiswa & Fresh Graduate", "Data Analyst Pemula", "Professional yang ingin upgrade skill"]', 'https://colab.research.google.com/sample', 'https://saweria.co/helmisalsabila', 1, 1, 2)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 5. Masukkan Modul & Lessons Produk
INSERT INTO `product_modules` (`id`, `product_id`, `module_number`, `title`, `order_index`) VALUES
('mod-01', 'prd-02', '01', 'Modul 1: Fondasi Dasar Python untuk Analisis Data', 1),
('mod-02', 'prd-02', '02', 'Modul 2: Eksplorasi & Visualisasi Lanjutan', 2)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

INSERT INTO `product_lessons` (`id`, `module_id`, `title`, `duration`, `order_index`) VALUES
('les-01', 'mod-01', 'Pengenalan Lingkungan Google Colab & Import Library', '15 Menit', 1),
('les-02', 'mod-01', 'Teknik Data Cleaning & Filtering dengan Pandas', '25 Menit', 2),
('les-03', 'mod-02', 'Merancang Bar Chart & Line Chart yang Komunikatif', '30 Menit', 1),
('les-04', 'mod-02', 'Mengekspor Grafik High-Resolution untuk Laporan', '20 Menit', 2)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

SET FOREIGN_KEY_CHECKS = 1;
