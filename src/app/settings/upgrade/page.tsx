'use client';

import { Protected } from '@/components/protected';
import { Button } from '@/components/ui/button';
import { useState, FormEvent, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

const PLANS = {
  free: {
    name: 'Free Plan',
    price: 'Free',
    color: 'border-gray-200',
    features: [
      '✓ Unlimited vocabulary lessons',
      '✓ Basic grammar exercises',
      '✓ Daily streak tracking',
      '✓ XP system',
    ],
  },
  premium: {
    name: 'Premium Plan',
    price: '€9.99/month',
    color: 'border-blue-200 bg-blue-50',
    features: [
      '✓ Unlimited vocabulary lessons',
      '✓ Basic grammar exercises',
      '✓ Daily streak tracking',
      '✓ XP system',
      '✓ Advanced courses',
      '✓ Offline mode',
      '✓ Priority email support',
      '✓ Custom learning paths',
    ],
  },
};

export default function UpgradePage() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
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
            <div className={`border-2 rounded-xl p-8 ${PLANS.free.color}`}>
              <h2 className="text-2xl font-bold mb-2">{PLANS.free.name}</h2>
              <p className="text-3xl font-bold text-gray-900 mb-6">{PLANS.free.price}</p>

              {user.plan === 'FREE' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg mb-6 text-sm font-medium">
                  {t('upgrade.yourCurrentPlan')}
                </div>
              )}

              <div className="space-y-3">
                {PLANS.free.features.map((feature, i) => (
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
            <div className={`border-2 rounded-xl p-8 ${PLANS.premium.color} relative`}>
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                {t('upgrade.popular')}
              </div>

              <h2 className="text-2xl font-bold mb-2">{PLANS.premium.name}</h2>
              <p className="text-3xl font-bold text-gray-900 mb-6">{PLANS.premium.price}</p>

              {user.plan === 'PREMIUM' && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded-lg mb-6 text-sm font-medium">
                  {t('upgrade.yourCurrentPlan')}
                </div>
              )}

              <div className="space-y-3">
                {PLANS.premium.features.map((feature, i) => (
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
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">{t('upgrade.faq')}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">{t('upgrade.howToUpgrade')}</h3>
                <p className="text-gray-600">
                  {t('upgrade.howToUpgradeAnswer')}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{t('upgrade.canCancel')}</h3>
                <p className="text-gray-600">
                  {t('upgrade.canCancelAnswer')}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{t('upgrade.trial')}</h3>
                <p className="text-gray-600">
                  {t('upgrade.trialAnswer')}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept credit cards (Visa, Mastercard), PayPal, and bank transfers. We'll provide payment details after approving your request.
                </p>
              </div>
            </div>
          </div>
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
