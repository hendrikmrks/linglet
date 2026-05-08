'use client';

import { useTranslation } from '@/lib/use-translation';
import { useLanguage } from '@/lib/language-context';
import { ChapterList } from '@/components/chapter-list';


interface LearningPathProps {
  variant?: 'full' | 'compact';
  titleKey?: string;
  subtitleKey?: string;
}

export function LearningPath({
  variant = 'full',
  titleKey = 'path.title',
  subtitleKey = 'path.subtitle',
}: LearningPathProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const headerClass = variant === 'compact' ? 'text-2xl' : 'text-4xl';
  const subtitleClass = variant === 'compact' ? 'text-sm' : 'text-base';

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className={`${headerClass} font-bold text-gray-900 mb-2`}>{t(titleKey)}</h2>
        <p className={`text-gray-600 ${subtitleClass}`}>{t(subtitleKey)}</p>
      </div>

      <ChapterList />
    </div>
  );
}
