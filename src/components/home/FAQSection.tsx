'use client';

import { useState } from 'react';
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
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Fetch FAQs from API
  useState(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`/api/faqs?limit=4&locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          const transformedFAQs = data.map((faq: any) => ({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            category: faq.category?.name || (locale === 'th' ? 'ทั่วไป' : locale === 'lo' ? 'ທົ່ວໄປ' : 'General')
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
  });

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
            {locale === 'th' ? 'คำถามที่พบบ่อย' : 
             locale === 'lo' ? 'ຄຳຖາມທີ່ພົບເລື້ອຍ' : 
             'Frequently Asked Questions'}
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            {locale === 'th' ? 'คำตอบสำหรับคำถามที่คุณอาจสงสัยเกี่ยวกับผลิตภัณฑ์และบริการของเรา' :
             locale === 'lo' ? 'ຄຳຕອບສຳລັບຄຳຖາມທີ່ທ່ານອາດສົງໄສເກີຽດກ່ຽວກັບຜະລິດຕະພັນ ແລະ ການບໍລິການຂອງພວກເຮົາ' :
             'Answers to questions you might have about our products and services'}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
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
                          {faq.id}
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
            {locale === 'th' ? 'ยังมีคำถามอื่นๆ อีกหรือไม่?' :
             locale === 'lo' ? 'ຍັງມີຄຳຖາມອື່ນໆ ອີກ ຫຼື ບໍ?' :
             'Still have other questions?'}
          </p>
          <a
            href={`/${locale}/contact`}
            className="btn btn-primary"
          >
            {locale === 'th' ? 'ติดต่อเรา' :
             locale === 'lo' ? 'ຕິດຕໍ່ພວກເຮົາ' :
             'Contact Us'}
          </a>
          <a
            href={`/${locale}/faq`}
            className="btn btn-secondary ml-4"
          >
            {locale === 'th' ? 'ดูคำถามทั้งหมด' :
             locale === 'lo' ? 'ເບິ່ງຄຳຖາມທັງໝົດ' :
             'View All FAQs'}
          </a>
        </div>
      </div>
    </section>
  );
}
