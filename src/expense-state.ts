import { atom, selector, selectorFamily } from "recoil";
import { getUserInfo } from "zmp-sdk";
import {
  ExpenseCategory,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "types/expense-category";
import { Wallet, DEFAULT_WALLETS } from "types/wallet";
import { Transaction } from "types/transaction";
import { getStorage, setStorage } from "zmp-sdk";

// User state
export const userState = selector({
  key: "user",
  get: async () => {
    const { userInfo } = await getUserInfo({ autoRequestPermission: true });
    return userInfo;
  },
});

// Categories state
const loadCategories = async (): Promise<ExpenseCategory[]> => {
  try {
    const stored = await getStorage({ keys: ["categories"] });
    if (stored.categories) {
      return JSON.parse(stored.categories);
    }
  } catch (error) {
    console.warn("Error loading categories:", error);
  }
  return [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];
};

const saveCategories = async (categories: ExpenseCategory[]) => {
  try {
    await setStorage({
      data: { categories: JSON.stringify(categories) },
    });
  } catch (error) {
    console.error("Error saving categories:", error);
  }
};

export const categoriesState = atom<ExpenseCategory[]>({
  key: "categories",
  default: loadCategories(),
  effects: [
    ({ onSet }) => {
      onSet((newCategories) => {
        saveCategories(newCategories);
      });
    },
  ],
});

export const expenseCategoriesState = selector<ExpenseCategory[]>({
  key: "expenseCategories",
  get: ({ get }) => {
    const categories = get(categoriesState);
    return categories.filter((c) => c.type === "expense");
  },
});

export const incomeCategoriesState = selector<ExpenseCategory[]>({
  key: "incomeCategories",
  get: ({ get }) => {
    const categories = get(categoriesState);
    return categories.filter((c) => c.type === "income");
  },
});

// Wallets state
const loadWallets = async (): Promise<Wallet[]> => {
  try {
    const stored = await getStorage({ keys: ["wallets"] });
    if (stored.wallets) {
      return JSON.parse(stored.wallets);
    }
  } catch (error) {
    console.warn("Error loading wallets:", error);
  }
  return DEFAULT_WALLETS;
};

const saveWallets = async (wallets: Wallet[]) => {
  try {
    await setStorage({
      data: { wallets: JSON.stringify(wallets) },
    });
  } catch (error) {
    console.error("Error saving wallets:", error);
  }
};

export const walletsState = atom<Wallet[]>({
  key: "wallets",
  default: loadWallets(),
  effects: [
    ({ onSet }) => {
      onSet((newWallets) => {
        saveWallets(newWallets);
      });
    },
  ],
});

export const totalBalanceState = selector({
  key: "totalBalance",
  get: ({ get }) => {
    const wallets = get(walletsState);
    return wallets.reduce((total, wallet) => total + wallet.balance, 0);
  },
});

// Transactions state
const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const stored = await getStorage({ keys: ["transactions"] });
    if (stored.transactions) {
      return JSON.parse(stored.transactions);
    }
  } catch (error) {
    console.warn("Error loading transactions:", error);
  }
  return [];
};

const saveTransactions = async (transactions: Transaction[]) => {
  try {
    await setStorage({
      data: { transactions: JSON.stringify(transactions) },
    });
  } catch (error) {
    console.error("Error saving transactions:", error);
  }
};

export const transactionsState = atom<Transaction[]>({
  key: "transactions",
  default: loadTransactions(),
  effects: [
    ({ onSet }) => {
      onSet((newTransactions) => {
        saveTransactions(newTransactions);
      });
    },
  ],
});

// Sorted transactions (newest first)
export const sortedTransactionsState = selector<Transaction[]>({
  key: "sortedTransactions",
  get: ({ get }) => {
    const transactions = get(transactionsState);
    return [...transactions].sort((a, b) => b.date - a.date);
  },
});

// Get transactions for current month
export const currentMonthTransactionsState = selector<Transaction[]>({
  key: "currentMonthTransactions",
  get: ({ get }) => {
    const transactions = get(sortedTransactionsState);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
  },
});

// Statistics for current month
export const monthlyStatsState = selector({
  key: "monthlyStats",
  get: ({ get }) => {
    const transactions = get(currentMonthTransactionsState);
    
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expense,
      balance: income - expense,
      total: income + expense,
    };
  },
});

// Transactions by category (for pie chart)
export const transactionsByCategoryState = selectorFamily<
  { categoryId: string; amount: number; percentage: number }[],
  "income" | "expense"
>({
  key: "transactionsByCategory",
  get:
    (type) =>
    ({ get }) => {
      const transactions = get(currentMonthTransactionsState);
      const filtered = transactions.filter((t) => t.type === type);
      
      const total = filtered.reduce((sum, t) => sum + t.amount, 0);
      
      if (total === 0) return [];
      
      const byCategory = filtered.reduce((acc, t) => {
        if (!acc[t.categoryId]) {
          acc[t.categoryId] = 0;
        }
        acc[t.categoryId] += t.amount;
        return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(byCategory)
        .map(([categoryId, amount]) => ({
          categoryId,
          amount,
          percentage: (amount / total) * 100,
        }))
        .sort((a, b) => b.amount - a.amount);
    },
});

// Selected transaction type for forms
export const selectedTransactionTypeState = atom<"income" | "expense">({
  key: "selectedTransactionType",
  default: "expense",
});
