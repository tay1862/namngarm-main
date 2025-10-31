'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Tag, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Tag {
  id: string;
  name_lo: string;
  name_th: string;
  name_zh: string;
  name_en: string;
  slug: string;
  articleCount?: number;
}

export default function TagsPage() {
  const locale = useLocale();
  const t = useTranslations();
  const [tags, setTags] = useState<Tag[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [allTagsResponse, popularResponse] = await Promise.all([
        fetch('/api/tags'),
        fetch('/api/tags?popular=true')
      ]);
      
      const allTagsResult = await allTagsResponse.json();
      const popularResult = await popularResponse.json();
      
      if (allTagsResult.success) {
        setTags(allTagsResult.data);
      }
      
      if (popularResult.success) {
        setPopularTags(popularResult.data);
      }
      
      if (!allTagsResult.success || !popularResult.success) {
        setError('Failed to fetch tags');
      }
    } catch (err) {
      setError('Failed to fetch tags');
      console.error('Tags fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container-custom py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8 w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded mb-12"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Error</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={fetchTags}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-pink-50 via-white to-pink-50 py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              Article Tags
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Browse articles by topic and discover content that interests you
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="text-pink-500" size={24} />
              <h2 className="text-3xl font-heading font-bold">Popular Tags</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {popularTags.map((tag, index) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    href={`/${locale}/tags/${tag.slug}`}
                    className="block p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 hover:border-pink-200 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Tag className="text-pink-500 group-hover:scale-110 transition-transform" size={24} />
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                        {tag.articleCount} {tag.articleCount === 1 ? 'article' : 'articles'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-pink-500 transition-colors">
                      {tag[`name_${locale}` as keyof typeof tag] as string}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Explore all articles tagged with {tag[`name_${locale}` as keyof typeof tag] as string}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All Tags */}
        <section>
          <h2 className="text-3xl font-heading font-bold mb-8">All Tags</h2>
          
          {tags.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tags.map((tag, index) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={`/${locale}/tags/${tag.slug}`}
                    className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-pink-200 group"
                  >
                    <Tag className="text-pink-400 group-hover:text-pink-500 transition-colors" size={18} />
                    <span className="font-medium group-hover:text-pink-500 transition-colors">
                      {tag[`name_${locale}` as keyof typeof tag] as string}
                    </span>
                    {(tag as any).articleCount && (
                      <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {(tag as any).articleCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏷️</div>
              <h3 className="text-xl font-semibold mb-2">No tags found</h3>
              <p className="text-gray-600">
                Tags will appear here once articles are tagged.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
