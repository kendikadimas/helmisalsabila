-- ============================================================
-- SQL Schema untuk cPanel phpMyAdmin (MySQL / MariaDB)
-- Portfolio & CMS Helmi Salsabila
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `article_tags`;
DROP TABLE IF EXISTS `articles`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `tags`;
DROP TABLE IF EXISTS `product_galleries`;
DROP TABLE IF EXISTS `product_lessons`;
DROP TABLE IF EXISTS `product_modules`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `service_galleries`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `testimonials`;
DROP TABLE IF EXISTS `value_propositions`;
DROP TABLE IF EXISTS `work_steps`;
DROP TABLE IF EXISTS `site_settings`;
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

-- 4. Services
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
	`price_subtext` varchar(100),
	`is_featured` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`order_index` int NOT NULL DEFAULT 0,
	`views_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

-- 6. Products
CREATE TABLE `products` (
	`id` varchar(36) NOT NULL,
	`category_id` varchar(36),
	`title` varchar(200) NOT NULL,
	`slug` varchar(250) NOT NULL,
	`thumbnail_url` varchar(500) NOT NULL,
	`level_badge` varchar(50) NOT NULL DEFAULT 'Semua Level',
	`badge_text` varchar(50),
	`original_price` decimal(12,2) NOT NULL DEFAULT 0.00,
	`discounted_price` decimal(12,2) NOT NULL DEFAULT 0.00,
	`discount_percent` int NOT NULL DEFAULT 0,
	`rating` decimal(3,2) NOT NULL DEFAULT 5.00,
	`reviews_count` int NOT NULL DEFAULT 0,
	`total_sales` int NOT NULL DEFAULT 0,
	`about_product` text,
	`features` json,
	`download_url` varchar(500),
	`is_featured` boolean NOT NULL DEFAULT false,
	`is_published` boolean NOT NULL DEFAULT true,
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
	UNIQUE KEY `products_slug_unique` (`slug`),
	CONSTRAINT `products_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Product Modules
CREATE TABLE `product_modules` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`title` varchar(200) NOT NULL,
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
	CONSTRAINT `product_modules_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Product Lessons
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

-- 9. Product Galleries
CREATE TABLE `product_galleries` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`image_url` varchar(500) NOT NULL,
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
	CONSTRAINT `product_galleries_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
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
	CONSTRAINT `articles_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
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

-- 12. Site Settings
CREATE TABLE `site_settings` (
	`id` int NOT NULL DEFAULT 1,
	`site_name` varchar(100) NOT NULL DEFAULT 'Helmi Salsabila',
	`tagline` varchar(255),
	`hero_title` varchar(255),
	`hero_subtitle` text,
	`contact_email` varchar(255),
	`contact_phone` varchar(50),
	`contact_address` text,
	`saweria_url` varchar(500),
	`stats_counters` json,
	`social_links` json,
	`meta_title` varchar(255),
	`meta_description` varchar(500),
	`og_image_url` varchar(500),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Testimonials
CREATE TABLE `testimonials` (
	`id` varchar(36) NOT NULL,
	`client_name` varchar(100) NOT NULL,
	`client_role` varchar(100),
	`client_company` varchar(100),
	`avatar_url` varchar(500),
	`rating` int NOT NULL DEFAULT 5,
	`content` text NOT NULL,
	`is_featured` boolean NOT NULL DEFAULT true,
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Work Steps
CREATE TABLE `work_steps` (
	`id` varchar(36) NOT NULL,
	`step_number` int NOT NULL,
	`title` varchar(150) NOT NULL,
	`description` text NOT NULL,
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Value Propositions
CREATE TABLE `value_propositions` (
	`id` varchar(36) NOT NULL,
	`icon_name` varchar(100) NOT NULL,
	`title` varchar(150) NOT NULL,
	`description` text NOT NULL,
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default user admin (Password: admin123)
-- Hash bcrypt 10 rounds: $2a$10$wN9Q9JqY89m84K... (generik admin)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`) VALUES
('usr-admin-1', 'Helmi Salsabila', 'admin@helmisalsabila.com', '$2b$10$u13vX1Z3e0WlX3VnfxwQ8e723WwK4R48N1c37dJk9hL0o5LqV7eWy', 'admin')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- Insert default site settings
INSERT INTO `site_settings` (`id`, `site_name`, `tagline`, `hero_title`, `hero_subtitle`, `contact_email`, `contact_phone`, `saweria_url`, `stats_counters`, `social_links`) VALUES
(1, 'Helmi Salsabila', 'Data & Digital Solutions', 'Data & Digital Solutions.', 'Masalah ditemukan. Solusi diarahkan. Pilihan terbaik direkomendasikan.', 'contact@helmisalsabila.com', '+628123456789', 'https://saweria.co/helmisalsabila', '{"years": "5+", "clients": "100+", "projects": "100%"}', '{"linkedin": "https://linkedin.com", "instagram": "https://instagram.com", "threads": "https://threads.net", "dribbble": "https://dribbble.com"}')
ON DUPLICATE KEY UPDATE `site_name` = VALUES(`site_name`);

SET FOREIGN_KEY_CHECKS = 1;
