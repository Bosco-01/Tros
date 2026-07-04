'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { apiFetch } from '@/services/apiClient';
import { AdminUserRow, mockAdminUsers } from '@/data/admins';

interface AdminUsersTableProps {
  data: AdminUserRow[];
}

export const AdminUsersTable: React.FC<AdminUsersTableProps> = ({ data }) => {
  const [admins, setAdmins] = useState<AdminUserRow[]>(data);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAdminsList = async () => {
    try {
      // Calls GET /admin/admins dynamically
      const response = await apiFetch<{ admins?: AdminUserRow[] }>('/admin/admins?page=1&limit=20');
      if (response.admins && response.admins.length > 0) {
        setAdmins(response.admins);
      } else {
        // Fallback to beautiful mockup rows if database list is empty
        setAdmins(data);
      }
    } catch (error) {
      console.warn('Backend /admin/admins unreachable. Falling back to local data.');
      setAdmins(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminsList();
  }, [data]);

  // Calls PATCH /admin/admins/{id}/status to toggle activation state
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const cleanId = id.replace('#', '').trim();
    setActionLoading(id);
    try {
      await apiFetch(`/admin/admins/${cleanId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      
      // Update local UI state
      setAdmins(prev => prev.map(admin => 
        admin.id === id ? { ...admin, is_active: !currentStatus } : admin
      ));
    } catch (err) {
      alert('Failed to update administrator status.');
    } finally {
      setActionLoading(null);
    }
  };

  // Calls DELETE /admin/admins/{id} to remove the administrator account
  const handleDeleteAdmin = async (id: string) => {
    const cleanId = id.replace('#', '').trim();
    if (!confirm('Are you sure you want to delete this administrator account?')) return;
    
    setActionLoading(id);
    try {
      await apiFetch(`/admin/admins/${cleanId}`, {
        method: 'DELETE',
      });
      // Filter out from local UI state
      setAdmins(prev => prev.filter(admin => admin.id !== id));
    } catch (err) {
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
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col max-w-[1100px] select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-neutral-100">
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">ID</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">Name</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">Phone Number</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">E-Mail</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">Role</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">Status</th>
              <th className="px-8 py-5 text-sm font-bold text-neutral-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((row, index) => {
              // Custom state check (supports true boolean or fallback mock 'Active' check)
              const isActive = typeof row.is_active === 'boolean' ? row.is_active : true;
              return (
                <tr
                  key={`${row.id}-${index}`}
                  className="border-b border-neutral-100 last:border-none hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.id}</td>
                  <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.name}</td>
                  <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.phone}</td>
                  <td className="px-8 py-5 text-[15px] text-neutral-600 font-medium">{row.email}</td>
                  
                  {/* Role Badge */}
                  <td className="px-8 py-5">
                    <span className="inline-flex px-4 py-1.5 rounded-lg text-xs font-bold bg-[#E4E4E7] text-[#52525B]">
                      {row.role}
                    </span>
                  </td>

                  {/* Active Toggle Switch Control */}
                  <td className="px-8 py-5">
                    <button
                      type="button"
                      disabled={actionLoading === row.id}
                      onClick={() => handleToggleStatus(row.id, isActive)}
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

                  {/* Delete Trashcan Action */}
                  <td className="px-8 py-5">
                    <button
                      type="button"
                      disabled={actionLoading === row.id}
                      onClick={() => handleDeleteAdmin(row.id)}
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

      <div className="px-8 py-5 border-t border-neutral-100 flex items-center justify-between bg-white mt-auto select-none">
        <button className="text-[15px] font-bold text-neutral-900 hover:text-[#6312E1] transition-colors focus:outline-none">
          Prev
        </button>
        <span className="text-[15px] font-bold text-neutral-950">1/2</span>
        <button className="text-[15px] font-bold text-neutral-900 hover:text-[#6312E1] transition-colors focus:outline-none">
          Next
        </button>
      </div>
    </div>
  );
};