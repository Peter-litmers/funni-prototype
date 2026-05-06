import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Studio } from "@funni/domain";
import { formatWon } from "@funni/domain";

type Props = {
  studio: Studio;
  onPress?: () => void;
};

export function StudioCard({ studio, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="rounded-2xl border border-gray-100 bg-white p-4">
      <View className="mb-3 h-28 items-center justify-center rounded-2xl bg-brand-50">
        <Ionicons name="camera-outline" size={28} color="#e85d93" />
      </View>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900">{studio.name}</Text>
          <Text className="mt-1 text-sm text-gray-500">
            {studio.category} · {studio.area}
          </Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {studio.tags.slice(0, 3).map((tag) => (
              <Text key={tag} className="rounded-full bg-brand-50 px-2 py-1 text-[11px] font-medium text-brand-500">
                #{tag}
              </Text>
            ))}
          </View>
        </View>
        <View className="items-end">
          <Text className="text-sm font-bold text-gray-900">{formatWon(studio.priceFrom)}</Text>
          <Text className="mt-1 text-xs text-gray-500">평점 {studio.rating}</Text>
        </View>
      </View>
    </Pressable>
  );
}
