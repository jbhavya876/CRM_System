import { FastifyRequest } from "fastify";
import Redis from "ioredis";
import { Pool } from "pg";

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379
});

export class LeadProtectionService {

  static async checkIdempotency(req: FastifyRequest) {
    const key = req.headers["x-idempotency-key"] as string;
    if (!key) return null;

    const cached = await redis.get(`idem:${key}`);
    return cached ? JSON.parse(cached) : null;
  }

  static async saveIdempotency(key: string | undefined, response: any) {
    if (!key) return;
    await redis.setex(`idem:${key}`, 86400, JSON.stringify(response));
  }

  static async findExistingLead(pool: Pool, phone: string) {
    const res = await pool.query(
      `SELECT id, status, lead_score FROM leads WHERE phone = $1`,
      [phone]
    );
    return res.rows[0] || null;
  }
}
