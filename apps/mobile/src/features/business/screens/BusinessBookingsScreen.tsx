import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import type { BookingStatus } from "@funni/domain";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { useBookings } from "@/features/shared/hooks/useBookings";

type FilterKey = "all" | BookingStatus;
type ManualBooking = {
  id: string;
  date: string;
  time: string;
  userName: string;
  category: "수기";
  amount: number;
  status: "manual";
  memo: string;
};

const filterItems = [
  { label: "전체", value: "all" as FilterKey },
  { label: "확정", value: "confirmed" as FilterKey },
  { label: "예약 취소 중", value: "cancelRequested" as FilterKey },
  { label: "완료", value: "completed" as FilterKey },
];

function statusLabel(status: BookingStatus | "manual") {
  if (status === "pending") return "대기";
  if (status === "confirmed") return "확정";
  if (status === "cancelRequested") return "예약 취소 중";
  if (status === "completed") return "완료";
  if (status === "manual") return "수기";
  return "취소완료";
}

function statusClasses(status: BookingStatus | "manual") {
  if (status === "cancelRequested") return "bg-amber-100 text-amber-700";
  if (status === "completed" || status === "cancelled") return "bg-gray-200 text-gray-500";
  if (status === "manual") return "bg-orange-100 text-orange-700";
  return "bg-green-100 text-green-700";
}

