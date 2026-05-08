'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { useTranslation, LANGUAGES } from '@/lib/use-translation';
import { useUser } from '@/lib/user-context';

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation(language);
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [animatedXP, setAnimatedXP] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [isLoading, user, router]);

  // Animate XP counter on load
  useEffect(() => {
    const target = 48;
    let current = 0;
    const timer = setInterval(() => {
      current += 2;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setAnimatedXP(current);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  // Show "correct" animation after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowCorrect(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (user) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Playful background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-green-200/60 blur-3xl animate-pulse" />
        <div className="absolute top-20 right-[-6rem] h-96 w-96 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-yellow-200/50 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-[-4rem] h-64 w-64 rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="text-center py-8">
        {/* Mascot & Brand */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <span className="text-8xl sm:text-9xl block animate-bounce" style={{ animationDuration: '2s' }}>🦜</span>
            <div className="absolute -right-3 -top-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
              +XP
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-green-700 mb-4">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          {t('home.heroTagline')}
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight max-w-4xl mx-auto">
          {t('home.heroTitle')}
        </h1>

        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t('home.heroSubtitle')}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white text-lg px-10 py-6 rounded-2xl shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all hover:scale-105 font-bold">
              🚀 {t('home.ctaPrimary')}
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg" className="text-lg px-10 py-6 rounded-2xl border-2 border-gray-200 hover:border-green-300 transition-all hover:scale-105 font-semibold">
              {t('home.ctaSecondary')}
            </Button>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-green-200 px-4 py-1.5 text-sm font-medium text-green-700 shadow-sm">
            ⚡ {t('home.badge1')}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
            🧠 {t('home.badge2')}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-amber-200 px-4 py-1.5 text-sm font-medium text-amber-700 shadow-sm">
            🏆 {t('home.badge3')}
          </span>
        </div>
      </section>

      {/* ===== INTERACTIVE PREVIEW ===== */}
      <section className="mt-16 max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Preview header bar */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <p className="text-white font-bold text-sm">{t('home.previewBadge')}</p>
                <p className="text-green-100 text-xs">{t('home.previewSubtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur rounded-full px-3 py-1 text-white text-xs font-bold flex items-center gap-1">
                🔥 {t('home.previewProgress')}
              </div>
            </div>
          </div>

          {/* Quiz card */}
          <div className="p-6">
            <p className="text-lg font-bold text-gray-900 mb-1">{t('home.previewPrompt')}</p>
            <p className="text-sm text-gray-500 mb-4">{t('home.previewMode')}</p>

            <div className="grid grid-cols-2 gap-3">
              {[t('home.previewOption1'), t('home.previewOption2'), t('home.previewOption3'), t('home.previewOption4')].map((option, index) => (
                <div
                  key={option}
                  className={`rounded-2xl border-2 px-4 py-3 text-sm font-bold text-center transition-all cursor-pointer ${
                    index === 0 && showCorrect
                      ? 'border-green-400 bg-green-50 text-green-700 scale-105 shadow-md shadow-green-100'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {index === 0 && showCorrect && <span className="mr-1">✅</span>}
                  {option}
                </div>
              ))}
            </div>

            {/* Animated progress bar */}
            {showCorrect && (
              <div className="mt-5 bg-green-50 rounded-2xl p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-green-700">🎉 {t('home.previewStatTitle')}</span>
                  <span className="text-xs text-green-600 font-medium">{t('home.previewStatHint')}</span>
                </div>
                <div className="h-3 bg-green-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: '65%' }} />
                </div>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{t('home.stat1Value')}</p>
                <p className="text-xs text-gray-500 font-medium">{t('home.stat1Label')}</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-green-600">{animatedXP}</p>
                <p className="text-xs text-gray-500 font-medium">{t('home.stat2Label')}</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{t('home.stat3Value')}</p>
                <p className="text-xs text-gray-500 font-medium">{t('home.stat3Label')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="mt-20">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-green-600 font-bold">{t('home.featuresTag')}</p>
          <h2 className="mt-3 text-4xl font-extrabold text-gray-900">{t('home.featuresTitle')}</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">{t('home.featuresSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[
            { icon: '🧭', color: 'bg-blue-50 border-blue-200', iconBg: 'bg-blue-100', title: t('home.feature1Title'), desc: t('home.feature1Desc') },
            { icon: '⚡', color: 'bg-yellow-50 border-yellow-200', iconBg: 'bg-yellow-100', title: t('home.feature2Title'), desc: t('home.feature2Desc') },
            { icon: '🎧', color: 'bg-purple-50 border-purple-200', iconBg: 'bg-purple-100', title: t('home.feature3Title'), desc: t('home.feature3Desc') },
            { icon: '🧠', color: 'bg-pink-50 border-pink-200', iconBg: 'bg-pink-100', title: t('home.feature4Title'), desc: t('home.feature4Desc') },
            { icon: '📈', color: 'bg-green-50 border-green-200', iconBg: 'bg-green-100', title: t('home.feature5Title'), desc: t('home.feature5Desc') },
            { icon: '🧳', color: 'bg-orange-50 border-orange-200', iconBg: 'bg-orange-100', title: t('home.feature6Title'), desc: t('home.feature6Desc') },
          ].map((item) => (
            <div key={item.title} className={`rounded-2xl border ${item.color} p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-default`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.iconBg} text-2xl`}>
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="mt-20">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-green-600 font-bold">{t('home.stepsTag')}</p>
          <h2 className="mt-3 text-4xl font-extrabold text-gray-900">{t('home.stepsTitle')}</h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">{t('home.stepsSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { step: 1, icon: '🌍', title: t('home.step1Title'), desc: t('home.step1Desc'), color: 'from-blue-500 to-blue-600' },
            { step: 2, icon: '🎮', title: t('home.step2Title'), desc: t('home.step2Desc'), color: 'from-green-500 to-green-600' },
            { step: 3, icon: '🏆', title: t('home.step3Title'), desc: t('home.step3Desc'), color: 'from-amber-500 to-amber-600' },
          ].map((item) => (
            <div key={item.step} className="relative bg-white rounded-3xl border border-gray-100 p-6 shadow-sm text-center hover:shadow-lg transition-all hover:scale-[1.03]">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} text-3xl text-white shadow-lg mb-4`}>
                {item.icon}
              </div>
              <div className={`absolute -top-3 -right-2 bg-gradient-to-br ${item.color} text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-md`}>
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stack / Skills */}
          <div className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-green-600 font-bold">{t('home.stackTag')}</p>
            <h3 className="mt-3 text-2xl font-extrabold text-gray-900">{t('home.stackTitle')}</h3>
            <p className="mt-2 text-sm text-gray-600">{t('home.stackSubtitle')}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { label: t('home.stack1'), icon: '📖' },
                { label: t('home.stack2'), icon: '👂' },
                { label: t('home.stack3'), icon: '🗣️' },
                { label: t('home.stack4'), icon: '🔄' },
              ].map((chip) => (
                <span key={chip.label} className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm border border-green-100">
                  {chip.icon} {chip.label}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">{t('home.testimonialTag')}</p>
            <h3 className="mt-3 text-2xl font-extrabold text-gray-900">{t('home.testimonialTitle')}</h3>
            <div className="mt-4 space-y-4">
              {[
                { quote: t('home.testimonial1Quote'), name: t('home.testimonial1Name'), role: t('home.testimonial1Role'), avatar: '🧑‍🎨' },
                { quote: t('home.testimonial2Quote'), name: t('home.testimonial2Name'), role: t('home.testimonial2Role'), avatar: '🧳' },
              ].map((item) => (
                <div key={item.name} className="rounded-2xl bg-gray-50 border border-gray-100 p-4 hover:bg-green-50 hover:border-green-200 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.avatar}</span>
                    <div>
                      <p className="text-sm text-gray-700 italic">&ldquo;{item.quote}&rdquo;</p>
                      <p className="mt-2 text-xs font-bold text-gray-600">{item.name} · <span className="font-normal text-gray-500">{item.role}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="mt-20">
        <div className="rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 text-white p-10 lg:p-14 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-4 left-8 text-6xl opacity-20 rotate-[-15deg]">🦜</div>
          <div className="absolute bottom-4 right-8 text-5xl opacity-20 rotate-[15deg]">🎯</div>
          <div className="absolute top-1/2 left-4 text-4xl opacity-10">⭐</div>
          <div className="absolute bottom-1/3 right-1/4 text-4xl opacity-10">🔥</div>

          <h2 className="text-3xl lg:text-4xl font-extrabold relative z-10">{t('home.ctaTitle')}</h2>
          <p className="mt-4 text-green-100 text-lg max-w-xl mx-auto relative z-10">{t('home.ctaSubtitle')}</p>
          <Link href="/register" className="relative z-10 inline-block mt-8">
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 text-lg px-10 py-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
              🚀 {t('home.ctaButton')}
            </Button>
          </Link>
        </div>
      </section>

      {/* ===== LANGUAGE SELECTOR ===== */}
      <section className="mt-16 mb-4 flex justify-center">
        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur rounded-2xl border border-gray-200 px-5 py-3 shadow-sm">
          <span className="text-lg">🌐</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'de' | 'en' | 'pt-br')}
            className="bg-transparent text-sm font-medium text-gray-700 border-none outline-none cursor-pointer pr-2"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.code === 'de' ? '🇩🇪' : lang.code === 'en' ? '🇬🇧' : '🇧🇷'} {t(`lesson.languages.${lang.code}`)}
              </option>
            ))}
          </select>
        </div>
      </section>
    </div>
  );
}
