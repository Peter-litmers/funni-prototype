import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Studio, StudioDeposit, StudioPackage } from "@funni/domain";
import { Text, TextInput, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { useBusinessStudios } from "@/features/business/hooks/useBusinessStudios";

const categories = ["프로필", "바디프로필", "웨딩", "가족", "반려동물", "비즈니스", "커플", "아기"];
const defaultPackages: StudioPackage[] = [
  { id: "package-1", title: "1컨셉", price: 270000, description: "보정본 4컷 · 30분" },
  { id: "package-2", title: "2컨셉", price: 420000, description: "보정본 7컷 · 60분", featured: true },
  { id: "package-3", title: "3컨셉", price: 580000, description: "보정본 12컷 · 90분" },
];
const defaultDeposit: StudioDeposit = { enabled: true, mode: "percent", value: 20 };

function packagePriceFrom(packages: StudioPackage[]) {
  return Math.min(...packages.map((item) => item.price));
}

type Props = {
  studioId?: string;
};

export function BusinessStudioEditorScreen({ studioId }: Props) {
  const router = useRouter();
  const params = useLocalSearchParams<{ studioId?: string }>();
  const { getById, createMine, saveMine } = useBusinessStudios();
  const editingStudio = getById(studioId ?? params.studioId ?? "");
  const isEdit = !!editingStudio;

  const [name, setName] = useState(editingStudio?.name ?? "");
  const [address, setAddress] = useState(editingStudio?.address ?? "");
  const [phone, setPhone] = useState(editingStudio?.phone ?? "");
  const [intro, setIntro] = useState(editingStudio?.intro ?? editingStudio?.description ?? "");
  const [selectedCategory, setSelectedCategory] = useState(editingStudio?.category ?? "프로필");
  const [tags, setTags] = useState<[string, string, string]>(() => {
    const current = editingStudio?.tags ?? [];
    return [current[0] ?? "", current[1] ?? "", current[2] ?? ""];
  });
  const [packages, setPackages] = useState<StudioPackage[]>(
    editingStudio?.packages ?? defaultPackages,
  );
  const [deposit, setDeposit] = useState<StudioDeposit>(editingStudio?.deposit ?? defaultDeposit);
  const primaryPackage = useMemo(
    () => packages.find((item) => item.featured) ?? packages[1] ?? packages[0],
    [packages],
  );

  const save = async () => {
    const nextStudio: Omit<Studio, "id" | "slug"> = {
      name,
      category: selectedCategory,
      area: address,
      address,
      description: intro,
      intro,
      phone,
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
      priceFrom: packagePriceFrom(packages),
      rating: editingStudio?.rating ?? 4.8,
      reviewCount: editingStudio?.reviewCount ?? 0,
      paymentCount: editingStudio?.paymentCount ?? 0,
      distanceKm: editingStudio?.distanceKm ?? 1.2,
      photoCount: editingStudio?.photoCount ?? 0,
      travelAvailable: editingStudio?.travelAvailable ?? true,
      packages,
      deposit,
    };

    if (isEdit && editingStudio) {
      await saveMine({
        ...editingStudio,
        ...nextStudio,
      });
      router.replace(`/biz/studios/${editingStudio.id}`);
      return;
    }

    const created = await createMine(nextStudio);
    router.replace(`/biz/studios/${created.id}`);
  };

  return (
    <Screen>
      <TopBar title="스튜디오 관리" showBack />

      <View className="mb-4 flex-row gap-2">
        <View className={`flex-1 rounded-xl border px-3 py-2 ${isEdit ? "border-brand-200 bg-brand-50" : "border-gray-200 bg-white"}`}>
          <Text className={`text-center text-xs font-semibold ${isEdit ? "text-brand-500" : "text-gray-500"}`}>
            {isEdit ? `기존 · ${editingStudio?.name} 편집중` : "기존"}
          </Text>
        </View>
        <View className={`flex-1 rounded-xl border px-3 py-2 ${!isEdit ? "border-brand-500 bg-brand-500" : "border-gray-200 bg-white"}`}>
          <Text className={`text-center text-xs font-semibold ${!isEdit ? "text-white" : "text-gray-500"}`}>
            신규 등록
          </Text>
        </View>
      </View>

      <View className="rounded-3xl bg-white p-5">
        <Text className="mb-2 text-xs font-semibold text-gray-500">스튜디오 이름</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="예: 루미에르 스튜디오"
          className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-900"
          placeholderTextColor="#9ca3af"
        />

        <Text className="mb-2 mt-4 text-xs font-semibold text-gray-500">주소</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="서울시 강남구 ..."
          className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-900"
          placeholderTextColor="#9ca3af"
        />

        <Text className="mb-2 mt-4 text-xs font-semibold text-gray-500">연락처</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="02-1234-5678"
          className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-900"
          placeholderTextColor="#9ca3af"
        />

        <Text className="mb-2 mt-4 text-xs font-semibold text-gray-500">스튜디오 소개</Text>
        <TextInput
          value={intro}
          onChangeText={setIntro}
          placeholder="브랜드 스토리 · 작가 소개 · 촬영 프로세스를 자유롭게 작성해 주세요."
          multiline
          textAlignVertical="top"
          className="min-h-40 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-900"
          placeholderTextColor="#9ca3af"
        />
        <Text className="mt-2 text-right text-[10px] text-gray-400">{intro.length} / 4,000자</Text>
      </View>

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="mb-2 text-xs font-semibold text-gray-500">상세 카테고리 해시태그 (3개)</Text>
        <View className="gap-2">
          {tags.map((tag, index) => (
            <View
              key={index}
              className="flex-row items-center rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
            >
              <Text className="mr-2 text-sm text-gray-400">#</Text>
              <TextInput
                value={tag}
                onChangeText={(value) => {
                  const next = [...tags] as [string, string, string];
                  next[index] = value.replace(/[\s#]/g, "");
                  setTags(next);
                }}
                placeholder={`태그 ${index + 1}`}
                className="flex-1 text-sm text-gray-900"
                placeholderTextColor="#9ca3af"
              />
            </View>
          ))}
        </View>

        <Text className="mb-2 mt-4 text-xs font-semibold text-gray-500">카테고리</Text>
        <View className="flex-row flex-wrap gap-2">
          {categories.map((category) => (
            <Chip
              key={category}
              label={selectedCategory === category ? `✓ ${category}` : category}
              active={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </View>
      </View>

      <View className="mt-6 rounded-3xl border border-brand-100 bg-brand-50/50 p-5">
        <Text className="mb-2 text-xs font-semibold text-gray-500">가격 패키지 · 예약금</Text>
        <Text className="mb-3 text-sm font-bold text-gray-900">{selectedCategory} 촬영</Text>

        <View className="gap-2">
          {packages.map((item, index) => (
            <View
              key={item.id}
              className={`rounded-2xl border p-4 ${item.featured ? "border-brand-200 bg-white" : "border-gray-100 bg-white"}`}
            >
              <Text className="mb-2 text-xs font-semibold text-gray-500">
                {index + 1}번 패키지 {item.featured ? "· 대표 노출중" : ""}
              </Text>
              <TextInput
                value={item.title}
                onChangeText={(value) =>
                  setPackages((current) =>
                    current.map((pkg) => (pkg.id === item.id ? { ...pkg, title: value } : pkg)),
                  )
                }
                className="rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-900"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                value={String(item.price)}
                onChangeText={(value) =>
                  setPackages((current) =>
                    current.map((pkg) =>
                      pkg.id === item.id
                        ? { ...pkg, price: Number(value.replace(/\D/g, "") || "0") }
                        : pkg,
                    ),
                  )
                }
                keyboardType="numeric"
                className="mt-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-900"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                value={item.description}
                onChangeText={(value) =>
                  setPackages((current) =>
                    current.map((pkg) => (pkg.id === item.id ? { ...pkg, description: value } : pkg)),
                  )
                }
                className="mt-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-900"
                placeholderTextColor="#9ca3af"
              />
              <View className="mt-2 flex-row justify-end">
                <Button
                  label={item.featured ? "대표 패키지" : "대표로 설정"}
                  variant={item.featured ? "secondary" : "ghost"}
                  onPress={() =>
                    setPackages((current) =>
                      current.map((pkg) => ({ ...pkg, featured: pkg.id === item.id })),
                    )
                  }
                />
              </View>
            </View>
          ))}
        </View>

        <View className="mt-4 rounded-2xl bg-white p-4">
          <Text className="text-xs font-semibold text-gray-500">예약금</Text>
          <Text className="mt-2 text-sm text-gray-700">
            {deposit.enabled
              ? deposit.mode === "percent"
                ? `${deposit.value}%`
                : `₩${deposit.value.toLocaleString()}`
              : "예약금 없음"}
          </Text>
          <View className="mt-3 flex-row gap-2">
            <Button
              label="%"
              variant={deposit.mode === "percent" ? "primary" : "ghost"}
              onPress={() => setDeposit((current) => ({ ...current, enabled: true, mode: "percent" }))}
            />
            <Button
              label="고정 ₩"
              variant={deposit.mode === "fixed" ? "primary" : "ghost"}
              onPress={() => setDeposit((current) => ({ ...current, enabled: true, mode: "fixed" }))}
            />
          </View>
          <TextInput
            value={String(deposit.value)}
            onChangeText={(value) =>
              setDeposit((current) => ({
                ...current,
                enabled: true,
                value: Number(value.replace(/\D/g, "") || "0"),
              }))
            }
            keyboardType="numeric"
            className="mt-3 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-900"
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="mb-2 text-xs font-semibold text-gray-500">포트폴리오</Text>
        <Text className="text-sm text-gray-600">
          현재 {editingStudio?.photoCount ?? 0} / 30장
        </Text>
        <View className="mt-3 flex-row flex-wrap gap-1.5">
          {Array.from({ length: Math.min((editingStudio?.photoCount ?? 0) + 1, 10) }).map((_, index) => (
            <View
              key={index}
              className={`h-14 w-14 items-center justify-center rounded-lg ${index < (editingStudio?.photoCount ?? 0) ? "bg-gray-200" : "border-2 border-dashed border-gray-300 bg-white"}`}
            >
              <Text className="text-lg text-gray-300">{index < (editingStudio?.photoCount ?? 0) ? "" : "+"}</Text>
            </View>
          ))}
        </View>
        <Text className="mt-2 text-xs leading-5 text-gray-400">
          실제 업로드는 아직 연결하지 않았고, RN 프로토타입에선 정보 구조와 저장 흐름만 먼저 맞췄습니다.
        </Text>
      </View>

      <View className="mt-6 gap-3">
        <Button label={isEdit ? "수정 저장" : "등록하기"} onPress={save} />
        <Button label="목록으로" variant="secondary" onPress={() => router.replace("/biz/studios")} />
      </View>

      {primaryPackage ? (
        <View className="mt-6 rounded-3xl bg-white p-5">
          <Text className="text-xs font-semibold text-gray-500">광고/추천 카드 노출 가격</Text>
          <Text className="mt-2 text-sm font-bold text-gray-900">
            {primaryPackage.title} · ₩{primaryPackage.price.toLocaleString()}
          </Text>
          <Text className="mt-1 text-xs text-gray-500">{primaryPackage.description}</Text>
        </View>
      ) : null}
    </Screen>
  );
}
