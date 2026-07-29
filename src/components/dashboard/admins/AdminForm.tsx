'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Lock, UserCircle2, Camera } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { AdminProfileData } from '@/data/admins';
import { AVATAR_PLACEHOLDER, avatarOrPlaceholder } from '@/lib/media';

interface AdminFormProps {
  initialData: AdminProfileData;
  /** Profile fields are GET-only on the backend — keep display read-only. */
  readOnlyProfile?: boolean;
  onAvatarUpdated?: (url: string) => void;
}

export const AdminForm: React.FC<AdminFormProps> = ({
  initialData,
  readOnlyProfile = true,
  onAvatarUpdated,
}) => {
  const [formData, setFormData] = useState<AdminProfileData>(initialData);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [avatarUrl, setAvatarUrl] = useState(
    avatarOrPlaceholder(initialData.avatarUrl),
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState('');

  useEffect(() => {
    setAvatarUrl(avatarOrPlaceholder(initialData.avatarUrl));
  }, [initialData.avatarUrl]);

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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setAvatarError('Image must be under 10MB.');
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarError('');
    setAvatarSuccess('');
    try {
      const res = await adminService.uploadAvatar(file);
      const nextUrl = avatarOrPlaceholder(res.avatar_url || res.profile_picture);
      setAvatarUrl(nextUrl);
      setFormData((prev) => ({ ...prev, avatarUrl: nextUrl }));
      setAvatarSuccess('Profile picture updated.');
      onAvatarUpdated?.(nextUrl);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('admin-avatar-updated', { detail: { url: nextUrl } }),
        );
      }
      setTimeout(() => setAvatarSuccess(''), 2500);
    } catch (err: unknown) {
      setAvatarError(
        err instanceof Error ? err.message : 'Failed to upload profile picture.',
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="w-full max-w-[1100px] flex flex-col gap-10">
      <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col gap-6">
        <h3 className="text-base font-bold text-neutral-950 mb-1 flex items-center gap-2 select-none">
          <UserCircle2 className="w-5 h-5 text-[#6312E1]" /> Profile details
        </h3>
        <p className="text-xs text-neutral-500 -mt-2">
          Name, email, and role are read-only. You can update your profile picture and password.
        </p>

        <div className="flex items-center gap-5 pb-2">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-neutral-100 border border-neutral-100 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl || AVATAR_PLACEHOLDER}
              alt={formData.name || 'Admin'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = AVATAR_PLACEHOLDER;
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => void handleAvatarChange(e)}
            />
            <button
              type="button"
              disabled={isUploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
              className="h-10 px-4 bg-white border border-neutral-150 hover:bg-neutral-50 disabled:opacity-50 text-neutral-800 font-bold text-xs rounded-xl inline-flex items-center gap-2 transition-all"
            >
              <Camera className="w-4 h-4 text-[#6312E1]" />
              {isUploadingAvatar ? 'Uploading...' : 'Upload profile picture'}
            </button>
            <span className="text-[11px] text-neutral-400">JPG, PNG, or WebP · max 10MB</span>
            {avatarSuccess && (
              <span className="text-xs font-bold text-emerald-600">{avatarSuccess}</span>
            )}
            {avatarError && (
              <span className="text-xs font-bold text-red-600">{avatarError}</span>
            )}
          </div>
        </div>

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
