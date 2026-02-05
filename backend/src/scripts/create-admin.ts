import { Pool } from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createAdmin() {
  const email = "admin@bhavya.com";
  const password = "ChangeThisStrongPassword!";
  const name = "Super Admin";

  try {
    const hash = await bcrypt.hash(password, 10);

    const res = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'ADMIN')
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [name, email, hash],
    );

    if (res.rowCount === 0) {
      console.log("⚠️ Admin already exists");
    } else {
      console.log("✅ Admin created");
      console.log(`Login → ${email} / ${password}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

createAdmin();
