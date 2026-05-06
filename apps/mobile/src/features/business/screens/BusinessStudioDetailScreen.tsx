import { useRouter } from "expo-router";
import type { Studio } from "@funni/domain";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { useBusinessStudios } from "@/features/business/hooks/useBusinessStudios";

type Props = {
  studio: Studio | null;
};

export function BusinessStudioDetailScreen({ studio }: Props) {
  const router = useRouter();
  const { deleteMine } = useBusinessStudios();

  if (!studio) {
    return (
      <Screen>
        <TopBar title="스튜디오 상세" showBack />
        <EmptyState title="스튜디오를 찾을 수 없어요" body="목록에서 다시 선택해 주세요." />
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="스튜디오 상세" showBack />
      <View className="rounded-3xl bg-white p-5">
        <Text className="text-xl font-bold text-gray-900">{studio.name}</Text>
        <Text className="mt-2 text-sm text-gray-500">{studio.address}</Text>
        <View className="mt-3 flex-row flex-wrap gap-2">
          <Text className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-500">
            {studio.category}
          </Text>
          <Text className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600">
            📸 {studio.photoCount}/30장
          </Text>
        </View>
        <View className="mt-4 flex-row flex-wrap gap-1.5">
          {studio.tags.map((tag) => (
            <Text
              key={tag}
              className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-medium text-brand-500"
            >
              #{tag}
            </Text>
          ))}
        </View>
        <Text className="mt-4 text-sm leading-6 text-gray-700">
          {studio.intro ?? studio.description}
        </Text>
      </View>

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="text-base font-bold text-gray-900">패키지 요약</Text>
        <View className="mt-4 gap-3">
          {studio.packages.map((pkg) => (
            <View
              key={pkg.id}
              className={`rounded-2xl border p-4 ${pkg.featured ? "border-brand-200 bg-brand-50/40" : "border-gray-100"}`}
            >
              <Text className="text-sm font-bold text-gray-900">{pkg.title}</Text>
              <Text className="mt-1 text-sm text-gray-500">{pkg.description}</Text>
              <Text className="mt-2 text-sm font-semibold text-gray-900">
                ₩{pkg.price.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-6 flex-row gap-3">
        <View className="flex-1">
          <Button
            label="수정"
            onPress={() =>
              router.push({ pathname: "/biz/studios/edit", params: { studioId: studio.id } })
            }
          />
        </View>
        <View className="flex-1">
          <Button
            label="삭제"
            variant="ghost"
            onPress={async () => {
              await deleteMine(studio.id);
              router.replace("/biz/studios");
            }}
          />
        </View>
      </View>
    </Screen>
  );
}
