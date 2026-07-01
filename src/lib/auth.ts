'use client';

import { useRouter } from 'next/navigation';

export async function logoutAdmin(): Promise<void> {
  await fetch('/api/admin/logout', { method: 'POST' });
}

export function useLogout() {
  const router = useRouter();

  return async () => {
    await logoutAdmin();
    router.replace('/');
  };
}
