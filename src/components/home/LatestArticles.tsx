'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ArticlesList from '@/components/articles/ArticlesList';

export default function LatestArticles() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-2">
              {t('article.latest')}
            </h2>
            <p className="text-gray-600">{t('article.featured')}</p>
          </div>
          <Link
            href={`/${locale}/articles`}
            className="flex items-center gap-2 text-pink-500 hover:text-pink-600 font-medium"
          >
            {t('common.viewAll')}
            <ArrowRight size={20} />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ArticlesList limit={2} featured={true} />
        </motion.div>
      </div>
    </section>
  );
}
