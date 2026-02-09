import { MenuManagementItem } from "@/types/menu";

export type PaymentMethod = "Cash" | "Card" | "InstaPay" | "E-wallet" | "";

export interface OrderItemData {
  itemId: string;
  name: {
    en: string;
    ar: string;
  };
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface CreateOrderData {
  tableId?: string;
  items: OrderItemData[];
  paymentMethod: PaymentMethod;
  totalAmount: number;
  notes?: string;
  _id?: string;
  reservationId?: string;
  shiftId?: string;
  staffId?: string;
  status?: string;
  orderType?: string;
  isPaid?: boolean;
}

export interface OrderResponse {
  _id?: string;
  shiftId: string;
  staffId: string;
  tableId?: string;
  reservationId?: string;
  items: OrderItemData[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export interface POSCartItem extends OrderItemData {
  // Add extra properties for UI if needed (e.g., category name, local name)
  categoryName?: string;
}

export interface POSFormData {
  [key: string]: unknown;
  tableId?: string;
  reservationId?: string;
  items: POSCartItem[];
  paymentMethod: PaymentMethod;
  totalAmount: number;
  notes?: string;
}

export interface ActiveMenuItem extends MenuManagementItem {
  quantity: number;
}
