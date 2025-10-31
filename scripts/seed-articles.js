const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('📝 Starting to seed articles...\n');

  try {
    // Get admin user
    const admin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });

    if (!admin) {
      console.error('❌ No admin user found! Please create an admin user first.');
      console.log('Run: npm run create-admin\n');
      process.exit(1);
    }

    console.log(`✅ Found admin user: ${admin.email}\n`);

    // Create Articles
    console.log('📄 Creating articles...');
    
    const articles = [
      {
        slug: 'how-to-choose-perfect-skincare',
        title_lo: 'ວິທີການເລືອກຜະລິດຕະພັນບຳລຸງຜິວທີ່ເໝາະສົມ',
        title_th: 'วิธีเลือกผลิตภัณฑ์บำรุงผิวที่เหมาะสม',
        title_zh: '如何选择合适的护肤产品',
        title_en: 'How to Choose Perfect Skincare Products',
        excerpt_lo: 'ຄຳແນະນຳທີ່ຈະຊ່ວຍໃຫ້ທ່ານເລືອກຜະລິດຕະພັນບຳລຸງຜິວທີ່ຕອບໂຈດຄວາມຕ້ອງການຂອງຜິວພັນຂອງທ່ານໄດ້ດີທີ່ສຸດ',
        excerpt_th: 'คำแนะนำที่จะช่วยให้คุณเลือกผลิตภัณฑ์บำรุงผิวที่ตอบโจทย์ความต้องการของผิวพันธุ์ของคุณได้ดีที่สุด',
        excerpt_zh: '帮助您选择最适合您皮肤类型护肤产品的指南',
        excerpt_en: 'A guide to help you choose the best skincare products for your skin type',
        content_lo: 'ການເລືອກຜະລິດຕະພັນບຳລຸງຜິວທີ່ເໝາະສົມແມ່ນສິ່ງສຳຄັນຫຼາຍ... ການຮູ້ຈັກປະເພດຜິວພັນຂອງທ່ານແມ່ນຂັ້ນຕອນທຳອິດທີ່ຕ້ອງທຳ...',
        content_th: 'การเลือกผลิตภัณฑ์บำรุงผิวที่เหมาะสมเป็นสิ่งสำคัญมาก... การรู้จักประเภทผิวพันธุ์ของคุณเป็นขั้นตอนแรกที่ต้องทำ...',
        content_zh: '选择合适的护肤产品非常重要... 了解您的皮肤类型是第一步...',
        content_en: 'Choosing the right skincare products is very important... Knowing your skin type is the first step...',
        featuredImage: null,
        metaTitle_lo: 'ວິທີການເລືອກຜະລິດຕະພັນບຳລຸງຜິວ',
        metaTitle_th: 'วิธีเลือกผลิตภัณฑ์บำรุงผิว',
        metaTitle_zh: '如何选择护肤产品',
        metaTitle_en: 'How to Choose Skincare Products',
        metaDesc_lo: 'ຄຳແນະນຳການເລືອກຜະລິດຕະພັນບຳລຸງຜິວທີ່ເໝາະສົມ',
        metaDesc_th: 'คำแนะนำการเลือกผลิตภัณฑ์บำรุงผิวที่เหมาะสม',
        metaDesc_zh: '选择合适护肤产品的指南',
        metaDesc_en: 'Guide to choosing suitable skincare products',
        isPublished: true,
        isFeatured: true,
      },
      {
        slug: 'summer-fashion-trends-2024',
        title_lo: 'ແຟຊັ່ນລະດູຮ້ອນ 2024',
        title_th: 'แฟชั่นฤดูร้อน 2024',
        title_zh: '2024年夏季时尚趋势',
        title_en: 'Summer Fashion Trends 2024',
        excerpt_lo: 'ຮູ້ຈັກຮູບແບບແຟຊັ່ນລະດູຮ້ອນທີ່ກຳລັງໄດ້ຮັບຄວາມນິຍົມໃນປີ 2024',
        excerpt_th: 'รู้จักสไตล์แฟชั่นฤดูร้อนที่กำลังได้รับความนิยมในปี 2024',
        excerpt_zh: '了解2024年夏季流行的时尚风格',
        excerpt_en: 'Discover the trending summer fashion styles for 2024',
        content_lo: 'ລະດູຮ້ອນປີ 2024 ມາພ້ອມກັບຮູບແບບແຟຊັ່ນທີ່ສົດໃສ ແລະ ທັນສະໄໝ... ສີສັນທີ່ໂດດເດັ່ນ, ຜ້າທີ່ສະບາຍ...',
        content_th: 'ฤดูร้อนปี 2024 มาพร้อมกับสไตล์แฟชั่นที่สดใสและทันสมัย... สีสันที่โดดเด่น, เนื้อผ้าที่สบาย...',
        content_zh: '2024年夏季带来了清新时尚的风格... 鲜艳的色彩，舒适的面料...',
        content_en: 'Summer 2024 brings fresh and trendy fashion styles... Bright colors, comfortable fabrics...',
        featuredImage: null,
        metaTitle_lo: 'ແຟຊັ່ນລະດູຮ້ອນ 2024',
        metaTitle_th: 'แฟชั่นฤดูร้อน 2024',
        metaTitle_zh: '2024年夏季时尚趋势',
        metaTitle_en: 'Summer Fashion Trends 2024',
        metaDesc_lo: 'ຮູບແບບແຟຊັ່ນລະດູຮ້ອນທີ່ໄດ້ຮັບຄວາມນິຍົມໃນປີ 2024',
        metaDesc_th: 'สไตล์แฟชั่นฤดูร้อนยอดนิยมปี 2024',
        metaDesc_zh: '2024年流行夏季时尚风格',
        metaDesc_en: 'Popular summer fashion styles for 2024',
        isPublished: true,
        isFeatured: true,
      },
      {
        slug: 'benefits-of-vitamin-c-for-skin',
        title_lo: 'ປະໂຫຍດຂອງວິຕາມິນຊີຕໍ່ຜິວ',
        title_th: 'ประโยชน์ของวิตามินซีต่อผิว',
        title_zh: '维生素C对皮肤的好处',
        title_en: 'Benefits of Vitamin C for Skin',
        excerpt_lo: 'ວິຕາມິນຊີມີບົດບາດສຳຄັນໃນການດູແລຜິວ ແລະ ສ້າງຄວາມງາມ',
        excerpt_th: 'วิตามินซีมีบทบาทสำคัญในการดูแลผิวและสร้างความงาม',
        excerpt_zh: '维生素C在护肤和美容方面起着重要作用',
        excerpt_en: 'Vitamin C plays an important role in skin care and beauty',
        content_lo: 'ວິຕາມິນຊີແມ່ນສານບຳລຸງທີ່ຈຳເປັນຕໍ່ສຸຂະພາບຜິວ... ມັນຊ່ວຍເພີ່ມການຜະລິດຄອລລາເຈນ...',
        content_th: 'วิตามินซีเป็นสารอาหารที่จำเป็นต่อสุขภาพผิว... ช่วยเพิ่มการผลิตคอลลาเจน...',
        content_zh: '维生素C是皮肤健康必需的营养素... 帮助促进胶原蛋白生成...',
        content_en: 'Vitamin C is an essential nutrient for skin health... It helps boost collagen production...',
        featuredImage: null,
        metaTitle_lo: 'ປະໂຫຍດວິຕາມິນຊີຕໍ່ຜິວ',
        metaTitle_th: 'ประโยชน์วิตามินซีต่อผิว',
        metaTitle_zh: '维生素C对皮肤的好处',
        metaTitle_en: 'Vitamin C Skin Benefits',
        metaDesc_lo: 'ປະໂຫຍດຂອງວິຕາມິນຊີໃນການບຳລຸງຜິວ',
        metaDesc_th: 'ประโยชน์ของวิตามินซีในการดูแลผิว',
        metaDesc_zh: '维生素C护肤的好处',
        metaDesc_en: 'Benefits of vitamin C for skin care',
        isPublished: true,
        isFeatured: false,
      },
      {
        slug: 'collagen-beauty-secrets',
        title_lo: 'ຄວາມລັບຄວາມງາມຂອງຄອລລາເຈນ',
        title_th: 'ความลับความงามของคอลลาเจน',
        title_zh: '胶原蛋白的美容秘诀',
        title_en: 'Collagen Beauty Secrets',
        excerpt_lo: 'ຄອລລາເຈນຄືນຄວາມອ່ອນໜຸ່ມ ແລະ ສ້າງຄວາມງາມຈາກພາຍໃນ',
        excerpt_th: 'คอลลาเจนฟื้นฟูความอ่อนเยาว์และสร้างความงามจากภายใน',
        excerpt_zh: '胶原蛋白恢复年轻，从内而外创造美丽',
        excerpt_en: 'Collagen restores youthfulness and creates beauty from within',
        content_lo: 'ຄອລລາເຈນແມ່ນໂປຼຕີນທີ່ພົບໄດ້ຕາມທຳມະຊາດໃນຮ່າງກາຍຂອງພວກເຮົາ... ມັນຊ່ວຍໃຫ້ຜິວມີຄວາມຍືດ...',
        content_th: 'คอลลาเจนเป็นโปรตีนที่พบตามธรรมชาติในร่างกายของเรา... ช่วยให้ผิวยืดหยุ่น...',
        content_zh: '胶原蛋白是我们体内天然存在的蛋白质... 帮助皮肤保持弹性...',
        content_en: 'Collagen is a naturally occurring protein in our bodies... It helps keep skin supple...',
        featuredImage: null,
        metaTitle_lo: 'ຄວາມລັບຄອລລາເຈນ',
        metaTitle_th: 'ความลับคอลลาเจน',
        metaTitle_zh: '胶原蛋白秘诀',
        metaTitle_en: 'Collagen Beauty Secrets',
        metaDesc_lo: 'ປະໂຫຍດຂອງຄອລລາເຈນຕໍ່ຄວາມງາມ',
        metaDesc_th: 'ประโยชน์ของคอลลาเจนต่อความงาม',
        metaDesc_zh: '胶原蛋白对美容的好处',
        metaDesc_en: 'Benefits of collagen for beauty',
        isPublished: true,
        isFeatured: false,
      },
    ];

    for (const article of articles) {
      const existing = await prisma.article.findUnique({
        where: { slug: article.slug },
      });

      if (existing) {
        console.log(`  ⚠️  Article "${article.title_en}" already exists, skipping...`);
      } else {
        await prisma.article.create({
          data: {
            ...article,
            createdById: admin.id,
            publishedAt: new Date(),
          },
        });
        console.log(`  ✅ Created article: ${article.title_en}`);
      }
    }

    console.log('\n🎉 Articles seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Articles: ${articles.length}`);
    console.log('\n✨ You can now view your articles at:');
    console.log('   - Admin: http://localhost:3001/admin/articles');
    console.log('   - Public: http://localhost:3001/articles\n');
    
  } catch (error) {
    console.error('\n❌ Error seeding articles:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
