import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { sortedTransactionsState, categoriesState } from "expense-state";
import { formatCurrency } from "utils/format";
import { useNavigate } from "react-router-dom";
import { Card, EmptyState } from "components/ui";
import { ChevronRightIcon, ClockIcon, getIcon, CategoryIcon } from "components/icons";

export const RecentTransactions: FC = () => {
  const transactions = useRecoilValue(sortedTransactionsState);
  const categories = useRecoilValue(categoriesState);
  const navigate = useNavigate();

  const recentTransactions = transactions.slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <Box className="px-4 pb-4">
        <Box className="flex justify-between items-center mb-3">
          <Text className="font-bold text-gray-900 text-sm">
            Giao dịch gần đây
          </Text>
        </Box>
        <EmptyState
          icon={<ClockIcon size={40} color="#D1D5DB" />}
          title="Chưa có giao dịch nào"
          description="Bắt đầu ghi chép ngay hôm nay"
        />
      </Box>
    );
  }

  return (
    <Box className="px-4 pb-4">
      <Box className="flex justify-between items-center mb-3">
        <Box className="flex items-center">
          <Text className="font-bold text-gray-900 text-sm">
            Giao dịch gần đây
          </Text>
        </Box>
        <Box
          className="flex items-center px-2.5 py-1 rounded-full bg-yellow-50 cursor-pointer active:scale-95 transition-transform"
          onClick={() => navigate("/history")}
        >
          <Text size="xSmall" className="text-yellow-600 font-semibold mr-1">
            Xem tất cả
          </Text>
          <ChevronRightIcon size={12} color="#CA8A04" />
        </Box>
      </Box>
      <Card padding="sm">
        <Box className="space-y-1.5">
          {recentTransactions.map((transaction, index) => {
            const category = categories.find(
              (c) => c.id === transaction.categoryId
            );
            const date = new Date(transaction.date);
            const IconComponent = getIcon(category?.icon || "");

            return (
              <Box
                key={transaction.id}
                className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98]"
                onClick={() => navigate(`/history?id=${transaction.id}`)}
              >
                <Box className="flex items-center space-x-2.5">
                  <Box
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ 
                      background: `${category?.color}15`,
                    }}
                  >
                    {IconComponent ? (
                      <IconComponent size={18} color={category?.color || "#6B7280"} />
                    ) : (
                      <CategoryIcon size={18} color={category?.color || "#6B7280"} />
                    )}
                  </Box>
                  <Box>
                    <Text size="xSmall" className="font-bold text-gray-900">
                      {category?.name || "Khác"}
                    </Text>
                    <Text size="xxSmall" className="text-gray-500">
                      {date.toLocaleDateString("vi-VN")}
                    </Text>
                  </Box>
                </Box>
                <Box className={`px-2 py-1 rounded-lg ${
                  transaction.type === "income"
                    ? "bg-emerald-50"
                    : "bg-rose-50"
                }`}>
                  <Text
                    size="xSmall"
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
