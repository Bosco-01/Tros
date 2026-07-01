'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Topbar } from '@/components/layout/topbar';
import { AdminForm } from '@/components/dashboard/admins/AdminForm';
import { AdminUsersTable } from '@/components/dashboard/admins/AdminUsersTable';
import { adminService } from '@/services/adminService';
import { unwrapList } from '@/lib/api-helpers';
import { titleCase } from '@/lib/api-helpers';
import type { AdminProfile, AdminStaff } from '@/types/admin';
import type { AdminProfileData, AdminUserRow } from '@/data/admins';
import { LoadingState, ErrorState } from '@/components/ui/AsyncStates';

function mapProfile(p: AdminProfile): AdminProfileData {
  return {
    name: p.name || '',
    email: p.email || '',
    phone: '',
    role: titleCase(String(p.role || '')),
    jobTitle: titleCase(String(p.role || '')),
  } as AdminProfileData;
}

function mapStaffToRow(s: AdminStaff): AdminUserRow {
  return {
    id: s.id,
    name: s.name,
    phone: '—',
    email: s.email,
    role: titleCase(String(s.role || '')),
    jobTitle: s.is_active ? 'Active' : 'Inactive',
  } as AdminUserRow;
}

export default function ManageAdminsPage() {
  const [activeTab, setActiveTab] = useState<'Profile' | 'Users' | 'Role'>('Profile');
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [staff, setStaff] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [profileRes, staffRes] = await Promise.all([
        adminService.getProfile(),
        adminService.listAdmins(1, 50),
      ]);
      setProfile(mapProfile(profileRes));
      setStaff((unwrapList(staffRes) as AdminStaff[]).map(mapStaffToRow));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Topbar title="Manage Admins" />
      <main className="flex-1 p-4 md:p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px] flex flex-col gap-8">
          <div className="flex items-center justify-between gap-4 w-full select-none">
            <div className="flex gap-2 sm:gap-4 flex-wrap">
              {(['Profile', 'Users', 'Role'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 sm:px-8 py-2.5 rounded-full font-bold text-[15px] transition-all duration-200 border ${
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
                <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-neutral-100 shadow-sm shadow-neutral-100/30 rounded-full hover:bg-neutral-50 transition-colors focus:outline-none whitespace-nowrap">
                  <div className="w-5 h-5 bg-[#6312E1] text-white flex items-center justify-center rounded-md font-bold text-xs">
                    +
                  </div>
                  <span className="text-sm font-bold text-neutral-800">Add New User</span>
                </button>
              </Link>
            )}
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : (
            <>
              {activeTab === 'Profile' && profile && <AdminForm initialData={profile} />}
              {activeTab === 'Users' && <AdminUsersTable data={staff} />}
              {activeTab === 'Role' && (
                <div className="w-full bg-white rounded-3xl p-12 border border-neutral-100 text-center select-none shadow-sm shadow-neutral-100/40">
                  <h3 className="text-lg font-bold text-neutral-950 mb-1">Role Management Directory</h3>
                  <p className="text-sm text-neutral-500">Configure administrative access structures and role security models.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
