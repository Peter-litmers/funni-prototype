import { useLocalSearchParams } from "expo-router";
import { BusinessBookingDetailScreen } from "@/features/business/screens/BusinessBookingDetailScreen";
import { useBookings } from "@/features/shared/hooks/useBookings";

export default function BusinessBookingDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookings } = useBookings();
  const booking = bookings.find((item) => item.id === id) ?? null;

  return <BusinessBookingDetailScreen booking={booking} />;
}
