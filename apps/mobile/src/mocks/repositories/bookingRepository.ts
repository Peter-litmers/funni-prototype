import {
  buildPaymentSummary,
  calculateDeposit,
  type Booking,
} from "@funni/domain";
import { getMockState, updateMockState } from "../store";

type CreateBookingInput = {
  studioId: string;
  packageId: string;
  date: string;
  time: string;
  amount?: number;
};

function makeBookingId() {
  return `booking-${Date.now()}`;
}

export const bookingRepository = {
  async listForCurrentRole() {
    const { session, bookings } = getMockState();
    if (session.role === "business") return bookings;
    return bookings.filter((booking) => booking.userName === session.userName);
  },

  async getById(id: string) {
    return getMockState().bookings.find((booking) => booking.id === id) ?? null;
  },

  async create(input: CreateBookingInput): Promise<Booking> {
    const studio = getMockState().studios.find((item) => item.id === input.studioId);

    if (!studio) {
      throw new Error("Studio not found");
    }

    const selectedPackage =
      studio.packages.find((item) => item.id === input.packageId) ??
      studio.packages[0];
    const totalAmount = input.amount ?? selectedPackage.price;
    const depositAmount = calculateDeposit(totalAmount, studio.deposit);
    const payment = buildPaymentSummary(totalAmount, depositAmount);

    const nextBooking: Booking = {
      id: makeBookingId(),
      studioId: studio.id,
      studioName: studio.name,
      userName: getMockState().session.userName,
      category: studio.category,
      date: input.date,
      time: input.time,
      amount: payment.amount,
      depositAmount: payment.depositAmount,
      balanceAmount: payment.balanceAmount,
      status: "confirmed",
    };

    updateMockState((current) => ({
      ...current,
      bookings: [nextBooking, ...current.bookings],
      notifications: [
        {
          id: `notification-${Date.now()}`,
          role: "consumer",
          type: "booking",
          title: "예약이 생성되었어요",
          body: `${studio.name} ${input.date} ${input.time} 예약이 등록되었습니다.`,
          timeLabel: "방금 전",
          read: false,
          bookingId: nextBooking.id,
          route: "/bookings",
        },
        ...current.notifications,
      ],
    }));

    return nextBooking;
  },

  async requestCancel(id: string) {
    updateMockState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === id ? { ...booking, status: "cancelRequested" } : booking,
      ),
      notifications: [
        {
          id: `notification-${Date.now()}`,
          role: "business",
          type: "cancel",
          title: "취소 요청이 접수되었어요",
          body: "예약 상세에서 취소 사유와 상태를 확인해 주세요.",
          timeLabel: "방금 전",
          read: false,
          bookingId: id,
          route: `/biz/bookings/${id}`,
        },
        ...current.notifications,
      ],
    }));
  },

  async markCompleted(id: string) {
    updateMockState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === id ? { ...booking, status: "completed" } : booking,
      ),
      notifications: [
        {
          id: `notification-${Date.now()}`,
          role: "consumer",
          type: "review",
          title: "촬영이 완료되었어요",
          body: "사진 전달이 끝났다면 리뷰를 남겨 주세요.",
          timeLabel: "방금 전",
          read: false,
          bookingId: id,
          route: "/bookings",
        },
        ...current.notifications,
      ],
    }));
  },

  async confirmBooking(id: string) {
    updateMockState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === id ? { ...booking, status: "confirmed" } : booking,
      ),
      notifications: [
        {
          id: `notification-${Date.now()}`,
          role: "consumer",
          type: "booking",
          title: "예약이 확정되었어요",
          body: "업체가 예약을 확인해 확정 상태로 변경했습니다.",
          timeLabel: "방금 전",
          read: false,
          bookingId: id,
          route: "/bookings",
        },
        ...current.notifications,
      ],
    }));
  },
};
