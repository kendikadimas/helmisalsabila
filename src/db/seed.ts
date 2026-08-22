import { db, schema } from "./index";
import { hashPassword } from "../lib/auth";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🌱 Seeding database with mockup data...");

  try {
    // 1. Admin User
    const adminPassword = await hashPassword("admin12345");
    const adminId = "user-admin-helmi-001";

    await db
      .insert(schema.users)
      .values({
        id: adminId,
        name: "Helmi Salsabila",
        email: "admin@helmisalsabila.com",
        passwordHash: adminPassword,
        role: "admin",
        avatarUrl: "/assets/helmi-avatar.png",
      })
      .onDuplicateKeyUpdate({ target: schema.users.id, set: { name: "Helmi Salsabila" } });

    // 2. Categories
    const categoriesData = [
      { id: "cat-data-analyst", name: "Data Analyst", slug: "data-analyst", type: "general" as const, orderIndex: 1 },
      { id: "cat-marketing", name: "Marketing Digital", slug: "marketing-digital", type: "general" as const, orderIndex: 2 },
      { id: "cat-it-solution", name: "IT Solution", slug: "it-solution", type: "general" as const, orderIndex: 3 },
      { id: "cat-sales", name: "Sales", slug: "sales", type: "general" as const, orderIndex: 4 },
      { id: "cat-system-analyst", name: "System Analyst", slug: "system-analyst", type: "article" as const, orderIndex: 5 },
      { id: "cat-sales-prod", name: "Sales Product Digital", slug: "sales-product-digital", type: "product" as const, orderIndex: 6 },
    ];

    for (const cat of categoriesData) {
      await db.insert(schema.categories).values(cat).onDuplicateKeyUpdate({ target: schema.categories.id, set: cat });
    }

    // 3. Tags
    const tagsData = [
      { id: "tag-it", name: "Information Technology", slug: "information-technology" },
      { id: "tag-si", name: "Sistem Informasi", slug: "sistem-informasi" },
      { id: "tag-food", name: "Food", slug: "food" },
      { id: "tag-travel", name: "Traveling", slug: "traveling" },
      { id: "tag-life", name: "Life Style", slug: "life-style" },
      { id: "tag-remote", name: "Remote Working", slug: "remote-working" },
      { id: "tag-dm", name: "Digital Marketing", slug: "digital-marketing" },
      { id: "tag-fulltime", name: "Fulltime Work", slug: "fulltime-work" },
      { id: "tag-mom", name: "Mom & Baby", slug: "mom-and-baby" },
    ];

    for (const tag of tagsData) {
      await db.insert(schema.tags).values(tag).onDuplicateKeyUpdate({ target: schema.tags.id, set: tag });
    }

    // 4. Services (Mockup items)
    const servicesData = [
      {
        id: "srv-01",
        categoryId: "cat-data-analyst",
        title: "Jasa Data Analyst (Python)",
        slug: "jasa-data-analyst-python",
        thumbnailUrl: "/assets/service-data-analyst.jpg",
        iconName: "bar-chart-2",
        shortDescription: "Jasa Data Analyst – Olah Data, Visualisasi & Insight Profesional.",
        fullDescription: `
### Jasa Data Analyst – Olah Data, Visualisasi & Insight Profesional

Punya data tapi bingung mengolahnya jadi insight yang jelas? Saya siap membantu Anda mengubah data menjadi informasi yang rapi, mudah dipahami, dan siap digunakan.

Cocok untuk berbagai kebutuhan seperti bisnis, laporan, penelitian, maupun project pribadi.

#### Layanan yang saya tawarkan:
- Data cleaning & preprocessing
- Exploratory Data Analysis (EDA)
- Visualisasi data (grafik/chart)
- Analisis tren & pola data
- Insight & kesimpulan data
- Pengolahan data Excel / CSV
- Analisis menggunakan Python (opsional)

#### Tools yang digunakan:
- Python
- Google Colab

#### Output yang Anda dapatkan:
- File data yang sudah rapi (Excel / CSV)
- Visualisasi grafik profesional
- Insight & summary yang mudah dipahami
- File analisis (.ipynb)

#### Cocok untuk:
- Mahasiswa (tugas, skripsi, thesis)
- Pebisnis / UMKM
- Startup & freelancer
- Penelitian & laporan
- Siapa saja yang memiliki data dan ingin diolah secara profesional

#### Keunggulan layanan saya:
✔ Hasil rapi & mudah dipahami
✔ Bisa request sesuai kebutuhan
✔ Fast response & komunikatif
✔ Bisa bantu dari nol
✔ Fleksibel & bisa custom project

> **Catatan:** "Silakan diskusi terlebih dahulu sebelum order agar hasil sesuai kebutuhan Anda."
        `,
        features: [
          "Hasil rapi & mudah dipahami",
          "Bisa request sesuai kebutuhan",
          "Fast response & komunikatif",
          "Bisa bantu dari nol",
          "Fleksibel & bisa custom project",
        ],
        toolsUsed: ["Python", "Google Colab", "Excel", "Pandas", "Matplotlib"],
        outputsReceived: ["File data rapi (Excel/CSV)", "Visualisasi grafik", "Summary insight", "File .ipynb"],
        targetAudience: ["Mahasiswa (skripsi/thesis)", "Pebisnis / UMKM", "Startup & Freelancer", "Peneliti"],
        priceStartingAt: "200000.00",
        isFeatured: true,
        isActive: true,
        orderIndex: 1,
        viewsCount: 245,
      },
      {
        id: "srv-02",
        categoryId: "cat-it-solution",
        title: "Two-Way Data Entry Specialist",
        slug: "two-way-data-entry-specialist",
        thumbnailUrl: "/assets/service-data-entry.jpg",
        iconName: "database",
        shortDescription: "Two-Way Data Entry Specialist | Document to Website & Website to Document.",
        fullDescription: `
### Two-Way Data Entry Specialist

Input data cepat, teliti, dan akurat dari dokumen fisik/digital ke website atau sebaliknya dari website ke spreadsheet/database terstruktur.

#### Format Dokumen Didukung:
- PDF, DOCX, XLSX, TXT, LaTeX
- Gambar (PNG, JPG, JPEG)
- Web portal & database dashboard
        `,
        features: ["Akurasi 100%", "Kecepatan pengerjaan tinggi", "Kerahasiaan data terjamin"],
        priceStartingAt: "200000.00",
        isFeatured: true,
        isActive: true,
        orderIndex: 2,
        viewsCount: 180,
      },
      {
        id: "srv-03",
        categoryId: "cat-data-analyst",
        title: "Responden Realistis Skripsi, Thesis & Penelitian",
        slug: "responden-realistis-skripsi-thesis-penelitian",
        thumbnailUrl: "/assets/service-responden.jpg",
        iconName: "users",
        shortDescription: "Solusi responden kuesioner realistis dan valid untuk kebutuhan akademik dan riset.",
        fullDescription: `
### Solusi Responden Realistis untuk Skripsi, Thesis & Penelitian

Membantu pengumpulan data responden kuesioner dengan kriteria responden tertarget, data valid, lolos uji reliabilitas dan normalitas.
        `,
        features: ["Responden sesuai kriteria target", "Lolos uji statistik", "Pengerjaan cepat"],
        priceStartingAt: "200000.00",
        isFeatured: true,
        isActive: true,
        orderIndex: 3,
        viewsCount: 310,
      },
    ];

    for (const srv of servicesData) {
      await db.insert(schema.services).values(srv).onDuplicateKeyUpdate({ target: schema.services.id, set: srv });
    }

    // 5. Products (Mockup items)
    const productsData = [
      {
        id: "prd-01",
        categoryId: "cat-sales-prod",
        title: "[LIFETIME ACCESS] - PERSONAL BRANDING BUILDER [BASIC]",
        slug: "lifetime-access-personal-branding-builder-basic",
        thumbnailUrl: "/assets/product-branding-builder.jpg",
        levelBadge: "Semua Level",
        originalPrice: "350000.00",
        discountPercent: 10,
        discountedPrice: "200000.00",
        totalSales: 1200,
        aboutProduct: `
Bangun personal branding yang lebih profesional dan terpercaya dengan Personal Branding Builder [Basic]. Produk digital ini dirancang untuk membantu Anda menampilkan profil, keahlian, pengalaman, dan layanan secara lebih terstruktur dalam satu halaman yang mudah dibagikan.

Dengan Lifetime Access, Anda dapat mengakses produk kapan saja tanpa batas waktu. Cocok untuk freelancer, profesional, job seeker, maupun pemilik jasa yang ingin memiliki personal branding digital yang rapi dan profesional.
        `,
        whatYouGet: [
          "Template personal branding yang siap digunakan",
          "Struktur halaman yang profesional dan mudah dipahami",
          "Section untuk profil, keahlian, pengalaman, layanan, dan kontak",
          "Dapat digunakan sebagai portfolio atau landing page jasa",
          "Panduan dasar untuk mengisi dan menyesuaikan konten",
          "Lifetime Access tanpa batas waktu",
        ],
        suitableFor: ["Freelancer", "Job Seeker", "Profesional", "Konsultan", "Penyedia Jasa", "Personal Brand"],
        isFeatured: true,
        isPublished: true,
        orderIndex: 1,
      },
      {
        id: "prd-02",
        categoryId: "cat-sales-prod",
        title: "150 Digital Product Ideas Starter Pack",
        slug: "150-digital-product-ideas-starter-pack",
        thumbnailUrl: "/assets/product-150-ideas.jpg",
        levelBadge: "Semua Level",
        originalPrice: "300000.00",
        discountPercent: 33,
        discountedPrice: "200000.00",
        totalSales: 1200,
        aboutProduct: "Kumpulan 150 ide produk digital yang siap dikembangkan dan divalidasi ke market.",
        whatYouGet: ["150 Ide terkurasi", "Framework validasi market", "Template copywriting"],
        suitableFor: ["Content Creator", "Freelancer", "Solopreneur"],
        isFeatured: true,
        isPublished: true,
        orderIndex: 2,
      },
      {
        id: "prd-03",
        categoryId: "cat-sales-prod",
        title: "Digital Product Ideas E-Book & Blueprint",
        slug: "digital-product-ideas-ebook-blueprint",
        thumbnailUrl: "/assets/product-digital-ideas.jpg",
        levelBadge: "Semua Level",
        originalPrice: "250000.00",
        discountPercent: 20,
        discountedPrice: "200000.00",
        totalSales: 1200,
        aboutProduct: "Blueprint lengkap step-by-step membuat dan menjual produk digital pertama Anda.",
        whatYouGet: ["E-book PDF Full Color", "Worksheet Notion", "Checklist Peluncuran"],
        suitableFor: ["Pemula", "Digital Marketer"],
        isFeatured: true,
        isPublished: true,
        orderIndex: 3,
      },
    ];

    for (const prd of productsData) {
      await db.insert(schema.products).values(prd).onDuplicateKeyUpdate({ target: schema.products.id, set: prd });
    }

    // Product Modules & Lessons for prd-01
    const modulesData = [
      {
        id: "mod-01",
        productId: "prd-01",
        moduleNumber: "01",
        title: "Personal Branding Fundamentals",
        orderIndex: 1,
        lessons: [
          "Apa itu personal branding?",
          "Mengapa personal branding penting?",
          "Menentukan tujuan personal branding",
          "Menentukan target audiens",
        ],
      },
      {
        id: "mod-02",
        productId: "prd-01",
        moduleNumber: "02",
        title: "Menentukan Personal Brand",
        orderIndex: 2,
        lessons: [
          "Mengenali keahlian dan keunggulan diri",
          "Menentukan niche",
          "Menentukan positioning",
          "Menentukan nilai dan karakter personal brand",
        ],
      },
      {
        id: "mod-03",
        productId: "prd-01",
        moduleNumber: "03",
        title: "Menyusun Profil Profesional",
        orderIndex: 3,
        lessons: [
          "Mengenali keahlian dan keunggulan diri",
          "Menentukan niche",
          "Menentukan positioning",
          "Menentukan nilai dan karakter personal brand",
        ],
      },
    ];

    for (const mod of modulesData) {
      await db
        .insert(schema.productModules)
        .values({
          id: mod.id,
          productId: mod.productId,
          moduleNumber: mod.moduleNumber,
          title: mod.title,
          orderIndex: mod.orderIndex,
        })
        .onDuplicateKeyUpdate({ target: schema.productModules.id, set: { title: mod.title } });

      for (let i = 0; i < mod.lessons.length; i++) {
        const lessonId = `lsn-${mod.id}-${i + 1}`;
        await db
          .insert(schema.productLessons)
          .values({
            id: lessonId,
            moduleId: mod.id,
            title: mod.lessons[i],
            lessonType: "document",
            orderIndex: i + 1,
          })
          .onDuplicateKeyUpdate({ target: schema.productLessons.id, set: { title: mod.lessons[i] } });
      }
    }

    // 6. Articles (Mockup items)
    const articlesData = [
      {
        id: "art-01",
        authorId: adminId,
        categoryId: "cat-it-solution",
        title: "3 Headphone JBL Terbaik 2026 dengan Suara Bass Mantap!",
        slug: "3-headphone-jbl-terbaik-2026-dengan-suara-bass-mantap",
        excerpt: "Rekomendasi headphone JBL terbaik di tahun 2026 dengan performa bass bertenaga dan konektivitas nirkabel stabil.",
        content: `
Headphone JBL terbaik hadir untuk memberikan pengalaman audio yang memukau dengan kualitas suara yang jernih dan bass yang bertenaga. Dirancang dengan teknologi canggih dan desain ergonomis, headphone JBL cocok untuk berbagai kebutuhan, mulai dari mendengarkan musik hingga menikmati podcast atau film.

Setiap model menawarkan fitur-fitur unggulan, seperti konektivitas nirkabel, ketahanan baterai panjang, dan noise cancellation untuk suara yang lebih fokus. JBL memastikan kenyamanan dan performa optimal, membuatnya menjadi pilihan ideal bagi pecinta musik yang menginginkan kualitas tanpa kompromi. Yuk, temukan headphone JBL yang sesuai dengan gaya dan kebutuhanmu!

## Dengar Musik Jadi Lebih Asik dengan JBL

Memilih headphone dengan kualitas audio terbaik tentu menjadi impian setiap pencinta musik. JBL, sebagai merek audio ternama, menawarkan beragam pilihan headphone dengan fitur unggulan untuk pengalaman mendengarkan yang luar biasa. Dengan suara jernih, bass yang bertenaga, dan desain yang nyaman, headphone JBL terbaik siap menemani setiap aktivitas musikmu dengan kualitas tanpa kompromi.

### 1. JBL Quantum 100 Wired

JBL Quantum 100 Wired adalah salah satu headphone JBL terbaik bagi para gamer yang mencari kualitas suara yang jernih dan pengalaman audio yang mendalam. Dilengkapi dengan driver dinamis 40mm dan JBL QuantumSound Signature, headphone ini menghadirkan detail audio luar biasa, mulai dari suara langkah kaki yang halus hingga ledakan keras dalam game. Mikrofon boom yang bisa dilepas dan fitur bisu memberikan komunikasi yang jelas dan fokus saat bermain.

**Rentang Harga:** Rp470.000 - Rp800.000

### 2. JBL Tune 520BT Wireless

Headphone nirkabel dengan daya tahan baterai hingga 57 jam, fitur Pure Bass Sound khas JBL, dan koneksi Bluetooth 5.3 stabil untuk mobilitas tinggi sehari-hari.

**Rentang Harga:** Rp470.000 - Rp800.000

### 3. JBL Tune 770NC

Dilengkapi Adaptive Noise Cancelling dengan teknologi Smart Ambient untuk meredam kebisingan luar dan pengalaman mendengarkan musik yang imersif.

**Rentang Harga:** Rp470.000 - Rp800.000
        `,
        featuredImage: "/assets/article-jbl.jpg",
        readingTimeMin: 3,
        viewsCount: 1000,
        isPopular: true,
        isTrending: true,
        trendingRank: 1,
        isPublished: true,
        publishedAt: new Date("2026-08-03T19:26:00"),
      },
      {
        id: "art-02",
        authorId: adminId,
        categoryId: "cat-it-solution",
        title: "Mengapa Keamanan Software Harus Menjadi Bagian dari Software?",
        slug: "mengapa-keamanan-software-harus-menjadi-bagian-dari-software",
        excerpt: "Pentingnya mengintegrasikan security by design sejak fase awal perancangan arsitektur aplikasi.",
        content: "Keamanan aplikasi bukan lagi sekadar checklist di akhir fase rilis, melainkan fundamental arsitektur...",
        featuredImage: "/assets/article-security.jpg",
        readingTimeMin: 4,
        viewsCount: 850,
        isPopular: false,
        isTrending: true,
        trendingRank: 2,
        isPublished: true,
        publishedAt: new Date("2026-08-03T10:00:00"),
      },
      {
        id: "art-03",
        authorId: adminId,
        categoryId: "cat-it-solution",
        title: "Penerapan AI dalam Radiologi dengan AIRIS PACS: Transformasi Diagnostik di Era Digital",
        slug: "penerapan-ai-dalam-radiologi-dengan-airis-pacs-transformasi-diagnostik-era-digital",
        excerpt: "Bagaimana teknologi kecerdasan buatan merevolusi pembacaan citra medis radiologi lebih akurat dan efisien.",
        content: "Integrasi AIRIS PACS dengan model deep learning membantu radiolog mendeteksi anomali citra medis secara real-time...",
        featuredImage: "/assets/article-airis.jpg",
        readingTimeMin: 5,
        viewsCount: 640,
        isPopular: true,
        isTrending: true,
        trendingRank: 3,
        isPublished: true,
        publishedAt: new Date("2026-08-03T11:30:00"),
      },
      {
        id: "art-04",
        authorId: adminId,
        categoryId: "cat-it-solution",
        title: "Website Pendaftaran Online untuk Kursus: Solusi Ultimate Course",
        slug: "website-pendaftaran-online-untuk-kursus-solusi-ultimate-course",
        excerpt: "Studi kasus perancangan website pendaftaran kursus online dengan integrasi payment gateway dan LMS.",
        content: "Solusi otomatisasi pendaftaran kursus dan manajemen materi digital...",
        featuredImage: "/assets/article-course.jpg",
        readingTimeMin: 3,
        viewsCount: 420,
        isPopular: false,
        isTrending: false,
        isPublished: true,
        publishedAt: new Date("2026-08-03T14:00:00"),
      },
    ];

    for (const art of articlesData) {
      await db.insert(schema.articles).values(art).onDuplicateKeyUpdate({ target: schema.articles.id, set: art });
    }

    // 7. Testimonials (FOOM / Regina)
    const testimonialsData = [
      {
        id: "tst-01",
        clientName: "Regina",
        clientCompany: "FOOM",
        avatarUrl: "/assets/client-regina.jpg",
        companyLogoUrl: "/assets/logo-foom.png",
        quote:
          "Nilai excellent untuk semuanya: pelayanan, hasil kerja, kesabaran dan kecepatan balas chatt. Terima kasih banyak mas helmi, sangat membantu saya",
        rating: 5,
        isActive: true,
        orderIndex: 1,
      },
      {
        id: "tst-02",
        clientName: "Regina",
        clientCompany: "FOOM",
        avatarUrl: "/assets/client-regina.jpg",
        companyLogoUrl: "/assets/logo-foom.png",
        quote:
          "Nilai excellent untuk semuanya: pelayanan, hasil kerja, kesabaran dan kecepatan balas chatt. Terima kasih banyak mas helmi, sangat membantu saya",
        rating: 5,
        isActive: true,
        orderIndex: 2,
      },
      {
        id: "tst-03",
        clientName: "Regina",
        clientCompany: "FOOM",
        avatarUrl: "/assets/client-regina.jpg",
        companyLogoUrl: "/assets/logo-foom.png",
        quote:
          "Nilai excellent untuk semuanya: pelayanan, hasil kerja, kesabaran dan kecepatan balas chatt. Terima kasih banyak mas helmi, sangat membantu saya",
        rating: 5,
        isActive: true,
        orderIndex: 3,
      },
    ];

    for (const tst of testimonialsData) {
      await db
        .insert(schema.testimonials)
        .values(tst)
        .onDuplicateKeyUpdate({ target: schema.testimonials.id, set: tst });
    }

    // 8. Work Steps (01 s/d 04)
    const stepsData = [
      {
        id: "stp-01",
        stepNumber: "01",
        title: "Hubungi Saya dan Sampaikan Kebutuhan",
        description: "Kirim pesan melalui kontak saya dan jelaskan kebutuhan Anda: jenis pekerjaan, cakupan tugas, serta tenggat waktu yang diinginkan.",
        orderIndex: 1,
      },
      {
        id: "stp-02",
        stepNumber: "02",
        title: "Kesepakatan, Penawaran, dan Pembayaran Awal",
        description: "Setelah kebutuhan dibahas, saya akan memberikan estimasi harga & waktu pengerjaan. Pekerjaan dimulai setelah pembayaran uang muka diterima.",
        orderIndex: 2,
      },
      {
        id: "stp-03",
        stepNumber: "03",
        title: "Pengerjaan, Review, dan Revisi",
        description: "Pekerjaan dikerjakan sesuai kesepakatan. Hasil dikirimkan untuk ditinjau, dan revisi dapat diajukan sesuai ketentuan yang telah disepakati.",
        orderIndex: 3,
      },
      {
        id: "stp-04",
        stepNumber: "04",
        title: "Pelunasan dan Pengiriman Hasil Akhir",
        description: "Setelah hasil disetujui, pembayaran pelunasan dilakukan dan file atau dokumen final dikirimkan sepenuhnya kepada Anda.",
        orderIndex: 4,
      },
    ];

    for (const stp of stepsData) {
      await db.insert(schema.workSteps).values(stp).onDuplicateKeyUpdate({ target: schema.workSteps.id, set: stp });
    }

    // 9. Value Propositions (Why Choose Me 4 Cards)
    const valuesData = [
      {
        id: "val-01",
        title: "Proses Aman & Terpercaya",
        description: "Setiap pekerjaan dijalankan dengan kesepakatan yang jelas sejak awal. Data dan file Anda juga dijaga kerahasiaannya.",
        icon3dName: "lock",
        orderIndex: 1,
      },
      {
        id: "val-02",
        title: "Kualitas Hasil Terbaik",
        description: "Setiap detail dikerjakan dengan teliti & penuh tanggung jawab, memastikan hasilnya benar-benar sesuai kebutuhan.",
        icon3dName: "medal",
        orderIndex: 2,
      },
      {
        id: "val-03",
        title: "Harga Terjangkau",
        description: "Harga terjangkau sesuai cakupan pekerjaan, tanpa biaya tersembunyi maupun mengorbankan kualitas.",
        icon3dName: "banknote",
        orderIndex: 3,
      },
      {
        id: "val-04",
        title: "Dipercaya Banyak Client",
        description: "Rekam jejak pengerjaan dari berbagai klien menjadi bukti nyata konsistensi kualitas dan layanan yang diberikan.",
        icon3dName: "handshake",
        orderIndex: 4,
      },
    ];

    for (const val of valuesData) {
      await db
        .insert(schema.valuePropositions)
        .values(val)
        .onDuplicateKeyUpdate({ target: schema.valuePropositions.id, set: val });
    }

    // 10. Site Settings
    await db
      .insert(schema.siteSettings)
      .values({
        id: 1,
        siteName: "Helmi Salsabila",
        heroTitle: "Data & Digital Solutions.",
        heroSubtitle: "Masalah ditemukan. Solusi diarahkan. Pilihan terbaik direkomendasikan.",
        bioDescription: "Your Reliable Partner for Digital & Data Solutions",
        avatarUrl: "/assets/helmi-photo.png",
        resumeCvUrl: "/resume-helmi.pdf",
        contactPhone: "+6269233221",
        contactAddress: "Based in Tangerang, Indonesia",
        saweriaUrl: "https://saweria.co/helmisalsabila",
        statsCounters: {
          years: "5+",
          clients: "100+",
          projects: "100%",
        },
        socialLinks: {
          linkedin: "https://linkedin.com/in/helmisalsabila",
          instagram: "https://instagram.com/helmisalsabila",
          threads: "https://threads.net/@helmisalsabila",
          youtube: "https://youtube.com/@helmisalsabila",
          facebook: "https://facebook.com/helmisalsabila",
          tiktok: "https://tiktok.com/@helmisalsabila",
        },
        metaTitle: "Helmi Salsabila | Your Reliable Partner for Data & Digital Solutions",
        metaDescription: "Portofolio & Solusi Data Analytics, Digital Marketing, IT Solutions, dan Produk Digital terpercaya.",
        ogImageUrl: "/assets/og-image.jpg",
      })
      .onDuplicateKeyUpdate({
        target: schema.siteSettings.id,
        set: { siteName: "Helmi Salsabila" },
      });

    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

main();
