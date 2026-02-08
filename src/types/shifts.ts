import { UserData } from "./users";

export interface IShiftData {
  _id?: string;
  staffId: string | UserData;
  startTime: Date;
  endTime?: Date;
  openingBalance: number;
  totalCashSales: number;
  totalCardSales: number;
  totalDigitalSales: number;
  actualCashAtClose?: number;
  status: "Open" | "Closed";
  createdAt?: Date;
  updatedAt?: Date;
}
