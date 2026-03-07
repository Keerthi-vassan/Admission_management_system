"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
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
      if (session.user.role === "ADMIN") router.push("/admin");
      else if (session.user.role === "STUDENT") router.push("/dashboard");
      else router.push("/");
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

  // Loading state while checking auth
  if (status === "loading" || !session || session.user.role !== "VERIFIER") {
    return (
      <div className="min-h-screen bg-app-background flex items-center justify-center px-6 md:px-8">
        <p className="text-app-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-background py-8 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold text-app-primary">
              My Assigned Applications
            </h1>
            <p className="text-app-muted mt-1">
              Review and verify applications assigned to you
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="border border-app-primary text-app-primary hover:bg-app-primary hover:text-white rounded-md px-4 py-1.5 transition"
          >
            Sign Out
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 bg-app-card rounded-xl border border-app-border shadow-sm">
            <p className="text-app-muted">Loading assignments...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-app-card rounded-xl shadow-sm border border-app-border p-6">
                <CardContent className="p-0">
                  <p className="text-sm text-app-muted">Total Assigned</p>
                  <p className="text-3xl font-bold text-app-primary mt-2">
                    {applications.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-app-card rounded-xl shadow-sm border border-app-border p-6">
                <CardContent className="p-0">
                  <p className="text-sm text-app-muted">In Review</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {
                      applications.filter(
                        (a) => a.applicationStatus === "IN_REVIEW"
                      ).length
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-app-card rounded-xl shadow-sm border border-app-border p-6">
                <CardContent className="p-0">
                  <p className="text-sm text-app-muted">Verified</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {
                      applications.filter(
                        (a) => a.applicationStatus === "VERIFIED"
                      ).length
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <CardTitle className="text-lg font-semibold text-app-primary mb-4">
              Assigned Applications
            </CardTitle>

            <Card className="p-0 bg-app-card rounded-xl shadow-sm border border-app-border overflow-x-auto">
              <CardContent className="p-0">
                <table className="w-full min-w-[760px]">
                  <thead className="bg-blue-50 border-b border-app-border text-app-primary uppercase text-xs tracking-wide">
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
                        <td colSpan={5} className="p-8 text-center text-app-muted">
                          No applications assigned yet
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        <tr
                          key={app.id}
                          className="border-b border-app-border hover:bg-gray-50 text-sm cursor-pointer"
                          onClick={() =>
                            router.push(`/verifier/applications/${app.id}`)
                          }
                        >
                          <td className="p-4 font-medium text-gray-800">
                            {app.name}
                          </td>
                          <td className="p-4 text-app-muted">
                            {app.email}
                          </td>
                          <td className="p-4 text-gray-700">
                            {app.branchAllotted}
                          </td>
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
                                router.push(
                                  `/verifier/applications/${app.id}`
                                );
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm inline-flex items-center gap-1"
                            >
                              Review →
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}