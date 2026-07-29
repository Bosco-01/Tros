'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Topbar } from '@/components/layout/topbar';
import { AdminForm } from '@/components/dashboard/admins/AdminForm';
import { AdminUsersTable } from '@/components/dashboard/admins/AdminUsersTable';
import { PinSettings } from '@/components/dashboard/admins/PinSettings';
import { AdminBroadcasts } from '@/components/dashboard/admins/AdminBroadcasts';
import { adminService } from '@/services/adminService';
import type { AdminProfileData } from '@/data/admins';
import { LoadingState, ErrorState } from '@/components/ui/AsyncStates';

export default function ManageAdminsPage() {
  const [activeTab, setActiveTab] = useState<
    'Profile' | 'Users' | 'Role' | 'Transaction PIN' | 'Broadcasts'
  >('Profile');
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (activeTab !== 'Profile') return;
    let cancelled = false;
    const load = async () => {
      setLoadingProfile(true);
      setProfileError('');
      try {
        const admin = await adminService.getProfile();
        if (cancelled) return;
        setProfile({
          name: admin.name || '',
          phone: (admin as { phone?: string; phone_number?: string }).phone ||
            (admin as { phone_number?: string }).phone_number ||
            '',
          email: admin.email || '',
          role: admin.role || '',
          jobTitle: (admin as { job_title?: string }).job_title || admin.role || '',
        });
      } catch (err) {
        if (cancelled) return;
        setProfile(null);
        setProfileError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  return (
    <>
      <Topbar title="Manage Admins" />

      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px] flex flex-col gap-8">
          <div className="flex items-center justify-between gap-4 w-full select-none">
            <div className="flex flex-wrap gap-4">
              {(
                ['Profile', 'Users', 'Role', 'Transaction PIN', 'Broadcasts'] as const
              ).map((tab) => (
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

            {activeTab === 'Users' && (
              <Link href="/dashboard/admins/add">
                <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-neutral-100 shadow-sm shadow-neutral-100/30 rounded-full hover:bg-neutral-50 transition-colors focus:outline-none">
                  <div className="w-5 h-5 bg-[#6312E1] text-white flex items-center justify-center rounded-md font-bold text-xs">
                    +
                  </div>
                  <span className="text-sm font-bold text-neutral-800">Add New User</span>
                </button>
              </Link>
            )}
          </div>

          {activeTab === 'Profile' &&
            (loadingProfile ? (
              <LoadingState />
            ) : profileError || !profile ? (
              <ErrorState message={profileError || 'Profile not found'} />
            ) : (
              <AdminForm initialData={profile} readOnlyProfile />
            ))}

          {activeTab === 'Users' && <AdminUsersTable />}

          {activeTab === 'Transaction PIN' && <PinSettings />}

          {activeTab === 'Broadcasts' && <AdminBroadcasts />}

          {activeTab === 'Role' && (
            <div className="w-full bg-white rounded-3xl p-12 border border-neutral-100 text-center select-none shadow-sm shadow-neutral-100/40">
              <h3 className="text-lg font-bold text-neutral-900 mb-1">
                Role Management Directory
              </h3>
              <p className="text-sm text-neutral-500">
                Role configuration is not available via the admin API yet. Staff roles are
                assigned when creating an admin account.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
