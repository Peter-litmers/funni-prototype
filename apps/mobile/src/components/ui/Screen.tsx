import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  scroll?: boolean;
};

export function Screen({ children, scroll = true }: Props) {
  if (!scroll) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 bg-white px-4 pb-4">{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical
        bounces
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 140 }}
      >
        <View>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
