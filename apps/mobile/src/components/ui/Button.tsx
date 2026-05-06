import { Pressable, Text } from "react-native";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={cn(
        "items-center justify-center rounded-xl px-4 py-3",
        variant === "primary" && "bg-brand-500",
        variant === "secondary" && "border border-brand-100 bg-brand-50",
        variant === "ghost" && "bg-gray-100",
        disabled && "opacity-50",
      )}
    >
      <Text
        className={cn(
          "text-sm font-bold",
          variant === "primary" ? "text-white" : "text-gray-900",
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
