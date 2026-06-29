import React from "react";
import { Topbar } from "@/components/layout/topbar";
import { UsersTable } from "@/components/dashboard/UsersTable";
import { recentUsersData } from "@/data/dashboard";

export default function AllUsersPage() {
  return (
    <>
      <Topbar title="All Users" />

      <main className="flex-1 p-8 bg-[#FDFDFE] overflow-y-auto custom-scrollbar">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            User Management
          </h2>
          <p className="text-sm text-neutral-500">
            View and manage all registered users on the platform.
          </p>
        </div>

        {/* Reusing the exact same table from the main dashboard */}
        <div className="w-full">
          <UsersTable data={recentUsersData} />
        </div>
      </main>
    </>
  );
}
