import { useLocalSearchParams } from "expo-router";
import { ConsumerBookingsScreen } from "@/features/consumer/screens/ConsumerBookingsScreen";

export default function ConsumerBookingsRoute() {
  const { filter } = useLocalSearchParams<{ filter?: "예정" | "완료" | "취소" }>();

  return <ConsumerBookingsScreen initialFilter={filter} />;
}
