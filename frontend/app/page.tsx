import Link from "next/link";
import {
  ShieldCheck,
  LayoutDashboard,
  QrCode,
  ArrowRight,
  Lock,
} from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      {/* 1. Branding Section */}
      <div className="text-center mb-12 animate-in fade-in zoom-in duration-700">
        <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/50 mb-6">
          <ShieldCheck className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Bhavya Agencies
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Authorized Finance Partner • Exhibition 2026
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          System Operational
        </div>
      </div>

      {/* 2. Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Card A: Staff Portal (Secure) */}
        <Link
          href="/login"
          className="group relative overflow-hidden bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Lock className="h-24 w-24 text-blue-400" />
          </div>

          <div className="relative z-10">
            <div className="h-12 w-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-6 border border-blue-800 group-hover:border-blue-500 transition-colors">
              <LayoutDashboard className="h-6 w-6 text-blue-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Staff Portal</h2>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              Secure access for Loan Officers and Booth Managers. View live
              dashboard, track leads, and manage assignments.
            </p>

            <span className="inline-flex items-center text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
              Login to CRM <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </div>
        </Link>

        {/* Card B: Visitor Demo (Public Test) */}
        <Link
          href="/scan/DEMO-ENTRY-01"
          className="group relative overflow-hidden bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <QrCode className="h-24 w-24 text-purple-400" />
          </div>

          <div className="relative z-10">
            <div className="h-12 w-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-6 border border-purple-800 group-hover:border-purple-500 transition-colors">
              <QrCode className="h-6 w-6 text-purple-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Visitor Demo</h2>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              Simulate a visitor scanning a QR code at the booth. Test the
              "Digital Entry" flow and see instant pre-approval.
            </p>

            <span className="inline-flex items-center text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
              Launch Demo Form <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </div>
        </Link>
      </div>

      {/* 3. Footer */}
      <div className="mt-16 text-center">
        <p className="text-slate-600 text-sm">
          &copy; 2026 Bhavya Agencies. Internal System v1.0.0
        </p>
      </div>
    </div>
  );
}
