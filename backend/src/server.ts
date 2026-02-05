import dotenv from "dotenv";

dotenv.config();

import Fastify from "fastify";
import { z } from "zod";
import cors from '@fastify/cors';
import { pool } from "./db";
import { notificationQueue } from "./queues/notification.queue";
import { calculateScore } from "./services/scoring.service";
import { manualEntryRoutes } from "./routes/manualEntry.routes";
import authPlugin from "./plugins/auth";
import { dashboardRoutes } from "./routes/dashboard.routes";
import { officerRoutes } from './routes/officer.routes';

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: 'http://localhost:3001',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','x-idempotency-key'],
});

const LeadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  loanType: z.string(),
  amountNeeded: z.number().positive(),
  employment: z.enum(["SALARIED", "SELF_EMPLOYED"]),
  source: z.string().optional(),
});

fastify.post("/api/leads/entry", async (request, reply) => {
  const data = LeadSchema.parse(request.body);

  const score = calculateScore(data.amountNeeded, data.employment);
  const status = score >= 80 ? "PRE_QUALIFIED" : "NEW";

  const query = `
    INSERT INTO leads 
    (full_name, phone, email, loan_type, amount_needed, employment_status, lead_score, status, source_campaign)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING id, created_at
  `;

  const values = [
    data.name,
    data.phone,
    data.email,
    data.loanType,
    data.amountNeeded,
    data.employment,
    score,
    status,
    data.source || "Exhibition-2026-QR1",
  ];

  const result = await pool.query(query, values);
  const newLead = result.rows[0];

  await notificationQueue.add("process-new-lead", {
    leadId: newLead.id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    status,
  });

  return reply.code(201).send({
    success: true,
    message:
      status === "PRE_QUALIFIED" ? "Pre-approved!" : "Application Received",
    data: { leadId: newLead.id, status, score },
  });
});

fastify.register(authPlugin);
fastify.register(manualEntryRoutes);
fastify.register(dashboardRoutes);
fastify.register(officerRoutes);

const start = async () => {
  await fastify.listen({ port: Number(process.env.PORT) || 3000 });
};

start();
