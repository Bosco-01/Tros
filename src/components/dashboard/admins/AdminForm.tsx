'use client';

import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, UserCircle2 } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { AdminProfileData } from '@/data/admins';

interface AdminFormProps {
  initialData: AdminProfileData;
  /** Profile fields are GET-only on the backend — keep display read-only. */
  readOnlyProfile?: boolean;
}

export const AdminForm: React.FC<AdminFormProps> = ({
  initialData,
  readOnlyProfile = true,
}) => {
  const [formData, setFormData] = useState<AdminProfileData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Change Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await adminService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 2000);
    } catch (err: unknown) {
      setPasswordError(
        err instanceof Error ? err.message : 'Failed to update administrative password.',
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="w-full max-w-[1100px] flex flex-col gap-10">
      <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col gap-6">
        <h3 className="text-base font-bold text-neutral-950 mb-1 flex items-center gap-2 select-none">
          <UserCircle2 className="w-5 h-5 text-[#6312E1]" /> Profile details
        </h3>
        <p className="text-xs text-neutral-500 -mt-2">
          Profile fields are read-only. Use Change Password below to update credentials.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-500">Name</label>
            <input
              type="text"
              value={formData.name}
              readOnly={readOnlyProfile}
              className="bg-white/80 rounded-xl px-5 h-14 border border-neutral-150 font-bold text-neutral-900 text-[16px] w-full focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-500">Phone Number</label>
            <input
              type="text"
              value={formData.phone || '—'}
              readOnly={readOnlyProfile}
              className="bg-white/80 rounded-xl px-5 h-14 border border-neutral-150 font-bold text-neutral-500 text-[16px] w-full focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-500">E-mail</label>
            <input
              type="email"
              value={formData.email}
              readOnly={readOnlyProfile}
              className="bg-white/80 rounded-xl px-5 h-14 border border-neutral-150 font-bold text-neutral-900 text-[16px] w-full focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-500">Role</label>
            <input
              type="text"
              value={formData.role}
              readOnly
              className="bg-white/80 rounded-xl px-5 h-14 border border-neutral-150 font-bold text-neutral-500 text-[16px] w-full select-none focus:outline-none"
            />
          </div>
        </div>
      </div>

      <form
        onSubmit={handleChangePassword}
        className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col gap-6"
      >
        <h3 className="text-base font-bold text-neutral-950 mb-1 flex items-center gap-2 select-none">
          <Lock className="w-5 h-5 text-[#6312E1]" /> Change Admin Password
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-500">Current Password</label>
            <div className="relative w-full">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="h-14 pl-5 pr-12 bg-white border border-neutral-150 rounded-xl font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1]"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-950"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="hidden md:block" />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-500">New Password</label>
            <div className="relative w-full">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="h-14 pl-5 pr-12 bg-white border border-neutral-150 rounded-xl font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-950"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-500">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="h-14 px-5 bg-white border border-neutral-150 rounded-xl font-bold text-neutral-900 text-[16px] w-full focus:outline-none focus:border-[#6312E1]"
            />
          </div>
        </div>

        {passwordSuccess && (
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold self-start">
            Administrative Password changed successfully!
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold self-start">
            {passwordError}
          </div>
        )}

        <button
          type="submit"
          disabled={isChangingPassword}
          className="h-11 px-8 bg-[#6312E1] hover:bg-[#520cbd] disabled:opacity-50 text-white font-bold text-[14px] rounded-xl transition-all self-start shadow-sm shadow-[#6312E1]/10"
        >
          {isChangingPassword ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};