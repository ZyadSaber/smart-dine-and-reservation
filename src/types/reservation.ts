export interface ReservationData {
  _id?: string;
  customerName: string;
  customerPhone: string;
  startTime: string;
  endTime: string;
  date: Date;
  partySize: number;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  reservedBy: "Website" | "CallCenter" | "WalkIn";
  staffId?: string; // Optional if not always assigned
  menuItems?: { itemId: string; quantity: number }[];
  createdAt?: Date;
}
