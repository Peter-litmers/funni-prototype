import { useMemo } from "react";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import {
  buildPaymentSummary,
  calculateDeposit,
  describeDeposit,
  formatWon,
  type Studio,
} from "@funni/domain";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { useBookings } from "@/features/shared/hooks/useBookings";

const addonOptions = [
  { id: "original", name: "원본 추가", price: 40000 },
  { id: "retouch", name: "보정 컷 추가", price: 40000 },
];

const hairMakeupOptions = [
  { id: "hair", name: "헤어 스타일링", price: 50000 },
  { id: "makeup", name: "메이크업", price: 70000 },
];

type Props = {
  studio: Studio | null;
  initialPackageId?: string;
  initialDate?: string;
  initialTime?: string;
  initialAddons?: string;
  initialOptions?: string;
};

function formatBookingDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
}

function addOneHour(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return time;
  return `${String(hour + 1).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function parseIds(value?: string) {
  return value?.split(",").filter(Boolean) ?? [];
}

export function ConsumerBookingScreen({
  studio,
  initialPackageId,
  initialDate,
  initialTime,
  initialAddons,
  initialOptions,
}: Props) {
  const router = useRouter();
  const { createBooking } = useBookings();
  const selectedDate = initialDate ?? "2026-05-10";
  const selectedTime = initialTime ?? "14:00";
  const selectedAddonIds = useMemo(() => parseIds(initialAddons), [initialAddons]);
  const selectedOptionIds = useMemo(() => parseIds(initialOptions), [initialOptions]);

  const selectedPackage = useMemo(
    () => studio?.packages.find((item) => item.id === initialPackageId) ?? studio?.packages[0] ?? null,
    [initialPackageId, studio],
  );
  const selectedAddons = useMemo(
    () => addonOptions.filter((item) => selectedAddonIds.includes(item.id)),
    [selectedAddonIds],
  );
  const selectedOptions = useMemo(
    () => hairMakeupOptions.filter((item) => selectedOptionIds.includes(item.id)),
    [selectedOptionIds],
  );
  const totalAmount = useMemo(
    () =>
      (selectedPackage?.price ?? 0) +
      selectedAddons.reduce((sum, item) => sum + item.price, 0) +
      selectedOptions.reduce((sum, item) => sum + item.price, 0),
    [selectedAddons, selectedOptions, selectedPackage],
  );
  const paymentSummary = useMemo(() => {
    if (!studio || !selectedPackage) return null;
    const deposit = calculateDeposit(totalAmount, studio.deposit);
    return buildPaymentSummary(totalAmount, deposit);
  }, [selectedPackage, studio, totalAmount]);

  if (!studio || !selectedPackage) {
    return (
      <Screen>
        <TopBar title="예약 확인" showBack />
        <EmptyState title="예약 대상을 찾을 수 없어요" body="스튜디오 상세에서 다시 진입해 주세요." />
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="예약 확인" showBack />
      <View className="rounded-xl bg-gray-50 p-4">
        <Text className="text-sm font-bold text-gray-900">{studio.name}</Text>
        <Text className="mt-1 text-xs text-gray-400">{studio.category} · {studio.area}</Text>
      </View>

      <View className="mt-4 gap-3 px-1">
        <View className="flex-row justify-between gap-4">
          <Text className="text-sm text-gray-500">날짜</Text>
          <Text className="flex-1 text-right text-sm font-medium text-gray-900">{formatBookingDate(selectedDate)}</Text>
        </View>
        <View className="flex-row justify-between gap-4">
          <Text className="text-sm text-gray-500">시간</Text>
          <Text className="flex-1 text-right text-sm font-medium text-gray-900">
            {selectedTime} ~ {addOneHour(selectedTime)} (1시간)
          </Text>
        </View>
        <View className="flex-row justify-between gap-4">
          <Text className="text-sm text-gray-500">{selectedPackage.title}</Text>
          <Text className="text-sm font-medium text-gray-900">{formatWon(selectedPackage.price)}</Text>
        </View>
        {selectedAddons.map((item) => (
          <View key={item.id} className="flex-row justify-between gap-4">
            <Text className="text-sm text-gray-500">{item.name}</Text>
            <Text className="text-sm font-medium text-gray-900">+{formatWon(item.price)}</Text>
          </View>
        ))}
        {selectedOptions.map((item) => (
          <View key={item.id} className="flex-row justify-between gap-4">
            <Text className="text-sm text-gray-500">{item.name}</Text>
            <Text className="text-sm font-medium text-gray-900">+{formatWon(item.price)}</Text>
          </View>
        ))}
        <View className="mt-1 flex-row justify-between border-t border-gray-100 pt-3">
          <Text className="text-sm font-bold text-gray-500">총 금액</Text>
          <Text className="text-base font-bold text-gray-900">{formatWon(paymentSummary?.amount ?? 0)}</Text>
        </View>
        <View className="mt-1 rounded-xl border border-brand-100 bg-brand-50 p-3">
          <View className="mb-1.5 flex-row items-center justify-between">
            <Text className="text-xs font-bold text-brand-500">오늘 결제 (예약금)</Text>
            <Text className="text-base font-bold text-brand-500">
              {formatWon(paymentSummary?.depositAmount ?? 0)}
            </Text>
          </View>
          <Text className="mb-2 text-[10px] text-gray-500">{describeDeposit(studio.deposit)} · 옵션 포함 총액 기준</Text>
          <View className="border-t border-brand-100 pt-1.5">
            <View className="flex-row items-center justify-between">
              <Text className="text-[11px] text-gray-600">잔금 (촬영 전 결제)</Text>
              <Text className="text-sm font-semibold text-gray-700">
                {formatWon(paymentSummary?.balanceAmount ?? 0)}
              </Text>
            </View>
          </View>
          <Text className="mt-2 text-[10px] text-gray-400">
            잔금은 촬영일 D-1 23:59까지 MY → 예약 카드에서 결제. 미결제 시 예약 자동 취소 및 환불 정책 적용.
          </Text>
        </View>
      </View>

      <View className="mt-4">
        <Button
          label={`예약금 ${formatWon(paymentSummary?.depositAmount ?? 0)} 결제 · 토스페이먼츠`}
          onPress={async () => {
            const booking = await createBooking({
              studioId: studio.id,
              packageId: selectedPackage.id,
              date: selectedDate,
              time: selectedTime,
              amount: paymentSummary?.amount ?? selectedPackage.price,
            });

            router.replace(`/booking/complete?bookingId=${booking.id}`);
          }}
        />
      </View>
    </Screen>
  );
}
