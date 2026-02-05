import StaffEntryForm from '@/components/forms/StaffEntryForm';

export default function StaffEntryPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manual Lead Entry</h1>
          <p className="text-gray-500">For use by authorized booth staff only.</p>
        </div>
        <StaffEntryForm />
      </div>
    </div>
  );
}
