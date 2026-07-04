'use client';

import React, { useState } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '@/services/apiClient';

export const PinSettings: React.FC = () => {
  const [activeForm, setActiveForm] = useState<'set' | 'change' | 'reset'>('set');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Form Field States
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [password, setPassword] = useState('');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const clearMessages = () => {
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (pin.length !== 4 || confirmPin.length !== 4) {
      setErrorMsg('PIN must be exactly 4 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setErrorMsg('PINs do not match.');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/account/set-pin', {
        method: 'POST',
        body: JSON.stringify({ account_pin: pin, confirm_account_pin: confirmPin }),
      });
      setSuccessMsg('Transaction PIN set successfully!');
      setPin('');
      setConfirmPin('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to set PIN.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (newPin.length !== 4 || oldPin.length !== 4) {
      setErrorMsg('PIN must be exactly 4 digits.');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/account/change-pin', {
        method: 'POST',
        body: JSON.stringify({ current_password: password, old_pin: oldPin, new_pin: newPin }),
      });
      setSuccessMsg('Transaction PIN changed successfully!');
      setPassword('');
      setOldPin('');
      setNewPin('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to change PIN.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResetOtp = async () => {
    clearMessages();
    if (!email) {
      setErrorMsg('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/account/forgot-pin', {
        method: 'POST',
        body: JSON.stringify({ email, password: 'UserPassword123' }), 
      });
      setSuccessMsg('Reset OTP sent successfully to your email!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to trigger reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email || !verificationCode) {
      setErrorMsg('Please enter both Email and OTP verification code.');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/account/verify-pin-reset', {
        method: 'POST',
        body: JSON.stringify({ email, verification_code: verificationCode }),
      });
      setSuccessMsg('OTP verified successfully! You can now set a new PIN.');
      setVerificationCode('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1100px] flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Sub-form selectors */}
      <div className="flex gap-4 border-b border-neutral-150 pb-4 select-none">
        {(['set', 'change', 'reset'] as const).map((form) => (
          <button
            key={form}
            onClick={() => { setActiveForm(form); clearMessages(); }}
            className={`px-6 py-2 rounded-xl font-bold text-xs tracking-tight transition-all border ${
              activeForm === form
                ? 'bg-[#6312E1] border-[#6312E1] text-white shadow-sm'
                : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {form === 'set' && 'Set New PIN'}
            {form === 'change' && 'Change PIN'}
            {form === 'reset' && 'Reset Forgot PIN'}
          </button>
        ))}
      </div>

      {/* Forms Content Card */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col gap-6">
        
        {/* ==================== FORM A: SET PIN ==================== */}
        {activeForm === 'set' && (
          <form onSubmit={handleSetPin} className="flex flex-col gap-5 max-w-[420px]">
            <h3 className="text-base font-bold text-neutral-950 leading-none mb-1 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#6312E1]" /> Set Transaction PIN
            </h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-500">New 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="h-12 px-4 border border-neutral-300 rounded-xl text-center font-bold text-lg focus:outline-none focus:border-[#6312E1]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-500">Confirm 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="h-12 px-4 border border-neutral-300 rounded-xl text-center font-bold text-lg focus:outline-none focus:border-[#6312E1]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 mt-2 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center"
            >
              {loading ? 'Processing...' : 'Set PIN'}
            </button>
          </form>
        )}

        {/* ==================== FORM B: CHANGE PIN ==================== */}
        {activeForm === 'change' && (
          <form onSubmit={handleChangePin} className="flex flex-col gap-5 max-w-[420px]">
            <h3 className="text-base font-bold text-neutral-950 leading-none mb-1 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#6312E1]" /> Change Transaction PIN
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-500">Current Login Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter current password"
                className="h-12 px-4 border border-neutral-300 rounded-xl font-semibold text-sm focus:outline-none focus:border-[#6312E1]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-500">Old 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="h-12 px-4 border border-neutral-300 rounded-xl text-center font-bold text-lg focus:outline-none focus:border-[#6312E1]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-500">New 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="h-12 px-4 border border-neutral-300 rounded-xl text-center font-bold text-lg focus:outline-none focus:border-[#6312E1]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 mt-2 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center"
            >
              {loading ? 'Processing...' : 'Change PIN'}
            </button>
          </form>
        )}

        {/* ==================== FORM C: RESET FORGOT PIN ==================== */}
        {activeForm === 'reset' && (
          <div className="flex flex-col gap-5 max-w-[420px]">
            <h3 className="text-base font-bold text-neutral-950 leading-none mb-1 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#6312E1]" /> Reset Forgotten PIN
            </h3>

            {/* Step 1: Request Reset OTP */}
            <div className="flex flex-col gap-3 border-b border-neutral-100 pb-5 mb-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-500">Account Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="h-12 px-4 border border-neutral-300 rounded-xl font-semibold text-sm focus:outline-none focus:border-[#6312E1]"
                />
              </div>
              <button
                type="button"
                onClick={handleRequestResetOtp}
                disabled={loading}
                className="h-11 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-bold rounded-xl text-xs transition-all"
              >
                {loading ? 'Triggering...' : 'Request Reset OTP Code'}
              </button>
            </div>

            {/* Step 2: Verify OTP */}
            <form onSubmit={handleVerifyResetOtp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-500">6-Digit OTP Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="h-12 px-4 border border-neutral-300 rounded-xl text-center font-bold tracking-widest text-lg focus:outline-none focus:border-[#6312E1]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !verificationCode}
                className="h-11 bg-[#6312E1] hover:bg-[#520cbd] text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center"
              >
                {loading ? 'Verifying...' : 'Verify OTP & Reset'}
              </button>
            </form>
          </div>
        )}

        {/* Feedback Toasts */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-2 max-w-[420px] transition-all">
            <CheckCircle2 className="w-4.5 h-4.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 max-w-[420px] transition-all">
            <ShieldAlert className="w-4.5 h-4.5" />
            <span>{errorMsg}</span>
          </div>
        )}

      </div>
    </div>
  );
};