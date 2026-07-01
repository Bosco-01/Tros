'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

// Inline SVGs for self-contained, lightweight, zero-dependency icon styling
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

export const LoginForm: React.FC = () => {
  const router = useRouter(); // Next.js router initialized
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || 'Invalid email or password.');
        return;
      }

      setSuccess('Successfully logged in! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 400);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[440px] flex flex-col">
      <div className="flex flex-col gap-2 mb-8 md:mb-10">
        <h1 className="text-[34px] md:text-[38px] font-bold text-neutral-900 tracking-tight leading-tight">
          Log into your Account
        </h1>
        <p className="text-[14px] text-neutral-500 font-normal">
          Welcome back, please enter your details to continue
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Input
          label="Email Address"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none flex items-center justify-center p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <div className="text-neutral-500"><EyeIcon /></div>
                ) : (
                  <div className="text-neutral-500"><EyeOffIcon /></div>
                )}
              </button>
            }
          />
          
          <div className="flex justify-start mt-0.5">
            <button
              type="button"
              className="text-sm font-bold text-neutral-900 hover:text-[#6312e1] transition-colors"
            >
              Forgot Password
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium transition-all">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium transition-all">
          {success}
        </div>
      )}

      <div className="mt-8">
        <Button type="submit" isLoading={isLoading}>
          Login
        </Button>
      </div>
    </form>
  );
};