import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import '../../styles/globals.css';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import StructuredData, { OrganizationStructuredData } from '@/components/seo/StructuredData';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminLoginProvider from '@/components/layout/AdminLoginProvider';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale as any)) notFound();

  // Load messages using the proper next-intl server approach
  // This will automatically use the locale from the params
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
        <GoogleAnalytics />
        <OrganizationStructuredData 
          data={{
            name: 'NAMNGAM',
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3001'}/${locale}`,
            logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3001'}/logo.png`,
            description: 'Premium quality products and beauty items',
            sameAs: [
              process.env.NEXT_PUBLIC_SITE_URL,
            ],
          }} 
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <AdminLoginProvider />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
