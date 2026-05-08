'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useUser } from '@/lib/user-context';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, refreshUser } = useUser();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      await refreshUser();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const desktopNavLink = (href: string, icon: string, label: string) => {
    const isActive = pathname === href || pathname.startsWith(href + '/');
    return (
      <Link
        key={href}
        href={href}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <span>{icon}</span> {label}
      </Link>
    );
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-1.5 text-xl font-bold text-blue-600 flex-shrink-0">
              <span className="text-2xl">🦜</span>
              <span>Linglet</span>
            </Link>

            {/* Desktop centre nav – only when logged in */}
            {user && (
              <div className="hidden md:flex items-center gap-1">
                {desktopNavLink('/dashboard', '📚', t('navbar.dashboard'))}
                {desktopNavLink('/leaderboard', '🏆', t('navbar.leaderboard'))}
                {desktopNavLink('/shop', '🛍️', t('navbar.shop'))}
              </div>
            )}

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Guest buttons */}
              {!isLoading && !user && (
                <>
                  {!user && (
                    <Link href="/" className="hidden sm:flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      🏠 {t('navbar.home')}
                    </Link>
                  )}
                  <Link href="/login">
                    <Button variant="secondary" size="sm">🔓 {t('navbar.login')}</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">🚀 {t('navbar.register')}</Button>
                  </Link>
                </>
              )}

              {/* Logged-in: Plan badge + user dropdown */}
              {user && (
                <div className="flex items-center gap-2">
                  {/* Premium badge – desktop only */}
                  {user.plan === 'PREMIUM' ? (
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full">
                      ⭐ {t('navbar.premium')}
                    </span>
                  ) : (
                    <Link
                      href="/settings/upgrade"
                      className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full transition-colors"
                    >
                      ⭐ {t('navbar.upgradeToPremium')}
                    </Link>
                  )}

                  {/* User dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                        {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                      </span>
                      <span className="hidden sm:block text-sm font-medium text-gray-800 max-w-[100px] truncate">
                        {user.name}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                        {/* User info */}
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          <p className="text-xs mt-1">
                            {user.plan === 'PREMIUM'
                              ? <span className="text-yellow-600 font-semibold">⭐ {t('navbar.premium')}</span>
                              : <span className="text-gray-400">{t('navbar.free')}</span>
                            }
                          </p>
                        </div>

                        {/* Lernen */}
                        <div className="py-1">
                          <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{t('navbar.sectionLearn')}</p>
                          <MobileNavLink href="/dashboard" icon="📚" label={t('navbar.dashboard')} />
                          <MobileNavLink href="/leaderboard" icon="🏆" label={t('navbar.leaderboard')} />
                          <MobileNavLink href="/shop" icon="🛍️" label={t('navbar.shop')} />
                        </div>

                        {/* Premium-Features */}
                        {user.plan === 'PREMIUM' && (
                          <div className="py-1 border-t border-gray-100">
                            <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-yellow-500">{t('navbar.sectionPremium')}</p>
                            <MobileNavLink href="/stats" icon="📊" label={t('navbar.stats')} />
                            <MobileNavLink href="/certificate" icon="🏅" label={t('navbar.certificate')} />
                          </div>
                        )}

                        {/* Konto */}
                        <div className="py-1 border-t border-gray-100">
                          <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{t('navbar.sectionAccount')}</p>
                          <MobileNavLink href="/profile" icon="👤" label={t('navbar.profile')} />
                          <MobileNavLink href="/settings/password" icon="🔑" label={t('navbar.changePassword')} />
                          {user.plan === 'FREE' && (
                            <MobileNavLink href="/settings/upgrade" icon="⭐" label={t('navbar.upgradeToPremium')} highlight />
                          )}
                          {user.isAdmin && (
                            <MobileNavLink href="/admin" icon="🛠️" label={t('navbar.admin')} />
                          )}
                        </div>

                        {/* Logout */}
                        <div className="py-1 border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <span>🚪</span> {t('navbar.logout')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

function MobileNavLink({
  href,
  icon,
  label,
  highlight = false,
}: {
  href: string;
  icon: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
        highlight
          ? 'text-blue-600 font-semibold hover:bg-blue-50'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
}


