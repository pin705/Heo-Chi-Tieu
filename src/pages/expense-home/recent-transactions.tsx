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
      <Card padding="none" className="overflow-hidden">
        <Box className="divide-y divide-gray-100">
          {recentTransactions.map((transaction, index) => {
            const category = categories.find(
              (c) => c.id === transaction.categoryId
            );
            const date = new Date(transaction.date);
            const IconComponent = getIcon(category?.icon || "");

            return (
              <Box
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer active:bg-gray-100"
                onClick={() => navigate(`/history?id=${transaction.id}`)}
              >
                <Box className="flex items-center space-x-3">
                  <Box
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ 
                      background: `${category?.color}15`,
                      border: `1px solid ${category?.color}20`
                    }}
                  >
                    {IconComponent ? (
                      <IconComponent size={22} color={category?.color || "#6B7280"} />
                    ) : (
                      <CategoryIcon size={22} color={category?.color || "#6B7280"} />
                    )}
                  </Box>
                  <Box>
                    <Text className="font-bold text-gray-900 text-sm">
                      {category?.name || "Khác"}
                    </Text>
                    <Box className="flex items-center space-x-1.5">
                      <Text size="xxSmall" className="text-gray-400">
                        {date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' })}
                      </Text>
                      {transaction.note && (
                        <>
                          <Box className="w-1 h-1 rounded-full bg-gray-300" />
                          <Text size="xxSmall" className="text-gray-400 truncate max-w-[120px]">
                            {transaction.note}
                          </Text>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box className="text-right">
                  <Text
                    className={`font-bold text-sm ${
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
