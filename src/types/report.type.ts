export type ReportEntry = {
  bookingId: string;
  clientId: { _id: string; username: string };
  spaceId: { _id: string; name: string };
  buildingId: { _id: string; buildingName: string };
  totalPrice?: number;
  numberOfDesks?: number;
  bookingDates: Date[];
  paymentMethod?: string;
};

export type AdminReportEntry = ReportEntry & {
  adminRevenue: number;
}