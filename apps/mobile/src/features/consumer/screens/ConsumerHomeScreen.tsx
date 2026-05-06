import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { Screen } from "@/components/ui/Screen";
import { useNotifications } from "@/features/shared/hooks/useNotifications";
import { useStudios } from "@/features/shared/hooks/useStudios";

const categoryActions = [
  { label: "프로필", category: "프로필", icon: "person-circle-outline" as const },
  { label: "바디프로필", category: "바디프로필", icon: "barbell-outline" as const },
  { label: "웨딩", category: "웨딩", icon: "sparkles-outline" as const },
  { label: "가족", category: "가족", icon: "gift-outline" as const },
  { label: "반려동물", category: "반려동물", icon: "paw-outline" as const },
  { label: "비즈니스", category: "비즈니스", icon: "briefcase-outline" as const },
  { label: "커플", category: "커플", icon: "heart-outline" as const },
  { label: "아기", category: "아기", icon: "happy-outline" as const },
];

const quickKeywords = ["증명사진", "성수 프로필", "주말 웨딩", "가족 스냅"];
const promoCards = [
  {
    title: "비즈니스 촬영",
    subtitle: "브랜드/팀 프로필 추천",
    bg: "bg-rose-50",
  },
  {
    title: "반려동물 촬영",
    subtitle: "반려 가족과 함께",
    bg: "bg-gray-50",
  },
  {
    title: "가족 패키지",
    subtitle: "3인 이상 촬영 추천",
    bg: "bg-amber-50",
  },
];

function HomeStudioCard({
  title,
  area,
  tags,
  bookingCount,
  rating,
  hot = false,
  ad = false,
  adLabel,
  travelAvailable = false,
  priceLabel,
}: {
  title: string;
  area: string;
  tags: string[];
  bookingCount: number;
  rating: number;
  hot?: boolean;
  ad?: boolean;
  adLabel?: string;
  travelAvailable?: boolean;
  priceLabel?: string;
}) {
  return (
    <View className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
      <View className="relative h-28 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
        <Ionicons name="image-outline" size={28} color="#9ca3af" />
        {hot ? (
          <View className="absolute left-2 top-2 rounded-full bg-gray-900 px-2 py-1">
            <Text className="text-[9px] font-semibold text-white">HOT</Text>
          </View>
        ) : null}
        {ad ? (
          <>
            <View className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1">
              <Text className="text-[9px] font-semibold text-gray-500">AD</Text>
            </View>
            {adLabel ? (
              <View className="absolute right-2 top-2 rounded-full bg-brand-500 px-2 py-1">
                <Text className="text-[9px] font-semibold text-white">{adLabel}</Text>
              </View>
            ) : null}
          </>
        ) : null}
      </View>
      <View className="flex-1 p-3">
        <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
          {title}
        </Text>
        <View className="mt-1 flex-row items-center gap-1.5">
          <Text className="min-w-0 shrink text-[11px] text-gray-400" numberOfLines={1}>
            {area}
          </Text>
          {travelAvailable ? (
            <Text className="rounded-full border border-brand-100 bg-brand-50 px-1.5 py-0.5 text-[9px] font-medium text-brand-500">
              출장 가능
            </Text>
          ) : null}
        </View>
        {tags.length > 0 ? (
          <View className="mt-1 flex-row flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Text key={tag} className="rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] text-brand-500">
                #{tag}
              </Text>
            ))}
          </View>
        ) : null}
        <View className="mt-2 flex-row items-center justify-between">
          {priceLabel ? (
            <Text className="text-[11px] font-bold text-gray-900">{priceLabel}</Text>
          ) : (
            <Text className="text-[11px] text-gray-500">예약 {bookingCount}건</Text>
          )}
          <Text className="text-[11px] text-amber-500">★ {rating}</Text>
        </View>
      </View>
    </View>
  );
}

