import type { StudioDeposit } from "../studio";

export function calculateDeposit(total: number, config: StudioDeposit): number {
  if (!config.enabled || total <= 0 || config.value <= 0) return 0;

  if (config.mode === "percent") {
    const percent = Math.max(0, Math.min(config.value, 100));
    return Math.round((total * percent) / 100);
  }

  return Math.min(total, Math.round(config.value));
}

export function describeDeposit(config: StudioDeposit): string {
  if (!config.enabled) return "예약금 없음";
  if (config.mode === "percent") return `${config.value}% 예약금`;
  return `예약금 ₩${config.value.toLocaleString()}`;
}
