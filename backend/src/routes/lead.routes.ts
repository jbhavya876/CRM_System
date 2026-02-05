import { FastifyInstance } from "fastify";
import { pool } from "../db";
import { LeadProtectionService } from "../services/LeadProtectionService";
import { ScoringEngine } from "../services/ScoringEngine";
import { notificationQueue } from "../queues/notification.queue";
import { LeadSchema } from "../schemas/LeadSchema";

const scoringEngine = new ScoringEngine();

export async function leadRoutes(fastify: FastifyInstance) {
  await scoringEngine.load(pool); // load rules at startup

  fastify.post("/api/leads/entry", async (req, reply) => {
    // 1. Idempotency
    const cached = await LeadProtectionService.checkIdempotency(req);
    if (cached) return reply.send(cached);

    const data = LeadSchema.parse(req.body);

    // 2. Deduplication
    const existing = await LeadProtectionService.findExistingLead(
      pool,
      data.phone,
    );

    if (existing) {
      const response = {
        success: true,
        message: "Lead already exists",
        data: existing,
      };
      await LeadProtectionService.saveIdempotency(
        req.headers["x-idempotency-key"] as string,
        response,
      );
      return reply.send(response);
    }

    // 3. Dynamic scoring
    const score = scoringEngine.calculate(data);
    const status = score >= 80 ? "PRE_QUALIFIED" : "NEW";

    // 4. Insert
    try {
      const res = await pool.query(
        `INSERT INTO leads
        (full_name, phone, email, loan_type, amount_needed, employment_status, lead_score, status)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING id, status, lead_score`,
        [
          data.name,
          data.phone,
          data.email,
          data.loanType,
          data.amountNeeded,
          data.employment,
          score,
          status,
        ],
      );

      const response = {
        success: true,
        leadId: res.rows[0].id,
        status: res.rows[0].status,
        score: res.rows[0].lead_score,
      };

      await LeadProtectionService.saveIdempotency(
        req.headers["x-idempotency-key"] as string,
        response,
      );

      await notificationQueue.add("process-new-lead", {
        leadId: res.rows[0].id,
        status,
      });

      return reply.code(201).send(response);
    } catch (err: any) {
      // 🔒 Handle duplicate key violation safely
      if (err.code === "23505") {
        const existing = await LeadProtectionService.findExistingLead(
          pool,
          data.phone,
        );

        const response = {
          success: true,
          message: "Lead already exists",
          data: existing,
        };

        await LeadProtectionService.saveIdempotency(
          req.headers["x-idempotency-key"] as string,
          response,
        );

        return reply.code(200).send(response);
      }

      // Unknown error → real 500
      req.log.error(err);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });
}
