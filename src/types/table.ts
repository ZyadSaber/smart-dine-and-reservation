export interface TableData {
  _id?: string;
  number: string;
  capacity: number;
  status: "Available" | "Occupied" | "Reserved";
  createdAt?: string;
  updatedAt?: string;
}
