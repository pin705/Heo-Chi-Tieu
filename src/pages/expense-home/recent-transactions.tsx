import React, { FC } from "react";
import { Box, Text, Icon } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { sortedTransactionsState, categoriesState } from "expense-state";
import { formatCurrency } from "utils/format";
import { useNavigate } from "react-router-dom";

export const RecentTransactions: FC = () => {
  const transactions = useRecoilValue(sortedTransactionsState);
  const categories = useRecoilValue(categoriesState);
  const navigate = useNavigate();

  const recentTransactions = transactions.slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <Box className="m-4">
        <Box className="flex justify-between items-center mb-3">
          <Text.Title size="small">Giao dịch gần đây</Text.Title>
        </Box>
        <Box className="text-center py-8 text-gray-400">
          <Text size="small">Chưa có giao dịch nào</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="m-4">
      <Box className="flex justify-between items-center mb-3">
        <Text.Title size="small">Giao dịch gần đây</Text.Title>
        <Text
          size="xSmall"
          className="text-primary cursor-pointer"
          onClick={() => navigate("/history")}
        >
          Xem tất cả
        </Text>
      </Box>
      <Box className="space-y-2">
        {recentTransactions.map((transaction) => {
          const category = categories.find(
            (c) => c.id === transaction.categoryId
          );
          const date = new Date(transaction.date);

          return (
            <Box
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <Box className="flex items-center space-x-3">
                <Box
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${category?.color}20` }}
                >
                  <Icon
                    icon={(category?.icon || "zi-more-grid") as any}
                    style={{ color: category?.color }}
                  />
                </Box>
                <Box>
                  <Text size="small" className="font-medium">
                    {category?.name || "Khác"}
                  </Text>
                  <Text size="xSmall" className="text-gray-500">
                    {date.toLocaleDateString("vi-VN")}
                  </Text>
                </Box>
              </Box>
              <Text
                size="small"
                className={`font-semibold ${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
