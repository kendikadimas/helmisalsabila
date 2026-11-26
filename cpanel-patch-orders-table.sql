-- ==========================================================
-- PATCH DATABASE CPANEL (TABLE: orders & webhook_logs)
-- Jalankan query ini di phpMyAdmin cPanel untuk mengaktifkan
-- transaksi DOKU Payment Gateway dan audit log webhook.
-- ==========================================================

CREATE TABLE IF NOT EXISTS `orders` (
  `id` varchar(36) NOT NULL,
  `invoice_number` varchar(100) NOT NULL,
  `item_type` enum('product','service') NOT NULL DEFAULT 'product',
  `item_id` varchar(36) NOT NULL,
  `item_title` varchar(255) NOT NULL,
  `customer_name` varchar(150) NOT NULL,
  `customer_email` varchar(150) NOT NULL,
  `customer_phone` varchar(50) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('PENDING','PAID','FAILED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `payment_url` varchar(500) DEFAULT NULL,
  `doku_transaction_id` varchar(150) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_invoice_number_unique` (`invoice_number`),
  KEY `orders_customer_email_idx` (`customer_email`),
  KEY `orders_status_idx` (`status`)
);

CREATE TABLE IF NOT EXISTS `webhook_logs` (
  `id` varchar(36) NOT NULL,
  `provider` varchar(50) NOT NULL DEFAULT 'doku',
  `invoice_number` varchar(100) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `payload` longtext NOT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `webhook_logs_invoice_idx` (`invoice_number`),
  KEY `webhook_logs_status_idx` (`status`)
);

-- Tambahkan kolom khusus link akses materi/file digital setelah bayar DOKU
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `digital_access_url` varchar(500) DEFAULT NULL AFTER `purchase_link_external`;
