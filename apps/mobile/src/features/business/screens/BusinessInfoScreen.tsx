import { Pressable, Text, TextInput, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";

function Field({ label, value, editable = true }: { label: string; value: string; editable?: boolean }) {
  return (
    <View>
      <Text className="mb-1 text-xs text-gray-500">{label}</Text>
      <TextInput
        defaultValue={value}
        editable={editable}
        className={`rounded-xl border border-gray-200 px-4 py-2.5 text-sm ${
          editable ? "bg-gray-50 text-gray-900" : "bg-gray-100 text-gray-500"
        }`}
      />
    </View>
  );
}

export function BusinessInfoScreen() {
  return (
    <Screen>
      <TopBar title="업체 기본정보 수정" showBack />
      <View className="gap-3">
        <Field label="업체명" value="루미에르 스튜디오" />
        <Field label="대표자명" value="김사장" />
        <Field label="사업자등록번호" value="123-45-67890" editable={false} />
        <Field label="연락처" value="02-1234-5678" />
        <Field label="이메일" value="lumiere@example.com" />
      </View>
      <Pressable className="mt-6 items-center rounded-xl bg-brand-500 py-3" onPress={() => {}}>
        <Text className="text-sm font-bold text-white">저장</Text>
      </Pressable>
    </Screen>
  );
}
