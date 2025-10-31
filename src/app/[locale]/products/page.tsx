import { getTranslations } from 'next-intl/server';
import ProductsList from '@/components/products/ProductsList';

export const dynamic = 'force-dynamic';

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products?published=true`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage({ params }: { params: { locale: string } }) {
  const products = await getProducts();
  const t = await getTranslations({ locale: params.locale });

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-pink-50 via-white to-pink-50 py-16">
        <div className="container-custom">
          <h1 className="text-5xl font-heading font-bold mb-4 text-center bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
            {t('product.allProducts')}
          </h1>
          <p className="text-center text-gray-600 mb-12">
            ສິນຄ້າຄຸນນະພາບດີ ສຳລັບທຸກທ່ານ
          </p>

          <ProductsList products={products} locale={params.locale} />
        </div>
      </section>
    </div>
  );
}
