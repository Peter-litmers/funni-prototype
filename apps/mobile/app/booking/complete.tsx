import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatWon } from "@funni/domain";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { useBookings } from "@/features/shared/hooks/useBookings";

export default function BookingCompleteRoute() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const { bookings } = useBookings();
  const booking = bookings.find((item) => item.id === bookingId);

  return (
    <Screen>
      <View className="min-h-[500px] items-center justify-center px-2">
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-brand-50">
          <Ionicons name="checkmark-circle-outline" size={48} color="#ec4899" />
        </View>
        <Text className="text-lg font-bold text-gray-900">예약금 결제 완료!</Text>
        <Text className="mt-1 text-sm text-gray-500">{booking?.studioName ?? "예약 신청이 완료되었습니다."}</Text>
        <Text className="mb-6 mt-1 text-xs text-gray-400">
          {booking ? `${booking.date} ${booking.time}` : "최근 생성된 예약 정보를 확인하세요."}
        </Text>
        {booking ? (
          <View className="mb-4 w-full rounded-xl border border-brand-100 bg-brand-50 p-4">
            <Text className="text-xs font-medium text-brand-500">토스페이먼츠 예약금 완료</Text>
            <Text className="mt-1 text-sm font-bold text-gray-900">{formatWon(booking.depositAmount)}</Text>
            <View className="mt-3 gap-1 border-t border-brand-100 pt-3">
              <View className="flex-row justify-between">
                <Text className="text-[11px] text-gray-500">총 금액</Text>
                <Text className="text-[11px] text-gray-500">{formatWon(booking.amount)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-[11px] text-gray-500">오늘 결제 (예약금)</Text>
                <Text className="text-[11px] font-semibold text-brand-500">- {formatWon(booking.depositAmount)}</Text>
              </View>
              <View className="flex-row justify-between border-t border-gray-100 pt-1">
                <Text className="text-xs font-semibold text-gray-700">남은 잔금</Text>
                <Text className="text-xs font-semibold text-gray-700">{formatWon(booking.balanceAmount)}</Text>
              </View>
            </View>
            <Text className="mt-3 text-[11px] leading-5 text-gray-500">
              업체가 승인하면 예약이 확정됩니다. 만약 업체가 승인하지 않을 시 예약금은 환불됩니다. 잔금은 촬영일 전까지 MY → 예약 카드에서 결제하세요.
            </Text>
          </View>
        ) : null}
        <View className="w-full gap-2">
          <Button label="예약 신청 내역 확인" variant="secondary" onPress={() => router.replace("/bookings")} />
          <Button label="홈으로" onPress={() => router.replace("/(tabs)/home")} />
        </View>
      </View>
    </Screen>
  );
}
