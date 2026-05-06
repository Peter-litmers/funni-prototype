import { useLocalSearchParams } from "expo-router";
import { ConsumerBookingScreen } from "@/features/consumer/screens/ConsumerBookingScreen";
import { useStudios } from "@/features/shared/hooks/useStudios";

export default function BookingRoute() {
  const { studioId, packageId, date, time, addons, options } = useLocalSearchParams<{
    studioId: string;
    packageId?: string;
    date?: string;
    time?: string;
    addons?: string;
    options?: string;
  }>();
  const studios = useStudios();
  const studio = studios.find((item) => item.id === studioId) ?? null;

  return (
    <ConsumerBookingScreen
      studio={studio}
      initialPackageId={packageId}
      initialDate={date}
      initialTime={time}
      initialAddons={addons}
      initialOptions={options}
    />
  );
}
