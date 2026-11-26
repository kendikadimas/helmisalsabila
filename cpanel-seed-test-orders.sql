-- ==========================================================
-- SEED PESANAN UJI (untuk tes /cek-pesanan dan /dashboard)
-- Jalankan di phpMyAdmin. Butuh minimal 1 produk di tabel `products`.
-- Semua invoice berawalan TEST- agar mudah dihapus (lihat bagian bawah).
--
-- Invoice uji:
--   TEST-PAID-0001     | tester@example.com | PAID    -> produk + link akses tampil
--   TEST-PENDING-0001  | tester@example.com | PENDING -> TIDAK boleh membuka produk
--   TEST-EXPIRED-0001  | tester@example.com | EXPIRED
--   TEST-FAILED-0001   | tester@example.com | FAILED
-- ==========================================================

INSERT INTO `orders`
  (`id`, `invoice_number`, `item_type`, `item_id`, `item_title`, `customer_name`, `customer_email`, `customer_phone`, `amount`, `status`, `paid_at`)
SELECT UUID(), 'TEST-PAID-0001', 'product', p.`id`, p.`title`, 'Tester Satu', 'tester@example.com', '081234567890', 100000.00, 'PAID', NOW()
FROM `products` p ORDER BY p.`created_at` LIMIT 1;

INSERT INTO `orders`
  (`id`, `invoice_number`, `item_type`, `item_id`, `item_title`, `customer_name`, `customer_email`, `customer_phone`, `amount`, `status`)
SELECT UUID(), 'TEST-PENDING-0001', 'product', p.`id`, p.`title`, 'Tester Satu', 'tester@example.com', '081234567890', 100000.00, 'PENDING'
FROM `products` p ORDER BY p.`created_at` LIMIT 1;

INSERT INTO `orders`
  (`id`, `invoice_number`, `item_type`, `item_id`, `item_title`, `customer_name`, `customer_email`, `customer_phone`, `amount`, `status`)
SELECT UUID(), 'TEST-EXPIRED-0001', 'product', p.`id`, p.`title`, 'Tester Satu', 'tester@example.com', '081234567890', 100000.00, 'EXPIRED'
FROM `products` p ORDER BY p.`created_at` LIMIT 1;

INSERT INTO `orders`
  (`id`, `invoice_number`, `item_type`, `item_id`, `item_title`, `customer_name`, `customer_email`, `customer_phone`, `amount`, `status`)
SELECT UUID(), 'TEST-FAILED-0001', 'product', p.`id`, p.`title`, 'Tester Satu', 'tester@example.com', '081234567890', 100000.00, 'FAILED'
FROM `products` p ORDER BY p.`created_at` LIMIT 1;

-- ==========================================================
-- HAPUS DATA UJI SETELAH SELESAI TES:
-- DELETE FROM `orders` WHERE `invoice_number` LIKE 'TEST-%';
-- ==========================================================
