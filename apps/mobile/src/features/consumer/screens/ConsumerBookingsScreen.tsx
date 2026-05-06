import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { formatWon, pickRefundRate } from "@funni/domain";
import type { Booking } from "@funni/domain";
import { BookingCard } from "@/components/cards/BookingCard";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { useBookings } from "@/features/shared/hooks/useBookings";

type BookingFilter = "예정" | "완료" | "취소";

const refundPeriodLabels = {
  d7: "7일 이상 전",
  d3to6: "3~6일 전",
  d1to2: "1~2일 전",
  sameDay: "당일",
} as const;

const standardRefundMatrix = { d7: 100, d3to6: 80, d1to2: 50, sameDay: 20 };
const strictWeddingRefundMatrix = { d7: 100, d3to6: 50, d1to2: 0, sameDay: 0 };

const refundMatrixByCategory: Record<string, typeof standardRefundMatrix> = {
  프로필: standardRefundMatrix,
  바디프로필: standardRefundMatrix,
  가족: standardRefundMatrix,
  반려동물: standardRefundMatrix,
  비즈니스: standardRefundMatrix,
  커플: standardRefundMatrix,
  아기: standardRefundMatrix,
  웨딩: strictWeddingRefundMatrix,
};

function parseBookingDate(value: string) {
  const normalized = value.replace(/\./g, "-").slice(0, 10);
  const date = new Date(`${normalized}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysUntilBooking(booking: Booking) {
  const shootDate = parseBookingDate(booking.date);
  if (!shootDate) return 0;
  const today = new Date("2026-05-06T00:00:00");
  return Math.floor((shootDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function refundPeriod(daysUntilShoot: number): keyof typeof refundPeriodLabels {
  if (daysUntilShoot >= 7) return "d7";
  if (daysUntilShoot >= 3) return "d3to6";
  if (daysUntilShoot >= 1) return "d1to2";
  return "sameDay";
}

function buildRefundSummary(booking: Booking | null) {
  if (!booking) return null;

  const daysUntilShoot = daysUntilBooking(booking);
  const period = refundPeriod(daysUntilShoot);
  const matrix = refundMatrixByCategory[booking.category] ?? standardRefundMatrix;
  const rate = pickRefundRate(matrix, daysUntilShoot);
  const amount = Math.round((booking.amount * rate) / 100);

  return {
    amount,
    daysUntilShoot,
    fee: booking.amount - amount,
    fromDefault: !(booking.category in refundMatrixByCategory),
    period,
    rate,
  };
}

type Props = {
  initialFilter?: BookingFilter;
};

export function ConsumerBookingsScreen({ initialFilter = "예정" }: Props) {
  const router = useRouter();
  const { currentRoleBookings, requestCancel } = useBookings();
  const [selectedFilter, setSelectedFilter] = useState<BookingFilter>(initialFilter);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const cancelTarget = useMemo(
    () => currentRoleBookings.find((booking) => booking.id === cancelTargetId) ?? null,
    [cancelTargetId, currentRoleBookings],
  );
  const refundSummary = useMemo(() => buildRefundSummary(cancelTarget), [cancelTarget]);
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
            소비자 취소 환불 기준: 7일 전 전액 환불 · 3~6일 전 80% · 1~2일 전 50% · 당일 20%
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
            onPress={() => router.push(`/studio/${booking.studioId}`)}
            primaryLabel={
              booking.status === "confirmed"
                ? "예약 취소"
                : selectedFilter === "완료"
                  ? "리뷰 작성"
                  : undefined
            }
            onPrimaryAction={
              booking.status === "confirmed"
                ? () => {
                    setCancelTargetId(booking.id);
                    setCancelReason("");
                  }
                : selectedFilter === "완료"
                  ? () =>
                      router.push({
                        pathname: "/reviews/write",
                        params: { bookingId: booking.id },
                      })
                : undefined
            }
            secondaryLabel={
              booking.status === "confirmed" && booking.balanceAmount > 0 && !booking.balancePaid
                ? "잔금 결제"
                : undefined
            }
            onSecondaryAction={
              booking.status === "confirmed" && booking.balanceAmount > 0 && !booking.balancePaid
                ? () =>
                    router.push({
                      pathname: "/balance-payment/[bookingId]",
                      params: { bookingId: booking.id },
                    })
                : undefined
            }
          />
        ))
      )}

      <Modal visible={cancelTargetId !== null} transparent animationType="slide" onRequestClose={() => setCancelTargetId(null)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setCancelTargetId(null)}>
          <Pressable className="rounded-t-2xl bg-white p-4 pb-8" onPress={() => {}}>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-base font-bold text-gray-900">예약 취소</Text>
              <Pressable onPress={() => setCancelTargetId(null)}>
                <Text className="text-gray-400">×</Text>
              </Pressable>
            </View>
            {cancelTarget && refundSummary ? (
              <View className="mb-3 rounded-xl bg-gray-50 p-3">
                <Text className="mb-1 text-xs font-bold text-gray-900">{cancelTarget.studioName}</Text>
                <View className="mb-2 flex-row flex-wrap items-center gap-1.5">
                  <Text className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                    {cancelTarget.category}
                  </Text>
                  <Text className="text-[10px] text-gray-500">·</Text>
                  <Text className="text-[10px] text-gray-500">
                    촬영까지 {refundSummary.daysUntilShoot >= 0 ? `${refundSummary.daysUntilShoot}일` : "지남"}
                  </Text>
                  <Text className="text-[10px] text-gray-500">·</Text>
                  <Text className="text-[10px] text-gray-500">
                    구간: <Text className="font-bold">{refundPeriodLabels[refundSummary.period]}</Text>
                  </Text>
                </View>
                <View className="rounded-lg border border-gray-100 bg-white p-2.5">
                  <View className="mb-1 flex-row justify-between">
                    <Text className="text-[11px] text-gray-500">결제 금액</Text>
                    <Text className="text-xs font-medium text-gray-900">{formatWon(cancelTarget.amount)}</Text>
                  </View>
                  <View className="mb-1 flex-row justify-between">
                    <Text className="text-[11px] text-gray-500">적용 환불율</Text>
                    <Text className="text-xs font-medium text-brand-500">{refundSummary.rate}%</Text>
                  </View>
                  <View className="mb-1 flex-row justify-between">
                    <Text className="text-[11px] text-gray-500">취소 수수료</Text>
                    <Text className="text-xs text-gray-500">- {formatWon(refundSummary.fee)}</Text>
                  </View>
                  <View className="mt-1 border-t border-gray-100 pt-1.5">
                    <View className="flex-row justify-between">
                      <Text className="text-[11px] font-bold text-gray-700">예상 환불 금액</Text>
                      <Text className="text-sm font-bold text-red-500">{formatWon(refundSummary.amount)}</Text>
                    </View>
                  </View>
                </View>
                {refundSummary.fromDefault ? (
                  <Text className="mt-1.5 text-[9px] text-amber-600">
                    {cancelTarget.category} 카테고리 환불율 미설정 - 기본 기준값 적용
                  </Text>
                ) : null}
                <Text className="mt-1.5 text-[9px] leading-4 text-gray-400">
                  최종 환불은 업체 승인 후 확정됩니다. 업체 귀책 취소는 100% 환불 + 업체 페널티.
                </Text>
              </View>
            ) : null}
            <Text className="mb-1.5 text-xs font-medium text-gray-900">취소 사유</Text>
            <TextInput
              value={cancelReason}
              onChangeText={setCancelReason}
              multiline
              maxLength={200}
              textAlignVertical="top"
              placeholder="예약하신 스튜디오와 포토팟이 확인합니다. 구체적으로 작성 부탁드립니다."
              placeholderTextColor="#9ca3af"
              className="min-h-[104px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900"
            />
            <Text className="mt-1 text-right text-[10px] text-gray-400">{cancelReason.length}/200</Text>
            <View className="mt-4 flex-row gap-2">
              <Pressable className="flex-1 items-center rounded-xl bg-gray-100 py-3" onPress={() => setCancelTargetId(null)}>
                <Text className="text-sm font-medium text-gray-600">돌아가기</Text>
              </Pressable>
              <Pressable
                className={`flex-1 items-center rounded-xl py-3 ${cancelReason.trim().length >= 5 ? "bg-brand-500" : "bg-gray-200"}`}
                disabled={cancelReason.trim().length < 5}
                onPress={() => {
                  if (!cancelTargetId) return;
                  requestCancel(
                    cancelTargetId,
                    cancelReason.trim(),
                    refundSummary
                      ? { rate: refundSummary.rate, amount: refundSummary.amount }
                      : undefined,
                  );
                  setCancelTargetId(null);
                  setCancelReason("");
                }}
              >
                <Text className={`text-sm font-bold ${cancelReason.trim().length >= 5 ? "text-white" : "text-gray-400"}`}>
                  취소 요청
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
