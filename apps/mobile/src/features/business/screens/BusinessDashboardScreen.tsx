import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";
import { formatWon, type Booking } from "@funni/domain";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { useBookings } from "@/features/shared/hooks/useBookings";

type PeriodKey = "1m" | "3m" | "6m" | "1y" | "custom";

const periodItems: { key: PeriodKey; label: string }[] = [
  { key: "1m", label: "1개월" },
  { key: "3m", label: "3개월" },
  { key: "6m", label: "6개월" },
  { key: "1y", label: "1년" },
  { key: "custom", label: "직접 설정" },
];

const dashboardToday = new Date("2026-05-10T00:00:00");
const todayKey = formatDate(dashboardToday);

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function periodRange(period: Exclude<PeriodKey, "custom">) {
  const start = new Date(dashboardToday);
  if (period === "1m") start.setMonth(start.getMonth() - 1);
  if (period === "3m") start.setMonth(start.getMonth() - 3);
  if (period === "6m") start.setMonth(start.getMonth() - 6);
  if (period === "1y") start.setFullYear(start.getFullYear() - 1);

  return {
    start: formatDate(start),
    end: todayKey,
  };
}

function statusLabel(status: Booking["status"]) {
  if (status === "cancelRequested") return "예약 취소 중";
  if (status === "confirmed") return "확정";
  if (status === "completed") return "완료";
  if (status === "pending") return "대기";
  return "취소완료";
}

