import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen } from "@/components/ui/Screen";
import { useNotifications } from "@/features/shared/hooks/useNotifications";
import { useStudios } from "@/features/shared/hooks/useStudios";

const categoryIconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  전체: "grid-outline",
  프로필: "person-circle-outline",
  바디프로필: "barbell-outline",
  웨딩: "sparkles-outline",
  가족: "gift-outline",
  반려동물: "paw-outline",
  비즈니스: "briefcase-outline",
  커플: "heart-outline",
  아기: "happy-outline",
};

function ExploreStudioCard({
  title,
  category,
  area,
  tags,
  rating,
  priceLabel,
  travelAvailable = false,
}: {
  title: string;
  category: string;
  area: string;
  tags: string[];
  rating: number;
  priceLabel?: string;
  travelAvailable?: boolean;
}) {
  return (
    <View className="flex-row gap-3 border-b border-gray-50 py-3">
      <View className="h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100">
        <Ionicons name="image-outline" size={22} color="#9ca3af" />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-medium text-gray-900" numberOfLines={1}>{title}</Text>
        <View className="mt-0.5 flex-row items-center gap-1.5">
          <Text className="text-xs text-gray-400" numberOfLines={1}>{category} · {area}</Text>
          {travelAvailable ? (
            <Text className="rounded-full border border-brand-100 bg-brand-50 px-1.5 py-0.5 text-[9px] font-medium text-brand-500">
              출장 가능
            </Text>
          ) : null}
        </View>
        <View className="mt-1 flex-row flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Text key={tag} className="rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] text-brand-500">
              #{tag}
            </Text>
          ))}
        </View>
        <View className="mt-1 flex-row items-center gap-2">
          {priceLabel ? <Text className="text-sm font-bold text-gray-900">{priceLabel}</Text> : null}
          <Text className="text-xs text-yellow-500">★ {rating}</Text>
        </View>
      </View>
    </View>
  );
}

