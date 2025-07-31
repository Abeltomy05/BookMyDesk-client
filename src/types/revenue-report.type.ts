// admin revenue report

export interface AdminRevenueReportItem {
  bookingId: string;
  clientId: {
    _id: string;
    username: string;
  };
  spaceId: {
    _id: string;
    name: string;
  };
  buildingId: {
    _id: string;
    buildingName: string;
  };
  totalPrice: number;
  numberOfDesks: number;
  bookingDate: string;
  paymentMethod: string;
  adminRevenue: number;
}

export interface AdminRevenueReportResponse {
  totalAdminRevenue: number;
  bookings: AdminRevenueReportItem[];
}