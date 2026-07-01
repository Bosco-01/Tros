'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Store,
  Calendar,
  Banknote,
  BarChart2,
  Layers,
  ShieldCheck,
  LifeBuoy,
  Settings,
  LogOut,
} from 'lucide-react';
import { useLogout } from '@/lib/auth';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'All Users', href: '/dashboard/users', icon: Users },
  { name: 'All Vendors', href: '/dashboard/vendors', icon: Store },
  { name: 'All Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Transactions', href: '/dashboard/transactions', icon: Banknote },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart2 },
  { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: Layers },
  { name: 'Manage Admins', href: '/dashboard/admins', icon: ShieldCheck },
  { name: 'Support Platform', href: '/dashboard/support', icon: LifeBuoy },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <aside className="w-[260px] flex-shrink-0 h-screen bg-white border-r border-neutral-100 flex flex-col pt-8 pb-6 sticky top-0 hidden lg:flex">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-8 mb-10">
        <div className="text-[#FF5C00]">
          {/* Custom SVG approximating the Trios Logo */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 9L12 22L22 9L12 2Z" />
          </svg>
        </div>
        <span className="text-2xl font-black text-[#6312E1] tracking-tight">Trios</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-5 flex flex-col gap-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors ${
                isActive
                  ? 'text-neutral-900 font-bold bg-neutral-50/0'
                  : 'text-neutral-600 font-medium hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? 'text-neutral-900 stroke-[2.5]' : 'text-neutral-500 stroke-2'}`}
              />
              <span className="text-[15px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-5 pt-4 border-t border-neutral-100 flex flex-col gap-1 mt-auto">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-4 px-4 py-3 text-neutral-600 font-medium hover:bg-neutral-50 rounded-xl transition-colors"
        >
          <Settings className="w-5 h-5 text-neutral-500" />
          <span className="text-[15px]">Platform Setting</span>
        </Link>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex items-center gap-4 px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors text-left w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[15px]">Logout</span>
        </button>
      </div>
    </aside>
  );
};