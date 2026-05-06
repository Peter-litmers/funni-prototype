import type { Booking } from "@funni/domain";
import { formatWon } from "@funni/domain";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { useBookings } from "@/features/shared/hooks/useBookings";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  booking: Booking | null;
};

function statusLabel(status: Booking["status"]) {
  if (status === "pending") return "대기";
  if (status === "confirmed") return "확정";
  if (status === "cancelRequested") return "예약 취소 중";
  if (status === "completed") return "완료";
  return "취소완료";
}

function statusClasses(status: Booking["status"]) {
  if (status === "cancelRequested") return "bg-amber-100 text-amber-700";
  if (status === "completed" || status === "cancelled") return "bg-gray-200 text-gray-500";
  return "bg-green-100 text-green-700";
}

export function BusinessBookingDetailScreen({ booking }: Props) {
  const { confirmBooking, markCompleted } = useBookings();
  const [cancelDecision, setCancelDecision] = useState<"accepted" | "rejected" | null>(null);
  const [noShowReported, setNoShowReported] = useState(false);
  const [businessCancelRequested, setBusinessCancelRequested] = useState(false);

  if (!booking) {
    return (
      <Screen>
        <TopBar title="예약 상세" showBack />
        <EmptyState title="예약을 찾을 수 없어요" body="목데이터 기준으로 다시 확인해 주세요." />
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="예약 상세" showBack />
      <View className="rounded-xl bg-gray-50 p-4">
        <View className="mb-3 flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-brand-50">
            <Text className="text-xl">👤</Text>
          </View>
          <View>
            <Text className="text-base font-bold text-gray-900">{booking.userName}</Text>
            <Text className="text-xs text-gray-400">고객</Text>
          </View>
        </View>
        <View className="gap-2">
          <View className="flex-row justify-between gap-4">
            <Text className="text-sm text-gray-500">촬영 종류</Text>
            <Text className="text-sm font-medium text-gray-900">{booking.category}</Text>
          </View>
          <View className="flex-row justify-between gap-4">
            <Text className="text-sm text-gray-500">날짜</Text>
            <Text className="text-sm font-medium text-gray-900">{booking.date}</Text>
          </View>
          <View className="flex-row justify-between gap-4">
            <Text className="text-sm text-gray-500">시간</Text>
            <Text className="text-sm font-medium text-gray-900">{booking.time}</Text>
          </View>
          <View className="flex-row justify-between gap-4 border-t border-gray-200 pt-2">
            <Text className="text-sm text-gray-500">금액</Text>
            <Text className="text-sm font-bold text-brand-500">{formatWon(booking.amount)}</Text>
          </View>
          <View className="flex-row items-center justify-between gap-4">
            <Text className="text-sm text-gray-500">상태</Text>
            <Text className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(booking.status)}`}>
              {statusLabel(booking.status)}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-4 gap-3">
        {booking.status === "pending" ? (
          <Button
            label="예약 확정 처리"
            onPress={() => {
              confirmBooking(booking.id);
            }}
          />
        ) : null}
        {booking.status === "cancelRequested" ? (
          <View className="rounded-2xl border border-amber-100 bg-amber-50 p-3">
            <Text className="mb-2 text-sm font-medium text-amber-700">고객이 예약 취소를 요청 중입니다</Text>
            <View className="mb-2 rounded-lg border border-amber-100 bg-white p-2.5">
              <Text className="mb-0.5 text-[10px] font-medium text-gray-500">취소 사유</Text>
              <Text className="text-xs text-gray-700">일정 변경이 생겨서 취소 부탁드립니다.</Text>
            </View>
            {cancelDecision ? (
              <Text className="text-xs font-medium text-amber-700">
                {cancelDecision === "accepted" ? "취소 요청을 수락했습니다." : "취소 요청을 거절했습니다."}
              </Text>
            ) : (
              <View className="mt-2 flex-row gap-2">
                <Pressable
                  className="flex-1 items-center rounded-xl border border-amber-100 bg-white py-2.5"
                  onPress={() => setCancelDecision("rejected")}
                >
                  <Text className="text-sm font-medium text-gray-600">거절</Text>
                </Pressable>
                <Pressable
                  className="flex-1 items-center rounded-xl bg-red-500 py-2.5"
                  onPress={() => setCancelDecision("accepted")}
                >
                  <Text className="text-sm font-medium text-white">취소 수락</Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : null}
        {(booking.status === "confirmed" || booking.status === "completed") ? (
          <View className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <Text className="mb-2 text-xs text-gray-500">고객이 방문하지 않은 경우 (노쇼)</Text>
            {noShowReported ? (
              <View className="items-center rounded-xl border border-amber-200 bg-amber-50 py-2.5">
                <Text className="text-sm font-medium text-amber-700">⚠️ 노쇼 신고 완료 · 어드민 확인 대기</Text>
              </View>
            ) : (
              <Pressable
                className="items-center rounded-xl border border-gray-300 bg-white py-2.5"
                onPress={() => setNoShowReported(true)}
              >
                <Text className="text-sm font-medium text-gray-700">⚠️ 노쇼 처리</Text>
              </Pressable>
            )}
            <Text className="mt-1.5 text-[10px] text-gray-400">
              노쇼 누적은 소비자 이용제한 정책에 반영될 수 있습니다
            </Text>
          </View>
        ) : null}
        {booking.status === "confirmed" ? (
          <View className="rounded-2xl border border-brand-100 bg-brand-50 p-3">
            <Text className="mb-1 text-xs font-medium text-brand-500">📸 작업 완료 처리</Text>
            <Text className="mb-2 text-[10px] leading-5 text-gray-500">
              고객에게 사진 전송이 끝나면 누르세요. 예약이 완료 상태로 전환되고, 소비자에게 사진 도착 + 리뷰 요청 알림이 자동 발송됩니다.
            </Text>
            <Button label="작업 완료 (사진 전송함)" onPress={() => markCompleted(booking.id)} />
          </View>
        ) : null}
        {booking.status === "completed" ? (
          <View className="rounded-2xl bg-success-50 p-4">
            <Text className="text-sm font-semibold text-success-500">작업 완료</Text>
            <Text className="mt-2 text-sm leading-6 text-gray-600">
              소비자에게 완료 알림이 발송되고, 다음 리뷰 유도 단계로 이어집니다.
            </Text>
          </View>
        ) : null}
        {booking.status === "confirmed" ? (
          <View className="rounded-2xl border border-red-100 bg-red-50 p-3">
            <Text className="mb-1 text-xs font-medium text-red-700">부득이한 업체 사유로 취소</Text>
            <Text className="mb-2 text-[10px] leading-5 text-gray-500">
              고객 100% 환불 처리됩니다. 누적 5회 이상 시 이용정지 검토 대상이 됩니다.
            </Text>
            {businessCancelRequested ? (
              <Text className="text-xs font-medium text-red-600">업체 취소 처리되었습니다. 어드민에 자동 보고됩니다.</Text>
            ) : (
              <Pressable
                className="items-center rounded-xl border border-red-200 bg-white py-2"
                onPress={() => setBusinessCancelRequested(true)}
              >
                <Text className="text-xs font-medium text-red-600">업체 사유로 예약 취소</Text>
              </Pressable>
            )}
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
