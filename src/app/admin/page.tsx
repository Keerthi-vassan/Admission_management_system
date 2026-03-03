"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminApplicationsTable from "@/components/admin/AdminApplicationsTable";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return null;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  if (session.user.role !== "ADMIN") {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-app-background px-6 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold text-app-primary">
              Admin Dashboard
            </h1>
            <p className="text-app-muted mt-1">
              Manage student applications
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <Link
              href="/admin/assignments"
              className="border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg px-4 py-2 text-sm font-medium transition"
            >
              Assignments
            </Link>

            <LogoutButton />
          </div>
        </div>

        <AdminApplicationsTable />
      </div>
    </div>
  );
}