export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "failed" ;
export type PaymentStatus = "unpaid" | "pending" | "succeeded" | "failed" | "refunded";
export type PaymentMethod = "stripe" | "wallet";

export interface BookingData{
    _id: string;
    
    bookingDate: Date;
    numberOfDesks?: number;
    totalPrice?: number;
    
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    
    transactionId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    building?: {
      buildingName: string;
      location?: {
        type?: string;
        name?: string;
        displayName?: string;
        zipCode?: string;
        coordinates?: number[];
    };
    };
    space?: {
        name: string;
        pricePerDesk: number;
    };
  client?: {
    username: string;
    email: string;
    phone: string;
  };
}