import VisitorForm from "@/components/forms/VisitorForm";
import { ShieldCheck } from "lucide-react";

interface PageProps {
  params: Promise<{
    qrId: string;
  }>;
}

export default async function VisitorEntryPage({ params }: PageProps) {
  const { qrId } = await params;
  const displayId = qrId.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Bhavya Agencies
          </h1>
          <p className="mt-2 text-sm text-gray-600 flex items-center justify-center gap-1">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            Authorized Exhibition Partner
          </p>
          <div className="mt-4 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full inline-block">
            Expo Code: {displayId}
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Quick Eligibility Check
            </h2>
            <p className="text-sm text-gray-500">
              Fill this form to get instant pre-approval and exclusive expo
              rates.
            </p>
          </div>

          <VisitorForm sourceId={displayId} />
        </div>
      </div>
    </div>
  );
}
