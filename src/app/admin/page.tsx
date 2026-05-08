'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Protected } from '@/components/protected';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { ContentManager } from '@/components/content-manager';
import { AdminNav } from '@/components/admin/admin-nav';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  plan: 'FREE' | 'PREMIUM';
  isAdmin?: boolean;
  xp?: number;
  streakCount?: number;
  language?: string;
  learningLanguage?: string;
  createdAt?: string;
}

interface PremiumRequest {
  id: string;
  userId: string;
  email: string;
  name: string;
  reason: string | null;
  message: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface PremiumSettings {
  id: string;
  maxChaptersPerDayFree: number;
  maxChaptersPerDayPremium: number;
  maxSubchaptersPerDayFree: number;
  maxSubchaptersPerDayPremium: number;
  maxChaptersTotalFree: number;
  canSeeLeaderboardFree: boolean;
  canSeeLeaderboardPremium: boolean;
  xpMultiplierPremium: number;
  maxLessonsPerDayFree: number;
  maxLessonsPerDayPremium: number;
  createdAt: string;
  updatedAt: string;
}

interface VocabularyReport {
  id: string;
  userId: string;
  vocabularyId: string;
  chapterId: string;
  subchapterId: string;
  issueType: 'WORD' | 'TRANSLATION';
  reason: string;
  comment: string | null;
  word: string;
  translation: string;
  sourceLanguage: string;
  targetLanguage: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
  email: string;
  name: string;
  chapterTitle: string;
  subchapterTitle: string;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'BADGE' | 'THEME' | 'BOOSTER';
  price: number;
  icon: string;
  isActive: boolean;
  metadata: any;
  createdAt: string;
  _count?: {
    purchases: number;
  };
}

export default function AdminPage() {
  return (
    <Protected>
      {(user) => <AdminContent user={user} />}
    </Protected>
  );
}

type AdminTab = 'content' | 'settings' | 'requests' | 'reports' | 'users' | 'shop';

function AdminContent({ user }: { user: { id: string; isAdmin?: boolean } }) {
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState<AdminTab>('content');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [requests, setRequests] = useState<PremiumRequest[]>([]);
  const [reports, setReports] = useState<VocabularyReport[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [premiumSettingsDraft, setPremiumSettingsDraft] = useState<PremiumSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSettingsSaving, setIsSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [shopMessage, setShopMessage] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<{ id: string; price: number } | null>(null);

  const isAdmin = Boolean(user.isAdmin);

  const loadData = async () => {
    try {
      setError(null);
      const [usersResponse, requestsResponse, settingsResponse, reportsResponse, shopResponse] = await Promise.all([
        fetch('/api/admin/users', { credentials: 'include' }),
        fetch('/api/admin/premium-requests', { credentials: 'include' }),
        fetch('/api/admin/premium-settings', { credentials: 'include' }),
        fetch('/api/admin/vocabulary-reports', { credentials: 'include' }),
        fetch('/api/admin/shop-items', { credentials: 'include' }),
      ]);

      if (
        usersResponse.status === 403 ||
        requestsResponse.status === 403 ||
        settingsResponse.status === 403 ||
        reportsResponse.status === 403 ||
        shopResponse.status === 403
      ) {
        setError(t('admin.notAuthorized'));
        return;
      }

      if (!usersResponse.ok || !requestsResponse.ok || !settingsResponse.ok || !reportsResponse.ok || !shopResponse.ok) {
        setError(t('admin.loadFailed'));
        return;
      }

      const usersData = await usersResponse.json();
      const requestsData = await requestsResponse.json();
      const settingsData = await settingsResponse.json();
      const reportsData = await reportsResponse.json();
      const shopData = await shopResponse.json();

      setUsers(usersData.users || []);
      setRequests(requestsData.requests || []);
      setPremiumSettingsDraft(settingsData.settings || null);
      setReports(reportsData.reports || []);
      setShopItems(shopData.items || []);
    } catch (err) {
      console.error('Admin dashboard load failed:', err);
      setError(t('admin.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }
    loadData();
  }, [isAdmin, language]);

  const handleUpdatePlan = async (userId: string, plan: 'FREE' | 'PREMIUM') => {
    try {
      setIsSaving(true);
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan }),
      });
      await loadData();
    } catch (err) {
      console.error('Failed to update plan:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm(t('admin.deleteConfirm'))) {
      return;
    }

    try {
      setIsSaving(true);
      await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      await loadData();
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestStatus = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setIsSaving(true);
      await fetch(`/api/admin/premium-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      await loadData();
    } catch (err) {
      console.error('Failed to update request:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResolveReport = async (reportId: string) => {
    try {
      setIsSaving(true);
      await fetch(`/api/admin/vocabulary-reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'RESOLVED' }),
      });
      await loadData();
    } catch (err) {
      console.error('Failed to resolve report:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingsChange = (field: keyof PremiumSettings, value: number | boolean) => {
    setPremiumSettingsDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveSettings = async () => {
    if (!premiumSettingsDraft) return;

    try {
      setIsSettingsSaving(true);
      setSettingsMessage(null);

      const response = await fetch('/api/admin/premium-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(premiumSettingsDraft),
      });

      if (!response.ok) {
        setSettingsMessage(t('admin.settingsSaveFailed'));
        return;
      }

      const data = await response.json();
      setPremiumSettingsDraft(data.settings || null);
      setSettingsMessage(t('admin.settingsSaved'));
    } catch (err) {
      console.error('Failed to save premium settings:', err);
      setSettingsMessage(t('admin.settingsSaveFailed'));
    } finally {
      setIsSettingsSaving(false);
    }
  };

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === 'PENDING'),
    [requests]
  );

  const openReports = useMemo(() => reports.filter((report) => report.status === 'OPEN'), [reports]);

  if (!isAdmin) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('admin.title')}</h1>
        <p className="text-gray-600 mb-6">{t('admin.notAuthorized')}</p>
        <Button onClick={() => router.push('/dashboard')}>
          {t('admin.backToDashboard')}
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('admin.title')}</h1>
        <p className="text-gray-600">{t('admin.subtitle')}</p>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">{t('admin.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('admin.title')}</h1>
        <p className="text-gray-600">{t('admin.subtitle')}</p>
        <div className="mt-8 p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('admin.title')}</h1>
        <p className="text-gray-600">{t('admin.subtitle')}</p>
      </div>

      <AdminNav />

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          className={`px-4 md:px-6 py-3 font-medium whitespace-nowrap transition-colors relative ${
            activeTab === 'content'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('content')}
        >
          📚 Inhalte
          {activeTab === 'content' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          className={`px-4 md:px-6 py-3 font-medium whitespace-nowrap transition-colors relative ${
            activeTab === 'settings'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Einstellungen
          {activeTab === 'settings' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          className={`px-4 md:px-6 py-3 font-medium whitespace-nowrap transition-colors relative ${
            activeTab === 'requests'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('requests')}
        >
          📋 Anfragen
          {pendingRequests.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-800">
              {pendingRequests.length}
            </span>
          )}
          {activeTab === 'requests' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          className={`px-4 md:px-6 py-3 font-medium whitespace-nowrap transition-colors relative ${
            activeTab === 'reports'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('reports')}
        >
          🚩 {t('admin.reportsTitle')}
          {openReports.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-800">
              {openReports.length}
            </span>
          )}
          {activeTab === 'reports' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          className={`px-4 md:px-6 py-3 font-medium whitespace-nowrap transition-colors relative ${
            activeTab === 'users'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('users')}
        >
          👥 Benutzer
          {activeTab === 'users' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          className={`px-4 md:px-6 py-3 font-medium whitespace-nowrap transition-colors relative ${
            activeTab === 'shop'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('shop')}
        >
          🛍️ Shop
          {activeTab === 'shop' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && <ContentManager />}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{t('admin.premiumSettingsTitle')}</h2>
            <span className="text-sm text-gray-500">{t('admin.unlimitedHint')}</span>
          </div>

          {!premiumSettingsDraft ? (
            <p className="text-gray-600">{t('admin.loading')}</p>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('admin.freeLimitsTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    min={-1}
                    label={t('admin.maxChaptersPerDayFree')}
                    value={premiumSettingsDraft.maxChaptersPerDayFree}
                    onChange={(event) =>
                      handleSettingsChange('maxChaptersPerDayFree', Number(event.target.value))
                    }
                  />
                  <Input
                    type="number"
                    min={-1}
                    label={t('admin.maxChaptersTotalFree')}
                    value={premiumSettingsDraft.maxChaptersTotalFree}
                    onChange={(event) =>
                      handleSettingsChange('maxChaptersTotalFree', Number(event.target.value))
                    }
                  />
                  <Input
                    type="number"
                    min={-1}
                    label={t('admin.maxSubchaptersPerDayFree')}
                    value={premiumSettingsDraft.maxSubchaptersPerDayFree}
                    onChange={(event) =>
                      handleSettingsChange('maxSubchaptersPerDayFree', Number(event.target.value))
                    }
                  />
                  <Input
                    type="number"
                    min={-1}
                    label={t('admin.maxLessonsPerDayFree')}
                    value={premiumSettingsDraft.maxLessonsPerDayFree}
                    onChange={(event) =>
                      handleSettingsChange('maxLessonsPerDayFree', Number(event.target.value))
                    }
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('admin.premiumLimitsTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    min={-1}
                    label={t('admin.maxChaptersPerDayPremium')}
                    value={premiumSettingsDraft.maxChaptersPerDayPremium}
                    onChange={(event) =>
                      handleSettingsChange('maxChaptersPerDayPremium', Number(event.target.value))
                    }
                  />
                  <Input
                    type="number"
                    min={-1}
                    label={t('admin.maxSubchaptersPerDayPremium')}
                    value={premiumSettingsDraft.maxSubchaptersPerDayPremium}
                    onChange={(event) =>
                      handleSettingsChange('maxSubchaptersPerDayPremium', Number(event.target.value))
                    }
                  />
                  <Input
                    type="number"
                    min={-1}
                    label={t('admin.maxLessonsPerDayPremium')}
                    value={premiumSettingsDraft.maxLessonsPerDayPremium}
                    onChange={(event) =>
                      handleSettingsChange('maxLessonsPerDayPremium', Number(event.target.value))
                    }
                  />
                  <Input
                    type="number"
                    min={0}
                    step="0.1"
                    label={t('admin.xpMultiplierPremium')}
                    value={premiumSettingsDraft.xpMultiplierPremium}
                    onChange={(event) =>
                      handleSettingsChange('xpMultiplierPremium', Number(event.target.value))
                    }
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('admin.accessTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={premiumSettingsDraft.canSeeLeaderboardFree}
                      onChange={(event) =>
                        handleSettingsChange('canSeeLeaderboardFree', event.target.checked)
                      }
                    />
                    {t('admin.canSeeLeaderboardFree')}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={premiumSettingsDraft.canSeeLeaderboardPremium}
                      onChange={(event) =>
                        handleSettingsChange('canSeeLeaderboardPremium', event.target.checked)
                      }
                    />
                    {t('admin.canSeeLeaderboardPremium')}
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={handleSaveSettings} isLoading={isSettingsSaving}>
                  {t('admin.saveSettings')}
                </Button>
                {settingsMessage && (
                  <span className="text-sm text-gray-600">{settingsMessage}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{t('admin.requestsTitle')}</h2>
            <span className="text-sm text-gray-500">
              {t('admin.pendingCount')}: {pendingRequests.length}
            </span>
          </div>

          {requests.length === 0 ? (
            <p className="text-gray-600">{t('admin.noRequests')}</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{request.name} ({request.email})</p>
                      <p className="text-sm text-gray-500">{t('admin.requestedAt')}: {new Date(request.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      request.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : request.status === 'APPROVED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <p><span className="font-semibold">{t('admin.reason')}:</span> {request.reason || '-'}</p>
                    <p><span className="font-semibold">{t('admin.message')}:</span> {request.message || '-'}</p>
                  </div>
                  {request.status === 'PENDING' && (
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        onClick={() => handleRequestStatus(request.id, 'APPROVED')}
                        isLoading={isSaving}
                      >
                        {t('admin.approve')}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRequestStatus(request.id, 'REJECTED')}
                        isLoading={isSaving}
                      >
                        {t('admin.reject')}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{t('admin.reportsTitle')}</h2>
            <span className="text-sm text-gray-500">{t('admin.pendingCount')}: {openReports.length}</span>
          </div>

          {openReports.length === 0 ? (
            <p className="text-gray-600">{t('admin.noOpenReports')}</p>
          ) : (
            <div className="space-y-4">
              {openReports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {report.word} → {report.translation}
                      </p>
                      <p className="text-sm text-gray-500">
                        {report.chapterTitle} · {report.subchapterTitle}
                      </p>
                      <p className="text-sm text-gray-500">
                        {report.sourceLanguage} → {report.targetLanguage}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">{t('admin.reportedBy')}:</span> {report.name} ({report.email})
                    </p>
                    <p>
                      <span className="font-semibold">{t('admin.issueType')}:</span>{' '}
                      {report.issueType === 'WORD' ? t('admin.issueWord') : t('admin.issueTranslation')}
                    </p>
                    <p>
                      <span className="font-semibold">{t('admin.reason')}:</span> {report.reason}
                    </p>
                    <p>
                      <span className="font-semibold">{t('admin.comment')}:</span> {report.comment || t('admin.emptyValue')}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => handleResolveReport(report.id)}
                      isLoading={isSaving}
                    >
                      {t('admin.resolve')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('admin.usersTitle')}</h2>
          {users.length === 0 ? (
            <p className="text-gray-600">{t('admin.noUsers')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="py-2 pr-4">{t('admin.tableName')}</th>
                    <th className="py-2 pr-4">{t('admin.tableEmail')}</th>
                    <th className="py-2 pr-4">{t('admin.tablePlan')}</th>
                    <th className="py-2 pr-4">{t('admin.tableLearningLanguage')}</th>
                    <th className="py-2 pr-4">{t('admin.tableActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((row) => (
                    <tr key={row.id} className="border-t border-gray-100">
                      <td className="py-2 pr-4">
                        <div className="font-medium text-gray-900">
                          {row.name}
                          {row.isAdmin && (
                            <span className="ml-2 text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                              {t('admin.adminBadge')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 pr-4 text-gray-600">{row.email}</td>
                      <td className="py-2 pr-4 text-gray-600">
                        {row.plan === 'PREMIUM' ? t('navbar.premium') : t('navbar.free')}
                      </td>
                      <td className="py-2 pr-4 text-gray-600">
                        {row.learningLanguage ? t(`lesson.languages.${row.learningLanguage}`) : '-'}
                      </td>
                      <td className="py-2 pr-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdatePlan(row.id, row.plan === 'PREMIUM' ? 'FREE' : 'PREMIUM')}
                            isLoading={isSaving}
                          >
                            {row.plan === 'PREMIUM' ? t('admin.makeFree') : t('admin.makePremium')}
                          </Button>
                          {!row.isAdmin && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDeleteUser(row.id)}
                              isLoading={isSaving}
                            >
                              {t('admin.deleteUser')}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Shop Tab */}
      {activeTab === 'shop' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('admin.shopTitle')}</h2>
            <p className="text-sm text-gray-500">{t('admin.shopSubtitle')}</p>
          </div>

          {shopMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {shopMessage}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 font-medium">
                  <th className="py-2 pr-4">{t('admin.shopIcon')}</th>
                  <th className="py-2 pr-4">{t('admin.tableName')}</th>
                  <th className="py-2 pr-4">{t('admin.shopType')}</th>
                  <th className="py-2 pr-4">{t('admin.shopPriceXp')}</th>
                  <th className="py-2 pr-4">{t('admin.shopStatus')}</th>
                  <th className="py-2 pr-4">{t('admin.shopPurchases')}</th>
                  <th className="py-2 pr-4">{t('admin.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {shopItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="py-3 pr-4 text-2xl">{item.icon}</td>
                    <td className="py-3 pr-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {item.type === 'BADGE' && `🏅 ${t('shop.types.BADGE')}`}
                      {item.type === 'THEME' && `🎨 ${t('shop.types.THEME')}`}
                      {item.type === 'BOOSTER' && `⚡ ${t('shop.types.BOOSTER')}`}
                    </td>
                    <td className="py-3 pr-4">
                      {editingPrice?.id === item.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            value={editingPrice.price}
                            onChange={(e) => setEditingPrice({ ...editingPrice, price: parseInt(e.target.value) || 0 })}
                            className="w-24"
                          />
                          <Button
                            size="sm"
                            onClick={async () => {
                              try {
                                const response = await fetch(`/api/admin/shop-items/${item.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  credentials: 'include',
                                  body: JSON.stringify({ price: editingPrice.price })
                                });
                                if (response.ok) {
                                  setShopMessage(t('admin.shopPriceUpdated'));
                                  setEditingPrice(null);
                                  loadData();
                                  setTimeout(() => setShopMessage(null), 3000);
                                }
                              } catch (error) {
                                console.error('Price update error:', error);
                              }
                            }}
                          >
                            ✓
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditingPrice(null)}
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-900 font-semibold">⚡ {item.price}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {item.isActive ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                          {t('admin.shopActive')}
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                          {t('admin.shopInactive')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{item._count?.purchases || 0}</td>
                    <td className="py-3 pr-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingPrice({ id: item.id, price: item.price })}
                      >
                        ✏️ {t('admin.shopAdjustPrice')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {shopItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Keine Shop-Produkte vorhanden.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
