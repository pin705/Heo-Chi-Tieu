import React, { FC, useState, useMemo } from "react";
import { Box, Page, Text, Sheet } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { sortedTransactionsState, categoriesState } from "expense-state";
import { formatCurrency } from "utils/format";
import { useNavigate } from "react-router-dom";
import { 
  MenuIcon, 
  SearchIcon, 
  CalendarIcon, 
  ChevronDownIcon,
  getIcon,
  CategoryIcon 
} from "components/icons";
import { haptic } from "components/ui";
import { AppLogo } from "components/logo";

const ExpenseHomePage: FC = () => {
  const navigate = useNavigate();
  const transactions = useRecoilValue(sortedTransactionsState);
  const categories = useRecoilValue(categoriesState);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const months = [
    "Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6",
    "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"
  ];

  // Filter transactions by selected month
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
    });
  }, [transactions, selectedYear, selectedMonth]);

  // Calculate monthly stats for selected month
  const monthStats = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const dateKey = `${date.getDate()} thg ${date.getMonth() + 1}`;
      const dayName = date.toLocaleDateString("vi-VN", { weekday: "long" });
      const fullKey = `${dateKey}|${dayName}`;

      if (!acc[fullKey]) {
        acc[fullKey] = { transactions: [], expense: 0, income: 0 };
      }
      acc[fullKey].transactions.push(transaction);
      if (transaction.type === "expense") {
        acc[fullKey].expense += transaction.amount;
      } else {
        acc[fullKey].income += transaction.amount;
      }
      return acc;
    }, {} as Record<string, { transactions: typeof filteredTransactions; expense: number; income: number }>);
  }, [filteredTransactions]);

  return (
    <Page className="flex flex-col bg-white min-h-screen">
      {/* Yellow Header */}
      <Box 
        className="flex-none"
        style={{ 
          background: '#FBBF24',
          paddingTop: 'var(--safe-top)',
        }}
      >
        {/* Top Bar */}
        <Box className="flex items-center justify-between px-4 py-3 pr-24">
          <Box className="flex items-center space-x-2">
            <AppLogo size={32} />
            <Text className="text-black text-lg font-bold">Heo Chi Tiêu</Text>
          </Box>
          <Box className="flex items-center space-x-3">
            <Box className="cursor-pointer p-2" onClick={() => navigate("/history")}>
              <SearchIcon size={22} color="#000000" />
            </Box>
            <Box className="cursor-pointer p-2">
              <CalendarIcon size={22} color="#000000" />
            </Box>
          </Box>
        </Box>

        {/* Month Selector & Stats */}
        <Box className="px-4 pb-4">
          <Box className="flex items-end justify-between">
            {/* Year & Month */}
            <Box 
              className="cursor-pointer"
              onClick={() => { haptic.light(); setShowMonthPicker(true); }}
            >
              <Text size="xSmall" className="text-black/70">{selectedYear}</Text>
              <Box className="flex items-center">
                <Text className="text-black text-2xl font-bold">{months[selectedMonth]}</Text>
                <ChevronDownIcon size={20} color="#000000" />
              </Box>
            </Box>

            {/* Stats */}
            <Box className="flex space-x-6 text-right">
              <Box>
                <Text size="xSmall" className="text-black/70">Chi tiêu</Text>
                <Text className="text-black font-bold">
                  {monthStats.expense > 0 ? formatCurrency(monthStats.expense).replace(' ₫', '') : '0'}
                </Text>
              </Box>
              <Box>
                <Text size="xSmall" className="text-black/70">Thu nhập</Text>
                <Text className="text-black font-bold">
                  {monthStats.income > 0 ? formatCurrency(monthStats.income).replace(' ₫', '') : '0'}
                </Text>
              </Box>
              <Box>
                <Text size="xSmall" className="text-black/70">Số dư</Text>
                <Text className={`font-bold ${monthStats.balance >= 0 ? 'text-black' : 'text-red-600'}`}>
                  {monthStats.balance !== 0 ? formatCurrency(monthStats.balance).replace(' ₫', '') : '0'}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Transaction List */}
      <Box className="flex-1 overflow-auto pb-24 bg-gray-50">
        {Object.keys(groupedTransactions).length === 0 ? (
          <Box className="flex flex-col items-center justify-center h-full py-20">
            <Box className="w-16 h-16 mb-4 opacity-30">
              <svg viewBox="0 0 64 64" fill="none">
                <rect x="12" y="8" width="40" height="48" rx="4" stroke="#9CA3AF" strokeWidth="2"/>
                <path d="M20 20h24M20 28h24M20 36h16" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                <path d="M44 44l8 8M52 44l-8 8" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Box>
            <Text className="text-gray-400">Chưa có dữ liệu</Text>
          </Box>
        ) : (
          Object.entries(groupedTransactions).map(([key, data]) => {
            const [dateStr, dayName] = key.split("|");
            const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

            return (
              <Box key={key}>
                {/* Date Header */}
                <Box className="flex items-center justify-between px-4 py-2 bg-gray-50">
                  <Box className="flex items-center space-x-2">
                    <Text size="small" className="text-gray-600 font-medium">{dateStr}</Text>
                    <Text size="small" className="text-gray-400">{capitalizedDay}</Text>
                  </Box>
                  <Text size="small" className="text-gray-500">
                    {data.expense > 0 ? `Chi: ${formatCurrency(data.expense).replace(' ₫', '')}` : ''}
                    {data.income > 0 ? ` Thu: ${formatCurrency(data.income).replace(' ₫', '')}` : ''}
                  </Text>
                </Box>

                {/* Transactions */}
                {data.transactions.map((transaction) => {
                  const category = categories.find((c) => c.id === transaction.categoryId);
                  const IconComponent = getIcon(category?.icon || "");

                  return (
                    <Box
                      key={transaction.id}
                      className="flex items-center justify-between px-4 py-3 bg-white cursor-pointer active:bg-gray-50"
                      onClick={() => navigate(`/history?id=${transaction.id}`)}
                    >
                      <Box className="flex items-center space-x-3">
                        <Box
                          className="w-11 h-11 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category?.color ? `${category.color}20` : '#FEF3C7' }}
                        >
                          {IconComponent ? (
                            <IconComponent size={22} color={category?.color || "#EAB308"} />
                          ) : (
                            <CategoryIcon size={22} color={category?.color || "#EAB308"} />
                          )}
                        </Box>
                        <Box>
                          <Text className="text-gray-900 font-medium">{category?.name || "Khác"}</Text>
                          {transaction.note && (
                            <Text size="xxSmall" className="text-gray-400 truncate max-w-[180px]">
                              {transaction.note}
                            </Text>
                          )}
                        </Box>
                      </Box>
                      <Text className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-gray-900"}`}>
                        {transaction.type === "expense" ? "-" : "+"}{formatCurrency(transaction.amount).replace(' ₫', '')}
                      </Text>
                    </Box>
                  );
                })}
              </Box>
            );
          })
        )}
      </Box>

      {/* Month Picker Sheet */}
      <Sheet
        visible={showMonthPicker}
        onClose={() => setShowMonthPicker(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="p-4 pb-8">
          <Text className="text-lg font-bold text-center mb-4">Chọn tháng</Text>
          
          {/* Year Selector */}
          <Box className="flex items-center justify-center space-x-4 mb-4">
            <Box 
              className="px-4 py-2 rounded-lg bg-gray-100 cursor-pointer"
              onClick={() => setSelectedYear(selectedYear - 1)}
            >
              <Text>◀</Text>
            </Box>
            <Text className="text-xl font-bold">{selectedYear}</Text>
            <Box 
              className="px-4 py-2 rounded-lg bg-gray-100 cursor-pointer"
              onClick={() => setSelectedYear(selectedYear + 1)}
            >
              <Text>▶</Text>
            </Box>
          </Box>

          {/* Month Grid */}
          <Box className="grid grid-cols-4 gap-2">
            {months.map((month, index) => (
              <Box
                key={index}
                className={`py-3 rounded-xl text-center cursor-pointer transition-all ${
                  selectedMonth === index
                    ? "bg-yellow-400 text-black font-bold"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => {
                  haptic.light();
                  setSelectedMonth(index);
                  setShowMonthPicker(false);
                }}
              >
                <Text size="small" className={selectedMonth === index ? "font-bold" : ""}>
                  {month}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Sheet>
    </Page>
  );
};

export default ExpenseHomePage;
