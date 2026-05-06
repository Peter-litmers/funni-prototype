import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Studio, StudioDeposit, StudioPackage } from "@funni/domain";
import { Pressable, Text, TextInput, View } from "react-native";
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
const defaultHairMakeupOptions = [
  { name: "헤어 메이크업", price: "30000" },
  { name: "얼굴 메이크업", price: "50000" },
  { name: "세트 (헤어+얼굴)", price: "70000" },
];
const defaultAdditionalOptions = [
  { id: "option-1", name: "원본 추가", price: "40000" },
  { id: "option-2", name: "보정 컷 추가", price: "40000" },
];
const depositPercentPresets = [10, 20, 30, 50];
const subcategoryHints: Record<string, [string, string, string]> = {
  프로필: ["증명사진", "취업프로필", "이력서"],
  바디프로필: ["일반바디", "피트니스", "커플바디"],
  웨딩: ["본식스냅", "야외웨딩", "리마인드"],
  가족: ["3대가족", "돌잔치", "가족나들이"],
  반려동물: ["강아지", "고양이", "반려가족"],
  비즈니스: ["사내프로필", "단체촬영", "음식"],
  커플: ["기념일", "데이트스냅", "프리웨딩"],
  아기: ["신생아", "100일", "돌"],
};
const bufferOptions = [
  { label: "없음", value: "0" },
  { label: "15분", value: "15" },
  { label: "30분", value: "30" },
  { label: "1시간", value: "60" },
  { label: "1시간 30분", value: "90" },
  { label: "2시간", value: "120" },
];
const minBookingOptions = [
  { label: "당일", value: "0" },
  { label: "1일 전", value: "1" },
  { label: "3일 전", value: "3" },
  { label: "7일 전", value: "7" },
];
const maxBookingOptions = [
  { label: "30일 이내", value: "30" },
  { label: "60일 이내", value: "60" },
  { label: "90일 이내", value: "90" },
  { label: "6개월 이내", value: "180" },
  { label: "1년 이내", value: "365" },
  { label: "무제한", value: "unlimited" },
];
const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

function packagePriceFrom(packages: StudioPackage[]) {
  return Math.min(...packages.map((item) => item.price));
}

function makePackageId() {
  return `package-${Date.now()}`;
}

