import { ConsumerHomeScreen } from "@/features/consumer/screens/ConsumerHomeScreen";
import { BusinessDashboardScreen } from "@/features/business/screens/BusinessDashboardScreen";
import { useRole } from "@/features/shared/hooks/useRole";

export default function HomeTab() {
  const [role] = useRole();

  return role === "business" ? <BusinessDashboardScreen /> : <ConsumerHomeScreen />;
}
