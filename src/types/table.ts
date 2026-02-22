export interface TableData {
  _id?: string;
  number: string;
  capacity: number;
  status: "Available" | "Occupied" | "Reserved";
  reservationId?: {
    _id: string;
    customerName: string;
    customerPhone: string;
    menuItems?: Array<{
      itemId:
        | string
        | {
            _id?: string;
            name?: { en: string; ar: string };
            price?: number;
          };
      quantity: number;
    }>;
  };
  createdAt?: string;
  updatedAt?: string;
}
