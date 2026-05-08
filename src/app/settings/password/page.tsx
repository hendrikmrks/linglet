'use client';

import { Protected } from '@/components/protected';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, FormEvent } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

export default function ChangePasswordPage() {
  return (
    <Protected>
      {() => (
        <ChangePasswordForm />
      )}
    </Protected>
  );
}

function ChangePasswordForm() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({});

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.issues) {
          const errors: Record<string, string> = {};
          data.issues.forEach((issue: any) => {
            const path = issue.path[0] as string;
            errors[path] = issue.message;
          });
          setFieldErrors(errors);
        } else {
          setError(data.error || t('settings.changePasswordFailed'));
        }
        return;
      }

      setSuccess(true);
      setFormData({ currentPassword: '', newPassword: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(t('auth.errorOccurred'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      title={t('settings.changePasswordTitle')}
      description={t('settings.changePasswordDescription')}
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {t('settings.changePasswordSuccess')}
        </div>
      )}

      <Input
        label={t('settings.currentPassword')}
        type="password"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={handleChange}
        error={fieldErrors.currentPassword}
      />

      <Input
        label={t('settings.newPassword')}
        type="password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        error={fieldErrors.newPassword}
      />

      <Button type="submit" isLoading={isLoading}>
        {t('settings.changePasswordButton')}
      </Button>
    </Form>
  );
}
