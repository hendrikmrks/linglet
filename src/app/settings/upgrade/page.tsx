'use client';

import { Protected } from '@/components/protected';
import { Button } from '@/components/ui/button';
import { useState, FormEvent, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { FaqItem } from '@/lib/faq';

export default function UpgradePage() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const locale = language === 'de' ? 'de-DE' : language === 'pt-br' ? 'pt-BR' : 'en-US';
  const premiumPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(9.99);
  const plans = {
    free: {
      name: t('upgrade.freePlan'),
      price: t('upgrade.freePriceLabel'),
      color: 'border-gray-200',
      features: [
        t('upgrade.unlimitedVocabulary'),
        t('upgrade.basicGrammar'),
        t('upgrade.dailyStreak'),
        t('upgrade.xpSystem'),
      ],
    },
    premium: {
      name: t('upgrade.premiumPlan'),
      price: `${premiumPrice}${t('upgrade.perMonth')}`,
      color: 'border-blue-200 bg-blue-50',
      features: [
        t('upgrade.unlimitedVocabulary'),
        t('upgrade.basicGrammar'),
        t('upgrade.dailyStreak'),
        t('upgrade.xpSystem'),
        t('upgrade.advancedCourses'),
        t('upgrade.offlineMode'),
        t('upgrade.prioritySupport'),
        t('upgrade.customLearning'),
      ],
    },
  };

  useEffect(() => {
    let isMounted = true;

    const loadFaqs = async () => {
      try {
        const response = await fetch(`/api/faq?language=${encodeURIComponent(language)}`);

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const loadedFaqs = data.faqs || [];

        if (!isMounted) {
          return;
        }

        setFaqs(loadedFaqs);
        setOpenFaqId((current) => {
          if (loadedFaqs.some((faq: FaqItem) => faq.id === current)) {
            return current;
          }

          return loadedFaqs[0]?.id ?? null;
        });
      } catch (error) {
        console.error('Error loading FAQs:', error);
      }
    };

    loadFaqs();

    return () => {
      isMounted = false;
    };
  }, [language]);

  return (
    <Protected>
      {(user) => (
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-2 text-center">{t('upgrade.upgradeYourPlan')}</h1>
          <p className="text-gray-600 text-center mb-12">
            {t('upgrade.choosePlan')}
          </p>

          {/* Plans Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Free Plan */}
            <div className={`border-2 rounded-xl p-8 ${plans.free.color}`}>
              <h2 className="text-2xl font-bold mb-2">{plans.free.name}</h2>
              <p className="text-3xl font-bold text-gray-900 mb-6">{plans.free.price}</p>

              {user.plan === 'FREE' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg mb-6 text-sm font-medium">
                  {t('upgrade.yourCurrentPlan')}
                </div>
              )}

              <div className="space-y-3">
                {plans.free.features.map((feature, i) => (
                  <div key={i} className="text-gray-700">
                    {feature}
                  </div>
                ))}
              </div>

              {user.plan !== 'FREE' && (
                <Button variant="secondary" className="w-full mt-8" disabled>
                  {t('upgrade.yourCurrentPlan')}
                </Button>
              )}
            </div>

            {/* Premium Plan */}
            <div className={`border-2 rounded-xl p-8 ${plans.premium.color} relative`}>
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                {t('upgrade.popular')}
              </div>

              <h2 className="text-2xl font-bold mb-2">{plans.premium.name}</h2>
              <p className="text-3xl font-bold text-gray-900 mb-6">{plans.premium.price}</p>

              {user.plan === 'PREMIUM' && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded-lg mb-6 text-sm font-medium">
                  {t('upgrade.yourCurrentPlan')}
                </div>
              )}

              <div className="space-y-3">
                {plans.premium.features.map((feature, i) => (
                  <div key={i} className="text-gray-700">
                    {feature}
                  </div>
                ))}
              </div>

              {user.plan !== 'PREMIUM' && (
                <RequestPremiumModal language={language} />
              )}
            </div>
          </div>

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">{t('upgrade.faq')}</h2>
              <div className="space-y-3">
                {faqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;

                  return (
                    <div key={faq.id} className="overflow-hidden rounded-lg border border-gray-200">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-4 bg-white px-4 py-4 text-left"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      >
                        <span className="text-lg font-bold text-gray-900">{faq.question}</span>
                        <span className="text-2xl text-gray-400">{isOpen ? '−' : '+'}</span>
                      </button>

                      {isOpen && (
                        <div className="whitespace-pre-line border-t border-gray-100 px-4 py-4 text-gray-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Protected>
  );
}

function RequestPremiumModal({ language }: { language: string }) {
  const { t } = useTranslation(language);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    message: '',
  });

  // Check if user has pending request on mount
  useEffect(() => {
    const checkPendingRequest = async () => {
      try {
        const response = await fetch('/api/premium-request', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setHasPendingRequest(data.hasPendingRequest);
        }
      } catch (err) {
        console.error('Error checking pending request:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkPendingRequest();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/premium-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || t('upgrade.requestFailed'));
        return;
      }

      setSuccess(true);
      setFormData({ reason: '', message: '' });
      setHasPendingRequest(true);
      setTimeout(() => setIsOpen(false), 2000);
    } catch (err) {
      setError(t('auth.errorOccurred'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg w-full mt-8 text-center">
        ✓ {t('upgrade.requestSubmitted')}
      </div>
    );
  }

  if (hasPendingRequest) {
    return (
      <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg w-full mt-8 text-center">
        {t('upgrade.requestPending')}
      </div>
    );
  }

  return (
    <>
      <Button 
        className="w-full mt-8" 
        onClick={() => setIsOpen(true)}
        disabled={isChecking}
      >
        {isChecking ? t('common.loading') : t('upgrade.requestPremium')}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold mb-6">{t('upgrade.upgradePlan')}</h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('upgrade.reasonOptional')}
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder={t('upgrade.reasonPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('upgrade.messageOptional')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('upgrade.messagePlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={isLoading}
                >
                  {t('common.submit')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
