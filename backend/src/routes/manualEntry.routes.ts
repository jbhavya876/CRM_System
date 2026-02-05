/// <reference path="../types/fastify.d.ts" />
import { FastifyInstance } from "fastify";
import { AssignmentService } from "../services/AssignmentService";
import { ManualLeadSchema } from "../schemas/ManualLeadSchema";
import { notificationQueue } from "../queues/notification.queue";
import { ScoringEngine } from "../services/ScoringEngine";
import { pool } from "../db";

export async function manualEntryRoutes(fastify: FastifyInstance) {
  const assigner = new AssignmentService(pool);
  const scoringEngine = new ScoringEngine();
  await scoringEngine.load(pool);

  fastify.post(
    "/api/leads/manual",
    {
      onRequest: [
        fastify.authenticate,
        fastify.authorize(["ADMIN", "BOOTH_STAFF"]),
      ],
    },
    async (req, reply) => {
      const staffId = req.user!.id;

      const data = ManualLeadSchema.parse(req.body);

      const assignedOfficerId = await assigner.assignLead(data.loanType);

      if (!assignedOfficerId) {
        return reply.code(500).send({
          success: false,
          message: "No loan officer available for this loan type",
        });
      }

      const score = scoringEngine.calculate(data);

      const res = await pool.query(
        `
      INSERT INTO leads (
        full_name, phone, email, loan_type, amount_needed, employment_status,
        urgency_level, special_notes, tags, source_campaign,
        assigned_to, created_by, status, lead_score
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'BOOTH_MANUAL',$10,$11,'NEW',$12)
      RETURNING id
      `,
        [
          data.name,
          data.phone,
          data.email,
          data.loanType,
          data.amountNeeded,
          data.employment,
          data.urgency,
          data.notes,
          ["Exhibition-2026-BoothVisit"],
          assignedOfficerId,
          staffId,
          score,
        ],
      );

      const leadId = res.rows[0].id;

      // Immediate welcome
      await notificationQueue.add("send-welcome-pack", { leadId });

      // Delayed nurture
      const DAY = 86400000;
      await notificationQueue.add(
        "nurture-day-3",
        { leadId },
        { delay: DAY * 3 },
      );
      await notificationQueue.add(
        "nurture-day-5",
        { leadId },
        { delay: DAY * 5 },
      );
      await notificationQueue.add(
        "nurture-day-7",
        { leadId },
        { delay: DAY * 7 },
      );

      return reply.send({ success: true, assignedTo: assignedOfficerId });
    },
  );
}
