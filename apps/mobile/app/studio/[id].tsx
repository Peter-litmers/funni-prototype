import { useLocalSearchParams } from "expo-router";
import { ConsumerStudioDetailScreen } from "@/features/consumer/screens/ConsumerStudioDetailScreen";
import { useStudios } from "@/features/shared/hooks/useStudios";

export default function StudioDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const studios = useStudios();
  const studio = studios.find((item) => item.id === id) ?? null;

  return <ConsumerStudioDetailScreen studio={studio} />;
}
