import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";
import { formatWon } from "@funni/domain";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { useBookings } from "@/features/shared/hooks/useBookings";

const paymentMethod = "토스페이먼츠";

const reviewSeed = [
  {
    studioName: "브랜드컷 스튜디오",
    date: "2026.04.20",
    rating: 5,
    text: "팀 프로필 결과물이 기대 이상이에요. 재방문 예정입니다!",
  },
  {
    studioName: "루미에르 스튜디오",
    date: "2026.03.28",
    rating: 4,
    text: "자연광 느낌이 좋아서 프로필 사진이 편하게 나왔습니다.",
  },
];

const refundRows = [
  { label: "7일 이상 전", value: "100%" },
  { label: "3~6일 전", value: "80%" },
  { label: "1~2일 전", value: "50%" },
  { label: "당일", value: "20%" },
];

export function BalancePaymentScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const { getById, payBalance } = useBookings();
  const booking = bookingId ? getById(bookingId) : undefined;

  if (!booking) {
    return (
      <Screen>
        <TopBar title="잔금 결제" showBack />
        <EmptyState title="예약을 찾을 수 없습니다" body="예약 내역에서 다시 진입해 주세요." />
      </Screen>
    );
  }

  const balance = booking.balanceAmount;

  return (
    <Screen>
      <TopBar title="잔금 결제" showBack />
      <View className="mb-4 rounded-xl bg-gray-50 p-4">
        <Text className="text-sm font-bold text-gray-900">{booking.studioName}</Text>
        <Text className="mt-1 text-xs text-gray-400">
          {booking.category} · {booking.date} {booking.time}
        </Text>
      </View>

      <View className="mb-4 gap-3 px-1">
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-500">총 결제 금액</Text>
          <Text className="text-sm font-medium text-gray-900">{formatWon(booking.amount)}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-500">예약금 결제 완료</Text>
          <Text className="text-sm font-medium text-gray-400">- {formatWon(booking.depositAmount)}</Text>
        </View>
        <View className="flex-row justify-between border-t border-gray-100 pt-3">
          <Text className="text-sm font-bold text-gray-700">오늘 결제할 잔금</Text>
          <Text className="text-base font-bold text-brand-500">{formatWon(balance)}</Text>
        </View>
        {booking.balanceDueDate ? (
          <Text className="text-[11px] leading-5 text-gray-400">
            결제 마감: {booking.balanceDueDate}. 미결제 시 예약 자동 취소 및 환불 정책이 적용됩니다.
          </Text>
        ) : null}
      </View>

      <View className="mb-4 rounded-xl border border-rose-100 bg-rose-50 p-3">
        <Text className="mb-2 text-xs font-bold text-gray-700">{booking.category} 환불 정책</Text>
        {refundRows.map((row) => (
          <View key={row.label} className="flex-row justify-between border-b border-rose-100/70 py-1.5 last:border-b-0">
            <Text className="text-[11px] text-gray-600">{row.label}</Text>
            <Text className="text-[11px] font-semibold text-gray-900">{row.value}</Text>
          </View>
        ))}
        <Text className="mt-2 text-[10px] text-gray-500">결제 총액 기준 적용. 예약금에서 우선 차감됩니다.</Text>
      </View>

      <Button
        label={`잔금 ${formatWon(balance)} 결제 · ${paymentMethod}`}
        disabled={booking.balancePaid || balance <= 0}
        onPress={() => {
          payBalance(booking.id);
          router.replace({ pathname: "/bookings", params: { filter: "예정" } });
        }}
      />
    </Screen>
  );
}