export function ConsumerHomeScreen() {
  const router = useRouter();
  const studios = useStudios();
  const { currentRoleNotifications } = useNotifications();
  const [searchInput, setSearchInput] = useState("");
  const hotStudios = studios
    .slice()
    .sort((left, right) => right.paymentCount - left.paymentCount)
    .slice(0, 4);
  const promotedStudios = studios.slice(0, 4);
  const hasUnread = currentRoleNotifications.some((item) => !item.read);
  const runSearch = () => {
    const keyword = searchInput.trim();
    if (!keyword) return;
    router.push({ pathname: "/(tabs)/explore", params: { keyword } });
  };

  return (
    <Screen>
      <View className="mb-2 flex-row items-center justify-between pt-2">
        <Pressable className="flex-row items-center gap-2" onPress={() => router.replace("/(tabs)/home")}>
          <Ionicons name="camera-outline" size={24} color="#f472b6" />
          <Text className="text-xl font-black tracking-tight text-gray-900">포토팟</Text>
        </Pressable>
        <Pressable className="relative p-1" onPress={() => router.push("/notifications")}>
          <Ionicons name="notifications-outline" size={20} color="#6b7280" />
          {hasUnread ? (
            <View className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
          ) : null}
        </Pressable>
      </View>

      <View className="mb-3 mt-2 flex-row items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-3">
        <Ionicons name="search-outline" size={16} color="#9ca3af" />
        <TextInput
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={runSearch}
          returnKeyType="search"
          placeholder="스튜디오·지역·키워드 검색"
          placeholderTextColor="#9ca3af"
          className="ml-3 flex-1 text-sm text-gray-900"
        />
        {searchInput ? (
          <Pressable className="px-1" onPress={() => setSearchInput("")}>
            <Text className="text-lg text-gray-400">×</Text>
          </Pressable>
        ) : null}
        {searchInput.trim() ? (
          <Pressable className="ml-1 rounded-full bg-brand-500 px-3 py-1" onPress={runSearch}>
            <Text className="text-xs font-medium text-white">검색</Text>
          </Pressable>
        ) : null}
      </View>

      <View className="mb-5">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="pr-1 pt-2 text-[13px] font-medium text-brand-500">인기 검색어</Text>
          {quickKeywords.map((item, index) => (
            <Chip
              key={item}
              label={item}
              active={index === 0}
              onPress={() => router.push({ pathname: "/(tabs)/explore", params: { keyword: item } })}
            />
          ))}
        </View>
      </View>

      <View className="mb-5">
        <Text className="mb-3 text-[15px] font-bold text-gray-900">인기</Text>
        <View className="flex-row gap-4">
          {promoCards.map((card) => (
            <View
              key={card.title}
              className={`h-32 flex-1 rounded-2xl border border-gray-200 p-3 ${card.bg}`}
            >
              <View className="mb-4 self-start rounded-full bg-white/80 px-2 py-0.5">
                <Text className="text-sm font-bold text-gray-500">AD</Text>
              </View>
              <Text className="min-h-[32px] text-xs font-bold leading-tight text-gray-900">{card.title}</Text>
              <Text className="mt-1 min-h-[28px] text-[10px] leading-snug text-gray-500">{card.subtitle}</Text>
            </View>
          ))}
        </View>
        <View className="mt-3 flex-row justify-center gap-1.5">
          <View className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          <View className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          <View className="h-1.5 w-4 rounded-full bg-brand-500" />
        </View>
      </View>

      <View className="mb-6">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[15px] font-bold text-gray-900">카테고리</Text>
          <Pressable onPress={() => router.push({ pathname: "/(tabs)/explore", params: { category: "전체" } })}>
            <Text className="text-xs font-medium text-gray-400">전체보기</Text>
          </Pressable>
        </View>
        <View className="flex-row flex-wrap justify-between gap-y-3">
          {categoryActions.map((item) => (
            <Pressable
              key={item.category}
              onPress={() =>
                router.push({ pathname: "/(tabs)/explore", params: { category: item.category } })
              }
              className="w-[23%] items-center"
            >
              <View className="mb-2 h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
                <Ionicons name={item.icon} size={20} color="#374151" />
              </View>
              <Text className="text-[11px] font-medium text-gray-600">{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mb-8">
        <View className="mb-3 flex-row items-center justify-between">
          <View>
            <Text className="text-[11px] text-gray-400">예약·평점 TOP</Text>
            <Text className="text-[15px] font-bold text-gray-900">요즘 많이 찾는 스튜디오</Text>
          </View>
          <Pressable onPress={() => router.push({ pathname: "/(tabs)/explore", params: { category: "전체" } })}>
            <Text className="text-xs font-medium text-gray-400">전체보기 →</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 4 }}
        >
          {hotStudios.map((studio, index) => (
            <Pressable key={studio.id} className="w-44" onPress={() => router.push(`/studio/${studio.id}`)}>
              <HomeStudioCard
                title={studio.name}
                area={studio.area}
                tags={studio.tags}
                bookingCount={studio.paymentCount}
                rating={studio.rating}
                hot={index < 2}
                travelAvailable={studio.travelAvailable}
              />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View className="pb-4">
        <View className="mb-3 flex-row items-center justify-between">
          <View>
            <Text className="text-[11px] text-gray-400">에디터 셀렉션</Text>
            <Text className="text-[15px] font-bold text-gray-900">요즘 추천하는 스튜디오</Text>
          </View>
          <Pressable onPress={() => router.push({ pathname: "/(tabs)/explore", params: { category: "전체" } })}>
            <Text className="text-xs font-medium text-gray-400">전체보기 →</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 4 }}
        >
          {promotedStudios.map((studio) => {
            const featuredPackage = studio.packages.find((item) => item.featured) ?? studio.packages[0];
            return (
              <Pressable key={studio.id} className="w-40" onPress={() => router.push(`/studio/${studio.id}`)}>
                <HomeStudioCard
                  title={studio.name}
                  area={studio.area}
                  tags={studio.tags}
                  bookingCount={studio.paymentCount}
                  rating={studio.rating}
                  ad
                  adLabel={studio.category}
                  travelAvailable={studio.travelAvailable}
                  priceLabel={`₩${featuredPackage.price.toLocaleString()} · ${featuredPackage.title}`}
                />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Screen>
  );
}
