"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ApplicationWithAssignment } from "@/types";

export default function VerifierDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<ApplicationWithAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Role-based redirect
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.role !== "VERIFIER") {
      // Redirect non-verifiers to their appropriate dashboard
      if (session.user.role === "ADMIN") {
        router.push("/admin");
      } else if (session.user.role === "STUDENT") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      return;
    }
  }, [session, status, router]);

  // Fetch assigned applications
  useEffect(() => {
    async function fetchAssignedApplications() {
      if (!session?.user || session.user.role !== "VERIFIER") return;

      try {
        setIsLoading(true);
        const response = await fetch("/api/verifier/assignments");
        const data = await response.json();

        if (response.ok) {
          setApplications(data.applications);
        } else {
          console.error("Failed to fetch assignments:", data.error);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssignedApplications();
  }, [session]);

  // Show loading while checking auth
  if (status === "loading" || !session || session.user.role !== "VERIFIER") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 md:px-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">My Assigned Applications</h1>
            <p className="text-gray-600 mt-1">
              Review and verify applications assigned to you
            </p>
          </div>
          <Link
            href="/"
            className="border border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white rounded-md px-4 py-1.5 transition"
          >
            Sign Out
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-600">Loading assignments...</p>
          </div>
        ) : (
          <>
            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <CardContent className="p-0">
                  <p className="text-sm text-gray-600">Total Assigned</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">
                    {applications.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <CardContent className="p-0">
                  <p className="text-sm text-gray-600">In Review</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {applications.filter((a) => a.applicationStatus === "IN_REVIEW").length}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <CardContent className="p-0">
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {applications.filter((a) => a.applicationStatus === "VERIFIED").length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Applications Table */}
            <CardTitle className="text-lg font-semibold text-blue-700 mb-4">Assigned Applications</CardTitle>

            <Card className="p-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px]">
                    <thead className="bg-blue-50 border-b border-gray-200 text-blue-700 uppercase text-xs tracking-wide">
                      <tr>
                        <th className="p-4 text-left font-medium">Name</th>
                        <th className="p-4 text-left font-medium">Email</th>
                        <th className="p-4 text-left font-medium">Branch</th>
                        <th className="p-4 text-left font-medium">Status</th>
                        <th className="p-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500">
                            No applications assigned yet
                          </td>
                        </tr>
                      ) : (
                        applications.map((app) => (
                          <tr
                            key={app.id}
                            className="border-b border-gray-200 hover:bg-gray-50 text-sm cursor-pointer"
                            onClick={() => router.push(`/verifier/applications/${app.id}`)}
                          >
                            <td className="p-4 font-medium text-gray-800">{app.name}</td>
                            <td className="p-4 text-gray-600">{app.email}</td>
                            <td className="p-4 text-gray-700">{app.branchAllotted}</td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  app.applicationStatus === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : app.applicationStatus === "IN_REVIEW"
                                    ? "bg-blue-100 text-blue-700"
                                    : app.applicationStatus === "VERIFIED"
                                    ? "bg-green-100 text-green-700"
                                    : app.applicationStatus === "REJECTED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {app.applicationStatus}
                              </span>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/verifier/applications/${app.id}`);
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm inline-flex items-center gap-1"
                              >
                                Review <span aria-hidden="true">→</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}