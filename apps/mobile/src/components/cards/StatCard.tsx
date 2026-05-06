import { Text, View } from "react-native";

type Props = {
  label: string;
  value: string;
  tone?: "brand" | "success" | "warning";
};

const toneClassMap = {
  brand: "border-brand-100 bg-brand-50",
  success: "border-success-50 bg-success-50",
  warning: "border-warning-50 bg-warning-50",
};

export function StatCard({ label, value, tone = "brand" }: Props) {
  return (
    <View className={`rounded-2xl border p-4 ${toneClassMap[tone]}`}>
      <Text className="text-xs text-gray-500">{label}</Text>
      <Text className="mt-2 text-xl font-bold text-gray-900">{value}</Text>
    </View>
  );
}