export function ConsumerExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string; keyword?: string }>();
  const studios = useStudios();
  const { currentRoleNotifications } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchInput, setSearchInput] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [sort, setSort] = useState<"payments" | "rating" | "distance">("payments");
  const [sortOpen, setSortOpen] = useState(false);
  const categories = useMemo(
    () => ["전체", ...new Set(studios.map((studio) => studio.category))],
    [studios],
  );

  useEffect(() => {
    if (params.category && params.category !== selectedCategory) {
      setSelectedCategory(params.category);
      setAppliedKeyword("");
      setSearchInput("");
    }
  }, [params.category, selectedCategory]);

  useEffect(() => {
    if (params.keyword && params.keyword !== appliedKeyword) {
      setSearchInput(params.keyword);
      setAppliedKeyword(params.keyword);
      setSelectedCategory("전체");
    }
  }, [appliedKeyword, params.keyword]);

  const clearSearch = () => {
    setSearchInput("");
    setAppliedKeyword("");
  };

  const runSearch = () => {
    const keyword = searchInput.trim();
    if (!keyword) return;
    setAppliedKeyword(keyword);
    setSelectedCategory("전체");
    setSortOpen(false);
  };

  const filteredStudios = useMemo(() => {
    const normalizedKeyword = appliedKeyword.trim().toLowerCase();

    const filtered = studios.filter((studio) => {
      const matchesCategory =
        selectedCategory === "전체" || studio.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!normalizedKeyword) return true;

      const haystack = [
        studio.name,
        studio.category,
        studio.area,
        studio.description,
        ...studio.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedKeyword);
    });

    return filtered.sort((left, right) => {
      if (sort === "rating") return right.rating - left.rating;
      if (sort === "distance") return left.area.localeCompare(right.area, "ko");
      return right.paymentCount - left.paymentCount;
    });
  }, [appliedKeyword, selectedCategory, sort, studios]);
  const hasUnread = currentRoleNotifications.some((item) => !item.read);
  const sortItems = [
    { key: "payments" as const, label: "예약순" },
    { key: "rating" as const, label: "평점순" },
    { key: "distance" as const, label: "거리순" },
  ];
  const currentSortLabel = sortItems.find((item) => item.key === sort)?.label ?? "예약순";
  const resetToAll = () => {
    setSelectedCategory("전체");
    clearSearch();
    setSortOpen(false);
  };

  return (
    <Screen>
      <View className="mb-2 flex-row items-center justify-between pt-2">
        <Pressable className="flex-row items-center gap-2" onPress={() => router.replace("/(tabs)/home")}>
          <Ionicons name="camera-outline" size={24} color="#f472b6" />
          <Text className="text-xl font-black tracking-tight text-gray-900">포토팟</Text>
        </Pressable>
        <Pressable className="relative p-1" onPress={() => router.push("/notifications")}>
          <Ionicons name="notifications-outline" size={22} color="#6b7280" />
          {hasUnread ? (
            <View className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
          ) : null}
        </Pressable>
      </View>

      <View className="mb-3 mt-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5">
        <View className="flex-row items-center gap-2">
          <Ionicons name="search-outline" size={18} color="#9ca3af" />
          <TextInput
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={runSearch}
            returnKeyType="search"
            placeholder="스튜디오·지역·키워드 검색"
            placeholderTextColor="#9ca3af"
            className="flex-1 text-sm text-gray-900"
          />
          {searchInput || appliedKeyword ? (
            <Pressable className="px-1" onPress={clearSearch}>
              <Text className="text-lg text-gray-400">×</Text>
            </Pressable>
          ) : null}
          {searchInput.trim() && searchInput.trim() !== appliedKeyword ? (
            <Pressable className="rounded-full bg-brand-500 px-3 py-1" onPress={runSearch}>
              <Text className="text-xs font-medium text-white">검색</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3 -mx-4"
        contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingBottom: 4 }}
      >
        {categories.map((category) => {
          const active = selectedCategory === category;
          const icon = categoryIconMap[category] ?? "ellipse-outline";

          return (
            <Pressable
            key={category}
              className={`flex-row items-center gap-1.5 rounded-full border px-3 py-1.5 ${
                active ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white"
              }`}
            onPress={() => {
              setSelectedCategory(category);
              clearSearch();
              setSortOpen(false);
            }}
          >
              <Ionicons name={icon} size={14} color={active ? "#ec4899" : "#4b5563"} />
              <Text className={`text-xs ${active ? "font-semibold text-brand-500" : "text-gray-600"}`}>{category}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="mb-3 flex-row items-center justify-between gap-3">
        <Text className="text-xs text-gray-500">
          {appliedKeyword
            ? `검색 결과 ${filteredStudios.length}곳`
            : selectedCategory === "전체"
            ? `전체 스튜디오 ${filteredStudios.length}곳`
            : `'${selectedCategory}' 스튜디오 ${filteredStudios.length}곳`}
        </Text>
        <Pressable
          className="flex-row items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5"
          onPress={() => setSortOpen((value) => !value)}
        >
          <Ionicons name="options-outline" size={14} color="#6b7280" />
          <Text className="text-xs font-medium text-gray-700">{currentSortLabel}</Text>
          <Ionicons name={sortOpen ? "chevron-up" : "chevron-down"} size={12} color="#6b7280" />
        </Pressable>
      </View>
      {sortOpen ? (
        <View className="mb-4 self-end overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {sortItems.map((item) => (
            <Pressable
              key={item.key}
              className={`min-w-[120px] flex-row items-center justify-between px-4 py-3 ${
                sort === item.key ? "bg-brand-50" : "bg-white"
              }`}
              onPress={() => {
                setSort(item.key);
                setSortOpen(false);
              }}
            >
              <Text className={`text-sm ${sort === item.key ? "font-semibold text-brand-500" : "text-gray-700"}`}>
                {item.label}
              </Text>
              {sort === item.key ? <Ionicons name="checkmark" size={14} color="#ec4899" /> : null}
            </Pressable>
          ))}
        </View>
      ) : null}

      {filteredStudios.length === 0 ? (
        <EmptyState title="검색 결과가 없어요" body="카테고리나 검색어를 바꿔 다시 시도해 주세요." />
      ) : (
        <View>
          {filteredStudios.map((studio) => {
            const featuredPackage = studio.packages.find((item) => item.featured) ?? studio.packages[0];
            return (
              <Pressable key={studio.id} onPress={() => router.push(`/studio/${studio.id}`)}>
                <ExploreStudioCard
                  title={studio.name}
                  category={studio.category}
                  area={studio.area}
                  tags={studio.tags}
                  rating={studio.rating}
                  priceLabel={`₩${featuredPackage.price.toLocaleString()} · ${featuredPackage.title}`}
                  travelAvailable={studio.travelAvailable}
                />
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}
