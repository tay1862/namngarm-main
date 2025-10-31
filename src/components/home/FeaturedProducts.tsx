'use client';

import { useTranslations, useLocale } from 'next-intl';
import { getLocalizedField } from '@/lib/i18n-helpers';
import { Locale } from '@/i18n';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FeaturedProducts() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?featured=true&published=true&limit=3');
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-2">
              {t('product.featured')}
            </h2>
            <p className="text-gray-600">{t('product.latest')}</p>
          </div>
          <Link
            href={`/${locale}/products`}
            className="flex items-center gap-2 text-pink-500 hover:text-pink-600 font-medium"
          >
            {t('common.viewAll')}
            <ArrowRight size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square rounded-xl bg-gray-200 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">ຍັງບໍ່ມີສິນຄ້າແນະນຳ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product: any, index: number) => {
              const name = getLocalizedField(product, 'name', locale);
              const price = product.price ? Number(product.price) : 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="card group cursor-pointer"
                >
                  {product.featuredImage ? (
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
                      <Image
                        src={product.featuredImage}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-100 to-pink-50 mb-4 flex items-center justify-center text-6xl">
                      🎁
                    </div>
                  )}
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-pink-500 transition-colors line-clamp-2">
                    {name}
                  </h3>
                  {price > 0 && (
                    <p className="text-pink-500 font-bold">
                      ₭{price.toLocaleString()}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
