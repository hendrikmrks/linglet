'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminLinks = [
  {
    href: '/admin',
    label: 'Übersicht',
    icon: '🛠️',
  },
  {
    href: '/admin/faq',
    label: 'FAQ',
    icon: '❓',
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {adminLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
