import { useTranslations } from 'next-intl';

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gradient-to-br from-pink-50 via-white to-pink-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-heading font-bold mb-8 text-center bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              ກ່ຽວກັບ NAMNGAM
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <div className="card mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-pink-500">
                  ເລື່ອງລາວຂອງພວກເຮົາ
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  NAMNGAM ORIGINAL ເປັນແບຣນທີ່ມຸ່ງໝັ້ນໃນການນຳສະເໜີສິນຄ້າທີ່ມີຄຸນນະພາບ
                  ແລະ ການບໍລິການທີ່ດີທີ່ສຸດໃຫ້ກັບລູກຄ້າທຸກທ່ານ.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  ພວກເຮົາເຊື່ອວ່າ ຄຸນນະພາບແລະຄວາມງາມທີ່ແທ້ຈິງ ແມ່ນສິ່ງທີ່ທຸກຄົນສົມຄວນໄດ້ຮັບ.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center">
                  <div className="text-5xl mb-4">💎</div>
                  <h3 className="font-semibold text-lg mb-2">ຄຸນນະພາບ</h3>
                  <p className="text-gray-600 text-sm">
                    ສິນຄ້າທຸກຊິ້ນຜ່ານການຄັດເລືອກຢ່າງພິຖີພິຖັນ
                  </p>
                </div>

                <div className="card text-center">
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="font-semibold text-lg mb-2">ຄວາມງາມ</h3>
                  <p className="text-gray-600 text-sm">
                    ອອກແບບສວຍງາມ ທັນສະໄໝ
                  </p>
                </div>

                <div className="card text-center">
                  <div className="text-5xl mb-4">🤝</div>
                  <h3 className="font-semibold text-lg mb-2">ບໍລິການ</h3>
                  <p className="text-gray-600 text-sm">
                    ພ້ອມໃຫ້ຄຳປຶກສາ ດ້ວຍຄວາມເປັນມິດ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
