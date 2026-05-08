import type { Metadata, Viewport } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BottomNav } from '@/components/bottom-nav';
import { PWARegister } from '@/components/pwa-register';
import { UserProvider } from '@/lib/user-context';
import { LanguageProvider } from '@/lib/language-context';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Linglet – Sprachen lernen',
  description: 'Lerne Sprachen spielerisch mit Linglet – gamifiziertes Sprachenlernen',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Linglet',
  },
  icons: {
    apple: '/icons/icon-192.png',
    icon: '/icons/icon-192.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#2563eb',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <UserProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex flex-col items-center justify-center py-8 px-4 flex-1 w-full max-w-6xl mx-auto pb-20 md:pb-8">
              {children}
            </main>
            <div className="hidden md:block">
              <Footer />
            </div>
            <BottomNav />
            <PWARegister />
          </LanguageProvider>
        </UserProvider>
      </body>
    </html>
  );
}

