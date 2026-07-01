'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  X,
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
import { apiFetch } from '@/services/apiClient';
import { AdminProfile } from '@/types/admin';
import { useLogout } from '@/lib/auth';

interface TopbarProps {
  title: string;
}

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

export const Topbar: React.FC<TopbarProps> = ({ title }) => {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Real profile state managed dynamically
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  // Fetch the logged-in administrator's profile details on mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const data = await apiFetch<AdminProfile>('/admin/profile');
        setProfile(data);
      } catch (error) {
        console.error('Failed to retrieve active administrator profile:', error);
        // Optional fallback: redirect to login if there is no session token
        // router.push('/');
      }
    };
    
    fetchAdminProfile();
  }, [router]);

  return (
    <>
      <header className="w-full h-[70px] md:h-[90px] px-4 md:px-8 flex items-center justify-between bg-[#FDFDFE] border-b border-neutral-50 lg:border-none sticky top-0 z-20">
        
        {/* Left Side: Mobile Menu Button & Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6 stroke-[2.2]" />
          </button>

          <h1 className="text-xl md:text-[28px] font-bold text-neutral-900 tracking-tight select-none truncate">
            {title}
          </h1>
        </div>

        {/* Right Side: Toolbar Actions */}
        <div className="flex items-center gap-2.5 md:gap-4">
          
          {/* Search */}
          <button className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors">
            <Search className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Theme Toggle */}
          <div className="h-10 md:h-11 flex items-center p-1 bg-white border border-neutral-100 shadow-sm rounded-full">
            <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#6312e1] text-white flex items-center justify-center shadow-sm">
              <Sun className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
            </button>
            <button className="w-8 h-8 md:w-9 md:h-9 rounded-full text-neutral-400 flex items-center justify-center hover:text-neutral-700 transition-colors">
              <Moon className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>

          {/* Notification */}
          <button className="relative w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* Dynamic Admin Profile Info (Top-Right Corner) */}
          <div className="flex items-center gap-3 pl-1 md:pl-2 select-none">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden relative bg-neutral-100 border border-neutral-100 flex-shrink-0">
              <img
                src={profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"}
                alt={profile?.name || "Administrator"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-bold text-neutral-900 leading-tight">
                {profile ? profile.name : 'Loading Profile...'}
              </span>
              <span className="text-xs text-neutral-500 font-medium leading-normal">
                {profile ? profile.email : 'Connecting...'}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* Mobile Drawer (replicated here with dynamic profile bindings too) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          />
          <div className="relative w-[280px] h-full bg-white shadow-2xl flex flex-col pt-8 pb-6 z-10 animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-5 p-2 rounded-xl text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950 transition-colors focus:outline-none"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-3 px-8 mb-8 select-none">
              <div className="text-[#FF5C00]">
                <svg width="26" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 9L12 22L22 9L12 2Z" />
                </svg>
              </div>
              <span className="text-2xl font-black text-[#6312E1] tracking-tight">Trios</span>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 flex flex-col gap-1 custom-scrollbar">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                      isActive
                        ? 'text-neutral-950 font-bold bg-neutral-50/90'
                        : 'text-neutral-600 font-medium hover:bg-neutral-50 hover:text-neutral-950'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? 'text-neutral-950 stroke-[2.5]' : 'text-neutral-500 stroke-2'}`}
                    />
                    <span className="text-[15px]">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="px-5 pt-4 border-t border-neutral-100 flex flex-col gap-1 mt-auto">
              <Link
                href="/dashboard/settings"
                onClick={() => setIsMobileMenuOpen(false)}
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
          </div>
        </div>
      )}
    </>
  );
};