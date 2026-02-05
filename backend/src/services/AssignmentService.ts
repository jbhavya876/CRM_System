import { Pool } from "pg";

export class AssignmentService {
  constructor(private pool: Pool) {}

  async assignLead(loanType: string): Promise<number | null> {
    const normalized =
      loanType.toUpperCase().includes("BUSINESS")
        ? "BUSINESS_LOAN"
        : "HOME_LOAN";

    const res = await this.pool.query(
      `
      SELECT id FROM users
      WHERE role = 'LOAN_OFFICER'
        AND (specialty = $1 OR specialty = 'ALL')
      ORDER BY RANDOM()
      LIMIT 1
      `,
      [normalized]
    );

    return res.rows[0]?.id ?? null;
  }
}
