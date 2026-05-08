'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/user-context';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { Button } from '@/components/ui/button';

type Step = 'welcome' | 'language' | 'howItWorks' | 'premium' | 'ready';

const STEPS: Step[] = ['welcome', 'language', 'howItWorks', 'premium', 'ready'];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading: userLoading, refreshUser } = useUser();
  const { language: uiLanguage, setLanguage: setUiLanguage } = useLanguage();
  const { t } = useTranslation(uiLanguage);

  const [step, setStep] = useState<Step>('welcome');
  const [nativeLanguage, setNativeLanguage] = useState('de');
  const [learningLanguage, setLearningLanguage] = useState('pt-br');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  // Redirect if not logged in or already onboarded
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
    if (!userLoading && user?.onboardingComplete) {
      router.push('/dashboard');
    }
  }, [user, userLoading, router]);

  if (userLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const goNext = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ language: nativeLanguage, learningLanguage }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t('onboarding.error'));
        return;
      }

      await setUiLanguage(nativeLanguage as 'de' | 'en' | 'pt-br');
      await refreshUser();
      router.push('/dashboard');
    } catch {
      setError(t('onboarding.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const languageOptions = [
    { code: 'de', label: '🇩🇪 Deutsch', flag: '🇩🇪' },
    { code: 'en', label: '🇬🇧 English', flag: '🇬🇧' },
    { code: 'pt-br', label: '🇧🇷 Português', flag: '🇧🇷' },
  ];

  const availableLearning = languageOptions.filter(l => l.code !== nativeLanguage);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{t('onboarding.step')} {stepIndex + 1}/{STEPS.length}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Step: Welcome ── */}
      {step === 'welcome' && (
        <div className="text-center space-y-6">
          <div className="text-6xl">👋</div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('onboarding.welcomeTitle')}
          </h1>
          <p className="text-gray-600 text-lg">
            {t('onboarding.welcomeSubtitle')}
          </p>
          <Button size="lg" className="w-full" onClick={goNext}>
            {t('onboarding.letsGo')}
          </Button>
        </div>
      )}

      {/* ── Step: Language selection ── */}
      {step === 'language' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-5xl mb-3">🌍</div>
            <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.languageTitle')}</h2>
            <p className="text-gray-500 mt-1">{t('onboarding.languageSubtitle')}</p>
          </div>

          {/* Native language */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              {t('onboarding.nativeLanguage')}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {languageOptions.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setNativeLanguage(lang.code);
                    if (lang.code === learningLanguage) {
                      setLearningLanguage(availableLearning.find(l => l.code !== lang.code)?.code || 'en');
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    nativeLanguage === lang.code
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium text-gray-900">{lang.label}</span>
                  {nativeLanguage === lang.code && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Learning language */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              {t('onboarding.learningLanguageLabel')}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {availableLearning.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLearningLanguage(lang.code)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    learningLanguage === lang.code
                      ? 'border-green-500 bg-green-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium text-gray-900">{lang.label}</span>
                  {learningLanguage === lang.code && (
                    <span className="ml-auto text-green-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={goBack}>
              {t('onboarding.back')}
            </Button>
            <Button className="flex-1" onClick={goNext}>
              {t('onboarding.next')}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step: How it works ── */}
      {step === 'howItWorks' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-5xl mb-3">📚</div>
            <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.howTitle')}</h2>
            <p className="text-gray-500 mt-1">{t('onboarding.howSubtitle')}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-bold">1</div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('onboarding.howStep1Title')}</h3>
                <p className="text-sm text-gray-500">{t('onboarding.howStep1Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-lg font-bold">2</div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('onboarding.howStep2Title')}</h3>
                <p className="text-sm text-gray-500">{t('onboarding.howStep2Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-lg font-bold">3</div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('onboarding.howStep3Title')}</h3>
                <p className="text-sm text-gray-500">{t('onboarding.howStep3Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-lg font-bold">4</div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('onboarding.howStep4Title')}</h3>
                <p className="text-sm text-gray-500">{t('onboarding.howStep4Desc')}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={goBack}>
              {t('onboarding.back')}
            </Button>
            <Button className="flex-1" onClick={goNext}>
              {t('onboarding.next')}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step: Premium upsell ── */}
      {step === 'premium' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-5xl mb-3">⭐</div>
            <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.premiumTitle')}</h2>
            <p className="text-gray-500 mt-1">{t('onboarding.premiumSubtitle')}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">👑</span>
              <h3 className="text-lg font-bold text-gray-900">{t('onboarding.premiumPlanName')}</h3>
              <span className="ml-auto bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {t('onboarding.premiumPopular')}
              </span>
            </div>

            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> {t('onboarding.premiumFeature1')}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> {t('onboarding.premiumFeature2')}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> {t('onboarding.premiumFeature3')}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> {t('onboarding.premiumFeature4')}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> {t('onboarding.premiumFeature5')}
              </li>
            </ul>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              onClick={() => {
                // Save onboarding first, then redirect to upgrade page
                handleFinishAndRedirect('/shop');
              }}
            >
              {t('onboarding.premiumCTA')}
            </Button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🆓</span>
              <h3 className="text-lg font-bold text-gray-900">{t('onboarding.freePlanName')}</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> {t('onboarding.freeFeature1')}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> {t('onboarding.freeFeature2')}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> {t('onboarding.freeFeature3')}
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={goBack}>
              {t('onboarding.back')}
            </Button>
            <Button className="flex-1" onClick={goNext}>
              {t('onboarding.continueForFree')}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step: Ready ── */}
      {step === 'ready' && (
        <div className="text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('onboarding.readyTitle')}
          </h1>
          <p className="text-gray-600 text-lg">
            {t('onboarding.readySubtitle')}
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">{t('onboarding.nativeLanguage')}:</span>
              <span>{languageOptions.find(l => l.code === nativeLanguage)?.label}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">{t('onboarding.learningLanguageLabel')}:</span>
              <span>{languageOptions.find(l => l.code === learningLanguage)?.label}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={goBack}>
              {t('onboarding.back')}
            </Button>
            <Button size="lg" className="flex-1" onClick={handleFinish} isLoading={isSubmitting}>
              {t('onboarding.startLearning')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  async function handleFinishAndRedirect(redirectTo: string) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ language: nativeLanguage, learningLanguage }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t('onboarding.error'));
        return;
      }

      await setUiLanguage(nativeLanguage as 'de' | 'en' | 'pt-br');
      await refreshUser();
      router.push(redirectTo);
    } catch {
      setError(t('onboarding.error'));
    } finally {
      setIsSubmitting(false);
    }
  }
}
