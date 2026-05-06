import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { BookingCard } from "@/components/cards/BookingCard";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { useBookings } from "@/features/shared/hooks/useBookings";

type BookingFilter = "예정" | "완료" | "취소";

type Props = {
  initialFilter?: BookingFilter;
};

export function ConsumerBookingsScreen({ initialFilter = "예정" }: Props) {
  const { currentRoleBookings, requestCancel } = useBookings();
  const [selectedFilter, setSelectedFilter] = useState<BookingFilter>(initialFilter);
  const counts = useMemo(
    () => ({
      예정: currentRoleBookings.filter((booking) => booking.status === "pending" || booking.status === "confirmed").length,
      완료: currentRoleBookings.filter((booking) => booking.status === "completed").length,
      취소: currentRoleBookings.filter((booking) => booking.status === "cancelRequested" || booking.status === "cancelled").length,
    }),
    [currentRoleBookings],
  );
  const filteredBookings = useMemo(() => {
    if (selectedFilter === "예정") {
      return currentRoleBookings.filter(
        (booking) => booking.status === "pending" || booking.status === "confirmed",
      );
    }
    if (selectedFilter === "취소") {
      return currentRoleBookings.filter(
        (booking) => booking.status === "cancelRequested" || booking.status === "cancelled",
      );
    }
    return currentRoleBookings.filter((booking) => booking.status === "completed");
  }, [currentRoleBookings, selectedFilter]);

  return (
    <Screen>
      <TopBar title="예약" showBack />
      <View className="mb-4 flex-row flex-wrap gap-2">
        {(["예정", "완료", "취소"] as BookingFilter[]).map((item) => (
          <Chip
            key={item}
            label={`${item} ${counts[item]}`}
            active={selectedFilter === item}
            onPress={() => setSelectedFilter(item)}
          />
        ))}
      </View>
      {selectedFilter === "완료" ? (
        <Text className="mb-3 text-[11px] text-gray-400">
          리뷰는 업체가 촬영 건을 완료 처리한 시점부터 2주 이내 작성, 작성 후 3일 이내 수정 가능합니다.
        </Text>
      ) : null}
      {selectedFilter === "취소" ? (
        <View className="mb-3 rounded-xl bg-red-50 p-3">
          <Text className="text-[11px] leading-5 text-red-500">
            소비자 취소 환불 기준: 7일 전 전액 환불 · 3~6일 전 20% · 1~2일 전 50% · 당일 80%
          </Text>
          <Text className="mt-1 text-[11px] leading-5 text-red-500">
            업체 취소: 100% 환불 + 업체에 페널티 누적 기록
          </Text>
        </View>
      ) : null}
      {filteredBookings.length === 0 ? (
        <EmptyState title="해당 예약이 없습니다" body="다른 필터를 선택하거나 스튜디오를 예약해 주세요." />
      ) : (
        filteredBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            primaryLabel={booking.status === "confirmed" ? "예약 취소" : undefined}
            onPrimaryAction={
              booking.status === "confirmed"
                ? () => requestCancel(booking.id)
                : undefined
            }
          />
        ))
      )}
    </Screen>
  );
}
