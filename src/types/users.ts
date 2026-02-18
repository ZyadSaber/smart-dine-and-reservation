export interface LogInProps {
  username: string;
  password?: string;
}

export interface UserData extends LogInProps {
  _id?: string;
  role: "admin" | "staff" | "cashier";
  allowedPages: string[];
  fullName: string;
  shiftId?: string;
}
