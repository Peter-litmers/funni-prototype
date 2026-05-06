import type { Notification } from "@funni/domain";

export const notificationsFixture: Notification[] = [
  {
    id: "notification-1",
    role: "consumer",
    type: "booking",
    title: "예약이 확정되었어요",
    body: "루미에르 스튜디오 5/10 14:00 예약이 확정되었습니다.",
    timeLabel: "10분 전",
    read: false,
    bookingId: "booking-1",
    route: "/bookings",
  },
  {
    id: "notification-2",
    role: "business",
    type: "cancel",
    title: "취소 요청이 접수되었어요",
    body: "블룸 웨딩 스튜디오 예약 취소 요청을 확인하세요.",
    timeLabel: "30분 전",
    read: false,
    bookingId: "booking-3",
    route: "/biz/bookings/booking-3",
  },
  {
    id: "notification-3",
    role: "business",
    type: "review",
    title: "새 리뷰가 도착했어요",
    body: "루미에르 스튜디오에 새로운 리뷰가 등록되었습니다.",
    timeLabel: "2시간 전",
    read: true,
    route: "/biz/dashboard",
  },
];
