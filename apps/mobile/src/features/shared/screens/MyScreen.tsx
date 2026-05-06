import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import type { UserRole } from "@funni/domain";
import { formatWon } from "@funni/domain";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { useRole } from "@/features/shared/hooks/useRole";
import { useStudios } from "@/features/shared/hooks/useStudios";

function nextRole(role: UserRole): UserRole {
  return role === "consumer" ? "business" : "consumer";
}

export function MyScreen() {
  const router = useRouter();
  const [role, setRole] = useRole();
  const studios = useStudios();
  const promotedStudios = studios.slice(0, 4);
  const [profileName, setProfileName] = useState("김포토");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  if (role === "business") {
    const quickMenus = [
      {
        icon: "home-outline" as const,
        title: "스튜디오 관리",
        desc: "등록 · 수정 · 삭제",
        onPress: () => router.push("/biz/studios"),
      },
      {
        icon: "calendar-outline" as const,
        title: "예약 달력",
        desc: "예약 · 수기 일정",
        onPress: () => router.push("/biz/bookings"),
      },
      {
        icon: "business-outline" as const,
        title: "업체 기본정보",
        desc: "기본정보 수정",
        onPress: () => router.push("/biz/info"),
      },
      {
        icon: "wallet-outline" as const,
        title: "정산 요청",
        desc: "월별 정산",
        onPress: () => router.push("/biz/settlement"),
      },
      {
        icon: "bar-chart-outline" as const,
        title: "실적 대시보드",
        desc: "월별 예약 · 매출",
        onPress: () => router.push("/biz/dashboard"),
      },
    ];

    return (
      <Screen>
        <TopBar title="MY" />
        <View className="mb-4 flex-row items-center gap-3 rounded-3xl bg-white p-5">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-50">
            <Text className="text-2xl">🏢</Text>
          </View>
          <View>
            <Text className="text-lg font-bold text-gray-900">루미에르 스튜디오</Text>
            <Text className="mt-1 text-xs text-gray-400">김사장님</Text>
            <Text className="mt-1 rounded-full bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-500">
              업체 모드
            </Text>
          </View>
        </View>

        <View className="mb-2 flex-row flex-wrap gap-2">
          {quickMenus.slice(0, 4).map((item) => (
            <View key={item.title} className="w-[48.5%]">
              <Pressable className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4" onPress={item.onPress}>
                <Ionicons name={item.icon} size={20} color="#374151" />
                <Text className="mt-2 text-sm font-medium text-gray-900">{item.title}</Text>
                <Text className="mt-1 text-[10px] text-gray-400">{item.desc}</Text>
                <View className="mt-3">
                  <Button label="열기" variant="ghost" onPress={item.onPress} />
                </View>
              </Pressable>
            </View>
          ))}
        </View>
        <Pressable className="mb-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4" onPress={quickMenus[4].onPress}>
          <Ionicons name={quickMenus[4].icon} size={20} color="#374151" />
          <Text className="mt-2 text-sm font-medium text-gray-900">{quickMenus[4].title}</Text>
          <Text className="mt-1 text-[10px] text-gray-400">{quickMenus[4].desc}</Text>
          <View className="mt-3">
            <Button label="열기" variant="ghost" onPress={quickMenus[4].onPress} />
          </View>
        </Pressable>

        <View className="mb-4">
          {[
            { label: "리뷰 관리", onPress: () => router.push("/biz/reviews") },
            { label: "로그아웃", onPress: () => router.push("/login") },
          ].map((item) => (
            <Pressable
              key={item.label}
              className="flex-row items-center justify-between border-b border-gray-50 py-3.5"
              onPress={item.onPress}
            >
              <Text className="text-sm text-gray-900">{item.label}</Text>
              <Text className="text-xs text-gray-300">›</Text>
            </Pressable>
          ))}
        </View>

        <View className="rounded-3xl bg-white p-5">
          <Button
            label="알림 보기"
            variant="secondary"
            onPress={() => router.push("/notifications")}
          />
          <View className="mt-3">
            <Button
              label="소비자 모드로 전환"
              variant="ghost"
              onPress={async () => {
                await setRole("consumer");
                router.replace("/(tabs)/home");
              }}
            />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="MY" />
      <View className="mb-6 flex-row items-center gap-3">
        <View className="relative">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-50">
            <Ionicons name="person-outline" size={26} color="#ec4899" />
          </View>
          <View className="absolute -bottom-0.5 -right-0.5 h-5 w-5 items-center justify-center rounded-full bg-brand-500">
            <Ionicons name="camera-outline" size={11} color="#fff" />
          </View>
        </View>
        <View className="flex-1">
          {isEditingProfile ? (
            <View className="flex-row items-center gap-2">
              <TextInput
                value={profileName}
                onChangeText={setProfileName}
                autoFocus
                className="w-24 border-b border-brand-500 px-0 py-0 text-sm font-bold text-gray-900"
              />
              <Pressable
                className="rounded bg-brand-50 px-2 py-1"
                onPress={() => setIsEditingProfile(false)}
              >
                <Text className="text-[10px] font-medium text-brand-500">완료</Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-row items-center gap-2">
              <Text className="font-bold text-gray-900">{profileName}</Text>
              <Pressable onPress={() => setIsEditingProfile(true)}>
                <Ionicons name="pencil-outline" size={12} color="#9ca3af" />
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <View className="-mx-4 mb-5">
        <View className="mb-2.5 flex-row items-center justify-between px-4">
          <View>
            <Text className="text-[10px] text-gray-400">에디터 셀렉션</Text>
            <Text className="text-sm font-bold text-gray-900">요즘 추천하는 스튜디오</Text>
          </View>
          <Pressable onPress={() => router.push({ pathname: "/(tabs)/explore", params: { category: "전체" } })}>
            <Text className="text-[11px] font-medium text-gray-400">전체보기</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingBottom: 4 }}
        >
          {promotedStudios.map((studio) => {
            const featuredPackage = studio.packages.find((item) => item.featured) ?? studio.packages[0];
            return (
              <Pressable
                key={studio.id}
                className="w-28 overflow-hidden rounded-xl border border-gray-100 bg-white"
                onPress={() => router.push(`/studio/${studio.id}`)}
              >
                <View className="relative h-20 items-center justify-center bg-gray-100">
                  <Ionicons name="image-outline" size={20} color="#9ca3af" />
                  <Text className="absolute left-1 top-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[8px] font-semibold text-gray-500">
                    AD
                  </Text>
                  <Text className="absolute right-1 top-1 rounded-full bg-brand-500 px-1.5 py-0.5 text-[8px] font-semibold text-white">
                    {studio.category}
                  </Text>
                </View>
                <View className="p-2">
                  <Text className="text-[11px] font-semibold text-gray-900" numberOfLines={1}>{studio.name}</Text>
                  <Text className="text-[9px] text-gray-400" numberOfLines={1}>{studio.area}</Text>
                  <View className="mt-1 flex-row items-center justify-between">
                    <Text className="text-[10px] font-bold text-gray-900">{formatWon(featuredPackage.price)}</Text>
                    <Text className="text-[9px] text-amber-500">★ {studio.rating}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View>
        {[
          { label: "정보 수정", onPress: () => router.push("/profile-edit") },
          { label: "예약 내역", onPress: () => router.push("/bookings") },
          { label: "리뷰 관리", onPress: () => router.push("/reviews") },
          { label: "결제 내역", onPress: () => router.push("/payments") },
          { label: "고객센터", onPress: () => router.push("/notifications") },
        ].map((item) => (
          <Pressable
            key={item.label}
            className="flex-row items-center justify-between border-b border-gray-50 py-3.5"
            onPress={item.onPress}
          >
            <Text className="text-sm text-gray-900">{item.label}</Text>
            <Text className="text-xs text-gray-300">›</Text>
          </Pressable>
        ))}
        <Pressable
          className="flex-row items-center justify-between border-b border-gray-50 py-3.5"
          onPress={() => router.push("/login")}
        >
          <Text className="text-sm text-gray-900">로그아웃</Text>
          <Text className="text-xs text-gray-300">›</Text>
        </Pressable>
      </View>

      <View className="mt-6">
        <Button
          label="업체 모드로 전환"
          variant="secondary"
          onPress={async () => {
            const targetRole = nextRole(role);
            await setRole(targetRole);
            router.replace("/biz/dashboard");
          }}
        />
      </View>
    </Screen>
  );
}

export function ProfileEditScreen() {
  const router = useRouter();
  const [name, setName] = useState("김포토");
  const [nickname, setNickname] = useState("포토팟유저");
  const [email, setEmail] = useState("kim.photo@example.com");
  const [phone, setPhone] = useState("010-1234-5678");
  const [birth, setBirth] = useState("1995-06-12");
  const [gender, setGender] = useState<"여성" | "남성" | "비공개">("여성");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const passwordMismatch = !!newPassword && !!newPasswordConfirm && newPassword !== newPasswordConfirm;
  const canSave =
    name.trim().length > 0 &&
    nickname.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    phone.replace(/\D/g, "").length >= 10 &&
    !passwordMismatch;

  const Field = ({
    label,
    value,
    onChangeText,
    placeholder,
    secure = false,
  }: {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    secure?: boolean;
  }) => (
    <View>
      <Text className="mb-1 text-xs text-gray-500">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900"
      />
    </View>
  );

  return (
    <Screen>
      <Pressable className="mb-4 self-start" onPress={() => router.back()}>
        <Text className="text-sm text-gray-400">← 돌아가기</Text>
      </Pressable>
      <Text className="text-lg font-bold text-gray-900">정보 수정</Text>
      <Text className="mb-6 mt-1 text-xs leading-5 text-gray-400">
        연락처·이메일은 예약 알림과 환불 안내에 사용됩니다.
      </Text>
      <View className="gap-3">
        <Field label="이름" value={name} onChangeText={setName} placeholder="김포토" />
        <Field label="닉네임 (리뷰에 표시)" value={nickname} onChangeText={setNickname} placeholder="포토팟유저" />
        <Field label="이메일" value={email} onChangeText={setEmail} placeholder="email@example.com" />
        <Field label="연락처" value={phone} onChangeText={setPhone} placeholder="010-0000-0000" />
        <Field label="생년월일" value={birth} onChangeText={setBirth} placeholder="1995-06-12" />
      </View>

      <Text className="mb-2 mt-4 text-xs text-gray-500">성별</Text>
      <View className="flex-row gap-2">
        {(["여성", "남성", "비공개"] as const).map((item) => (
          <Pressable
            key={item}
            className={`flex-1 rounded-xl border py-2 ${gender === item ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white"}`}
            onPress={() => setGender(item)}
          >
            <Text className={`text-center text-xs font-medium ${gender === item ? "text-brand-500" : "text-gray-500"}`}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-5 gap-3 rounded-xl bg-gray-50 p-4">
        <Text className="text-xs font-bold text-gray-700">비밀번호 변경</Text>
        <Text className="text-[10px] text-gray-400">변경하지 않으려면 빈칸으로 두세요.</Text>
        <Field label="현재 비밀번호" value={currentPassword} onChangeText={setCurrentPassword} placeholder="현재 비밀번호" secure />
        <Field label="새 비밀번호" value={newPassword} onChangeText={setNewPassword} placeholder="8자 이상 + 영문·숫자" secure />
        <Field label="새 비밀번호 확인" value={newPasswordConfirm} onChangeText={setNewPasswordConfirm} placeholder="새 비밀번호 확인" secure />
        {passwordMismatch ? (
          <Text className="text-[10px] text-red-500">새 비밀번호가 일치하지 않습니다.</Text>
        ) : null}
      </View>

      <View className="mt-6 flex-row gap-2">
        <Pressable className="flex-1 items-center rounded-xl bg-gray-100 py-3" onPress={() => router.back()}>
          <Text className="text-sm font-medium text-gray-600">취소</Text>
        </Pressable>
        <Pressable
          className={`flex-1 items-center rounded-xl py-3 ${canSave ? "bg-brand-500" : "bg-gray-200"}`}
          disabled={!canSave}
          onPress={() => router.back()}
        >
          <Text className={`text-sm font-bold ${canSave ? "text-white" : "text-gray-400"}`}>저장</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
