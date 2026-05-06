import { useRouter } from "expo-router";
import { NotificationCard } from "@/components/cards/NotificationCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { useNotifications } from "@/features/shared/hooks/useNotifications";

export default function NotificationsRoute() {
  const router = useRouter();
  const { currentRoleNotifications, markRead } = useNotifications();

  return (
    <Screen>
      <TopBar title="알림" showBack />
      {currentRoleNotifications.length === 0 ? (
        <EmptyState title="알림이 없어요" body="새 예약이나 상태 변경이 생기면 이곳에 표시됩니다." />
      ) : (
        currentRoleNotifications.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            onPress={() => {
              markRead(item.id);
              if (item.route) {
                router.push(item.route);
              }
            }}
          />
        ))
      )}
    </Screen>
  );
}
