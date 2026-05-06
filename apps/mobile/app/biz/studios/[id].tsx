import { useLocalSearchParams } from "expo-router";
import { BusinessStudioDetailScreen } from "@/features/business/screens/BusinessStudioDetailScreen";
import { useBusinessStudios } from "@/features/business/hooks/useBusinessStudios";

export default function BusinessStudiosDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById } = useBusinessStudios();
  const studio = getById(id);

  return <BusinessStudioDetailScreen studio={studio} />;
}
