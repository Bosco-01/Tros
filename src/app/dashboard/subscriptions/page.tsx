import React from 'react';
import { Topbar } from '@/components/layout/topbar'; // Note: Match your lowercase file layout configuration
import { SubscriptionHeader } from '@/components/dashboard/subscriptions/SubscriptionHeader';
import { PackageCard } from '@/components/dashboard/subscriptions/PackageCard';
import { UserSubscriptionsList } from '@/components/dashboard/subscriptions/UserSubscriptionsList';

import { mockPackages, mockUserSubscriptions } from '@/data/subscriptions';

export default function SubscriptionsPage() {
  return (
    <>
      <Topbar title="Subscriptions" />
      
      {/* 
        Main content wrapper with slightly grey background 
        so the pure white layout containers and tables stand out.
      */}
      <main className="flex-1 p-8 bg-[#F8F9FA] overflow-y-auto custom-scrollbar">
        
        {/* "Available Packages" header row */}
        <SubscriptionHeader />

        {/* 3 Package Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-[1100px]">
          {mockPackages.map((pack) => (
            <PackageCard key={pack.id} data={pack} />
          ))}
        </div>

        {/* Free/Basic/Premium Subscribed Users directory section */}
        <UserSubscriptionsList data={mockUserSubscriptions} />

      </main>
    </>
  );
}