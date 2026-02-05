'use client';

import { useEffect, useState } from 'react';
import { Phone, Calendar, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { authService } from '@/services/auth';
import { useRouter } from 'next/navigation';

export default function MyLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchLeads = async () => {
    try {
      const headers = authService.getAuthHeader();
      const res = await api.get('/leads/mine', { headers });
      setLeads(res.data.leads);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const headers = authService.getAuthHeader();
      await api.patch(`/leads/${id}/status`, { status: newStatus }, { headers });
      // Optimistic UI Update
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your workspace...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Workspace</h1>
            <p className="text-gray-500">You have {leads.filter(l => l.status === 'NEW' || l.status === 'PRE_QUALIFIED').length} pending calls.</p>
          </div>
          <button onClick={() => router.push('/dashboard')} className="text-sm text-blue-600 hover:underline">
            View Stats
          </button>
        </div>

        <div className="space-y-4">
          {leads.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed">
              <p className="text-gray-400">No leads assigned to you yet.</p>
            </div>
          ) : (
            leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onUpdate={updateStatus} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for individual lead cards
function LeadCard({ lead, onUpdate }: { lead: any, onUpdate: Function }) {
  // Color coding for urgency
  const urgencyColor = 
    lead.urgency_level === 'IMMEDIATE' ? 'bg-red-50 text-red-700 border-red-100' :
    lead.urgency_level === 'THIS_MONTH' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
    'bg-gray-50 text-gray-600 border-gray-100';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        
        {/* Left: Lead Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{lead.full_name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${urgencyColor}`}>
              {lead.urgency_level?.replace('_', ' ') || 'STANDARD'}
            </span>
            {lead.lead_score >= 80 && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center gap-1">
                 🔥 High Score ({lead.lead_score})
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 mt-3">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4 text-gray-400" /> {lead.phone}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-gray-400" /> ₹{(lead.amount_needed / 100000).toFixed(1)} Lakhs
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-gray-400" /> {lead.loan_type}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-400" /> {new Date(lead.created_at).toLocaleDateString()}
            </div>
          </div>

          {lead.special_notes && (
             <div className="mt-3 bg-yellow-50 p-2 rounded text-xs text-yellow-800 border border-yellow-100 flex gap-2">
               <AlertCircle className="h-4 w-4 shrink-0" />
               "{lead.special_notes}"
             </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col gap-2 min-w-[160px] border-l pl-4 md:border-l-gray-100">
           <span className="text-xs font-semibold text-gray-400 uppercase">Current Status</span>
           <div className={`font-medium ${lead.status === 'NEW' ? 'text-blue-600' : 'text-green-600'}`}>
             {lead.status.replace('_', ' ')}
           </div>
           
           <select 
             className="mt-2 w-full p-2 text-sm border rounded-lg bg-gray-50 hover:bg-white transition-colors cursor-pointer"
             value={lead.status}
             onChange={(e) => onUpdate(lead.id, e.target.value)}
           >
             <option value="NEW">New</option>
             <option value="PRE_QUALIFIED">Pre-Qualified</option>
             <option value="CONTACTED">📞 Contacted</option>
             <option value="INTERESTED">⭐ Interested</option>
             <option value="APPLIED">📝 Applied</option>
             <option value="REJECTED">❌ Rejected</option>
           </select>
        </div>

      </div>
    </div>
  );
}