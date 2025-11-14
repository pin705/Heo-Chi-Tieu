import React, { FC, useState } from "react";
import { Page, Header, Box, Text, Tabs, Icon } from "zmp-ui";
import { useRecoilValue } from "recoil";
import {
  monthlyStatsState,
  transactionsByCategoryState,
  categoriesState,
} from "expense-state";
import { formatCurrency } from "utils/format";

const ReportsPage: FC = () => {
  const stats = useRecoilValue(monthlyStatsState);
  const categories = useRecoilValue(categoriesState);
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

  const categoryStats = useRecoilValue(
    transactionsByCategoryState(activeTab)
  );

  return (
    <Page className="flex flex-col">
      <Header title="Báo cáo" showBackIcon={false} />
      <Box className="flex-1 overflow-auto">
        {/* Monthly Summary */}
        <Box className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
          <Text size="xSmall" className="text-white opacity-90 mb-2">
            Tháng này
          </Text>
          <Box className="grid grid-cols-3 gap-4 text-white">
            <Box>
              <Text size="xSmall" className="opacity-90">
                Thu nhập
              </Text>
              <Text.Title size="small" className="mt-1">
                {formatCurrency(stats.income)}
              </Text.Title>
            </Box>
            <Box>
              <Text size="xSmall" className="opacity-90">
                Chi tiêu
              </Text>
              <Text.Title size="small" className="mt-1">
                {formatCurrency(stats.expense)}
              </Text.Title>
            </Box>
            <Box>
              <Text size="xSmall" className="opacity-90">
                Còn lại
              </Text>
              <Text.Title size="small" className="mt-1">
                {formatCurrency(stats.balance)}
              </Text.Title>
            </Box>
          </Box>
        </Box>

        {/* Tabs for Expense/Income */}
        <Box className="p-4">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as "expense" | "income")}
          >
            <Tabs.Tab key="expense" label="Chi tiêu" />
            <Tabs.Tab key="income" label="Thu nhập" />
          </Tabs>
        </Box>

        {/* Category Breakdown */}
        <Box className="px-4 pb-4">
          {categoryStats.length === 0 ? (
            <Box className="text-center py-8">
              <Text className="text-gray-400">
                Chưa có {activeTab === "expense" ? "chi tiêu" : "thu nhập"} nào
                trong tháng này
              </Text>
            </Box>
          ) : (
            <Box className="space-y-3">
              {categoryStats.map((stat) => {
                const category = categories.find(
                  (c) => c.id === stat.categoryId
                );

                return (
                  <Box
                    key={stat.categoryId}
                    className="p-4 bg-gray-50 rounded-xl"
                  >
                    <Box className="flex items-center justify-between mb-2">
                      <Box className="flex items-center space-x-3">
                        <Box
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: `${category?.color}20`,
                          }}
                        >
                          <Icon
                            icon={(category?.icon || "zi-more-grid") as any}
                            style={{ color: category?.color }}
                          />
                        </Box>
                        <Text size="small" className="font-medium">
                          {category?.name || "Khác"}
                        </Text>
                      </Box>
                      <Box className="text-right">
                        <Text size="small" className="font-semibold">
                          {formatCurrency(stat.amount)}
                        </Text>
                        <Text size="xSmall" className="text-gray-500">
                          {stat.percentage.toFixed(1)}%
                        </Text>
                      </Box>
                    </Box>
                    {/* Progress Bar */}
                    <Box className="w-full bg-gray-200 rounded-full h-2">
                      <Box
                        className="h-2 rounded-full"
                        style={{
                          width: `${stat.percentage}%`,
                          backgroundColor: category?.color,
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default ReportsPage;
