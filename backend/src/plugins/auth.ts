import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import bcrypt from "bcrypt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { pool } from "../db";

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "supersecretkey"
  });

  fastify.decorate(
    "authenticate",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: "Unauthorized" });
      }
    }
  );

  fastify.decorate("authorize", (roles: string[]) => {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      if (!req.user || !roles.includes(req.user.role)) {
        reply.code(403).send({ error: "Forbidden" });
      }
    };
  });

  // 🔐 LOGIN
  fastify.post("/api/auth/login", async (req, reply) => {
    const { email, password } = req.body as any;

    const res = await pool.query("SELECT * FROM users WHERE email = $1", [
      email
    ]);
    const user = res.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    return { token };
  });

  // 👤 REGISTER STAFF (temporary open endpoint)
  fastify.post("/api/auth/register-staff", async (req, reply) => {
    const { name, email, role, password, specialty } = req.body as any;

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role, specialty)
       VALUES ($1,$2,$3,$4,$5)`,
      [name, email, hash, role, specialty]
    );

    return { success: true };
  });
});
