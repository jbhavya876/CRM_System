import { z } from "zod";

export const LeadSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().min(10, "Invalid phone number"),
  email: z.string().email().optional(),

  loanType: z.string(),
  amountNeeded: z.number().positive(),
  employment: z.enum(["SALARIED", "SELF_EMPLOYED"]),

  source: z.string().optional()
});

export type LeadInput = z.infer<typeof LeadSchema>;
