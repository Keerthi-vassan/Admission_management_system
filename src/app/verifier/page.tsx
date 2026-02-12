"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Assigned Applications</h1>
        <p className="text-gray-600 mt-2">
          Review and verify applications assigned to you
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      ) : (
        <>
          {/* Stats Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="py-0">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Total Assigned</p>
                <p className="text-3xl font-bold text-blue-600">
                  {applications.length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">In Review</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {applications.filter((a) => a.applicationStatus === "IN_REVIEW").length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-3xl font-bold text-green-600">
                  {applications.filter((a) => a.applicationStatus === "VERIFIED").length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Applications Table */}
          <CardTitle className="p-4">Assigned Applications</CardTitle>
          
          <Card className="py-0">
            
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
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
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`/verifier/applications/${app.id}`)}
                        >
                          <td className="p-4 font-medium">{app.name}</td>
                          <td className="p-4 text-gray-600">{app.email}</td>
                          <td className="p-4">{app.branchAllotted}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                app.applicationStatus === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : app.applicationStatus === "IN_REVIEW"
                                  ? "bg-blue-100 text-blue-800"
                                  : app.applicationStatus === "VERIFIED"
                                  ? "bg-green-100 text-green-800"
                                  : app.applicationStatus === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
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
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              Review →
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
  );
}