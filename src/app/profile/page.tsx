'use client';

import { Protected } from '@/components/protected';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { useTranslation, LANGUAGES } from '@/lib/use-translation';

export default function ProfilePage() {
  return (
    <Protected>
      {(user) => (
        <ProfileForm user={user} />
      )}
    </Protected>
  );
}

function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: user.name,
    learningLanguage: user.learningLanguage || 'en',
    showFullName: user.showFullName || false,
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Delete state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Avatar handlers
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      // Upload avatar if changed
      let avatarUrl = user.avatarUrl;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        
        const uploadResponse = await fetch('/api/upload-avatar', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!uploadResponse.ok) {
          const data = await uploadResponse.json();
          setProfileError(data.error || t('profile.uploadFailed'));
          setProfileLoading(false);
          return;
        }

        const uploadData = await uploadResponse.json();
        avatarUrl = uploadData.avatarUrl;
      }

      const normalizedAvatarUrl = avatarUrl || '';

      // Update profile
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...profileData,
          avatarUrl: normalizedAvatarUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setProfileError(data.error || t('profile.updateFailed'));
        return;
      }

      setAvatarFile(null);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(t('auth.errorOccurred'));
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Password handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        const data = await response.json();
        setPasswordError(data.error || t('settings.changePasswordFailed'));
        return;
      }

      setPasswordData({ currentPassword: '', newPassword: '' });
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(t('auth.errorOccurred'));
      console.error(err);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        setDeleteError(data.error || t('profile.deleteFailed'));
        setDeleteLoading(false);
        return;
      }

      // Redirect to home after deletion
      router.push('/');
    } catch (err) {
      setDeleteError(t('auth.errorOccurred'));
      console.error(err);
      setDeleteLoading(false);
    }
  };

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as 'de' | 'en' | 'pt-br';
    await setLanguage(newLanguage);
  };

  return (
    <div className="w-full py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('profile.editProfile')}</h1>
        <p className="text-gray-600">{t('profile.manageYourAccount')}</p>
      </div>

      {/* Avatar Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>🖼️</span> {t('profile.profilePicture')}
        </h2>
        
        <div className="flex flex-col gap-6">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <button
              onClick={handleAvatarClick}
              className="relative group"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
              >
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">👤</span>
                )}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">{t('profile.changePhoto')}</span>
              </div>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          <p className="text-center text-sm text-gray-500">{t('profile.photoHint')}</p>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>👤</span> {t('profile.personalInfo')}
        </h2>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {profileError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {profileError}
            </div>
          )}

          {profileSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              ✓ {t('profile.profileUpdated')}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.name')}
            </label>
            <Input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              className="w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.email')}
            </label>
            <Input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-gray-100"
            />
            <p className="text-sm text-gray-500 mt-2">{t('profile.emailNotChangeable')}</p>
          </div>

          {/* Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('navbar.plan')}
            </label>
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
              {user.plan === 'PREMIUM' ? '⭐ ' + t('navbar.premium') : t('navbar.free')}
            </div>
          </div>

          {/* Leaderboard Name Display Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profile.leaderboardName')}
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.showFullName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, showFullName: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t('profile.showFullName')}</span>
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">{t('profile.leaderboardNameHint')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profile.learningLanguage')}
            </label>
            <select
              name="learningLanguage"
              value={profileData.learningLanguage}
              onChange={handleProfileSelectChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            >
              <option value="de">{t('lesson.languages.de')}</option>
              <option value="en">{t('lesson.languages.en')}</option>
              <option value="pt-br">{t('lesson.languages.pt-br')}</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">{t('profile.learningLanguageResetHint')}</p>
          </div>

          <Button 
            type="submit" 
            isLoading={profileLoading}
            className="w-full"
          >
            {t('profile.saveChanges')}
          </Button>
        </form>
      </div>

      {/* Language Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>🌍</span> {t('settings.selectLanguage')}
        </h2>

        <div className="flex flex-col gap-4">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500">{t('profile.languageInfo')}</p>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>🔐</span> {t('settings.changePasswordTitle')}
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          {passwordError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              ✓ {t('settings.changePasswordSuccess')}
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('settings.currentPassword')}
            </label>
            <Input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('settings.newPassword')}
            </label>
            <Input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
            />
            <p className="text-sm text-gray-500 mt-2">{t('profile.passwordHint')}</p>
          </div>

          <Button 
            type="submit" 
            isLoading={passwordLoading}
            className="w-full"
          >
            {t('settings.changePasswordButton')}
          </Button>
        </form>
      </div>

      {/* Delete Account Section */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-2">
          <span>⚠️</span> {t('profile.dangerZone')}
        </h2>

        <div className="space-y-4">
          <p className="text-red-800">{t('profile.deleteWarning')}</p>

          {deleteError && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
              {deleteError}
            </div>
          )}

          <Button 
            variant="secondary"
            onClick={() => setShowDeleteDialog(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {t('profile.deleteAccount')}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-red-600 mb-4">{t('profile.confirmDelete')}</h3>
            
            <p className="text-gray-600 mb-6">
              {t('profile.deleteConfirmMessage')}
            </p>

            <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg mb-6">
              {t('profile.deleteIrreversible')}
            </p>

            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleteLoading}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleDeleteAccount}
                isLoading={deleteLoading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {t('profile.deleteAccountConfirm')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
