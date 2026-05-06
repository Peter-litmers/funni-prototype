import { Text, View } from "react-native";

type Props = {
  title: string;
  body: string;
};

export function EmptyState({ title, body }: Props) {
  return (
    <View className="rounded-2xl bg-white px-4 py-10">
      <Text className="text-center text-base font-bold text-gray-900">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-6 text-gray-500">{body}</Text>
    </View>
  );
}
