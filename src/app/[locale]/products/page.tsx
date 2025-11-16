import { getTranslations } from 'next-intl/server';
import ProductsList from '@/components/products/ProductsList';
import { Loading } from '@/components/shared/Loading';
import DynamicBackground from '@/components/shared/DynamicBackground';
import { PageStructuredData } from '@/components/seo/StructuredData';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getProducts() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products?published=true`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('API response not ok:', res.status, res.statusText);
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Products API response:', data);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'product' });
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: `${t('allProducts')} | NAMNGAM`,
    description: t('description'),
    openGraph: {
      title: t('allProducts'),
      description: t('description'),
      url: `${baseUrl}/${params.locale}/products`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('allProducts'),
      description: t('description'),
    },
  };
}

export default async function ProductsPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'product' });

  const breadcrumbs = [
    { name: t('nav.home'), url: `/${params.locale}` },
    { name: t('allProducts'), url: `/${params.locale}/products` },
  ];

  const products = await getProducts();

  return (
    <>
      {/* Structured Data */}
      <PageStructuredData
        title={t('allProducts')}
        description={t('description')}
        breadcrumbs={breadcrumbs}
        locale={params.locale}
      />
      
      <div className="min-h-screen">
        <DynamicBackground type="productsBg" fallbackClass="bg-gradient-to-br from-pink-50 via-white to-pink-50">
          <section className="py-16">
            <div className="container-custom">
              <h1 className="text-5xl font-heading font-bold mb-4 text-center bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                {t('allProducts')}
              </h1>
              <p className="text-center text-gray-600 mb-12">
                {t('description')}
              </p>

              {products.length === 0 ? (
                <Loading message="กำลังโหลดสินค้า..." />
              ) : (
                <ProductsList products={products} locale={params.locale} />
              )}
            </div>
          </section>
        </DynamicBackground>
      </div>
    </>
  );
}

