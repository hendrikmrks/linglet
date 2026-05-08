'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function KontaktPage() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'general',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', topic: 'general', message: '' });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{t('contact.kicker')}</p>
        <h1 className="mt-3 text-4xl font-display font-semibold text-gray-900">{t('contact.title')}</h1>
        <p className="mt-2 text-gray-600">{t('contact.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">{t('contact.formTitle')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('contact.formSubtitle')}</p>

          {submitted && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <p className="font-semibold">{t('contact.successTitle')}</p>
              <p className="text-xs">{t('contact.successSubtitle')}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label={t('contact.fieldName')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('contact.fieldNamePlaceholder')}
              required
            />
            <Input
              label={t('contact.fieldEmail')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('contact.fieldEmailPlaceholder')}
              required
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="topic">
                {t('contact.fieldTopic')}
              </label>
              <select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">{t('contact.topicGeneral')}</option>
                <option value="support">{t('contact.topicSupport')}</option>
                <option value="billing">{t('contact.topicBilling')}</option>
                <option value="partner">{t('contact.topicPartner')}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="message">
                {t('contact.fieldMessage')}
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                placeholder={t('contact.fieldMessagePlaceholder')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <Button type="submit">{t('contact.submit')}</Button>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold text-gray-900">{t('contact.directTitle')}</h2>
          <p className="mt-3 text-gray-600 whitespace-pre-line">{t('contact.directBody')}</p>
        </div>
      </div>
    </div>
  );
}