export function PaymentHistoryScreen() {
  const router = useRouter();
  const { currentRoleBookings } = useBookings();
  const payments = useMemo(
    () =>
      currentRoleBookings.flatMap((booking) => {
        const rows = [
          {
            key: `${booking.id}-deposit`,
            studioId: booking.studioId,
            studioName: booking.studioName,
            date: booking.date,
            method: paymentMethod,
            amount: booking.depositAmount,
            status: "예약금 결제완료",
            refund: false,
          },
        ];

        if (booking.balancePaid && booking.balanceAmount > 0) {
          rows.push({
            key: `${booking.id}-balance`,
            studioId: booking.studioId,
            studioName: booking.studioName,
            date: booking.date,
            method: paymentMethod,
            amount: booking.balanceAmount,
            status: "잔금 결제완료",
            refund: false,
          });
        }

        if (booking.status === "cancelled" || booking.status === "cancelRequested") {
          rows.push({
            key: `${booking.id}-refund`,
            studioId: booking.studioId,
            studioName: booking.studioName,
            date: booking.date,
            method: "환불",
            amount: booking.expectedRefundAmount ?? Math.round(booking.amount * 0.5),
            status: booking.status === "cancelled" ? "환불완료" : "환불 예정",
            refund: true,
          });
        }

        return rows;
      }),
    [currentRoleBookings],
  );

  return (
    <Screen>
      <TopBar title="결제 내역" showBack />
      {payments.map((payment) => (
        <Pressable
          key={payment.key}
          className="flex-row items-center justify-between border-b border-gray-50 py-3.5"
          onPress={() => router.push(`/studio/${payment.studioId}`)}
        >
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-900">
              {payment.studioName} <Text className="text-[10px] text-gray-300">›</Text>
            </Text>
            <Text className="mt-0.5 text-xs text-gray-400">
              {payment.date} · {payment.method}
            </Text>
          </View>
          <View className="items-end">
            <Text className={`text-sm font-bold ${payment.refund ? "text-red-500" : "text-gray-900"}`}>
              {payment.refund ? "-" : ""}
              {formatWon(payment.amount)}
            </Text>
            <Text className={`text-[10px] ${payment.refund ? "text-red-400" : "text-green-500"}`}>
              {payment.status}
            </Text>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}

export function ConsumerReviewsScreen() {
  const router = useRouter();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const editingReview = editingIndex !== null ? reviewSeed[editingIndex] : null;

  if (editingReview) {
    return (
      <Screen>
        <TopBar title="리뷰 수정" showBack />
        <View className="mb-6 rounded-xl bg-gray-50 p-4">
          <Text className="text-sm font-bold text-gray-900">{editingReview.studioName}</Text>
          <Text className="mt-0.5 text-xs text-gray-400">{editingReview.date}</Text>
        </View>
        <StarSelector rating={editRating} onChange={setEditRating} />
        <TextInput
          value={editText}
          onChangeText={setEditText}
          multiline
          maxLength={300}
          textAlignVertical="top"
          className="mt-5 min-h-[132px] rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900"
        />
        <View className="mt-1 flex-row justify-between gap-3">
          <Text className="flex-1 text-[10px] text-gray-400">30자 이상 입력해야 수정 가능 · 삭제는 요청 후 승인됩니다.</Text>
          <Text className="text-[10px] text-gray-400">{editText.length}/300</Text>
        </View>
        <View className="mt-6 flex-row gap-2">
          <Button label="취소" variant="secondary" onPress={() => setEditingIndex(null)} />
          <Button label="수정 완료" disabled={editText.trim().length < 30} onPress={() => setEditingIndex(null)} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="리뷰 관리" showBack />
      {reviewSeed.map((review, index) => (
        <View key={`${review.studioName}-${review.date}`} className="mb-3 rounded-xl bg-gray-50 p-4">
          <View className="mb-2 flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Pressable onPress={() => router.push(`/studio/${index === 0 ? "studio-brand" : "studio-lumiere"}`)}>
                <Text className="text-sm font-bold text-gray-900">
                  {review.studioName} <Text className="text-[10px] text-gray-300">›</Text>
                </Text>
              </Pressable>
              <Text className="mt-0.5 text-xs text-gray-400">{review.date}</Text>
            </View>
            <Text className="text-xs text-amber-400">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </Text>
          </View>
          <Text className="text-xs leading-5 text-gray-600">{review.text}</Text>
          <View className="mt-3 flex-row justify-end gap-2 border-t border-gray-100 pt-2">
            <Pressable
              className="px-2 py-1"
              onPress={() => {
                setEditingIndex(index);
                setEditRating(review.rating);
                setEditText(review.text);
              }}
            >
              <Text className="text-[10px] font-medium text-brand-500">수정</Text>
            </Pressable>
            <Pressable className="px-2 py-1" onPress={() => setDeleteIndex(index)}>
              <Text className="text-[10px] text-red-400">삭제 요청</Text>
            </Pressable>
          </View>
        </View>
      ))}

      {deleteIndex !== null ? (
        <View className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <Text className="mb-1 text-sm font-bold text-red-700">리뷰 삭제 요청</Text>
          <Text className="mb-3 text-[11px] leading-5 text-gray-500">삭제는 운영자 검토 후 반영됩니다. 요청 사유를 입력해 주세요.</Text>
          <TextInput
            value={deleteReason}
            onChangeText={setDeleteReason}
            multiline
            textAlignVertical="top"
            placeholder="삭제 요청 사유"
            placeholderTextColor="#9ca3af"
            className="min-h-[84px] rounded-xl border border-red-100 bg-white px-3 py-2 text-sm text-gray-900"
          />
          <View className="mt-3 flex-row gap-2">
            <Button
              label="닫기"
              variant="secondary"
              onPress={() => {
                setDeleteIndex(null);
                setDeleteReason("");
              }}
            />
            <Button
              label="삭제 요청"
              disabled={deleteReason.trim().length < 5}
              onPress={() => {
                setDeleteIndex(null);
                setDeleteReason("");
              }}
            />
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

export function ReviewWriteScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const { getById } = useBookings();
  const booking = bookingId ? getById(bookingId) : undefined;
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  return (
    <Screen>
      <TopBar title="리뷰 작성" showBack />
      <View className="mb-6 rounded-xl bg-gray-50 p-4">
        <Text className="text-sm font-bold text-gray-900">{booking?.studioName ?? "촬영 스튜디오"}</Text>
      </View>
      <StarSelector rating={rating} onChange={setRating} />
      <Text className="mt-6 text-sm font-medium text-gray-900">리뷰 내용</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        maxLength={300}
        textAlignVertical="top"
        placeholder="촬영 경험을 30자 이상 작성해주세요"
        placeholderTextColor="#9ca3af"
        className="mt-2 min-h-[140px] rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900"
      />
      <Text className="mt-1 text-right text-[10px] text-gray-400">{text.length}/300</Text>
      <View className="mt-6">
        <Button
          label="리뷰 등록"
          disabled={text.trim().length < 30}
          onPress={() => router.replace({ pathname: "/bookings", params: { filter: "완료" } })}
        />
      </View>
    </Screen>
  );
}

function StarSelector({ rating, onChange }: { rating: number; onChange: (rating: number) => void }) {
  return (
    <View>
      <Text className="mb-3 text-sm font-medium text-gray-900">별점</Text>
      <View className="flex-row justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => onChange(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={34}
              color={star <= rating ? "#facc15" : "#d1d5db"}
            />
          </Pressable>
        ))}
      </View>
      <Text className="mt-2 text-center text-xs text-gray-400">{rating}점</Text>
    </View>
  );
}
