import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { sortedTransactionsState, categoriesState } from "expense-state";
import { formatCurrency } from "utils/format";
import { useNavigate } from "react-router-dom";
import { Card, EmptyState } from "components/ui";
import { ChevronRightIcon, ClockIcon, getIcon } from "components/icons";

export const RecentTransactions: FC = () => {
  const transactions = useRecoilValue(sortedTransactionsState);
  const categories = useRecoilValue(categoriesState);
  const navigate = useNavigate();

  const recentTransactions = transactions.slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <Box className="px-4 pb-4 animate-fadeIn">
        <Box className="flex justify-between items-center mb-4">
          <Text.Title size="small" className="font-bold text-gray-900">
            Giao dịch gần đây
          </Text.Title>
        </Box>
        <EmptyState
          icon={<ClockIcon size={48} color="#D1D5DB" />}
          title="Chưa có giao dịch nào"
          description="Bắt đầu ghi chép ngay hôm nay"
        />
      </Box>
    );
  }

  return (
    <Box className="px-4 pb-4 animate-fadeIn">
      <Box className="flex justify-between items-center mb-4">
        <Box className="flex items-center">
          <Text.Title size="small" className="font-bold text-gray-900">
            Giao dịch gần đây
          </Text.Title>
        </Box>
        <Box
          className="flex items-center px-3 py-1.5 rounded-full bg-yellow-50 cursor-pointer active:scale-95 transition-transform"
          onClick={() => navigate("/history")}
        >
          <Text size="xSmall" className="text-yellow-600 font-semibold mr-1">
            Xem tất cả
          </Text>
          <ChevronRightIcon size={14} color="#CA8A04" />
        </Box>
      </Box>
      <Card padding="sm">
        <Box className="space-y-2">
          {recentTransactions.map((transaction, index) => {
            const category = categories.find(
              (c) => c.id === transaction.categoryId
            );
            const date = new Date(transaction.date);
            const IconComponent = getIcon(category?.icon || "other");

            return (
              <Box
                key={transaction.id}
                className="flex items-center justify-between p-3.5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] animate-fadeInUp"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/history?id=${transaction.id}`)}
              >
                <Box className="flex items-center space-x-3">
                  <Box
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${category?.color}15 0%, ${category?.color}25 100%)`,
                    }}
                  >
                    <IconComponent size={22} color={category?.color || "#6B7280"} />
                  </Box>
                  <Box>
                    <Text size="small" className="font-bold text-gray-900">
                      {category?.name || "Khác"}
                    </Text>
                    <Text size="xSmall" className="text-gray-500 font-medium">
                      {date.toLocaleDateString("vi-VN")}
                    </Text>
                  </Box>
                </Box>
                <Box className={`px-3 py-1.5 rounded-xl ${
                  transaction.type === "income"
                    ? "bg-gradient-to-r from-emerald-50 to-green-50"
                    : "bg-gradient-to-r from-rose-50 to-red-50"
                }`}>
                  <Text
                    size="small"
                    className={`font-bold ${
                      transaction.type === "income"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </Text>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Card>
    </Box>
  );
};
