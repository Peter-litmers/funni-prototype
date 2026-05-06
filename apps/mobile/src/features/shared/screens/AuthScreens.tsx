import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";

function Field({ label, placeholder, secure = false }: { label: string; placeholder: string; secure?: boolean }) {
  return (
    <View>
      <Text className="mb-1 text-xs text-gray-500">{label}</Text>
      <TextInput
        secureTextEntry={secure}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900"
      />
    </View>
  );
}

function AgreementRow({
  label,
  checked,
  onPress,
  showView = true,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
  showView?: boolean;
}) {
  return (
    <Pressable className="flex-row items-center gap-2" onPress={onPress}>
      <View className={`h-4 w-4 items-center justify-center rounded border ${checked ? "border-brand-500 bg-brand-500" : "border-gray-300 bg-white"}`}>
        {checked ? <Ionicons name="checkmark" size={11} color="#fff" /> : null}
      </View>
      <Text className="flex-1 text-xs text-gray-700">
        <Text className="text-red-500">*</Text> {label}
      </Text>
      {showView ? <Text className="text-[10px] text-gray-400 underline">보기</Text> : null}
    </Pressable>
  );
}

export function LoginScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View className="items-center pt-12">
        <View className="mb-3 h-[88px] w-[88px] items-center justify-center rounded-3xl bg-brand-50">
          <Ionicons name="camera-outline" size={48} color="#ec4899" />
        </View>
        <Text className="mb-2 text-3xl font-bold text-brand-500">포토팟</Text>
        <Text className="mb-10 text-xs text-gray-400">스튜디오 대관·예약 플랫폼</Text>
      </View>

      <View className="gap-2">
        <Pressable className="items-center rounded-xl bg-[#FEE500] py-3" onPress={() => router.replace("/(tabs)/home")}>
          <Text className="text-sm font-bold text-[#191919]">카카오로 시작하기</Text>
        </Pressable>
        <Pressable className="items-center rounded-xl bg-[#03C75A] py-3" onPress={() => router.replace("/(tabs)/home")}>
          <Text className="text-sm font-bold text-white">네이버로 시작하기</Text>
        </Pressable>
      </View>

      <View className="my-6 flex-row items-center gap-4">
        <View className="h-px flex-1 bg-gray-200" />
        <Text className="text-xs text-gray-400">또는</Text>
        <View className="h-px flex-1 bg-gray-200" />
      </View>

      <View className="gap-2">
        <TextInput
          placeholder="이메일"
          placeholderTextColor="#9ca3af"
          className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900"
        />
        <TextInput
          secureTextEntry
          placeholder="비밀번호"
          placeholderTextColor="#9ca3af"
          className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900"
        />
      </View>

      <View className="mt-4">
        <Button label="로그인" onPress={() => router.replace("/(tabs)/home")} />
      </View>

      <View className="mt-4 flex-row items-center justify-center gap-4">
        <Pressable onPress={() => router.push("/signup")}>
          <Text className="text-xs text-gray-400">회원가입</Text>
        </Pressable>
        <Text className="text-xs text-gray-300">|</Text>
        <Pressable onPress={() => router.push("/forgot-password")}>
          <Text className="text-xs text-gray-400">비밀번호 찾기</Text>
        </Pressable>
      </View>

      <View className="mt-8">
        <Button label="업체 회원가입" variant="secondary" onPress={() => router.push("/biz-signup")} />
      </View>
    </Screen>
  );
}

