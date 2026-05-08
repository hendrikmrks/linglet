'use client';

import { useEffect, useState } from 'react';
import { Protected } from '@/components/protected';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'BADGE' | 'THEME' | 'BOOSTER';
  price: number;
  icon: string;
  isActive: boolean;
  metadata: any;
  isPurchased: boolean;
}

interface Purchase {
  id: string;
  shopItemId: string;
  purchasedAt: string;
  equipped: boolean;
  shopItem: ShopItem;
}

export default function ShopPage() {
  return (
    <Protected>
      {(user) => <ShopContent user={user} />}
    </Protected>
  );
}

type ShopCategory = 'BADGE' | 'THEME' | 'BOOSTER';

function ShopContent({ user }: { user: { id: string; xp: number } }) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('BADGE');
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory'>('shop');
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [userXP, setUserXP] = useState(user.xp);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const loadShopItems = async () => {
    try {
      const response = await fetch('/api/shop/items', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setShopItems(data.items || []);
        setUserXP(data.userXP);
      }
    } catch (error) {
      console.error('Load shop items error:', error);
    }
  };

  const loadPurchases = async () => {
    try {
      const response = await fetch('/api/shop/my-purchases', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setPurchases(data.purchases || []);
      }
    } catch (error) {
      console.error('Load purchases error:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([loadShopItems(), loadPurchases()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handlePurchase = async (itemId: string, itemPrice: number) => {
    if (userXP < itemPrice) {
      setMessage(t('shop.notEnoughXP'));
      setMessageType('error');
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const response = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ itemId })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(t('shop.purchaseSuccess'));
        setMessageType('success');
        setUserXP(data.remainingXP);
        await Promise.all([loadShopItems(), loadPurchases()]);
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage(data.error || t('shop.purchaseError'));
        setMessageType('error');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setMessage(t('shop.purchaseError'));
      setMessageType('error');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleEquip = async (itemId: string, currentlyEquipped: boolean) => {
    try {
      const response = await fetch('/api/shop/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ itemId, equipped: !currentlyEquipped })
      });

      if (response.ok) {
        setMessage(currentlyEquipped ? t('shop.unequipSuccess') : t('shop.equipSuccess'));
        setMessageType('success');
        await loadPurchases();
        setTimeout(() => setMessage(null), 2000);
      } else {
        setMessage(t('shop.equipError'));
        setMessageType('error');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Equip error:', error);
      setMessage(t('shop.equipError'));
      setMessageType('error');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const badgeItems = shopItems.filter(i => i.type === 'BADGE');
  const badgePurchases = purchases.filter(p => p.shopItem.type === 'BADGE');

  const categories: { key: ShopCategory; label: string; icon: string; available: boolean }[] = [
    { key: 'BADGE', label: t('shop.categories.badges'), icon: '🏅', available: true },
    { key: 'THEME', label: t('shop.categories.themes'), icon: '🎨', available: false },
    { key: 'BOOSTER', label: t('shop.categories.boosters'), icon: '⚡', available: false },
  ];

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🛍️ {t('shop.title')}</h1>
          <p className="text-gray-600">{t('shop.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🛍️ {t('shop.title')}</h1>
            <p className="text-gray-600">{t('shop.subtitle')}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">{t('shop.yourXP')}</div>
            <div className="text-3xl font-bold text-blue-600">⚡ {userXP}</div>
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg border ${
              messageType === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => cat.available && setActiveCategory(cat.key)}
            className={`relative rounded-xl p-4 text-center transition-all border-2 ${
              activeCategory === cat.key
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : cat.available
                ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="text-3xl mb-1">{cat.icon}</div>
            <div className={`font-semibold text-sm ${activeCategory === cat.key ? 'text-blue-700' : 'text-gray-700'}`}>
              {cat.label}
            </div>
            {!cat.available && (
              <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                {t('shop.comingSoon')}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Shop/Inventory Tab Toggle */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <button
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'shop'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('shop')}
        >
          🛒 {t('shop.tabShop')}
          {activeTab === 'shop' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'inventory'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('inventory')}
        >
          🎒 {t('shop.tabInventory')} ({badgePurchases.length})
          {activeTab === 'inventory' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Shop Tab - Badges */}
      {activeTab === 'shop' && activeCategory === 'BADGE' && (
        <div className="space-y-2">
          <p className="text-sm text-gray-500 mb-4">{t('shop.badgeHint')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badgeItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-all ${
                  item.isPurchased
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:shadow-lg hover:border-blue-300'
                }`}
              >
                <div className="text-5xl mb-3 text-center">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 text-center min-h-[3rem]">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">
                    ⚡ {item.price}
                  </div>
                  {item.isPurchased ? (
                    <div className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold text-sm">
                      ✓ {t('shop.purchased')}
                    </div>
                  ) : (
                    <Button
                      onClick={() => handlePurchase(item.id, item.price)}
                      disabled={userXP < item.price}
                      size="sm"
                    >
                      {t('shop.buy')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {badgeItems.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🏅</div>
                <p className="text-xl">{t('shop.emptyShop')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coming soon categories */}
      {activeTab === 'shop' && (activeCategory === 'THEME' || activeCategory === 'BOOSTER') && (
        <div className="text-center py-16">
          <div className="text-7xl mb-4">{activeCategory === 'THEME' ? '🎨' : '⚡'}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('shop.comingSoonTitle')}
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {t('shop.comingSoonText')}
          </p>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {badgePurchases.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🎒</div>
              <p className="text-xl">{t('shop.emptyInventory')}</p>
              <p className="text-sm mt-2">{t('shop.emptyInventoryHint')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badgePurchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-all ${
                    purchase.equipped
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="text-5xl mb-3 text-center">{purchase.shopItem.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                    {purchase.shopItem.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 text-center">
                    {purchase.shopItem.description}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleEquip(purchase.shopItemId, purchase.equipped)}
                      variant={purchase.equipped ? 'secondary' : 'primary'}
                      className="w-full"
                    >
                      {purchase.equipped ? `📦 ${t('shop.unequip')}` : `✨ ${t('shop.equip')}`}
                    </Button>
                    {purchase.equipped && (
                      <p className="text-xs text-blue-600 text-center font-medium">
                        {t('shop.equippedBadgeHint')}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 text-center">
                      {t('shop.purchasedOn')} {new Date(purchase.purchasedAt).toLocaleDateString(language === 'pt-br' ? 'pt-BR' : language)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
