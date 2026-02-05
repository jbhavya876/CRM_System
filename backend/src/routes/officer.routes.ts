import { FastifyInstance } from 'fastify';
import { pool } from "../db";

export async function officerRoutes(fastify: FastifyInstance) {

  // 🔹 1. Get My Leads
  fastify.get('/api/leads/mine', {
    onRequest: [fastify.authenticate]
  }, async (req, reply) => {
    const staffId = req.user!.id;

    const query = `
      SELECT id, full_name, phone, loan_type, amount_needed,
             urgency_level, status, lead_score, special_notes, created_at
      FROM leads
      WHERE assigned_to = $1
      ORDER BY
        CASE urgency_level
          WHEN 'IMMEDIATE' THEN 1
          WHEN 'THIS_MONTH' THEN 2
          ELSE 3
        END,
        created_at DESC
    `;

    const res = await pool.query(query, [staffId]);
    return { success: true, leads: res.rows };
  });


  // 🔹 2. Update Lead Status
  fastify.patch('/api/leads/:id/status', {
    onRequest: [fastify.authenticate]
  }, async (req, reply) => {
    const staffId = req.user!.id;
    const { id } = req.params as { id: string };
    const { status } = req.body as { status: string };

    const query = `
      UPDATE leads
      SET status = $1,
          updated_at = NOW()
      WHERE id = $2 AND assigned_to = $3
      RETURNING id, status
    `;

    const res = await pool.query(query, [status, id, staffId]);

    if (res.rowCount === 0) {
      return reply.code(404).send({ error: 'Lead not found or not assigned to you' });
    }

    return { success: true, lead: res.rows[0] };
  });
}
