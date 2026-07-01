'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { SubscriptionHeader } from '@/components/dashboard/subscriptions/SubscriptionHeader';
import { PackageCard } from '@/components/dashboard/subscriptions/PackageCard';
import { UserSubscriptionsList } from '@/components/dashboard/subscriptions/UserSubscriptionsList';
import { adminService } from '@/services/adminService';
import { unwrapList } from '@/lib/api-helpers';
import { formatCurrency } from '@/lib/api-helpers';
import type { SubscriptionPlan, VendorSubscription } from '@/types/admin';
import type { SubscriptionPackage, UserSubscriptionRow } from '@/data/subscriptions';
import { LoadingState, ErrorState, PageShell } from '@/components/ui/AsyncStates';

const HEADER_COLORS = ['bg-[#6312E1]', 'bg-[#FF5C00]', 'bg-[#18392B]'];

function mapPlanToCard(plan: SubscriptionPlan, index: number): SubscriptionPackage {
  const features: string[] = [];
  if (plan.max_events) features.push(`Up to ${plan.max_events} events`);
  if (plan.max_tickets_per_event) features.push(`Up to ${plan.max_tickets_per_event} tickets/event`);
  if (plan.can_access_reports) features.push('Access to reports');
  if (plan.can_broadcast) features.push('Broadcast messages');
  if (plan.description) features.push(plan.description);
  if (features.length === 0) features.push('Standard vendor features');

  return {
    id: plan.plan_id || plan.id || String(index),
    name: plan.name,
    price: formatCurrency(plan.price),
    headerBg: HEADER_COLORS[index % HEADER_COLORS.length],
    features,
  };
}

export default function SubscriptionsPage() {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [plansRes, subsRes] = await Promise.all([
        adminService.listSubscriptionPlans(),
        adminService.listVendorSubscriptions(1, 50),
      ]);
      const plans = unwrapList<SubscriptionPlan>(plansRes);
      setPackages(plans.map(mapPlanToCard));
      setSubscriptions(
        unwrapList<VendorSubscription>(subsRes).map((s, i) => ({
          userId: String(s.vendor_name || s.subscription_id || i),
          customerName: String(s.vendor_name || '—'),
          plan: String(s.plan_name || '—') as UserSubscriptionRow['plan'],
          status: (String(s.status || '').toLowerCase() === 'active' ? 'Active' : 'Inactive') as UserSubscriptionRow['status'],
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Topbar title="Subscriptions" />
      <PageShell>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <>
            <SubscriptionHeader />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 w-full max-w-[1100px]">
              {packages.map((pack) => (
                <PackageCard key={pack.id} data={pack} />
              ))}
            </div>
            <UserSubscriptionsList data={subscriptions} />
          </>
        )}
      </PageShell>
    </>
  );
}
