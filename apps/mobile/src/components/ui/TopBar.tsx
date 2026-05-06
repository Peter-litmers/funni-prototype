import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Props = {
  title: string;
  showBack?: boolean;
  rightSlot?: ReactNode;
};

export function TopBar({ title, showBack = false, rightSlot }: Props) {
  const router = useRouter();

  return (
    <View className="mb-4 flex-row items-center justify-between py-2">
      <View className="min-w-10">
        {showBack ? (
          <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center">
            <Ionicons name="chevron-back" size={20} color="#374151" />
          </Pressable>
        ) : null}
      </View>
      <Text className="flex-1 text-center text-base font-bold text-gray-900">
        {title}
      </Text>
      <View className="min-w-10 items-end">{rightSlot}</View>
    </View>
  );
}
