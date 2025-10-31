'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useSettings } from '@/hooks/useSettings';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const navigation = [
    { name: t('home'), href: `/${locale}` },
    { name: t('about'), href: `/${locale}/about` },
    { name: t('products'), href: `/${locale}/products` },
    { name: t('articles'), href: `/${locale}/articles` },
    { name: 'FAQ', href: `/${locale}/faq` },
    { name: t('tags'), href: `/${locale}/tags` },
    { name: t('contact'), href: `/${locale}/contact` },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-neutral-150 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-4 group">
            <div className="relative w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg group-hover:shadow-pink-500/25 transition-all duration-300 group-hover:scale-105">
              <Image
                src={settings?.logo || "/Logo-namngam-white.svg"}
                alt={settings?.[`siteName_${locale}` as keyof typeof settings] || 'NAMNGAM'}
                width={56}
                height={56}
                className="object-contain p-2"
              />
            </div>
            <span className="text-2xl font-heading font-semibold gradient-text group-hover:scale-105 transition-transform duration-300">
              {settings?.[`siteName_${locale}` as keyof typeof settings] || 'NAMNGAM'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base font-medium transition-all duration-300 relative group ${
                  pathname === item.href 
                    ? 'text-pink-500' 
                    : 'text-neutral-600 hover:text-pink-500'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-pink-400 transform transition-transform duration-300 ${
                  pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
            <div className="ml-8">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 rounded-2xl hover:bg-pink-50 transition-colors duration-200"
          >
            {isOpen ? <X size={24} className="text-pink-500" /> : <Menu size={24} className="text-neutral-600" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 space-y-2 border-t border-neutral-150 mt-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-6 py-4 rounded-2xl transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-pink-50 text-pink-500 font-medium'
                    : 'text-neutral-600 hover:bg-pink-25 hover:text-pink-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-6 pt-4">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
