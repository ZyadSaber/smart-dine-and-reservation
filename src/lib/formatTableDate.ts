import { format } from "date-fns";

export const formatTableDate = (date: Date | string) => {
  if (!date) return "N/A";
  return format(new Date(date), "MMM dd, yyyy");
};
