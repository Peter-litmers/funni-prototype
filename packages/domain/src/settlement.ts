export type SettlementSummary = {
  id: string;
  period: string;
  amount: number;
  status: "pending" | "paid" | "rejected";
};
