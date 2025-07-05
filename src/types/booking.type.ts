export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "failed" ;
export type PaymentStatus = "unpaid" | "pending" | "succeeded" | "failed" | "refunded";
export type PaymentMethod = "stripe" | "wallet";

export interface BookingData{
    _id: string;
    spaceId: string;
    buildingId: string;
    bookingDate: Date;
    numberOfDesks?: number;
    totalPrice?: number;
    discountAmount?: number;
    
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    
    transactionId?: string;
    cancellationReason?: string;
    cancelledBy?: "vendor" | "client"; 
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
        pricePerDay: number;
    };
  client?: {
    username: string;
    email: string;
    phone: string;
  };
}