export function BusinessDashboardScreen() {
  const router = useRouter();
  const { currentRoleBookings } = useBookings();
  const initialRange = periodRange("3m");
  const [dashboardPeriod, setDashboardPeriod] = useState<PeriodKey>("3m");
  const [dashStart, setDashStart] = useState(initialRange.start);
  const [dashEnd, setDashEnd] = useState(initialRange.end);

  const periodBookings = useMemo(
    () => currentRoleBookings.filter((booking) => booking.date >= dashStart && booking.date <= dashEnd),
    [currentRoleBookings, dashEnd, dashStart],
  );
  const periodRevenue = useMemo(
    () =>
      periodBookings
        .filter((booking) => booking.status === "confirmed" || booking.status === "completed")
        .reduce((sum, booking) => sum + booking.amount, 0),
    [periodBookings],
  );
  const periodCancelCount = useMemo(
    () => periodBookings.filter((booking) => booking.status === "cancelRequested").length,
    [periodBookings],
  );
  const periodMonthlyStats = useMemo(() => {
    const grouped = new Map<string, { month: string; bookingCount: number; revenue: number }>();

    periodBookings.forEach((booking) => {
      const month = booking.date.slice(0, 7);
      const current = grouped.get(month) ?? { month, bookingCount: 0, revenue: 0 };
      current.bookingCount += 1;
      if (booking.status === "confirmed" || booking.status === "completed") {
        current.revenue += booking.amount;
      }
      grouped.set(month, current);
    });

    return Array.from(grouped.values()).sort((a, b) => (a.month < b.month ? 1 : -1));
  }, [periodBookings]);
  const todayBookings = useMemo(
    () => currentRoleBookings.filter((booking) => booking.date === todayKey),
    [currentRoleBookings],
  );

  const selectPeriod = (period: PeriodKey) => {
    setDashboardPeriod(period);
    if (period === "custom") return;

    const nextRange = periodRange(period);
    setDashStart(nextRange.start);
    setDashEnd(nextRange.end);
  };

  return (
    <Screen>
      <TopBar title="실적 대시보드" showBack />

      <View className="mb-4 rounded-xl border border-gray-200 bg-white p-3">
        <View className="mb-3 flex-row gap-1.5">
          {periodItems.map((item) => {
            const active = dashboardPeriod === item.key;

            return (
              <Pressable
                key={item.key}
                className={`flex-1 rounded-lg border py-1.5 ${
                  active ? "border-brand-500 bg-brand-500" : "border-gray-200 bg-white"
                }`}
                onPress={() => selectPeriod(item.key)}
              >
                <Text className={`text-center text-[11px] font-medium ${active ? "text-white" : "text-gray-500"}`}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {dashboardPeriod === "custom" ? (
          <View className="flex-row items-center gap-1.5">
            <TextInput
              value={dashStart}
              onChangeText={setDashStart}
              placeholder="YYYY-MM-DD"
              className="flex-1 rounded-lg border border-gray-100 bg-gray-50 px-2 py-1.5 text-[11px] text-gray-900"
            />
            <Text className="text-[10px] text-gray-400">~</Text>
            <TextInput
              value={dashEnd}
              onChangeText={setDashEnd}
              placeholder="YYYY-MM-DD"
              className="flex-1 rounded-lg border border-gray-100 bg-gray-50 px-2 py-1.5 text-[11px] text-gray-900"
            />
          </View>
        ) : null}
      </View>

      <View className="mb-5 flex-row gap-2">
        <View className="flex-1 rounded-2xl border border-brand-100 bg-brand-50 p-3">
          <Text className="mb-1 text-center text-[10px] text-gray-500">기간 내 예약</Text>
          <Text className="text-center text-xl font-bold text-brand-500">
            {periodBookings.length}
            <Text className="text-[10px] font-normal">건</Text>
          </Text>
        </View>
        <View className="flex-1 rounded-2xl border border-success-100 bg-success-50 p-3">
          <Text className="mb-1 text-center text-[10px] text-gray-500">기간 매출</Text>
          <Text className="text-center text-sm font-bold text-success-500">
            {(periodRevenue / 10000).toFixed(0)}
            <Text className="text-[10px] font-normal">만원</Text>
          </Text>
        </View>
        <Pressable
          className="flex-1 rounded-2xl border border-danger-100 bg-danger-50 p-3"
          onPress={() => router.push({ pathname: "/biz/bookings", params: { filter: "cancelRequested" } })}
        >
          <Text className="mb-1 text-center text-[10px] text-gray-500">기간 내 취소</Text>
          <Text className="text-center text-xl font-bold text-danger-500">
            {periodCancelCount}
            <Text className="text-[10px] font-normal">건</Text>
          </Text>
        </Pressable>
      </View>

      <View className="mb-4 rounded-xl bg-gray-50 p-4">
        <Text className="mb-3 text-xs font-bold text-gray-900">월별 실적</Text>
        {periodMonthlyStats.length === 0 ? (
          <Text className="py-3 text-center text-xs text-gray-400">선택한 기간 내 실적이 없습니다.</Text>
        ) : (
          <View>
            {periodMonthlyStats.map((stat) => (
              <View
                key={stat.month}
                className="flex-row items-center justify-between border-b border-gray-100 py-2 last:border-b-0"
              >
                <Text className="text-xs text-gray-500">{stat.month.replace("-", ".")}</Text>
                <View className="flex-row items-center gap-3">
                  <Text className="text-xs text-gray-900">{stat.bookingCount}건</Text>
                  <Text className="text-xs font-bold text-gray-900">{formatWon(stat.revenue)}</Text>
                  <Text className="text-xs text-yellow-500">★ 4.9</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <Text className="mb-3 text-sm font-bold text-gray-900">오늘의 예약</Text>
      {todayBookings.length === 0 ? (
        <View className="mb-4 rounded-xl bg-gray-50 py-8">
          <Text className="text-center text-sm text-gray-400">오늘 예약이 없습니다</Text>
        </View>
      ) : (
        <View className="mb-4 gap-2">
          {todayBookings.map((booking) => (
            <Pressable
              key={booking.id}
              className="flex-row items-center gap-3 rounded-xl bg-gray-50 p-3"
              onPress={() => router.push(`/biz/bookings/${booking.id}`)}
            >
              <View className="h-11 w-11 items-center justify-center rounded-full bg-brand-50">
                <Text className="text-lg">📷</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900">{booking.userName}</Text>
                <Text className="text-xs text-gray-400">
                  {booking.category} · {booking.time}
                </Text>
              </View>
              <View className="items-end">
                <StatusBadge status={booking.status} />
                <Text className="mt-1 text-xs font-bold text-gray-900">{formatWon(booking.amount)}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable className="items-center rounded-xl bg-brand-500 py-3.5" onPress={() => router.push("/biz/bookings")}>
        <Text className="text-sm font-bold text-white">예약 관리 보기</Text>
      </Pressable>
    </Screen>
  );
}
