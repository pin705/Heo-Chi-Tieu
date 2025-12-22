export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string; // Icon name for custom icons (e.g., "food", "transport", "shopping")
  color: string; // hex color
  type: "income" | "expense";
}

export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: "food",
    name: "Ăn uống",
    icon: "food",
    color: "#ef4444",
    type: "expense",
  },
  {
    id: "transport",
    name: "Di chuyển",
    icon: "transport",
    color: "#f59e0b",
    type: "expense",
  },
  {
    id: "shopping",
    name: "Mua sắm",
    icon: "shopping",
    color: "#ec4899",
    type: "expense",
  },
  {
    id: "entertainment",
    name: "Giải trí",
    icon: "entertainment",
    color: "#8b5cf6",
    type: "expense",
  },
  {
    id: "bills",
    name: "Hóa đơn",
    icon: "bill",
    color: "#06b6d4",
    type: "expense",
  },
  {
    id: "health",
    name: "Sức khỏe",
    icon: "health",
    color: "#10b981",
    type: "expense",
  },
  {
    id: "education",
    name: "Giáo dục",
    icon: "education",
    color: "#3b82f6",
    type: "expense",
  },
  {
    id: "housing",
    name: "Nhà ở",
    icon: "house",
    color: "#059669",
    type: "expense",
  },
  {
    id: "clothing",
    name: "Quần áo",
    icon: "clothing",
    color: "#d946ef",
    type: "expense",
  },
  {
    id: "beauty",
    name: "Làm đẹp",
    icon: "beauty",
    color: "#f472b6",
    type: "expense",
  },
  {
    id: "sports",
    name: "Thể thao",
    icon: "sports",
    color: "#0ea5e9",
    type: "expense",
  },
  {
    id: "travel",
    name: "Du lịch",
    icon: "travel",
    color: "#14b8a6",
    type: "expense",
  },
  {
    id: "communication",
    name: "Liên lạc",
    icon: "phone",
    color: "#3b82f6",
    type: "expense",
  },
  {
    id: "insurance",
    name: "Bảo hiểm",
    icon: "shield",
    color: "#6366f1",
    type: "expense",
  },
  {
    id: "family",
    name: "Gia đình",
    icon: "family",
    color: "#f59e0b",
    type: "expense",
  },
  {
    id: "pets",
    name: "Thú cưng",
    icon: "pets",
    color: "#84cc16",
    type: "expense",
  },
  {
    id: "gifts",
    name: "Quà tặng",
    icon: "gift",
    color: "#f43f5e",
    type: "expense",
  },
  {
    id: "other-expense",
    name: "Khác",
    icon: "other",
    color: "#6b7280",
    type: "expense",
  },
];

export const DEFAULT_INCOME_CATEGORIES: ExpenseCategory[] = [
  {
    id: "salary",
    name: "Lương",
    icon: "salary",
    color: "#10b981",
    type: "income",
  },
  {
    id: "bonus",
    name: "Thưởng",
    icon: "trophy",
    color: "#f59e0b",
    type: "income",
  },
  {
    id: "gift",
    name: "Quà tặng",
    icon: "gift",
    color: "#ec4899",
    type: "income",
  },
  {
    id: "investment",
    name: "Đầu tư",
    icon: "investment",
    color: "#3b82f6",
    type: "income",
  },
  {
    id: "business",
    name: "Kinh doanh",
    icon: "business",
    color: "#8b5cf6",
    type: "income",
  },
  {
    id: "part-time",
    name: "Làm thêm",
    icon: "clock",
    color: "#06b6d4",
    type: "income",
  },
  {
    id: "refund",
    name: "Hoàn tiền",
    icon: "refund",
    color: "#14b8a6",
    type: "income",
  },
  {
    id: "rental",
    name: "Cho thuê",
    icon: "rent",
    color: "#84cc16",
    type: "income",
  },
  {
    id: "other-income",
    name: "Khác",
    icon: "other",
    color: "#6b7280",
    type: "income",
  },
];
