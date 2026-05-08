'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

interface User {
  id: string;
  email: string;
  name: string;
  plan: 'FREE' | 'PREMIUM';
  xp: number;
  streakCount: number;
  streakUpdatedAt?: string | null;
  isAdmin?: boolean;
  onboardingComplete?: boolean;
}

interface ProtectedProps {
  children: (user: User) => React.ReactNode;
}

export function Protected({ children }: ProtectedProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const userData = await response.json();
        // Redirect to onboarding if not completed
        if (!userData.onboardingComplete) {
          router.push('/onboarding');
          return;
        }
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('protected.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children(user)}</>;
}
