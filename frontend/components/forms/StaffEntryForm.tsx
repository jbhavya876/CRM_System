"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Loader2, UserCheck, ArrowLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { authService } from "@/services/auth";

// 1. Extended Schema for Staff
const staffFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile number"),
  email: z.string().email("Valid email required"),
  loanType: z.enum(["BUSINESS", "HOME", "PERSONAL"]),
  amountNeeded: z.number().min(100000, "Min ₹1 Lakh"),
  employment: z.enum(["SALARIED", "SELF_EMPLOYED"]),
  urgency: z.enum(["IMMEDIATE", "THIS_MONTH", "EXPLORING"]),
  notes: z.string().optional(),
});

type StaffFormData = z.infer<typeof staffFormSchema>;

export default function StaffEntryForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ assignedTo: number } | null>(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      loanType: "BUSINESS",
      urgency: "IMMEDIATE",
      amountNeeded: 2500000,
      employment: "SELF_EMPLOYED",
    },
  });

  const onSubmit = async (data: StaffFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      // 2. Auth Header Injection
      const headers = authService.getAuthHeader();

      const res = await api.post("/leads/manual", data, { headers });

      if (res.data.success) {
        setSuccess(res.data);
        reset(); // Clear form for next person
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/login"); // Token expired
      } else {
        setError(err.response?.data?.message || "Failed to save lead");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Success View (Ready for next lead)
  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-in fade-in slide-in-from-bottom-4">
        <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <UserCheck className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-900">Lead Saved!</h2>
        <p className="text-green-700 mt-2">
          Assigned to Officer ID:{" "}
          <span className="font-mono font-bold">#{success.assignedTo}</span>
        </p>
        <div className="mt-8">
          <button
            onClick={() => setSuccess(null)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors w-full"
          >
            + Add Another Lead
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-3 text-green-600 text-sm hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">New Booth Entry</h2>
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Row 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Visitor Name
            </label>
            <input
              {...register("name")}
              className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Enter name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              {...register("phone")}
              className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="9876543210"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Email & Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              {...register("email")}
              className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Loan Amount (₹)
            </label>
            <input
              type="number"
              {...register("amountNeeded", { valueAsNumber: true })}
              className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Employment Type
          </label>
          <div className="flex gap-2">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="SALARIED"
                {...register("employment")}
                className="sr-only peer"
              />
              <div className="text-center py-2 rounded-md text-xs font-bold border border-blue-200 text-blue-600 peer-checked:bg-blue-50 peer-checked:ring-2 peer-checked:ring-blue-500 transition-all">
                Salaried
              </div>
            </label>

            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="SELF_EMPLOYED"
                {...register("employment")}
                className="sr-only peer"
              />
              <div className="text-center py-2 rounded-md text-xs font-bold border border-purple-200 text-purple-600 peer-checked:bg-purple-50 peer-checked:ring-2 peer-checked:ring-purple-500 transition-all">
                Self Employed
              </div>
            </label>
          </div>
          {errors.employment && (
            <p className="text-red-500 text-xs mt-1">
              {errors.employment.message}
            </p>
          )}
        </div>

        {/* Row 3: Loan Type & Urgency (Critical for Staff) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Loan Category
            </label>
            <select
              {...register("loanType")}
              className="w-full p-3 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="BUSINESS">Business Loan</option>
              <option value="HOME">Home Loan</option>
              <option value="PERSONAL">Personal Loan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Urgency Level
            </label>
            <div className="flex gap-2">
              {["IMMEDIATE", "THIS_MONTH", "EXPLORING"].map((level) => (
                <label key={level} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    value={level}
                    {...register("urgency")}
                    className="sr-only peer"
                  />
                  <div
                    className={`
                    text-center py-2 rounded-md text-xs font-bold border transition-all
                    peer-checked:ring-2 peer-checked:ring-offset-1
                    ${level === "IMMEDIATE" ? "border-red-200 text-red-600 peer-checked:bg-red-50 peer-checked:ring-red-500" : ""}
                    ${level === "THIS_MONTH" ? "border-yellow-200 text-yellow-600 peer-checked:bg-yellow-50 peer-checked:ring-yellow-500" : ""}
                    ${level === "EXPLORING" ? "border-gray-200 text-gray-500 peer-checked:bg-gray-100 peer-checked:ring-gray-500" : ""}
                  `}
                  >
                    {level.replace("_", " ")}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Staff Notes
          </label>
          <textarea
            {...register("notes")}
            rows={3}
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="e.g. Client needs funds for new machinery..."
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {isSubmitting ? "Saving..." : "Save Lead & Assign"}
        </button>
      </form>
    </div>
  );
}
