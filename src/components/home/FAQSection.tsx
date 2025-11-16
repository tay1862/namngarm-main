'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQSectionProps {
  locale: string;
}

export default function FAQSection({ locale }: FAQSectionProps) {
  const t = useTranslations();
  const tFaq = useTranslations('faq');
  const tContact = useTranslations('contact');
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`/api/faqs?limit=4&locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          const transformedFAQs = data.map((faq: any) => ({
            id: faq.id,
            question: faq[`question_${locale}`] || faq.question_en,
            answer: faq[`answer_${locale}`] || faq.answer_en,
            category: faq.category?.[`name_${locale}`] || faq.category?.name_en || (locale === 'th' ? 'ทั่วไป' : locale === 'lo' ? 'ທົ່ວໄປ' : 'General')
          }));
          setFaqs(transformedFAQs);
        }
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [locale, tFaq]); // Add locale and tFaq as dependencies

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="section-padding soft-gradient-bg">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-pink-500" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-6">
            {tFaq('title')}
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            {tFaq('description')}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="relative">
                  <ChevronDown size={48} className="animate-spin text-pink-500 mx-auto mb-4" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-pink-100 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-neutral-600 text-lg">{tFaq('loadingFaqs')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl overflow-hidden border border-neutral-150 hover:border-pink-200 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-pink-25 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                        <span className="text-pink-500 font-semibold text-sm">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="font-medium text-neutral-800 pr-4">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${
                        openItem === faq.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {openItem === faq.id && (
                    <div className="px-6 pb-5 border-t border-neutral-100">
                      <div className="pt-4 pl-14">
                        <p className="text-neutral-600 leading-relaxed">
                          {faq.answer}
                        </p>
                        <div className="mt-3">
                          <span className="inline-block px-3 py-1 bg-pink-50 text-pink-500 text-sm rounded-full">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-neutral-600 mb-6">
            {tFaq('stillHaveQuestions')}
          </p>
          <a
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center gap-3 rounded-2xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed antialiased bg-pink-500 text-white hover:bg-pink-550 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-pink-500/25 px-10 py-5 text-lg"
          >
            {tContact('getInTouch')}
          </a>
          <a
            href={`/${locale}/faq`}
            className="inline-flex items-center justify-center gap-3 rounded-2xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed antialiased bg-white text-pink-500 border-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300 px-10 py-5 text-lg ml-4"
          >
            {tFaq('viewAll')}
          </a>
        </div>
      </div>
    </section>
  );
}
