import { z } from "zod";

export const ManualLeadSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  loanType: z.string(),
  amountNeeded: z.number(),
  employment: z.enum(["SALARIED", "SELF_EMPLOYED"]),
  urgency: z.enum(["IMMEDIATE", "THIS_MONTH", "EXPLORING"]),
  notes: z.string().optional()
});
