import { Pressable, Text, View } from "react-native";
import type { Booking } from "@funni/domain";
import { formatWon } from "@funni/domain";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Props = {
  booking: Booking;
  onPrimaryAction?: () => void;
  primaryLabel?: string;
  onSecondaryAction?: () => void;
  secondaryLabel?: string;
  onPress?: () => void;
};

export function BookingCard({
  booking,
  onPrimaryAction,
  primaryLabel,
  onSecondaryAction,
  secondaryLabel,
  onPress,
}: Props) {
  return (
    <View className={`mb-3 rounded-xl bg-gray-50 p-4 ${booking.status === "cancelled" ? "opacity-60" : ""}`}>
      <Pressable disabled={!onPress} onPress={onPress}>
        <View className="mb-2 flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-sm font-bold text-gray-900">{booking.studioName}</Text>
            <Text className="mt-0.5 text-xs text-gray-400">
              {booking.category} · {booking.date}
            </Text>
            <Text className="text-xs text-gray-400">{booking.time}</Text>
          </View>
          <StatusBadge status={booking.status} />
        </View>
        <View className="border-t border-gray-100 pt-2">
          <Text className="text-sm font-bold text-gray-900">총 금액 {formatWon(booking.amount)}</Text>
          {booking.balanceAmount > 0 ? (
            <View className="mt-2 rounded-lg border border-brand-100 bg-brand-50 p-2.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-[10px] font-semibold text-brand-500">
                  {booking.balancePaid ? "잔금 결제 완료" : "잔금 결제 대기"}
                </Text>
                {!booking.balancePaid && booking.balanceDueDate ? (
                  <Text className="text-[10px] text-gray-500">마감 {booking.balanceDueDate}</Text>
                ) : null}
              </View>
              <Text className="mt-1 text-[10px] text-gray-500">
                예약금 {formatWon(booking.depositAmount)} 완료 / 잔금{" "}
                <Text className="font-bold text-gray-900">{formatWon(booking.balanceAmount)}</Text>
              </Text>
            </View>
          ) : null}
          {booking.status === "cancelRequested" ? (
            <View className="mt-2 rounded-lg border border-amber-100 bg-amber-50 px-2.5 py-1.5">
              <Text className="mb-0.5 text-[10px] font-medium text-amber-700">취소 사유</Text>
              {booking.cancelReason ? (
                <Text className="text-[11px] leading-4 text-gray-700">{booking.cancelReason}</Text>
              ) : null}
              <Text className="mt-1 text-[10px] leading-4 text-amber-700">
                환불율 {booking.refundRate ?? 50}% · 예상 환불 {formatWon(booking.expectedRefundAmount ?? Math.round(booking.amount * 0.5))}
              </Text>
            </View>
          ) : null}
        </View>
      </Pressable>
      {(onPrimaryAction && primaryLabel) || (onSecondaryAction && secondaryLabel) ? (
        <View className="mt-4 gap-2">
          {onSecondaryAction && secondaryLabel ? (
            <Button label={secondaryLabel} onPress={onSecondaryAction} />
          ) : null}
          {onPrimaryAction && primaryLabel ? (
            <Button label={primaryLabel} onPress={onPrimaryAction} variant="secondary" />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