export function SignupScreen() {
  const router = useRouter();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const enabled = agreeTerms && agreePrivacy;

  return (
    <Screen>
      <TopBar title="회원가입" showBack />
      <Text className="mb-6 text-xs text-gray-400">소비자 계정</Text>
      <View className="gap-3">
        <Field label="이름" placeholder="홍길동" />
        <Field label="닉네임 (앱 내 표시)" placeholder="포토팟유저" />
        <Field label="이메일" placeholder="email@example.com" />
        <Field label="비밀번호" placeholder="8자 이상" secure />
      </View>

      <View className="my-4 gap-2 rounded-xl bg-gray-50 p-3">
        <AgreementRow label="서비스 이용약관 동의" checked={agreeTerms} onPress={() => setAgreeTerms((value) => !value)} />
        <AgreementRow label="개인정보 처리방침 동의" checked={agreePrivacy} onPress={() => setAgreePrivacy((value) => !value)} />
      </View>

      <Text className="mb-3 text-xs text-gray-400">또는 SNS로 가입</Text>
      <View className="gap-2">
        <Pressable className="items-center rounded-xl bg-[#FEE500] py-3">
          <Text className="text-sm font-bold text-[#191919]">카카오로 가입</Text>
        </Pressable>
        <Pressable className="items-center rounded-xl bg-[#03C75A] py-3">
          <Text className="text-sm font-bold text-white">네이버로 가입</Text>
        </Pressable>
        <Pressable className="items-center rounded-xl border border-gray-200 bg-white py-3">
          <Text className="text-sm font-bold text-gray-700">G 구글로 가입</Text>
        </Pressable>
      </View>

      <View className="mt-6">
        <Button label="가입 완료" disabled={!enabled} onPress={() => router.replace("/(tabs)/home")} />
      </View>
    </Screen>
  );
}

export function BusinessSignupScreen() {
  const router = useRouter();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const requiredAgreed = agreeTerms && agreePrivacy && agreeAge;
  const allAgreed = requiredAgreed && agreeMarketing;
  const toggleAll = () => {
    const next = !allAgreed;
    setAgreeTerms(next);
    setAgreePrivacy(next);
    setAgreeAge(next);
    setAgreeMarketing(next);
  };

  return (
    <Screen>
      <TopBar title="업체 회원가입" showBack />
      <Text className="mb-6 text-xs text-gray-400">사업자 계정 · 승인 후 이용 가능</Text>
      <View className="gap-3">
        <Field label="이메일" placeholder="biz@example.com" />
        <Field label="비밀번호" placeholder="8자 이상 + 영문·숫자" secure />
        <Field label="비밀번호 확인" placeholder="비밀번호 재입력" secure />
        <Field label="사업자등록번호" placeholder="000-00-00000" />
        <Field label="대표자명" placeholder="홍길동" />
        <Field label="사업장 주소" placeholder="주소 검색을 눌러 도로명 주소를 선택하세요" />
        <Field label="상세 주소" placeholder="상세 주소 (동/호수, 선택)" />
        <Field label="연락처" placeholder="02-0000-0000" />
      </View>

      <View className="my-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
        <Text className="mb-1 text-xs font-bold text-emerald-800">정산 입금 계좌</Text>
        <Text className="mb-3 text-[10px] leading-5 text-emerald-700">
          포토팟이 매월 정산금을 입금할 계좌입니다. 본인 명의 또는 사업자 명의 계좌로 등록해주세요.
        </Text>
        <View className="gap-2.5">
        <Field label="정산 은행" placeholder="예: 국민은행" />
        <Field label="정산 계좌번호" placeholder="정산금을 입금받을 계좌" />
        <Field label="예금주명" placeholder="사업자명 또는 대표자명" />
        </View>
      </View>

      <View className="my-4">
        <Text className="mb-2 text-xs text-gray-500">스튜디오/작업물 사진 업로드</Text>
        <View className="flex-row gap-2">
          <View className="aspect-square flex-1 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-100">
            <Text className="text-xl text-gray-400">+</Text>
          </View>
          {[1, 2, 3].map((item) => (
            <View key={item} className="aspect-square flex-1 rounded-xl bg-gray-100" />
          ))}
        </View>
        <Text className="mt-1 text-[10px] text-gray-400">심사 시 활용됩니다</Text>
      </View>

      <View className="mb-4 gap-2 rounded-xl bg-gray-50 p-3">
        <Pressable className="mb-1 flex-row items-center gap-2 border-b border-gray-200 pb-2" onPress={toggleAll}>
          <View className={`h-4 w-4 items-center justify-center rounded border ${allAgreed ? "border-brand-500 bg-brand-500" : "border-gray-300 bg-white"}`}>
            {allAgreed ? <Ionicons name="checkmark" size={11} color="#fff" /> : null}
          </View>
          <Text className="flex-1 text-xs font-bold text-gray-800">모두 동의 (선택 항목 포함)</Text>
        </Pressable>
        <AgreementRow label="서비스 이용약관 동의" checked={agreeTerms} onPress={() => setAgreeTerms((value) => !value)} showView={false} />
        <AgreementRow label="개인정보 처리방침 동의" checked={agreePrivacy} onPress={() => setAgreePrivacy((value) => !value)} showView={false} />
        <AgreementRow label="만 14세 이상 확인" checked={agreeAge} onPress={() => setAgreeAge((value) => !value)} showView={false} />
        <Pressable className="flex-row items-center gap-2" onPress={() => setAgreeMarketing((value) => !value)}>
          <View className={`h-4 w-4 items-center justify-center rounded border ${agreeMarketing ? "border-brand-500 bg-brand-500" : "border-gray-300 bg-white"}`}>
            {agreeMarketing ? <Ionicons name="checkmark" size={11} color="#fff" /> : null}
          </View>
          <Text className="flex-1 text-xs text-gray-700">마케팅 정보 수신 동의 (선택)</Text>
        </Pressable>
      </View>

      <Button label="가입 신청" disabled={!requiredAgreed} onPress={() => router.replace("/approval-waiting")} />
      <View className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <Text className="mb-1 text-xs font-bold text-amber-700">승인 안내</Text>
        <Text className="text-[10px] leading-5 text-amber-600">심사는 2~3일 소요될 수 있습니다.</Text>
        <Text className="text-[10px] leading-5 text-amber-600">전화 확인이 진행될 수 있으니 전화를 받아주세요.</Text>
        <Text className="text-[10px] leading-5 text-amber-600">결과는 등록하신 이메일로 안내됩니다.</Text>
      </View>
    </Screen>
  );
}

