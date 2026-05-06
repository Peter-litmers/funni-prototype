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
      balanceDueDate: `${input.date} 23:59`,
      balancePaid: payment.balanceAmount === 0,
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

  async requestCancel(
    id: string,
    reason = "예약하신 스튜디오와 포토팟이 확인합니다. 구체적으로 작성 부탁드립니다.",
    refund?: { rate: number; amount: number },
  ) {
    updateMockState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status: "cancelRequested",
              cancelReason: reason,
              refundRate: refund?.rate ?? 50,
              expectedRefundAmount: refund?.amount ?? Math.round(booking.amount * 0.5),
            }
          : booking,
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

  async acceptCancelRequest(id: string) {
    updateMockState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status: "cancelled",
              refundRate: booking.refundRate ?? 100,
              expectedRefundAmount: booking.expectedRefundAmount ?? booking.amount,
            }
          : booking,
      ),
      notifications: [
        {
          id: `notification-${Date.now()}`,
          role: "consumer",
          type: "cancel",
          title: "예약 취소가 승인되었어요",
          body: "업체가 취소 요청을 승인했습니다. 환불 내역을 확인해 주세요.",
          timeLabel: "방금 전",
          read: false,
          bookingId: id,
          route: "/bookings",
        },
        ...current.notifications,
      ],
    }));
  },

  async rejectCancelRequest(id: string) {
    updateMockState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status: "confirmed",
              cancelReason: undefined,
              refundRate: undefined,
              expectedRefundAmount: undefined,
            }
          : booking,
      ),
      notifications: [
        {
          id: `notification-${Date.now()}`,
          role: "consumer",
          type: "booking",
          title: "예약 취소 요청이 거절되었어요",
          body: "업체가 예약 유지를 안내했습니다. 예약 상세를 확인해 주세요.",
          timeLabel: "방금 전",
          read: false,
          bookingId: id,
          route: "/bookings",
        },
        ...current.notifications,
      ],
    }));
  },

  async cancelByBusiness(id: string) {
    updateMockState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status: "cancelled",
              cancelReason: "업체 사유로 예약 취소",
              refundRate: 100,
              expectedRefundAmount: booking.amount,
            }
          : booking,
      ),
      notifications: [
        {
          id: `notification-${Date.now()}`,
          role: "consumer",
          type: "cancel",
          title: "업체 사유로 예약이 취소되었어요",
          body: "결제 금액은 100% 환불 처리됩니다.",
          timeLabel: "방금 전",
          read: false,
          bookingId: id,
          route: "/bookings",
        },
        ...current.notifications,
      ],
    }));
  },

  async payBalance(id: string) {
    updateMockState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === id ? { ...booking, balancePaid: true } : booking,
      ),
      notifications: [
        {
          id: `notification-${Date.now()}`,
          role: "consumer",
          type: "booking",
          title: "잔금 결제가 완료되었어요",
          body: "촬영 전 결제가 완료되었습니다.",
          timeLabel: "방금 전",
          read: false,
          bookingId: id,
          route: "/bookings",
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
