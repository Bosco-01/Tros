'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Enforces client-side routing
import { Topbar } from '@/components/layout/topbar'; 
import { AdminForm } from '@/components/dashboard/admins/AdminForm';
import { AdminUsersTable } from '@/components/dashboard/admins/AdminUsersTable';
import { mockAdminProfile, mockAdminUsers } from '@/data/admins';

export default function ManageAdminsPage() {
  const [activeTab, setActiveTab] = useState<'Profile' | 'Users' | 'Role'>('Profile');

  return (
    <>
      <Topbar title="Manage Admins" />
      
      {/* 
        Main content wrapper with slightly grey background 
        so the pure white layout inputs and tab blocks stand out.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px] flex flex-col gap-8">
          
          {/* Switcher Tab row with aligned Add New User button */}
          <div className="flex items-center justify-between gap-4 w-full select-none">
            
            {/* Switcher Tab State Pills */}
            <div className="flex gap-4">
              {(['Profile', 'Users', 'Role'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-full font-bold text-[15px] transition-all duration-200 border ${
                    activeTab === tab
                      ? 'bg-[#6312E1] border-[#6312E1] text-white shadow-sm shadow-[#6312E1]/10'
                      : 'bg-white border-neutral-100 text-neutral-700 hover:bg-neutral-50 shadow-sm shadow-neutral-100/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* [+] Add New User Button (Only visible on Users Tab, wrapped in Next.js Router Link) */}
            {activeTab === 'Users' && (
              <Link href="/dashboard/admins/add">
                <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-neutral-100 shadow-sm shadow-neutral-100/30 rounded-full hover:bg-neutral-50 transition-colors focus:outline-none">
                  {/* Square purple plus icon */}
                  <div className="w-5 h-5 bg-[#6312E1] text-white flex items-center justify-center rounded-md font-bold text-xs">
                    +
                  </div>
                  <span className="text-sm font-bold text-neutral-800">Add New User</span>
                </button>
              </Link>
            )}

          </div>

          {/* Render Active Tab */}
          {activeTab === 'Profile' && (
            <AdminForm initialData={mockAdminProfile} />
          )}

          {activeTab === 'Users' && (
            <AdminUsersTable data={mockAdminUsers} />
          )}

          {activeTab === 'Role' && (
            // Placeholder layout for Role tab
            <div className="w-full bg-white rounded-3xl p-12 border border-neutral-100 text-center select-none shadow-sm shadow-neutral-100/40">
              <h3 className="text-lg font-bold text-neutral-950 mb-1">Role Management Directory</h3>
              <p className="text-sm text-neutral-500">Configure administrative access structures and role security models.</p>
            </div>
          )}

        </div>
      </main>
    </>
  );
}