CREATE TABLE `article_tags` (
	`article_id` varchar(36) NOT NULL,
	`tag_id` varchar(36) NOT NULL,
	CONSTRAINT `article_tags_article_id_tag_id_pk` PRIMARY KEY(`article_id`,`tag_id`)
);
--> statement-breakpoint
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
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`type` enum('service','product','article','general') NOT NULL DEFAULT 'general',
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `product_galleries` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`image_url` varchar(500) NOT NULL,
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_galleries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_lessons` (
	`id` varchar(36) NOT NULL,
	`module_id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`lesson_type` varchar(50) NOT NULL DEFAULT 'document',
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_modules` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`module_number` varchar(10) NOT NULL,
	`title` varchar(200) NOT NULL,
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(36) NOT NULL,
	`category_id` varchar(36),
	`title` varchar(200) NOT NULL,
	`slug` varchar(250) NOT NULL,
	`thumbnail_url` varchar(500) NOT NULL,
	`level_badge` varchar(100) NOT NULL DEFAULT 'Semua Level',
	`original_price` decimal(12,2) NOT NULL,
	`discount_percent` int NOT NULL DEFAULT 0,
	`discounted_price` decimal(12,2) NOT NULL,
	`total_sales` int NOT NULL DEFAULT 0,
	`about_product` longtext NOT NULL,
	`what_you_get` json,
	`suitable_for` json,
	`live_demo_url` varchar(500),
	`purchase_link_external` varchar(500),
	`is_featured` boolean NOT NULL DEFAULT false,
	`is_published` boolean NOT NULL DEFAULT true,
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `service_galleries` (
	`id` varchar(36) NOT NULL,
	`service_id` varchar(36) NOT NULL,
	`image_url` varchar(500) NOT NULL,
	`caption` varchar(255),
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `service_galleries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
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
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
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
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('admin','editor') NOT NULL DEFAULT 'admin',
	`avatar_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `value_propositions` (
	`id` varchar(36) NOT NULL,
	`title` varchar(150) NOT NULL,
	`description` text NOT NULL,
	`icon_3d_name` varchar(100) NOT NULL,
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `value_propositions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `work_steps` (
	`id` varchar(36) NOT NULL,
	`step_number` varchar(10) NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text NOT NULL,
	`order_index` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `work_steps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `article_tags` ADD CONSTRAINT `article_tags_article_id_articles_id_fk` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `article_tags` ADD CONSTRAINT `article_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `articles` ADD CONSTRAINT `articles_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `articles` ADD CONSTRAINT `articles_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_galleries` ADD CONSTRAINT `product_galleries_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_lessons` ADD CONSTRAINT `product_lessons_module_id_product_modules_id_fk` FOREIGN KEY (`module_id`) REFERENCES `product_modules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_modules` ADD CONSTRAINT `product_modules_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_galleries` ADD CONSTRAINT `service_galleries_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE set null ON UPDATE no action;