function makeOptionId() {
  return `option-${Date.now()}`;
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
  const [additionalOptions, setAdditionalOptions] = useState(defaultAdditionalOptions);
  const [hairMakeupOptions, setHairMakeupOptions] = useState(defaultHairMakeupOptions);
  const [bufferMinutes, setBufferMinutes] = useState("30");
  const [travelAvailable, setTravelAvailable] = useState(editingStudio?.travelAvailable ?? false);
  const [vatIncluded, setVatIncluded] = useState(true);
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("22:00");
  const [closedDays, setClosedDays] = useState<string[]>(["월"]);
  const [minBookingDays, setMinBookingDays] = useState("1");
  const [maxBookingDays, setMaxBookingDays] = useState("90");
  const tagPlaceholders = subcategoryHints[selectedCategory] ?? ["태그1", "태그2", "태그3"];
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
      travelAvailable,
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
                placeholder={tagPlaceholders[index]}
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
        <Text className="mb-2 text-xs font-semibold text-gray-500">가격 패키지 · 예약금 · 버퍼 시간</Text>
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
              <View className="mt-2 flex-row items-center justify-end gap-2">
                <Pressable
                  disabled={packages.length <= 1}
                  className={`rounded-md px-2 py-1.5 ${packages.length <= 1 ? "bg-gray-100" : "bg-red-50"}`}
                  onPress={() =>
                    setPackages((current) => {
                      const next = current.filter((pkg) => pkg.id !== item.id);
                      if (item.featured && next[0]) {
                        return next.map((pkg, packageIndex) => ({ ...pkg, featured: packageIndex === 0 }));
                      }
                      return next;
                    })
                  }
                >
                  <Text className={`text-[10px] font-medium ${packages.length <= 1 ? "text-gray-300" : "text-red-500"}`}>
                    삭제
                  </Text>
                </Pressable>
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
          <Pressable
            className="items-center rounded-lg border border-dashed border-brand-200 bg-white py-2"
            onPress={() =>
              setPackages((current) => [
                ...current,
                {
                  id: makePackageId(),
                  title: "",
                  price: 0,
                  description: "",
                  featured: current.length === 0,
                },
              ])
            }
          >
            <Text className="text-xs font-medium text-brand-500">+ 패키지 추가</Text>
          </Pressable>
        </View>

        <Text className="mb-1.5 mt-4 text-[10px] text-gray-500">추가 옵션 (선택)</Text>
        <View className="gap-1.5">
          {additionalOptions.map((option) => (
            <View key={option.id} className="flex-row items-center gap-1 rounded-lg border border-gray-100 bg-white p-1.5">
              <TextInput
                value={option.name}
                onChangeText={(value) =>
                  setAdditionalOptions((current) =>
                    current.map((item) => (item.id === option.id ? { ...item, name: value } : item)),
                  )
                }
                className="min-w-0 flex-1 rounded bg-gray-50 px-2 py-1 text-xs text-gray-900"
                placeholder="옵션명"
                placeholderTextColor="#9ca3af"
              />
              <Text className="text-xs text-gray-500">₩</Text>
              <TextInput
                value={option.price}
                onChangeText={(value) =>
                  setAdditionalOptions((current) =>
                    current.map((item) =>
                      item.id === option.id ? { ...item, price: value.replace(/\D/g, "") } : item,
                    ),
                  )
                }
                keyboardType="numeric"
                className="w-20 rounded bg-gray-50 px-2 py-1 text-right text-xs text-gray-900"
                placeholder="0"
                placeholderTextColor="#9ca3af"
              />
              <Pressable
                className="rounded-md bg-gray-100 px-2 py-1"
                onPress={() => setAdditionalOptions((current) => current.filter((item) => item.id !== option.id))}
              >
                <Text className="text-[10px] text-red-500">삭제</Text>
              </Pressable>
            </View>
          ))}
          <Pressable
            className="items-center rounded-lg border border-dashed border-brand-200 bg-white py-2"
            onPress={() =>
              setAdditionalOptions((current) => [...current, { id: makeOptionId(), name: "", price: "0" }])
            }
          >
            <Text className="text-xs font-medium text-brand-500">+ 옵션 추가</Text>
          </Pressable>
        </View>

        <View className="mt-4 rounded-2xl bg-white p-4">
          <Pressable
            className="mb-2 flex-row items-center gap-2"
            onPress={() => setDeposit((current) => ({ ...current, enabled: !current.enabled }))}
          >
            <View className={`h-4 w-4 items-center justify-center rounded border ${deposit.enabled ? "border-brand-500 bg-brand-500" : "border-gray-300 bg-white"}`}>
              {deposit.enabled ? <Text className="text-[10px] font-bold text-white">✓</Text> : null}
            </View>
            <Text className="text-[11px] font-semibold text-gray-700">예약금 받기 (선결제)</Text>
          </Pressable>
          <Text className="mt-2 text-sm text-gray-700">
            {deposit.enabled
              ? deposit.mode === "percent"
                ? `${deposit.value}%`
                : `₩${deposit.value.toLocaleString()}`
              : "예약금 없음"}
          </Text>
          {deposit.enabled ? (
            <>
              <View className="mt-3 flex-row gap-2">
                <Button
                  label="%"
                  variant={deposit.mode === "percent" ? "primary" : "ghost"}
                  onPress={() => setDeposit((current) => ({ ...current, enabled: true, mode: "percent", value: 0 }))}
                />
                <Button
                  label="고정 ₩"
                  variant={deposit.mode === "fixed" ? "primary" : "ghost"}
                  onPress={() => setDeposit((current) => ({ ...current, enabled: true, mode: "fixed", value: 0 }))}
                />
              </View>
              {deposit.mode === "percent" ? (
                <View className="mt-2 flex-row gap-1">
                  {depositPercentPresets.map((preset) => (
                    <Pressable
                      key={preset}
                      className={`flex-1 rounded border py-1 ${
                        deposit.value === preset ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white"
                      }`}
                      onPress={() => setDeposit((current) => ({ ...current, value: preset }))}
                    >
                      <Text className={`text-center text-[10px] ${deposit.value === preset ? "font-semibold text-brand-500" : "text-gray-500"}`}>
                        {preset}%
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
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
              <Text className="mt-1 text-[10px] text-gray-400">
                예) 옵션 포함 ₩100,000 결제 시 → 예약금{" "}
                {deposit.mode === "percent"
                  ? `${deposit.value}% = ₩${Math.round((100000 * deposit.value) / 100).toLocaleString()}`
                  : `₩${Math.min(deposit.value, 100000).toLocaleString()}`}{" "}
                / 잔금 ₩
                {(
                  100000 -
                  (deposit.mode === "percent"
                    ? Math.round((100000 * deposit.value) / 100)
                    : Math.min(deposit.value, 100000))
                ).toLocaleString()}
              </Text>
            </>
          ) : null}
        </View>

        <View className="mt-4 rounded-2xl bg-white p-4">
          <Text className="mb-2 text-[10px] font-medium text-gray-500">버퍼 시간 (청소·준비)</Text>
          <View className="flex-row flex-wrap gap-1.5">
            {bufferOptions.map((option) => (
              <Pressable
                key={option.value}
                className={`rounded-lg border px-3 py-1.5 ${
                  bufferMinutes === option.value ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white"
                }`}
                onPress={() => setBufferMinutes(option.value)}
              >
                <Text className={`text-[10px] font-medium ${bufferMinutes === option.value ? "text-brand-500" : "text-gray-500"}`}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="mb-2 text-xs font-semibold text-gray-500">포트폴리오 (최대 30장, 동영상 불가)</Text>
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

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="mb-2 text-xs font-semibold text-gray-500">헤어 / 메이크업 옵션 설정</Text>
        <View className="gap-2">
          {hairMakeupOptions.map((option, index) => (
            <View key={index} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <TextInput
                value={option.name}
                onChangeText={(value) =>
                  setHairMakeupOptions((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? { ...item, name: value } : item)),
                  )
                }
                className="rounded-xl bg-white px-3 py-2 text-sm text-gray-900"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                value={option.price}
                onChangeText={(value) =>
                  setHairMakeupOptions((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, price: value.replace(/\D/g, "") } : item,
                    ),
                  )
                }
                keyboardType="numeric"
                className="mt-2 rounded-xl bg-white px-3 py-2 text-sm text-gray-900"
                placeholder="옵션 가격"
                placeholderTextColor="#9ca3af"
              />
            </View>
          ))}
        </View>
      </View>

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="mb-2 text-xs font-semibold text-gray-500">출장 가능 + 부가세</Text>
        <View className="flex-row gap-3">
          <Pressable
            className={`flex-1 rounded-2xl border px-4 py-3 ${travelAvailable ? "border-brand-200 bg-brand-50" : "border-gray-100 bg-gray-50"}`}
            onPress={() => setTravelAvailable((value) => !value)}
          >
            <Text className={`text-xs font-medium ${travelAvailable ? "text-brand-500" : "text-gray-600"}`}>
              {travelAvailable ? "✓ " : ""}🚗 출장 가능
            </Text>
          </Pressable>
          <Pressable
            className={`flex-1 rounded-2xl border px-4 py-3 ${vatIncluded ? "border-brand-200 bg-brand-50" : "border-gray-100 bg-gray-50"}`}
            onPress={() => setVatIncluded((value) => !value)}
          >
            <Text className={`text-xs font-medium ${vatIncluded ? "text-brand-500" : "text-gray-600"}`}>
              {vatIncluded ? "✓ " : ""}💰 VAT 포함
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="mb-3 text-xs font-semibold text-gray-700">운영 시간 설정</Text>
        <View className="flex-row gap-2">
          <TextInput
            value={openTime}
            onChangeText={setOpenTime}
            className="flex-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-center text-sm text-gray-900"
            placeholder="09:00"
            placeholderTextColor="#9ca3af"
          />
          <TextInput
            value={closeTime}
            onChangeText={setCloseTime}
            className="flex-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-center text-sm text-gray-900"
            placeholder="22:00"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <Text className="mb-2 mt-3 text-xs font-medium text-gray-700">휴무일</Text>
        <View className="flex-row gap-1.5">
          {weekdays.map((day) => {
            const closed = closedDays.includes(day);
            return (
              <Pressable
                key={day}
                className={`h-9 w-9 items-center justify-center rounded-lg ${closed ? "bg-red-100" : "bg-gray-100"}`}
                onPress={() =>
                  setClosedDays((current) =>
                    current.includes(day) ? current.filter((item) => item !== day) : [...current, day],
                  )
                }
              >
                <Text className={`text-xs font-medium ${closed ? "text-red-600" : "text-gray-500"}`}>{day}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="mb-2 text-xs font-semibold text-gray-500">고객 예약 가능 기간</Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="mb-1 text-[10px] text-gray-400">최소 예약</Text>
            <View className="gap-1">
              {minBookingOptions.map((option) => (
                <Pressable
                  key={option.value}
                  className={`rounded-lg border px-2 py-1.5 ${minBookingDays === option.value ? "border-brand-500 bg-brand-50" : "border-gray-100 bg-gray-50"}`}
                  onPress={() => setMinBookingDays(option.value)}
                >
                  <Text className={`text-center text-[10px] ${minBookingDays === option.value ? "font-semibold text-brand-500" : "text-gray-500"}`}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-[10px] text-gray-400">최대 예약</Text>
            <View className="gap-1">
              {maxBookingOptions.map((option) => (
                <Pressable
                  key={option.value}
                  className={`rounded-lg border px-2 py-1.5 ${maxBookingDays === option.value ? "border-brand-500 bg-brand-50" : "border-gray-100 bg-gray-50"}`}
                  onPress={() => setMaxBookingDays(option.value)}
                >
                  <Text className={`text-center text-[10px] ${maxBookingDays === option.value ? "font-semibold text-brand-500" : "text-gray-500"}`}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
        <Text className="mt-2 text-[10px] text-gray-400">
          최소 {minBookingOptions.find((option) => option.value === minBookingDays)?.label ?? "1일 전"}부터 최대{" "}
          {maxBookingOptions.find((option) => option.value === maxBookingDays)?.label ?? "90일 이내"}까지 예약 가능
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
