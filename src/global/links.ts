import {
  LayoutDashboard,
  Utensils,
  Package,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

export const menuItems = [
  {
    icon: LayoutDashboard,
    label: "dashboard",
    href: "/management/dashboard",
    description: "Monitor your restaurant's performance and key metrics.",
  },
  {
    icon: Utensils,
    label: "pos",
    href: "/management/pos",
    description: "Take orders, manage tables, and process payments.",
  },
  {
    icon: Package,
    label: "menu",
    href: "/management/menu",
    description: "Manage your menu, categories, and stock levels.",
  },
  {
    icon: CalendarDays,
    label: "reservations",
    href: "/management/reservations",
    description: "View and organize upcoming guest bookings.",
  },
  {
    icon: Users,
    label: "users",
    href: "/management/users",
    description: "Manage staff accounts, roles, and system access.",
  },
  {
    icon: BarChart3,
    label: "reports",
    href: "/management/reports",
    description: "Analyze sales data and generate business insights.",
  },
  {
    icon: Settings,
    label: "settings",
    href: "/management/settings",
    description: "Configure your restaurant's profile and preferences.",
  },
];

export const availablePages = [
  { label: "Home", href: "/management" },
  ...menuItems.map((item) => ({ label: item.label, href: item.href })),
];
