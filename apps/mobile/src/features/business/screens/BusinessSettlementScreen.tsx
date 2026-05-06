import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { formatWon } from "@funni/domain";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";

const weeklyData = [
  { week: "1주차", range: "5/1 ~ 5/7", bookings: 3, payments: 2, expectedNet: 540000 },
  { week: "2주차", range: "5/8 ~ 5/14", bookings: 5, payments: 4, expectedNet: 1080000 },
  { week: "3주차", range: "5/15 ~ 5/21", bookings: 4, payments: 3, expectedNet: 810000 },
  { week: "4주차", range: "5/22 ~ 5/28", bookings: 6, payments: 1, expectedNet: 270000 },
  { week: "5주차", range: "5/29 ~ 5/31", bookings: 1, payments: 0, expectedNet: 0 },
];

export function BusinessSettlementScreen() {
  const [requested, setRequested] = useState(false);
  const totalBookings = weeklyData.reduce((sum, item) => sum + item.bookings, 0);
  const totalPayments = weeklyData.reduce((sum, item) => sum + item.payments, 0);
  const totalExpectedNet = weeklyData.reduce((sum, item) => sum + item.expectedNet, 0);
  const periodLabel = "2026년 5월";

  return (
    <Screen>
      <TopBar title="이번 달 정산 요청" showBack />
      <View className="mb-4 rounded-2xl border border-brand-100 bg-brand-50 p-4">
        <Text className="text-[10px] text-gray-500">{periodLabel} 예상 정산금</Text>
        <Text className="mt-1 text-2xl font-bold text-brand-500">{formatWon(totalExpectedNet)}</Text>
        <View className="mt-3 flex-row gap-2">
          <View className="flex-1 rounded-lg bg-white p-2">
            <Text className="text-center text-[9px] text-gray-400">예약</Text>
            <Text className="mt-0.5 text-center text-sm font-bold text-gray-900">{totalBookings}건</Text>
          </View>
          <View className="flex-1 rounded-lg bg-white p-2">
            <Text className="text-center text-[9px] text-gray-400">결제 완료</Text>
            <Text className="mt-0.5 text-center text-sm font-bold text-gray-900">{totalPayments}건</Text>
          </View>
          <View className="flex-1 rounded-lg bg-white p-2">
            <Text className="text-center text-[9px] text-gray-400">수수료율</Text>
            <Text className="mt-0.5 text-center text-sm font-bold text-gray-900">10%</Text>
          </View>
        </View>
        <Text className="mt-3 text-[10px] text-gray-500">예약금·잔금 모두 정산 대상에 포함. 결제 완료된 건만 정산 가능.</Text>
      </View>

      <Text className="mb-2 text-xs font-medium text-gray-500">{periodLabel} 주차별 상세</Text>
      <View className="mb-4 overflow-hidden rounded-xl border border-gray-100 bg-white">
        <View className="flex-row bg-gray-50 px-3 py-3">
          <Text className="flex-1 text-xs font-medium text-gray-500">주차</Text>
          <Text className="w-11 text-right text-xs font-medium text-gray-500">예약</Text>
          <Text className="w-11 text-right text-xs font-medium text-gray-500">결제</Text>
          <Text className="w-24 text-right text-xs font-medium text-gray-500">예상 정산금</Text>
        </View>
        {weeklyData.map((item) => (
          <View key={item.week} className="flex-row items-center border-t border-gray-50 px-3 py-3">
            <View className="flex-1">
              <Text className="text-xs font-medium text-gray-700">{item.week}</Text>
              <Text className="mt-0.5 text-[10px] text-gray-400">{item.range}</Text>
            </View>
            <Text className="w-11 text-right text-xs text-gray-700">{item.bookings}건</Text>
            <Text className="w-11 text-right text-xs text-gray-700">{item.payments}건</Text>
            <Text className="w-24 text-right text-xs font-semibold text-brand-500">{formatWon(item.expectedNet)}</Text>
          </View>
        ))}
        <View className="flex-row items-center border-t-2 border-brand-100 bg-brand-50 px-3 py-3">
          <Text className="flex-1 text-xs font-bold text-gray-900">합계</Text>
          <Text className="w-11 text-right text-xs font-bold text-gray-900">{totalBookings}건</Text>
          <Text className="w-11 text-right text-xs font-bold text-gray-900">{totalPayments}건</Text>
          <Text className="w-24 text-right text-xs font-bold text-brand-500">{formatWon(totalExpectedNet)}</Text>
        </View>
      </View>

      {requested ? (
        <View className="mb-3 rounded-xl border border-warning-200 bg-warning-50 py-3">
          <Text className="text-center text-sm font-medium text-warning-500">
            {periodLabel} 정산 요청 접수 완료 · 어드민 검토 대기
          </Text>
        </View>
      ) : (
        <Pressable className="mb-3 items-center rounded-xl bg-brand-500 py-3.5" onPress={() => setRequested(true)}>
          <Text className="text-sm font-bold text-white">{periodLabel} 정산 요청</Text>
        </Pressable>
      )}
    </Screen>
  );
}
