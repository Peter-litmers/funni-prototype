import type { PaymentSummary } from "../payment";

export function buildPaymentSummary(
  amount: number,
  depositAmount: number,
): PaymentSummary {
  return {
    amount,
    depositAmount,
    balanceAmount: Math.max(amount - depositAmount, 0),
  };
}

export function formatWon(amount: number): string {
  return `₩${amount.toLocaleString()}`;
}
