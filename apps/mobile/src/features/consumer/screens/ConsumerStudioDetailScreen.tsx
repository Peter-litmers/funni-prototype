import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { describeDeposit, formatWon, type Studio } from "@funni/domain";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";

type Props = {
  studio: Studio | null;
};

const addonOptions = [
  { id: "original", name: "원본 추가", price: 40000 },
  { id: "retouch", name: "보정 컷 추가", price: 40000 },
];

const hairMakeupOptions = [
  { id: "hair", name: "헤어 스타일링", price: 50000 },
  { id: "makeup", name: "메이크업", price: 70000 },
];

const availableDates = [5, 10, 11, 13, 15, 18, 20, 25];
const timeOptions = ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
const bookedTimes = ["11:00", "16:00"];

function CheckDot({ selected }: { selected: boolean }) {
  return (
    <View
      className={`h-4 w-4 items-center justify-center rounded-full border-2 ${
        selected ? "border-brand-500 bg-brand-500" : "border-gray-300 bg-white"
      }`}
    >
      {selected ? <Ionicons name="checkmark" size={10} color="#fff" /> : null}
    </View>
  );
}

export function ConsumerStudioDetailScreen({ studio }: Props) {
  const router = useRouter();
  const [introExpanded, setIntroExpanded] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(studio?.packages[0]?.id ?? "");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(10);
  const [selectedTime, setSelectedTime] = useState("14:00");
  const selectedPackage = useMemo(
    () => studio?.packages.find((item) => item.id === selectedPackageId) ?? studio?.packages[0] ?? null,
    [selectedPackageId, studio],
  );
  const introText = studio?.intro || studio?.description || "";
  const previewIntro = introText.length > 120 ? `${introText.slice(0, 120)}...` : introText;
  const introIsLong = introText.length > previewIntro.length;
  const toggleAddon = (id: string) => {
    setSelectedAddons((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };
  const toggleOption = (id: string) => {
    setSelectedOptions((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  if (!studio) {
    return (
      <Screen>
        <TopBar title="스튜디오" showBack />
        <EmptyState title="스튜디오를 찾을 수 없어요" body="목데이터 기준으로 다시 확인해 주세요." />
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="-mx-4 -mt-2 h-52 items-center justify-center bg-gray-200">
        <Pressable
          className="absolute left-4 top-4 h-9 w-9 items-center justify-center rounded-full bg-white/90"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </Pressable>
        <Ionicons name="image-outline" size={56} color="#9ca3af" />
      </View>

      <View className="pt-4">
        <Text className="text-lg font-bold text-gray-900">{studio.name}</Text>
        <Text className="mt-1 text-xs text-gray-400">{studio.area}</Text>
        <View className="mt-1 flex-row flex-wrap items-center gap-2">
          <Text className="text-xs text-amber-500">★ {studio.rating}</Text>
          <Text className="text-xs text-gray-400">리뷰 {studio.reviewCount}개</Text>
          {studio.travelAvailable ? (
            <Text className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-500">
              출장 가능
            </Text>
          ) : null}
        </View>
      </View>

      <View className="mt-4 rounded-xl bg-gray-50 p-4">
        <Text className="mb-2 text-xs font-medium text-gray-500">스튜디오 소개</Text>
        <Text className="text-sm leading-6 text-gray-700">
          {introExpanded || !introIsLong ? introText : previewIntro}
        </Text>
        {introIsLong ? (
          <Pressable className="mt-2" onPress={() => setIntroExpanded((value) => !value)}>
            <Text className="text-xs font-medium text-brand-500">
              {introExpanded ? "접기 ▲" : "전체 보기 ▼"}
            </Text>
          </Pressable>
        ) : null}
        <View className="mt-3 flex-row flex-wrap gap-1.5">
          {studio.tags.map((tag) => (
            <Chip key={tag} label={`#${tag}`} />
          ))}
        </View>
      </View>

      <View className="mt-4 rounded-xl bg-gray-50 p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-xs font-medium text-gray-500">가격 패키지</Text>
          <Text className="text-[10px] text-gray-400">VAT 포함</Text>
        </View>
        <View className="gap-2">
          {studio.packages.map((item) => (
            <Pressable
              key={item.id}
              className={`rounded-lg border bg-white p-3 ${
                item.id === selectedPackage?.id ? "border-brand-500 bg-brand-50" : "border-gray-200"
              }`}
              onPress={() => setSelectedPackageId(item.id)}
            >
              <View className="flex-row items-start justify-between gap-3">
                <View className="mt-0.5">
                  <CheckDot selected={item.id === selectedPackage?.id} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-900">{item.title}</Text>
                  <Text className="mt-0.5 text-[10px] text-gray-500">{item.description}</Text>
                </View>
                <Text className="text-sm font-bold text-gray-900">{formatWon(item.price)}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-4 rounded-xl bg-gray-50 p-4">
        <Text className="mb-2 text-xs font-medium text-gray-500">추가 옵션</Text>
        <View className="gap-2">
          {addonOptions.map((item) => (
            <Pressable
              key={item.id}
              className={`flex-row items-center justify-between rounded-lg border bg-white p-3 ${
                selectedAddons.includes(item.id) ? "border-brand-500 bg-brand-50" : "border-gray-200"
              }`}
              onPress={() => toggleAddon(item.id)}
            >
              <View className="flex-row items-center gap-2">
                <CheckDot selected={selectedAddons.includes(item.id)} />
                <Text className="text-sm text-gray-900">{item.name}</Text>
              </View>
              <Text className="text-sm font-medium text-gray-900">+{formatWon(item.price)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-4 rounded-xl bg-gray-50 p-4">
        <Text className="mb-2 text-xs font-medium text-gray-500">헤어 / 메이크업 옵션</Text>
        <View className="gap-2">
          {hairMakeupOptions.map((item) => (
            <Pressable
              key={item.id}
              className={`flex-row items-center justify-between rounded-lg border bg-white p-3 ${
                selectedOptions.includes(item.id) ? "border-brand-500 bg-brand-50" : "border-gray-200"
              }`}
              onPress={() => toggleOption(item.id)}
            >
              <View className="flex-row items-center gap-2">
                <CheckDot selected={selectedOptions.includes(item.id)} />
                <Text className="text-sm text-gray-900">{item.name}</Text>
              </View>
              <Text className="text-sm font-medium text-gray-900">+{formatWon(item.price)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-xs font-medium text-gray-500">{studio.category} 포트폴리오</Text>
          <Text className="text-[10px] text-gray-400">최대 30장</Text>
        </View>
        <View className="flex-row flex-wrap overflow-hidden rounded-xl">
          {Array.from({ length: Math.min(studio.photoCount, 9) }).map((_, index) => (
            <View key={index} className="aspect-square w-1/3 items-center justify-center border border-white bg-gray-100">
              <Ionicons name="image-outline" size={20} color="#d1d5db" />
            </View>
          ))}
        </View>
      </View>

      <View className="mt-4">
        <Text className="mb-2 text-xs font-medium text-gray-500">위치</Text>
        <View className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
          <View className="h-32 items-center justify-center bg-blue-50">
            <Ionicons name="location-outline" size={34} color="#ec4899" />
            <Text className="absolute bottom-2 right-2 rounded-full border border-gray-200 bg-white/90 px-2 py-0.5 text-[9px] text-gray-500">
              카카오맵 연동 예정
            </Text>
          </View>
          <View className="p-3">
            <Text className="text-xs font-medium text-gray-700">{studio.address}</Text>
            <Pressable className="mt-1 flex-row items-center gap-1" onPress={() => Linking.openURL(`tel:${studio.phone}`)}>
              <Ionicons name="call-outline" size={12} color="#ec4899" />
              <Text className="text-[10px] text-brand-500">{studio.phone}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View className="mt-4">
        <Text className="mb-2 text-sm font-medium text-gray-900">리뷰 {studio.reviewCount}개</Text>
        <View className="gap-2">
          {[
            { name: "김**", rating: 5, text: "분위기 너무 좋아요! 사진 결과물도 만족합니다", date: "2026.04.10" },
            { name: "이**", rating: 4, text: "접근성이 좋고 시설이 깔끔해요", date: "2026.04.08" },
          ].map((review) => (
            <View key={review.name} className="rounded-lg border border-gray-100 bg-white p-3">
              <View className="mb-1 flex-row items-center gap-2">
                <Text className="text-xs font-medium text-gray-900">{review.name}</Text>
                <Text className="text-xs text-amber-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </Text>
                <Text className="ml-auto text-[10px] text-gray-400">{review.date}</Text>
              </View>
              <Text className="text-xs text-gray-600">{review.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-4">
        <Text className="mb-2 text-sm font-medium text-gray-900">날짜 선택</Text>
        <View className="rounded-xl bg-gray-50 p-3">
          <Text className="mb-2 text-center text-xs font-medium text-gray-900">2026년 5월</Text>
          <View className="mb-1 flex-row">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <Text key={day} className="flex-1 text-center text-[9px] text-gray-400">{day}</Text>
            ))}
          </View>
          <View className="flex-row flex-wrap">
            {Array.from({ length: 5 }).map((_, index) => (
              <View key={`empty-${index}`} className="w-[14.285%]" />
            ))}
            {Array.from({ length: 31 }).map((_, index) => {
              const day = index + 1;
              const available = availableDates.includes(day);
              const selected = selectedDate === day;
              return (
                <Pressable
                  key={day}
                  className={`my-0.5 w-[14.285%] rounded py-1 ${
                    selected
                      ? available
                        ? "bg-brand-500"
                        : "bg-gray-300"
                      : available
                      ? "bg-brand-50"
                      : "bg-transparent"
                  }`}
                  onPress={() => setSelectedDate(day)}
                >
                  <Text
                    className={`text-center text-[11px] ${
                      selected ? "font-bold text-white" : available ? "font-medium text-brand-500" : "text-gray-400"
                    }`}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text className="mb-2 mt-3 text-sm font-medium text-gray-900">시간 선택</Text>
        {!availableDates.includes(selectedDate) ? (
          <Text className="mb-1.5 text-[10px] text-red-500">선택한 날짜는 예약 불가입니다. 다른 날짜를 선택해주세요.</Text>
        ) : null}
        <View className="flex-row flex-wrap gap-1.5">
          {timeOptions.map((time) => {
            const disabled = !availableDates.includes(selectedDate) || bookedTimes.includes(time);
            const selected = selectedTime === time;
            return (
              <Pressable
                key={time}
                disabled={disabled}
                className={`w-[23%] rounded-lg py-2 ${
                  disabled ? "bg-gray-200" : selected ? "bg-brand-500" : "bg-gray-100"
                }`}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  className={`text-center text-xs ${
                    disabled ? "text-gray-300 line-through" : selected ? "font-bold text-white" : "text-gray-600"
                  }`}
                >
                  {time}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text className="mt-4 text-xs text-gray-500">{describeDeposit(studio.deposit)}</Text>

      <View className="mt-4 flex-row gap-2">
        <Pressable
          className="h-12 w-14 items-center justify-center rounded-xl border border-gray-300"
          onPress={() => Linking.openURL(`tel:${studio.phone}`)}
        >
          <Ionicons name="call-outline" size={18} color="#6b7280" />
        </Pressable>
        <Pressable
          className="h-12 flex-1 items-center justify-center rounded-xl bg-brand-500"
          onPress={() =>
            router.push({
              pathname: "/booking/[studioId]",
              params: {
                studioId: studio.id,
                packageId: selectedPackage?.id ?? studio.packages[0]?.id ?? "",
                date: `2026-05-${String(selectedDate).padStart(2, "0")}`,
                time: selectedTime,
                addons: selectedAddons.join(","),
                options: selectedOptions.join(","),
              },
            })
          }
        >
          <Text className="text-sm font-bold text-white">예약하기</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
