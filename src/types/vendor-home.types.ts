export interface VendorHomeData {
  totalBuildings: number;
  totalSpaces: number;
  completedBookingsCount: number;
  totalRevenue: number;
  monthlyBookings: {
    revenue:number;
    bookings:number;
    month:string;
  };
  completedBookings: Array<{
    _id: string;
    clientId: string;
    spaceId: string;
    buildingId: string;
    bookingDate: Date;
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
  month: string;
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
  className?: string;
};