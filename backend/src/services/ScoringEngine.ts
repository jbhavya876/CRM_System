import { Pool } from "pg";

interface Rule {
  category: string;
  match_value: string;
  operator: string;
  score_impact: number;
}

export class ScoringEngine {
  private rules: Rule[] = [];

  async load(pool: Pool) {
    const res = await pool.query(
      `SELECT category, match_value, operator, score_impact 
       FROM scoring_rules WHERE is_active = TRUE`
    );
    this.rules = res.rows;
  }

  calculate(data: any): number {
    let score = 50;

    for (const rule of this.rules) {
      switch (rule.category) {
        case "EMPLOYMENT":
          if (data.employment === rule.match_value)
            score += rule.score_impact;
          break;

        case "AMOUNT":
          if (
            rule.operator === "LESS_THAN" &&
            data.amountNeeded < Number(rule.match_value)
          )
            score += rule.score_impact;
          break;

        case "LOAN_TYPE":
          if (data.loanType.includes(rule.match_value))
            score += rule.score_impact;
          break;
      }
    }
    return score;
  }
}