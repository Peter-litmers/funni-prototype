import { Text, View } from "react-native";
import type { Booking } from "@funni/domain";
import { formatWon } from "@funni/domain";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Props = {
  booking: Booking;
  onPrimaryAction?: () => void;
  primaryLabel?: string;
};

export function BookingCard({ booking, onPrimaryAction, primaryLabel }: Props) {
  return (
    <View className="rounded-2xl border border-gray-100 bg-white p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900">{booking.studioName}</Text>
          <Text className="mt-1 text-sm text-gray-500">
            {booking.date} · {booking.time}
          </Text>
          <Text className="mt-1 text-sm text-gray-500">{booking.category}</Text>
        </View>
        <StatusBadge status={booking.status} />
      </View>
      <View className="mt-4 rounded-xl bg-gray-50 p-3">
        <Text className="text-xs text-gray-500">총 금액 {formatWon(booking.amount)}</Text>
        <Text className="mt-1 text-xs text-gray-500">
          예약금 {formatWon(booking.depositAmount)} · 잔금 {formatWon(booking.balanceAmount)}
        </Text>
      </View>
      {onPrimaryAction && primaryLabel ? (
        <View className="mt-4">
          <Button label={primaryLabel} onPress={onPrimaryAction} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}
