'use client';

import React, { useState, FormEvent } from 'react';
import { Form } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { registerSchema, loginSchema } from '@/lib/validators';
import Link from 'next/link';
import { useUser } from '@/lib/user-context';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { refreshUser } = useUser();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    learningLanguage: 'pt-br',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const resolveErrorMessage = (message: string) => {
    if (message.startsWith('auth.')) {
      return t(message as any);
    }
    return message;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // Validate form
      const schema = mode === 'login' ? loginSchema : registerSchema;
      const validation = schema.safeParse(formData);

      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          errors[path] = resolveErrorMessage(issue.message);
        });
        setFieldErrors(errors);
        return;
      }

      // Submit to API
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || t(mode === 'login' ? 'auth.loginFailed' : 'auth.registerFailed'));
        return;
      }

      // Success - refresh user and redirect
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        learningLanguage: 'pt-br',
      });
      await refreshUser();
      router.push(mode === 'register' ? '/onboarding' : '/dashboard');
    } catch (err) {
      setError(t('auth.errorOccurred'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      title={t(mode === 'login' ? 'auth.loginTitle' : 'auth.registerTitle')}
      description={t(
        mode === 'login'
          ? 'auth.loginDescription'
          : 'auth.registerDescription'
      )}
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Input
        label={t('auth.email')}
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="you@example.com"
        error={fieldErrors.email}
      />

      {mode === 'register' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('auth.firstName')}
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder={t('auth.firstNamePlaceholder')}
              error={fieldErrors.firstName}
            />
            <Input
              label={t('auth.lastName')}
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder={t('auth.lastNamePlaceholder')}
              error={fieldErrors.lastName}
            />
          </div>
          <Input
            label={t('auth.birthDate')}
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            error={fieldErrors.birthDate}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="learningLanguage">
              {t('auth.learningLanguage')}
            </label>
            <select
              id="learningLanguage"
              name="learningLanguage"
              value={formData.learningLanguage}
              onChange={handleSelectChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">{t('lesson.languages.en')}</option>
              <option value="de">{t('lesson.languages.de')}</option>
              <option value="pt-br">{t('lesson.languages.pt-br')}</option>
            </select>
            {fieldErrors.learningLanguage && (
              <p className="text-sm text-red-600">{fieldErrors.learningLanguage}</p>
            )}
          </div>
        </>
      )}

      <Input
        label={t('auth.password')}
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        error={fieldErrors.password}
      />

      {mode === 'register' && (
        <Input
          label={t('auth.confirmPassword')}
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          error={fieldErrors.confirmPassword}
        />
      )}

      <Button type="submit" isLoading={isLoading}>
        {t(mode === 'login' ? 'auth.signIn' : 'auth.createAccount')}
      </Button>

      <div className="text-center text-sm text-gray-600">
        {mode === 'login' ? (
          <>
            {t('auth.noAccount')}{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              {t('auth.registerLink')}
            </Link>
          </>
        ) : (
          <>
            {t('auth.haveAccount')}{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              {t('auth.signInLink')}
            </Link>
          </>
        )}
      </div>
    </Form>
  );
}
