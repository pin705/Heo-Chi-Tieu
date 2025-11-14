export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string; // Zalo icon name like "zi-home", "zi-clock", etc.
  color: string; // hex color
  type: "income" | "expense";
}

export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: "food",
    name: "Ăn uống",
    icon: "zi-home",
    color: "#ef4444",
    type: "expense",
  },
  {
    id: "transport",
    name: "Di chuyển",
    icon: "zi-location",
    color: "#f59e0b",
    type: "expense",
  },
  {
    id: "shopping",
    name: "Mua sắm",
    icon: "zi-bag",
    color: "#ec4899",
    type: "expense",
  },
  {
    id: "entertainment",
    name: "Giải trí",
    icon: "zi-play",
    color: "#8b5cf6",
    type: "expense",
  },
  {
    id: "bills",
    name: "Hóa đơn",
    icon: "zi-note",
    color: "#06b6d4",
    type: "expense",
  },
  {
    id: "health",
    name: "Sức khỏe",
    icon: "zi-heart",
    color: "#10b981",
    type: "expense",
  },
  {
    id: "education",
    name: "Giáo dục",
    icon: "zi-bookmark",
    color: "#3b82f6",
    type: "expense",
  },
  {
    id: "other-expense",
    name: "Khác",
    icon: "zi-more-grid",
    color: "#6b7280",
    type: "expense",
  },
];

export const DEFAULT_INCOME_CATEGORIES: ExpenseCategory[] = [
  {
    id: "salary",
    name: "Lương",
    icon: "zi-coin",
    color: "#10b981",
    type: "income",
  },
  {
    id: "bonus",
    name: "Thưởng",
    icon: "zi-star",
    color: "#f59e0b",
    type: "income",
  },
  {
    id: "gift",
    name: "Quà tặng",
    icon: "zi-gift",
    color: "#ec4899",
    type: "income",
  },
  {
    id: "investment",
    name: "Đầu tư",
    icon: "zi-poll",
    color: "#3b82f6",
    type: "income",
  },
  {
    id: "other-income",
    name: "Khác",
    icon: "zi-more-grid",
    color: "#6b7280",
    type: "income",
  },
];
