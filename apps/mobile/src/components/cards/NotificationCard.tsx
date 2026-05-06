import { Pressable, Text, View } from "react-native";
import type { Notification } from "@funni/domain";
import { cn } from "@/lib/cn";

type Props = {
  item: Notification;
  onPress?: () => void;
};

export function NotificationCard({ item, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-4",
        !item.read && "border-brand-100 bg-brand-50/40",
      )}
    >
      <Text className="text-sm font-bold text-gray-900">{item.title}</Text>
      <Text className="mt-2 text-sm leading-6 text-gray-600">{item.body}</Text>
      <Text className="mt-3 text-xs text-gray-400">{item.timeLabel}</Text>
    </Pressable>
  );
}
