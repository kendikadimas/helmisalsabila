import {
  mysqlTable,
  varchar,
  text,
  longtext,
  int,
  decimal,
  boolean,
  timestamp,
  mysqlEnum,
  json,
  primaryKey,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// 1. Users (Admin & Authors)
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["admin", "editor"]).default("admin").notNull(),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// 2. Categories
export const categories = mysqlTable("categories", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  type: mysqlEnum("type", ["service", "product", "article", "general"]).default("general").notNull(),
  orderIndex: int("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Tags
export const tags = mysqlTable("tags", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Services (Layanan & Portfolio)
export const services = mysqlTable("services", {
  id: varchar("id", { length: 36 }).primaryKey(),
  categoryId: varchar("category_id", { length: 36 }).references(() => categories.id, { onDelete: "set null" }),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 250 }).notNull().unique(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }).notNull(),
  iconName: varchar("icon_name", { length: 100 }),
  shortDescription: varchar("short_description", { length: 300 }).notNull(),
  fullDescription: longtext("full_description").notNull(),
  features: json("features").$type<string[]>(),
  toolsUsed: json("tools_used").$type<string[]>(),
  outputsReceived: json("outputs_received").$type<string[]>(),
  targetAudience: json("target_audience").$type<string[]>(),
  priceStartingAt: decimal("price_starting_at", { precision: 12, scale: 2 }),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  orderIndex: int("order_index").default(0).notNull(),
  viewsCount: int("views_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const serviceGalleries = mysqlTable("service_galleries", {
  id: varchar("id", { length: 36 }).primaryKey(),
  serviceId: varchar("service_id", { length: 36 }).notNull().references(() => services.id, { onDelete: "cascade" }),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  caption: varchar("caption", { length: 255 }),
  orderIndex: int("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. Products (Produk Digital)
export const products = mysqlTable("products", {
  id: varchar("id", { length: 36 }).primaryKey(),
  categoryId: varchar("category_id", { length: 36 }).references(() => categories.id, { onDelete: "set null" }),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 250 }).notNull().unique(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }).notNull(),
  levelBadge: varchar("level_badge", { length: 100 }).default("Semua Level").notNull(),
  originalPrice: decimal("original_price", { precision: 12, scale: 2 }).notNull(),
  discountPercent: int("discount_percent").default(0).notNull(),
  discountedPrice: decimal("discounted_price", { precision: 12, scale: 2 }).notNull(),
  totalSales: int("total_sales").default(0).notNull(),
  aboutProduct: longtext("about_product").notNull(),
  whatYouGet: json("what_you_get").$type<string[]>(),
  suitableFor: json("suitable_for").$type<string[]>(),
  liveDemoUrl: varchar("live_demo_url", { length: 500 }),
  purchaseLinkExternal: varchar("purchase_link_external", { length: 500 }),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  orderIndex: int("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const productGalleries = mysqlTable("product_galleries", {
  id: varchar("id", { length: 36 }).primaryKey(),
  productId: varchar("product_id", { length: 36 }).notNull().references(() => products.id, { onDelete: "cascade" }),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  orderIndex: int("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productModules = mysqlTable("product_modules", {
  id: varchar("id", { length: 36 }).primaryKey(),
  productId: varchar("product_id", { length: 36 }).notNull().references(() => products.id, { onDelete: "cascade" }),
  moduleNumber: varchar("module_number", { length: 10 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  orderIndex: int("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productLessons = mysqlTable("product_lessons", {
  id: varchar("id", { length: 36 }).primaryKey(),
  moduleId: varchar("module_id", { length: 36 }).notNull().references(() => productModules.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  lessonType: varchar("lesson_type", { length: 50 }).default("document").notNull(),
  orderIndex: int("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 6. Articles (Blog & Insights)
export const articles = mysqlTable("articles", {
  id: varchar("id", { length: 36 }).primaryKey(),
  authorId: varchar("author_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "restrict" }),
  categoryId: varchar("category_id", { length: 36 }).references(() => categories.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  excerpt: varchar("excerpt", { length: 500 }).notNull(),
  content: longtext("content").notNull(),
  featuredImage: varchar("featured_image", { length: 500 }).notNull(),
  readingTimeMin: int("reading_time_min").default(3).notNull(),
  viewsCount: int("views_count").default(0).notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
  isTrending: boolean("is_trending").default(false).notNull(),
  trendingRank: int("trending_rank"),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const articleTags = mysqlTable(
  "article_tags",
  {
    articleId: varchar("article_id", { length: 36 })
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    tagId: varchar("tag_id", { length: 36 })
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.articleId, t.tagId] }),
  })
);

// 7. Testimonials
export const testimonials = mysqlTable("testimonials", {
  id: varchar("id", { length: 36 }).primaryKey(),
  clientName: varchar("client_name", { length: 150 }).notNull(),
  clientCompany: varchar("client_company", { length: 150 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  companyLogoUrl: varchar("company_logo_url", { length: 500 }),
  quote: text("quote").notNull(),
  rating: int("rating").default(5).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  orderIndex: int("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 8. Site Settings & Global Config
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").primaryKey().default(1),
  siteName: varchar("site_name", { length: 150 }).notNull(),
  heroTitle: varchar("hero_title", { length: 255 }).notNull(),
  heroSubtitle: text("hero_subtitle").notNull(),
  bioDescription: text("bio_description").notNull(),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  resumeCvUrl: varchar("resume_cv_url", { length: 500 }),
  contactPhone: varchar("contact_phone", { length: 50 }).notNull(),
  contactAddress: varchar("contact_address", { length: 255 }).notNull(),
  saweriaUrl: varchar("saweria_url", { length: 500 }),
  statsCounters: json("stats_counters").$type<{ years: string; clients: string; projects: string }>(),
  socialLinks: json("social_links").$type<{
    linkedin?: string;
    instagram?: string;
    threads?: string;
    youtube?: string;
    facebook?: string;
    tiktok?: string;
  }>(),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 500 }),
  ogImageUrl: varchar("og_image_url", { length: 500 }),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// 9. Work Steps (01 s/d 04)
export const workSteps = mysqlTable("work_steps", {
  id: varchar("id", { length: 36 }).primaryKey(),
  stepNumber: varchar("step_number", { length: 10 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  orderIndex: int("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 10. Value Propositions (Kenapa Memilih Layanan Saya)
export const valuePropositions = mysqlTable("value_propositions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description").notNull(),
  icon3dName: varchar("icon_3d_name", { length: 100 }).notNull(),
  orderIndex: int("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Drizzle Relations
export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articles),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  services: many(services),
  products: many(products),
  articles: many(articles),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  category: one(categories, {
    fields: [services.categoryId],
    references: [categories.id],
  }),
  galleries: many(serviceGalleries),
}));

export const serviceGalleriesRelations = relations(serviceGalleries, ({ one }) => ({
  service: one(services, {
    fields: [serviceGalleries.serviceId],
    references: [services.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  galleries: many(productGalleries),
  modules: many(productModules),
}));

export const productGalleriesRelations = relations(productGalleries, ({ one }) => ({
  product: one(products, {
    fields: [productGalleries.productId],
    references: [products.id],
  }),
}));

export const productModulesRelations = relations(productModules, ({ one, many }) => ({
  product: one(products, {
    fields: [productModules.productId],
    references: [products.id],
  }),
  lessons: many(productLessons),
}));

export const productLessonsRelations = relations(productLessons, ({ one }) => ({
  module: one(productModules, {
    fields: [productLessons.moduleId],
    references: [productModules.id],
  }),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  articleTags: many(articleTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  articleTags: many(articleTags),
}));

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(articles, {
    fields: [articleTags.articleId],
    references: [articles.id],
  }),
  tag: one(tags, {
    fields: [articleTags.tagId],
    references: [tags.id],
  }),
}));
