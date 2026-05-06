export type RefundMatrix = {
  d7: number;
  d3to6: number;
  d1to2: number;
  sameDay: number;
};

export function pickRefundRate(
  matrix: RefundMatrix,
  daysUntilShoot: number,
): number {
  if (daysUntilShoot >= 7) return matrix.d7;
  if (daysUntilShoot >= 3) return matrix.d3to6;
  if (daysUntilShoot >= 1) return matrix.d1to2;
  return matrix.sameDay;
}