export function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <Screen>
      <TopBar title="비밀번호 찾기" showBack />
      <Text className="mb-8 text-xs text-gray-400">가입 시 사용한 이메일로 재설정 링크를 발송합니다</Text>
      <Field label="이메일" placeholder="email@example.com" />
      <View className="mt-6">
        <Button label="비밀번호 재설정 링크 발송" onPress={() => router.back()} />
      </View>
      <Text className="mt-4 text-center text-[10px] text-gray-400">입력한 이메일로 비밀번호 재설정 링크가 전송됩니다</Text>
    </Screen>
  );
}

export function ApprovalWaitingScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View className="min-h-[450px] items-center justify-center px-2">
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-amber-50">
          <Text className="text-4xl">⏳</Text>
        </View>
        <Text className="mb-2 text-lg font-bold text-gray-900">승인 대기 중</Text>
        <Text className="mb-6 text-center text-sm text-gray-500">제출하신 정보를 검토 중입니다</Text>

        <View className="mb-6 w-full rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Text className="mb-2 text-xs font-bold text-amber-700">심사 안내</Text>
          <Text className="text-[10px] leading-5 text-amber-600">• 사업자등록번호 및 포트폴리오를 검토합니다</Text>
          <Text className="text-[10px] leading-5 text-amber-600">• 영업일 기준 1~3일 소요됩니다</Text>
          <Text className="text-[10px] leading-5 text-amber-600">• 결과는 등록하신 이메일로 안내됩니다</Text>
          <Text className="text-[10px] leading-5 text-amber-600">• 승인 완료 후 스튜디오 등록이 가능합니다</Text>
        </View>

        <Button label="홈으로 돌아가기" onPress={() => router.replace("/(tabs)/home")} />
      </View>
    </Screen>
  );
}
