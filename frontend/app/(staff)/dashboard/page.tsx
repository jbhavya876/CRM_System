"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { PlusCircle } from "lucide-react";
import {
  Users,
  QrCode,
  ClipboardEdit,
  Flame,
  LogOut,
  RefreshCcw,
} from "lucide-react";
import api from "@/lib/api";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // 1. Authenticated Request
      const headers = authService.getAuthHeader();
      const res = await api.get("/dashboard/stats", { headers });
      setData(res.data);
    } catch (err) {
      // If 401/403, redirect to login
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Optional: Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading Dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Unauthorized or session expired. Please login again.
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-gray-900">
            Bhavya CRM{" "}
            <span className="text-xs font-normal text-gray-500 ml-2">
              Live View
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Desktop Button */}
            <Link
              href="/entry"
              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              <PlusCircle className="h-4 w-4" />
              New Lead
            </Link>
            <Link
              href="/leads"
              className="hidden sm:flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <ClipboardList className="h-4 w-4" />
              My Leads
            </Link>

            {/* Mobile Icon */}
            <Link
              href="/entry"
              className="sm:hidden p-2 bg-blue-600 text-white rounded-full"
            >
              <PlusCircle className="h-5 w-5" />
            </Link>

            <button
              onClick={fetchStats}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
            >
              <RefreshCcw className="h-5 w-5" />
            </button>

            <button
              onClick={authService.logout}
              className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Leads Today"
            value={data.metrics.total_leads}
            icon={<Users className="h-6 w-6 text-blue-600" />}
            bg="bg-blue-50"
          />
          <StatCard
            title="QR Scans"
            value={data.metrics.qr_scans}
            icon={<QrCode className="h-6 w-6 text-purple-600" />}
            bg="bg-purple-50"
          />
          <StatCard
            title="Booth Visits"
            value={data.metrics.booth_conv}
            icon={<ClipboardEdit className="h-6 w-6 text-orange-600" />}
            bg="bg-orange-50"
          />
          <StatCard
            title="Hot Leads (Score 80+)"
            value={data.metrics.hot_leads}
            icon={<Flame className="h-6 w-6 text-red-600" />}
            bg="bg-red-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2. Staff Leaderboard */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Staff Leaderboard
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                    <th className="pb-3">Staff Name</th>
                    <th className="pb-3">Leads Captured</th>
                    <th className="pb-3">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.leaderboard.map((staff: any, idx: number) => (
                    <tr key={idx} className="group hover:bg-gray-50">
                      <td className="py-4 text-sm font-medium text-gray-900">
                        {staff.name}
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {staff.leads}
                      </td>
                      <td className="py-4">
                        <div className="w-full bg-gray-100 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${(staff.leads / data.metrics.total_leads) * 100}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Loan Type Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Loan Distribution
            </h3>
            <div className="space-y-4">
              {data.distribution.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                    <span className="text-sm text-gray-600 capitalize">
                      {item.loan_type.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Component for Cards
function StatCard({ title, value, icon, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${bg}`}>{icon}</div>
    </div>
  );
}
