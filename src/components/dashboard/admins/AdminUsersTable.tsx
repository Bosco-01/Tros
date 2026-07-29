'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { unwrapList } from '@/lib/api-helpers';
import type { AdminUserRow } from '@/data/admins';
import type { AdminStaff } from '@/types/admin';
import { EmptyState } from '@/components/ui/AsyncStates';

function mapStaffToRow(admin: AdminStaff): AdminUserRow {
  return {
    id: admin.id,
    name: admin.name,
    phone: '',
    email: admin.email,
    role: admin.role,
    is_active: admin.is_active,
    jobTitle: admin.role,
  };
}

export const AdminUsersTable: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAdminsList = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.listAdmins(1, 50);
      const list = unwrapList<AdminStaff>(response).map(mapStaffToRow);
      setAdmins(list);
    } catch (err) {
      console.warn('Backend /admin/admins unreachable.');
      setAdmins([]);
      setError(err instanceof Error ? err.message : 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAdminsList();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setActionLoading(id);
    try {
      await adminService.updateAdminStatus(id, !currentStatus);
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === id ? { ...admin, is_active: !currentStatus } : admin,
        ),
      );
    } catch {
      alert('Failed to update administrator status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Are you sure you want to delete this administrator account?')) return;

    setActionLoading(id);
    try {
      await adminService.deleteAdmin(id);
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    } catch {
      alert('Failed to delete administrator account.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-3xl p-12 border border-neutral-100 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#6312E1]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  if (error) {
    return <EmptyState message={error} />;
  }

  if (admins.length === 0) {
    return <EmptyState message="No administrator accounts found." />;
  }

  return (
    <div className="w-full bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col max-w-[1100px] select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-neutral-100">
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">ID</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">Name</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">E-Mail</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">Role</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">Status</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((row) => {
              const isActive = typeof row.is_active === 'boolean' ? row.is_active : true;
              return (
                <tr
                  key={row.id}
                  className="border-b border-neutral-100 last:border-none hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.id}</td>
                  <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.name}</td>
                  <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.email}</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex px-4 py-1.5 rounded-lg text-xs font-bold bg-[#E4E4E7] text-[#52525B]">
                      {row.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button
                      type="button"
                      disabled={actionLoading === row.id}
                      onClick={() => void handleToggleStatus(row.id, isActive)}
                      className="focus:outline-none flex items-center transition-opacity hover:opacity-85 disabled:opacity-50"
                    >
                      {isActive ? (
                        <div className="flex items-center gap-1.5 text-[#168E33] font-bold text-xs">
                          <ToggleRight className="w-8 h-8" /> Active
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[#D82F2F] font-bold text-xs">
                          <ToggleLeft className="w-8 h-8" /> Inactive
                        </div>
                      )}
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <button
                      type="button"
                      disabled={actionLoading === row.id}
                      onClick={() => void handleDeleteAdmin(row.id)}
                      className="p-2 text-neutral-400 hover:text-[#D82F2F] hover:bg-red-50 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                      aria-label="Delete administrator"
                    >
                      <Trash2 className="w-5 h-5 stroke-[2]" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
