export interface VendorHomeData {
  totalBuildings: number;
  totalSpaces: number;
  completedBookingsCount: number;
  totalRevenue: number;
  completedBookings: Array<{
    _id: string;
    bookingId: string;
    clientId: string;
    spaceId: string;
    buildingId: string;
    bookingDates: Date[];
    status: string;
    totalPrice: number;
    numberOfDesks:number;
    client:{
      username:string;
      email:string;
    },
    space:{
      name:string;
      pricePerDay:number;
    },
    building:{
      buildingName:string;
      location:{
        name:string;
        displayName:string;
      }
    }
  }>;
  buildingIdsAndName:{
    _id: string,
    name: string,
  }[];
}

//revenur chart component
export type RevenueDataPoint = {
  month?: string;
  date?: string;
  hour?: string;
  revenue: number;
  bookings: number;
};

export type RevenueChartProps = {
  data: RevenueDataPoint[];
  title?: string;
  height?: number;
  showLegend?: boolean;
  primaryLine?: {
    dataKey: keyof RevenueDataPoint;
    stroke: string;
    label: string;
  };
  secondaryLine?: {
    dataKey: keyof RevenueDataPoint;
    stroke: string;
    label: string;
  };
  xAxisKey?: string;
  className?: string;
};