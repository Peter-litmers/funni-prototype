import { Text, View } from "react-native";
import type { BookingStatus } from "@funni/domain";
import { cn } from "@/lib/cn";

type Props = {
  status: BookingStatus;
};

const labelMap: Record<BookingStatus, string> = {
  pending: "대기",
  confirmed: "확정",
  cancelRequested: "취소 요청",
  cancelled: "취소됨",
  completed: "완료",
};

const toneMap: Record<BookingStatus, string> = {
  pending: "bg-warning-50",
  confirmed: "bg-brand-50",
  cancelRequested: "bg-danger-50",
  cancelled: "bg-gray-100",
  completed: "bg-success-50",
};

const textToneMap: Record<BookingStatus, string> = {
  pending: "text-warning-500",
  confirmed: "text-brand-500",
  cancelRequested: "text-danger-500",
  cancelled: "text-gray-500",
  completed: "text-success-500",
};

export function StatusBadge({ status }: Props) {
  return (
    <View className={cn("rounded-full px-2 py-1", toneMap[status])}>
      <Text className={cn("text-[11px] font-semibold", textToneMap[status])}>
        {labelMap[status]}
      </Text>
    </View>
  );
}
