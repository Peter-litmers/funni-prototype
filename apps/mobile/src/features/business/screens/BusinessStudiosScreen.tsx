import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { StatCard } from "@/components/cards/StatCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { useBookings } from "@/features/shared/hooks/useBookings";
import { useBusinessStudios } from "@/features/business/hooks/useBusinessStudios";

export function BusinessStudiosScreen() {
  const router = useRouter();
  const { studios } = useBusinessStudios();
  const { bookings } = useBookings();
  const avgRating =
    studios.length > 0
      ? studios.reduce((sum, studio) => sum + studio.rating, 0) / studios.length
      : 0;

  return (
    <Screen>
      <TopBar title="스튜디오 관리" showBack />
      <View className="mb-4 flex-row gap-2">
        <View className="flex-1 rounded-xl border border-brand-500 bg-brand-500 px-3 py-2">
          <Text className="text-center text-xs font-semibold text-white">
            기존 ({studios.length})
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/biz/studios/edit")}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2"
        >
          <Text className="text-center text-xs font-semibold text-gray-500">신규 등록</Text>
        </Pressable>
      </View>

      {studios.length === 0 ? (
        <EmptyState title="등록된 스튜디오가 없어요" body="첫 스튜디오를 등록하면 이 화면에서 수정과 삭제를 할 수 있습니다." />
      ) : (
        <View className="gap-3">
          {studios.map((studio) => (
            <Pressable
              key={studio.id}
              onPress={() => router.push(`/biz/studios/${studio.id}`)}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card"
            >
              <View className="h-28 items-center justify-center bg-gray-100">
                <Ionicons name="images-outline" size={36} color="#9ca3af" />
              </View>
              <View className="p-3">
                <View className="mb-2 flex-row items-start justify-between gap-2">
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-gray-900">{studio.name}</Text>
                    <Text className="mt-1 text-[10px] text-gray-400">{studio.address}</Text>
                  </View>
                  <Text className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-500">
                    {studio.category}
                  </Text>
                </View>

                <View className="mb-2 flex-row flex-wrap gap-1.5">
                  {studio.tags.map((tag) => (
                    <Text
                      key={tag}
                      className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-medium text-brand-500"
                    >
                      #{tag}
                    </Text>
                  ))}
                </View>

                <Text className="text-[11px] leading-5 text-gray-600" numberOfLines={2}>
                  {studio.intro ?? studio.description}
                </Text>

                <View className="mt-2 flex-row items-center gap-2">
                  <Text className="text-[10px] text-gray-400">📸 {studio.photoCount}/30장</Text>
                  <Text className="text-[10px] text-gray-400">·</Text>
                  <Text className="text-[10px] text-gray-400">⭐ {studio.rating.toFixed(1)}</Text>
                </View>

                <View className="mt-4 flex-row gap-2">
                  <View className="flex-1">
                    <Button
                      label="수정"
                      variant="secondary"
                      onPress={() => router.push({ pathname: "/biz/studios/edit", params: { studioId: studio.id } })}
                    />
                  </View>
                  <View className="w-28">
                    <Button
                      label="상세"
                      variant="ghost"
                      onPress={() => router.push(`/biz/studios/${studio.id}`)}
                    />
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {studios.length > 0 ? (
        <View className="mt-4 flex-row gap-3">
          <View className="flex-1">
            <StatCard label="총 예약" value={`${bookings.length}건`} tone="brand" />
          </View>
          <View className="flex-1">
            <StatCard label="평균 평점" value={`${avgRating.toFixed(1)} ★`} tone="warning" />
          </View>
        </View>
      ) : null}
    </Screen>
  );
}
