-- ==============================================================================
-- SQL Patch to Fix Schema & Align Database with Next.js Drizzle ORM
-- Run this in phpMyAdmin on Database `helsenvi_db`
-- ==============================================================================

-- 1. Fix `site_settings`
ALTER TABLE `site_settings`
  ADD COLUMN IF NOT EXISTS `bio_description` text NOT NULL DEFAULT 'Your Reliable Partner for Digital & Data Solutions' AFTER `hero_subtitle`,
  ADD COLUMN IF NOT EXISTS `avatar_url` varchar(500) DEFAULT '/profile-talent.png' AFTER `bio_description`,
  ADD COLUMN IF NOT EXISTS `resume_cv_url` varchar(500) DEFAULT NULL AFTER `avatar_url`,
  ADD COLUMN IF NOT EXISTS `saweria_url` varchar(500) DEFAULT 'https://saweria.co/helmisalsabila' AFTER `contact_address`,
  ADD COLUMN IF NOT EXISTS `stats_counters` json DEFAULT NULL AFTER `saweria_url`,
  ADD COLUMN IF NOT EXISTS `social_links` json DEFAULT NULL AFTER `stats_counters`,
  ADD COLUMN IF NOT EXISTS `meta_title` varchar(255) DEFAULT 'Helmi Salsabila | Portfolio' AFTER `social_links`,
  ADD COLUMN IF NOT EXISTS `meta_description` varchar(500) DEFAULT 'Data Analyst & Digital Solution Portfolio' AFTER `meta_title`,
  ADD COLUMN IF NOT EXISTS `og_image_url` varchar(500) DEFAULT '/logoku-1.png' AFTER `meta_description`,
  ADD COLUMN IF NOT EXISTS `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `og_image_url`;

-- Update site_settings default values if null
UPDATE `site_settings` SET
  `bio_description` = COALESCE(`bio_description`, 'Your Reliable Partner for Digital & Data Solutions'),
  `saweria_url` = COALESCE(`saweria_url`, 'https://saweria.co/helmisalsabila'),
  `stats_counters` = COALESCE(`stats_counters`, '{"years": "5+", "clients": "100+", "projects": "100%"}'),
  `social_links` = COALESCE(`social_links`, '{"linkedin": "https://linkedin.com", "instagram": "https://instagram.com", "threads": "https://threads.net", "dribbble": "https://dribbble.com"}')
WHERE `id` = 1;

-- 2. Fix `testimonials`
ALTER TABLE `testimonials`
  ADD COLUMN IF NOT EXISTS `company_logo_url` varchar(500) DEFAULT NULL AFTER `avatar_url`,
  ADD COLUMN IF NOT EXISTS `quote` text NOT NULL DEFAULT 'Pelayanan sangat profesional dan memuaskan.' AFTER `company_logo_url`,
  ADD COLUMN IF NOT EXISTS `is_active` tinyint(1) NOT NULL DEFAULT 1 AFTER `rating`;

-- If older column `content` exists, copy it to `quote`
UPDATE `testimonials` SET `quote` = `content` WHERE (`quote` IS NULL OR `quote` = '') AND `content` IS NOT NULL;

-- 3. Fix `value_propositions`
ALTER TABLE `value_propositions`
  ADD COLUMN IF NOT EXISTS `icon_3d_name` varchar(100) NOT NULL DEFAULT 'money-bag' AFTER `description`;

-- If older column `icon_name` exists, map to `icon_3d_name`
UPDATE `value_propositions` SET `icon_3d_name` = 
  CASE 
    WHEN `icon_name` = 'banknote' THEN 'money-bag'
    WHEN `icon_name` = 'lock' THEN 'padlock-shield'
    WHEN `icon_name` = 'medal' THEN 'medal'
    WHEN `icon_name` = 'handshake' THEN 'handshake'
    ELSE 'money-bag'
  END
WHERE `icon_3d_name` IS NULL OR `icon_3d_name` = 'money-bag';

-- 4. Fix `services`
ALTER TABLE `services`
  ADD COLUMN IF NOT EXISTS `features` json DEFAULT NULL AFTER `full_description`,
  ADD COLUMN IF NOT EXISTS `tools_used` json DEFAULT NULL AFTER `features`,
  ADD COLUMN IF NOT EXISTS `outputs_received` json DEFAULT NULL AFTER `tools_used`,
  ADD COLUMN IF NOT EXISTS `target_audience` json DEFAULT NULL AFTER `outputs_received`,
  ADD COLUMN IF NOT EXISTS `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

-- 5. Fix `products`
ALTER TABLE `products`
  ADD COLUMN IF NOT EXISTS `what_you_get` json DEFAULT NULL AFTER `about_product`,
  ADD COLUMN IF NOT EXISTS `suitable_for` json DEFAULT NULL AFTER `what_you_get`,
  ADD COLUMN IF NOT EXISTS `live_demo_url` varchar(500) DEFAULT NULL AFTER `suitable_for`,
  ADD COLUMN IF NOT EXISTS `purchase_link_external` varchar(500) DEFAULT NULL AFTER `live_demo_url`,
  ADD COLUMN IF NOT EXISTS `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

-- 6. Fix `product_modules`
ALTER TABLE `product_modules`
  ADD COLUMN IF NOT EXISTS `module_number` varchar(10) NOT NULL DEFAULT '01' AFTER `product_id`;

-- 7. Fix `product_lessons`
ALTER TABLE `product_lessons`
  ADD COLUMN IF NOT EXISTS `lesson_type` varchar(50) NOT NULL DEFAULT 'document' AFTER `title`;
