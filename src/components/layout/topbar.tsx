import React from 'react';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import Image from 'next/image';

interface TopbarProps {
  title: string;
}

export const Topbar: React.FC<TopbarProps> = ({ title }) => {
  return (
    <header className="w-full h-[90px] px-8 flex items-center justify-between bg-[#FDFDFE] sticky top-0 z-10">
      <h1 className="text-2xl md:text-[28px] font-bold text-neutral-900 tracking-tight">
        {title}
      </h1>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Search */}
        <button className="w-11 h-11 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <div className="h-11 flex items-center p-1 bg-white border border-neutral-100 shadow-sm rounded-full">
          <button className="w-9 h-9 rounded-full bg-[#6312e1] text-white flex items-center justify-center shadow-sm">
            <Sun className="w-4 h-4 fill-current" />
          </button>
          <button className="w-9 h-9 rounded-full text-neutral-400 flex items-center justify-center hover:text-neutral-700 transition-colors">
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* Notification */}
        <button className="relative w-11 h-11 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 md:pl-4">
          <div className="w-10 h-10 rounded-full overflow-hidden relative bg-neutral-200">
            {/* Using a placeholder. Replace with next/image properly mapped to domains if using remote URL */}
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop"
              alt="Emmanuel Isiguzo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-bold text-neutral-900 leading-tight">
              Emmanuel Isiguzo
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              emmanuel@gmail.com
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};