export interface LogInProps {
  username: string;
  password?: string;
}

export interface UserData extends LogInProps {
  _id?: string;
  role: "admin" | "staff" | "manager";
  allowedPages: string[];
  fullName: string;
}
