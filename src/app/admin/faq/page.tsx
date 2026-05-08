'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Protected } from '@/components/protected';
import { AdminNav } from '@/components/admin/admin-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaqItem, FAQ_LANGUAGES } from '@/lib/faq';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

type FaqFormState = {
  id: string;
  question: string;
  answer: string;
  language: string;
  order: string;
  isActive: boolean;
};

const INITIAL_FORM: FaqFormState = {
  id: '',
  question: '',
  answer: '',
  language: 'de',
  order: '0',
  isActive: true,
};

function getLanguageLabel(language: string, t: (key: string) => string) {
  switch (language) {
    case 'de':
      return `🇩🇪 ${t('lesson.languages.de')}`;
    case 'pt-br':
      return `🇧🇷 ${t('lesson.languages.pt-br')}`;
    case 'en':
      return `🇬🇧 ${t('lesson.languages.en')}`;
    default:
      return language;
  }
}

export default function AdminFaqPage() {
  return (
    <Protected>
      {(user) => <AdminFaqContent user={user} />}
    </Protected>
  );
}

function AdminFaqContent({ user }: { user: { id: string; isAdmin?: boolean } }) {
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FaqFormState>(INITIAL_FORM);

  const isAdmin = Boolean(user.isAdmin);

  const loadFaqs = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/faq', {
        credentials: 'include',
      });

      if (response.status === 403) {
        setError(t('admin.notAuthorized'));
        return;
      }

      if (!response.ok) {
        setError('FAQs konnten nicht geladen werden.');
        return;
      }

      const data = await response.json();
      setFaqs(data.faqs || []);
    } catch (err) {
      console.error('Failed to load FAQs:', err);
      setError(t('admin.faqLoadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    loadFaqs();
  }, [isAdmin]);

  const openCreateModal = () => {
    setForm(INITIAL_FORM);
    setMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FaqItem) => {
    setForm({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      language: faq.language,
      order: String(faq.order),
      isActive: faq.isActive,
    });
    setMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(INITIAL_FORM);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setMessage(null);

      const isEdit = Boolean(form.id);
      const response = await fetch(isEdit ? `/api/admin/faq/${form.id}` : '/api/admin/faq', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          question: form.question,
          answer: form.answer,
          language: form.language,
          order: Number(form.order),
          isActive: form.isActive,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || t('admin.faqSaveFailed'));
        return;
      }

      await loadFaqs();
      closeModal();
      setMessage(isEdit ? t('admin.faqUpdated') : t('admin.faqCreated'));
    } catch (err) {
      console.error('Failed to save FAQ:', err);
      setError(t('admin.faqSaveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (faq: FaqItem) => {
    if (!window.confirm(`${t('admin.faqDeleteConfirm')}\n\n${faq.question}`)) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setMessage(null);

      const response = await fetch(`/api/admin/faq/${faq.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || t('admin.faqDeleteFailed'));
        return;
      }

      await loadFaqs();
      setMessage(t('admin.faqDeleted'));
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
      setError(t('admin.faqDeleteFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('admin.faqManagementTitle')}</h1>
        <p className="text-gray-600 mb-6">{t('admin.notAuthorized')}</p>
        <Button onClick={() => router.push('/dashboard')}>
          {t('admin.backToDashboard')}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('admin.faqManagementTitle')}</h1>
        <p className="text-gray-600">{t('admin.faqManagementSubtitle')}</p>
      </div>

      <AdminNav />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('admin.faqTitle')}</h2>
            <p className="text-sm text-gray-500">{t('admin.faqSortHint')}</p>
          </div>
          <Button onClick={openCreateModal}>{t('admin.faqAdd')}</Button>
        </div>

        {isLoading ? (
          <div className="rounded-lg bg-gray-50 px-4 py-6 text-gray-600">{t('admin.loading')}</div>
        ) : faqs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center text-gray-500">
            {t('admin.faqEmpty')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="py-2 pr-4">{t('admin.faqQuestion')}</th>
                  <th className="py-2 pr-4">{t('admin.faqLanguage')}</th>
                  <th className="py-2 pr-4">{t('admin.faqOrder')}</th>
                  <th className="py-2 pr-4">{t('admin.shopStatus')}</th>
                  <th className="py-2 pr-4">{t('admin.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq) => (
                  <tr key={faq.id} className="border-t border-gray-100 align-top">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-gray-900">{faq.question}</div>
                      <div className="mt-1 max-w-2xl whitespace-pre-line text-xs text-gray-500">{faq.answer}</div>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{getLanguageLabel(faq.language, t)}</td>
                    <td className="py-3 pr-4 text-gray-600">{faq.order}</td>
                    <td className="py-3 pr-4">
                      {faq.isActive ? (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                          {t('admin.shopActive')}
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                          {t('admin.shopInactive')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openEditModal(faq)}>
                          {t('common.edit')}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(faq)} isLoading={isSaving}>
                          {t('common.delete')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {form.id ? t('admin.faqEdit') : t('admin.faqAdd')}
                </h3>
                <p className="text-sm text-gray-500">{t('admin.faqModalHint')}</p>
              </div>
              <Button variant="secondary" onClick={closeModal}>{t('common.cancel')}</Button>
            </div>

            <div className="space-y-4">
              <Input
                label={t('admin.faqQuestion')}
                value={form.question}
                onChange={(event) => setForm((current) => ({ ...current, question: event.target.value }))}
                placeholder={t('admin.faqQuestionPlaceholder')}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">{t('admin.faqAnswer')}</label>
                <textarea
                  value={form.answer}
                  onChange={(event) => setForm((current) => ({ ...current, answer: event.target.value }))}
                  placeholder={t('admin.faqAnswerPlaceholder')}
                  rows={6}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">{t('admin.faqLanguage')}</label>
                  <select
                    value={form.language}
                    onChange={(event) => setForm((current) => ({ ...current, language: event.target.value }))}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {FAQ_LANGUAGES.map((faqLanguage) => (
                      <option key={faqLanguage} value={faqLanguage}>
                        {getLanguageLabel(faqLanguage, t)}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label={t('admin.faqOrder')}
                  type="number"
                  value={form.order}
                  onChange={(event) => setForm((current) => ({ ...current, order: event.target.value }))}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
                />
                {t('admin.shopActive')}
              </label>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button variant="secondary" onClick={closeModal}>{t('common.cancel')}</Button>
              <Button onClick={handleSave} isLoading={isSaving}>{t('common.save')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
