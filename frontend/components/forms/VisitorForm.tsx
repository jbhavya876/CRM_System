'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile"),
  email: z.string().email("Enter valid email"),
  loanType: z.enum(['BUSINESS_LOAN', 'HOME_LOAN']),
  amountNeeded: z.number().min(100000, "Minimum ₹1,00,000"),
  employment: z.enum(['SALARIED', 'SELF_EMPLOYED']),
});

type FormData = z.infer<typeof formSchema>;

export default function VisitorForm({ sourceId }: { sourceId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanType: 'BUSINESS_LOAN',
      employment: 'SELF_EMPLOYED'
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError('');
    setSubmittedName(data.name);

    try {
      const res = await api.post('/leads/entry', {
        ...data,
        source: `Exhibition-2026-${sourceId}`
      });

      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 rounded-xl border border-green-200 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Application Received!</h2>
        <p className="text-gray-600 mt-2">
          Thank you {submittedName.split(' ')[0]}, our team will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('name')} placeholder="Full Name" className="w-full border p-3 rounded" />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <input {...register('phone')} placeholder="Mobile Number" className="w-full border p-3 rounded" />
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

      <input {...register('email')} placeholder="Email Address" className="w-full border p-3 rounded" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <input type="number" {...register('amountNeeded', { valueAsNumber: true })} placeholder="Loan Amount" className="w-full border p-3 rounded" />
      {errors.amountNeeded && <p className="text-red-500 text-sm">{errors.amountNeeded.message}</p>}

      <select {...register('loanType')} className="w-full border p-3 rounded">
        <option value="BUSINESS_LOAN">Business Loan</option>
        <option value="HOME_LOAN">Home Loan</option>
      </select>

      <select {...register('employment')} className="w-full border p-3 rounded">
        <option value="SALARIED">Salaried</option>
        <option value="SELF_EMPLOYED">Self Employed</option>
      </select>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded font-bold flex justify-center items-center gap-2"
      >
        {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Check Eligibility"}
      </button>
    </form>
  );
}
