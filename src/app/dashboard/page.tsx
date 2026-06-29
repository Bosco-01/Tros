import React from 'react';
import { Topbar } from '@/components/layout/topbar';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { UsersTable } from '@/components/dashboard/UsersTable';
import { metricsData, recentUsersData } from '@/data/dashboard';

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Dashboard" />
      
      {/* Main Content Area */}
      <main className="flex-1 p-8 bg-[#FDFDFE] overflow-y-auto custom-scrollbar">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {metricsData.map((metric) => (
            <MetricsCard key={metric.id} data={metric} />
          ))}
        </div>

        {/* Data Table Section */}
        <div className="w-full">
          <UsersTable data={recentUsersData} />
        </div>
        
      </main>
    </>
  );
}