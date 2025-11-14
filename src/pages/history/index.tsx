import React, { FC } from "react";
import { Page, Header, Box, Text, Icon } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { sortedTransactionsState, categoriesState } from "expense-state";
import { formatCurrency } from "utils/format";

const HistoryPage: FC = () => {
  const transactions = useRecoilValue(sortedTransactionsState);
  const categories = useRecoilValue(categoriesState);

  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const dateKey = date.toLocaleDateString("vi-VN");

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(transaction);
    return acc;
  }, {} as Record<string, typeof transactions>);

  return (
    <Page className="flex flex-col">
      <Header title="Lịch sử giao dịch" showBackIcon={true} />
      <Box className="flex-1 overflow-auto">
        {Object.keys(groupedTransactions).length === 0 ? (
          <Box className="text-center py-12">
            <Text className="text-gray-400">Chưa có giao dịch nào</Text>
          </Box>
        ) : (
          Object.entries(groupedTransactions).map(([dateKey, dayTransactions]) => {
            const dayTotal = dayTransactions.reduce((sum, t) => {
              return t.type === "income" ? sum + t.amount : sum - t.amount;
            }, 0);

            return (
              <Box key={dateKey} className="mb-4">
                <Box className="px-4 py-2 bg-gray-50 flex justify-between items-center">
                  <Text size="small" className="font-medium">
                    {dateKey}
                  </Text>
                  <Text
                    size="small"
                    className={`font-medium ${
                      dayTotal >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {dayTotal >= 0 ? "+" : ""}
                    {formatCurrency(dayTotal)}
                  </Text>
                </Box>
                <Box className="px-4">
                  {dayTransactions.map((transaction) => {
                    const category = categories.find(
                      (c) => c.id === transaction.categoryId
                    );
                    const time = new Date(transaction.date).toLocaleTimeString(
                      "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    );

                    return (
                      <Box
                        key={transaction.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100"
                      >
                        <Box className="flex items-center space-x-3 flex-1">
                          <Box
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: `${category?.color}20`,
                            }}
                          >
                            <Icon
                              icon={(category?.icon || "zi-more-grid") as any}
                              style={{ color: category?.color }}
                            />
                          </Box>
                          <Box className="flex-1 min-w-0">
                            <Text size="small" className="font-medium">
                              {category?.name || "Khác"}
                            </Text>
                            <Text size="xSmall" className="text-gray-500">
                              {time}
                              {transaction.note && ` • ${transaction.note}`}
                            </Text>
                          </Box>
                        </Box>
                        <Text
                          size="small"
                          className={`font-semibold flex-shrink-0 ml-2 ${
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
          })
        )}
      </Box>
    </Page>
  );
};

export default HistoryPage;
