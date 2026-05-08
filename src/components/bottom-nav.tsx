'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { useUser } from '@/lib/user-context';

const navItems = [
  { href: '/dashboard', icon: '📚', labelKey: 'navbar.dashboard' },
  { href: '/leaderboard', icon: '🏆', labelKey: 'navbar.leaderboard' },
  { href: '/shop', icon: '🛍️', labelKey: 'navbar.shop' },
  { href: '/profile', icon: '👤', labelKey: 'navbar.profile' },
];

export function BottomNav() {
  const { user } = useUser();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const pathname = usePathname();

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="grid grid-cols-4 h-16">
        {navItems.map(({ href, icon, labelKey }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span className={`text-xl leading-none transition-transform ${isActive ? 'scale-110' : ''}`}>
                {icon}
              </span>
              <span className={`${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                {t(labelKey)}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
