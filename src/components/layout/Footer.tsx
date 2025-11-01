'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Facebook, Mail, Phone } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

// WhatsApp SVG Icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.891-.291-.025-.511.087-.716.314-.205.227-.795.982-.974 1.181-.179.149-1.256-.463-2.391-1.475-.883-.788-1.48-1.761-1.656-2.059-.176-.297-.018-.458.13-.347.064-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771z"/>
  </svg>
);

// LINE SVG Icon
const LineIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#00C300">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771z"/>
  </svg>
);

// Phone SVG Icon
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07-8.67-2.07a2 2 0 0 1-2.18 2 4.11 4.11 0 0 1 2.81.7 2.81.7 0 0 1 1.189.149 1.425.064.614.137 1.189.149 1.425.064.614.137 1.189.149 1.425.064.236.085.411.274.611.629.611.629 0 0 1 .17-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771z"/>
  </svg>
);

// Email SVG Icon
const EmailIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const { settings, loading } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-400 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container-custom py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg overflow-hidden flex items-center justify-center shadow-lg shadow-pink-500/20">
                <Image
                  src={settings?.logo || "/Logo-namngam-white.svg"}
                  alt="NAMNGAM"
                  width={40}
                  height={40}
                  className="object-contain p-1"
                />
              </div>
              <span className="text-lg font-heading font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                {settings?.[`siteName_${locale}` as keyof typeof settings] || 'NAMNGAM'}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-pink-300">{t('nav.home')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-gray-400 hover:text-pink-300 transition-colors duration-300 text-sm"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-gray-400 hover:text-pink-300 transition-colors duration-300 text-sm"
                >
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/products`}
                  className="text-gray-400 hover:text-pink-300 transition-colors duration-300 text-sm"
                >
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/articles`}
                  className="text-gray-400 hover:text-pink-300 transition-colors duration-300 text-sm"
                >
                  {t('nav.articles')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-pink-300">{t('contact.getInTouch')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400 text-sm group">
                <Phone size={16} className="text-pink-400 group-hover:text-pink-300 transition-colors" />
                <span className="group-hover:text-pink-300 transition-colors">
                  {settings?.phone || '+856 20 xxxxxxxx'}
                </span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm group">
                <Mail size={16} className="text-pink-400 group-hover:text-pink-300 transition-colors" />
                <span className="group-hover:text-pink-300 transition-colors">
                  {settings?.email || 'info@namngam.com'}
                </span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4 text-pink-300">Social Media</h3>
            <div className="flex gap-3">
              {settings?.facebookPage && (
                <a
                  href={settings.facebookPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gradient-to-br hover:from-pink-500 hover:to-rose-500 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30 backdrop-blur-sm border border-gray-700/50"
                >
                  <Facebook size={20} className="text-gray-400 hover:text-white transition-colors" />
                </a>
              )}
              
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700/50 mt-8 pt-8 text-center text-sm text-gray-400">
          <p className="flex items-center justify-center gap-2">
            <span className="text-pink-400">©</span>
            <span>{currentYear}</span>
            <span className="bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent font-semibold">NAMNGAM </span>
            <span>.</span>
            <span>{t('footer.allRightsReserved')}.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