export function BusinessBookingsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string }>();
  const { currentRoleBookings } = useBookings();
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(5);
  const [calDate, setCalDate] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>(
    params.filter === "cancelRequested" ? "cancelRequested" : "all",
  );
  const [manualOpen, setManualOpen] = useState(false);
  const [manualDate, setManualDate] = useState("2026-05-10");
  const [manualTime, setManualTime] = useState("10:00");
  const [manualMemo, setManualMemo] = useState("");
  const [manualBookings, setManualBookings] = useState<ManualBooking[]>([]);
  const firstDayOffset = new Date(calYear, calMonth - 1, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth, 0).getDate();
  const allBookings = useMemo(
    () => [...currentRoleBookings, ...manualBookings],
    [currentRoleBookings, manualBookings],
  );
  const datesWithBookings = useMemo(
    () =>
      new Set(
        allBookings
          .map((booking) => {
            const parsed = new Date(`${booking.date}T00:00:00`);
            if (Number.isNaN(parsed.getTime())) return null;
            if (parsed.getFullYear() !== calYear || parsed.getMonth() + 1 !== calMonth) return null;
            return parsed.getDate();
          })
          .filter((date): date is number => date !== null),
      ),
    [allBookings, calMonth, calYear],
  );
  const dateBookings = useMemo(
    () =>
      allBookings.filter((booking) => {
        const parsed = new Date(`${booking.date}T00:00:00`);
        if (Number.isNaN(parsed.getTime())) return false;
        return parsed.getFullYear() === calYear && parsed.getMonth() + 1 === calMonth && parsed.getDate() === calDate;
      }),
    [allBookings, calDate, calMonth, calYear],
  );
  const filteredBookings = useMemo(() => {
    if (selectedFilter === "all") return dateBookings;
    return dateBookings.filter((booking) => booking.status === selectedFilter);
  }, [dateBookings, selectedFilter]);
  const moveMonth = (direction: -1 | 1) => {
    setCalDate(1);
    setCalMonth((month) => {
      if (direction === -1 && month === 1) {
        setCalYear((year) => year - 1);
        return 12;
      }
      if (direction === 1 && month === 12) {
        setCalYear((year) => year + 1);
        return 1;
      }
      return month + direction;
    });
  };
  const addManualBooking = () => {
    if (!manualDate || !manualTime) return;
    const parsed = new Date(`${manualDate}T00:00:00`);
    const name = manualMemo.split(/[,\s]/)[0] || "수기 일정";
    setManualBookings((current) => [
      ...current,
      {
        id: `manual-${Date.now()}`,
        date: manualDate,
        time: `${manualTime}~`,
        userName: name,
        category: "수기",
        amount: 0,
        status: "manual",
        memo: manualMemo,
      },
    ]);
    if (!Number.isNaN(parsed.getTime())) {
      setCalYear(parsed.getFullYear());
      setCalMonth(parsed.getMonth() + 1);
      setCalDate(parsed.getDate());
    }
    setManualMemo("");
    setManualOpen(false);
  };

  return (
    <Screen>
      <TopBar
        title="예약 관리"
        showBack
        rightSlot={
          <Pressable className="rounded-full bg-brand-50 px-3 py-1.5" onPress={() => setManualOpen(true)}>
            <Text className="text-[10px] font-medium text-brand-500">✏️ 수기 일정 추가</Text>
          </Pressable>
        }
      />

      <View className="mb-3 flex-row gap-2">
        {filterItems.map((item) => {
          const active = selectedFilter === item.value;
          const count = item.value === "all" ? "" : ` ${dateBookings.filter((booking) => booking.status === item.value).length}`;

          return (
            <Pressable
              key={item.value}
              className={`rounded-full px-3 py-1.5 ${active ? "bg-brand-500" : "bg-gray-100"}`}
              onPress={() => setSelectedFilter(item.value)}
            >
              <Text className={`text-xs font-medium ${active ? "text-white" : "text-gray-500"}`}>
                {item.label}
                {count}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
        <View className="mb-2 flex-row items-center justify-between">
          <Pressable
            className="h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white"
            onPress={() => moveMonth(-1)}
          >
            <Text className="text-sm text-gray-500">‹</Text>
          </Pressable>
          <Text className="text-sm font-medium text-gray-900">{calYear}년 {calMonth}월</Text>
          <Pressable
            className="h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white"
            onPress={() => moveMonth(1)}
          >
            <Text className="text-sm text-gray-500">›</Text>
          </Pressable>
        </View>
        <View className="flex-row flex-wrap">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <Text key={day} className="w-[14.285%] py-1 text-center text-[10px] text-gray-400">{day}</Text>
          ))}
          {Array.from({ length: firstDayOffset }).map((_, index) => (
            <View key={`empty-${index}`} className="w-[14.285%]" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const hasBooking = datesWithBookings.has(day);
            const selected = calDate === day;
            return (
              <Pressable
                key={day}
                className={`relative my-0.5 w-[14.285%] rounded-lg py-1 ${
                  selected ? "bg-brand-500" : hasBooking ? "bg-brand-50" : "bg-transparent"
                }`}
                onPress={() => setCalDate(day)}
              >
                <Text className={`text-center text-[11px] ${selected ? "font-bold text-white" : hasBooking ? "font-medium text-brand-500" : "text-gray-600"}`}>
                  {day}
                </Text>
                {hasBooking && !selected ? (
                  <View className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-500" />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text className="mb-2 text-xs font-medium text-gray-500">
        {calMonth}월 {calDate}일 예약 ({filteredBookings.length}건)
      </Text>
      {filteredBookings.length === 0 ? (
        <View className="rounded-xl bg-gray-50 py-8">
          <Text className="text-center text-sm text-gray-400">해당 날짜에 예약이 없습니다</Text>
        </View>
      ) : (
        <View className="gap-2">
          {filteredBookings.map((booking) => (
            <Pressable
              key={booking.id}
              onPress={() => {
                if (booking.status !== "manual") {
                  router.push(`/biz/bookings/${booking.id}`);
                }
              }}
              className="flex-row items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3"
            >
              <View>
                <Text className="text-sm font-medium text-gray-900">{booking.userName}</Text>
                <Text className="text-xs text-gray-400">{booking.category} · {booking.time}</Text>
                <Text className="mt-0.5 text-xs font-bold text-gray-900">₩{booking.amount.toLocaleString()}</Text>
              </View>
              <View className="items-end gap-1">
                <Text className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${statusClasses(booking.status)}`}>
                  {statusLabel(booking.status)}
                </Text>
                <Text className="text-xs text-gray-300">›</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <Modal visible={manualOpen} transparent animationType="slide" onRequestClose={() => setManualOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setManualOpen(false)}>
          <Pressable className="rounded-t-3xl bg-white p-5 pb-8" onPress={() => {}}>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-base font-bold text-gray-900">수기 일정 추가</Text>
              <Pressable onPress={() => setManualOpen(false)}>
                <Text className="text-xl text-gray-400">×</Text>
              </Pressable>
            </View>
            <Text className="mb-4 text-[10px] text-gray-400">앱 외부로 받은 예약을 달력에 수기로 추가합니다</Text>
            <View className="gap-3">
              <View>
                <Text className="mb-1 text-xs text-gray-500">날짜</Text>
                <TextInput
                  value={manualDate}
                  onChangeText={setManualDate}
                  placeholder="2026-05-10"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900"
                />
              </View>
              <View>
                <Text className="mb-1 text-xs text-gray-500">시간</Text>
                <TextInput
                  value={manualTime}
                  onChangeText={setManualTime}
                  placeholder="10:00"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900"
                />
              </View>
              <View>
                <Text className="mb-1 text-xs text-gray-500">메모</Text>
                <TextInput
                  value={manualMemo}
                  onChangeText={setManualMemo}
                  multiline
                  placeholder="예약자명, 연락처, 특이사항 등"
                  className="min-h-[84px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900"
                />
              </View>
            </View>
            <Pressable className="mt-4 items-center rounded-xl bg-brand-500 py-3.5" onPress={addManualBooking}>
              <Text className="text-sm font-bold text-white">일정 추가</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
