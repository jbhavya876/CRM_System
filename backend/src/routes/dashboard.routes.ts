import { FastifyInstance } from "fastify";
import { pool } from "../db";

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/api/dashboard/stats",
    {
      onRequest: [
        fastify.authenticate,
        fastify.authorize(["ADMIN", "MANAGER", 'BOOTH_STAFF'])
      ]
    },
    async (req, reply) => {
      try {
        const [summary, leaderboard, loans] = await Promise.all([
          // Summary Metrics
          pool.query(`
            SELECT 
              COUNT(*)::int AS total_leads,
              SUM(CASE WHEN source_campaign LIKE '%QR%' THEN 1 ELSE 0 END)::int AS qr_scans,
              SUM(CASE WHEN source_campaign = 'BOOTH_MANUAL' THEN 1 ELSE 0 END)::int AS booth_conv,
              SUM(CASE WHEN lead_score >= 80 THEN 1 ELSE 0 END)::int AS hot_leads
            FROM leads 
            WHERE created_at::DATE = CURRENT_DATE
          `),

          // Staff Leaderboard
          pool.query(`
            SELECT u.name, COUNT(l.id)::int AS leads
            FROM leads l
            JOIN users u ON l.created_by = u.id
            WHERE l.created_at::DATE = CURRENT_DATE
            GROUP BY u.name
            ORDER BY leads DESC
            LIMIT 5
          `),

          // Loan Distribution
          pool.query(`
            SELECT loan_type, COUNT(*)::int AS count
            FROM leads
            WHERE created_at::DATE = CURRENT_DATE
            GROUP BY loan_type
          `)
        ]);

        return {
          success: true,
          timestamp: new Date(),
          metrics: summary.rows[0],
          leaderboard: leaderboard.rows,
          distribution: loans.rows
        };
      } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({ error: "Dashboard query failed" });
      }
    }
  );
}
