export const calculateScore = (amount: number, employment: string): number => {
  let score = 50;

  if (employment === 'SELF_EMPLOYED') score += 20;
  if (amount < 5000000) score += 15;

  return score;
};
