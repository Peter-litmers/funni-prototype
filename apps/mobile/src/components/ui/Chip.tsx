import { Pressable, Text } from "react-native";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function Chip({ label, active = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "rounded-full border px-3 py-2",
        active ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white",
      )}
    >
      <Text
        className={cn(
          "text-xs font-medium",
          active ? "text-brand-500" : "text-gray-600",
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
