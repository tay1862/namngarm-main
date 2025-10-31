import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import FAQsClient from './FAQsClient';
import { Loading } from '@/components/shared/Loading';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('faq');
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function FAQPage() {
  const t = await getTranslations('faq');

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-neutral-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-100 via-pink-50 to-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light text-neutral-800 mb-6 tracking-wide">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <Suspense fallback={<Loading />}>
        <FAQsClient />
      </Suspense>
    </div>
  );
}
