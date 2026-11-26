-- ==========================================================
-- PATCH VOUCHER (jalankan di phpMyAdmin cPanel SEBELUM/SESUDAH deploy)
-- Membuat tabel voucher + catatan pemakaian, dan memindahkan
-- 5 kode promo lama (yang sebelumnya hardcode) ke database.
-- ==========================================================

CREATE TABLE IF NOT EXISTS `vouchers` (
  `id` varchar(36) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` enum('percent','fixed') NOT NULL DEFAULT 'percent',
  `value` int NOT NULL,
  `min_purchase` int NOT NULL DEFAULT 0,
  `max_discount` int DEFAULT NULL,
  `quota` int DEFAULT NULL,
  `starts_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vouchers_code_unique` (`code`)
);

CREATE TABLE IF NOT EXISTS `voucher_redemptions` (
  `id` varchar(36) NOT NULL,
  `voucher_code` varchar(50) NOT NULL,
  `order_id` varchar(36) NOT NULL,
  `discount_amount` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `voucher_redemptions_code_idx` (`voucher_code`),
  KEY `voucher_redemptions_order_idx` (`order_id`)
);

-- Migrasi kode lama. Ubah/nonaktifkan lewat menu Voucher di admin.
INSERT IGNORE INTO `vouchers` (`id`, `code`, `description`, `type`, `value`, `is_active`) VALUES
  (UUID(), 'DISKON10', 'Diskon 10%', 'percent', 10, 1),
  (UUID(), 'HELMI20', 'Diskon Spesial 20%', 'percent', 20, 1),
  (UUID(), 'FLASH30', 'Flash Sale 30%', 'percent', 30, 1),
  (UUID(), 'HEMAT50', 'Diskon 50%', 'percent', 50, 1),
  (UUID(), 'GRATISONGKIR', 'Potongan 10%', 'percent', 10, 1);
