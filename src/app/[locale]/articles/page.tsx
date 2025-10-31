import { useTranslations } from 'next-intl';
import ArticlesList from '@/components/articles/ArticlesList';

export const dynamic = 'force-dynamic';

export default function ArticlesPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-pink-50 via-white to-pink-50 py-16">
        <div className="container-custom">
          <h1 className="text-5xl font-heading font-bold mb-4 text-center bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
            {t('article.allArticles')}
          </h1>
          <p className="text-center text-gray-600 mb-12">
            ບົດຄວາມ ຂ່າວສານ ແລະ ເຄັດລັບດີໆ
          </p>

          <ArticlesList />
        </div>
      </section>
    </div>
  );
}
