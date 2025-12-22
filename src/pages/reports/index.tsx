import React, { FC, useState } from "react";
import { Page, Box, Text, Tabs } from "zmp-ui";
import AppHeader from "components/app-header";
import { useRecoilValue } from "recoil";
import {
  monthlyStatsState,
  transactionsByCategoryState,
  categoriesState,
  categoryBudgetStatusState,
  monthlyTrendState,
  weeklyTrendState,
} from "expense-state";
import { formatCurrency } from "utils/format";
import { ExpenseCategory } from "types/expense-category";
import { TrendChart } from "components/trend-chart";
import { WalletSelector } from "components/wallet-selector";
import { Card, AnimatedNumber, ProgressBar } from "components/ui";
import { ExpenseIcon, IncomeIcon, CategoryIcon, ChartIcon, WarningIcon, StarIcon, getIcon } from "components/icons";

interface CategoryStatItemProps {
  stat: { categoryId: string; amount: number; percentage: number };
  category?: ExpenseCategory;
  showBudget: boolean;
}

const CategoryStatItem: FC<CategoryStatItemProps> = ({
  stat,
  category,
  showBudget,
}) => {
  const budgetStatus = useRecoilValue(
    categoryBudgetStatusState(stat.categoryId)
  );
  const IconComponent = getIcon(category?.icon || "other");

  return (
    <Card className="animate-fadeInUp">
      <Box className="flex items-center justify-between mb-3">
        <Box className="flex items-center space-x-3">
          <Box
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
            style={{
              backgroundColor: `${category?.color}20`,
            }}
          >
            {IconComponent && <IconComponent size={24} color={category?.color || "#6B7280"} />}
          </Box>
          <Box>
            <Text size="small" className="font-semibold text-gray-800">
              {category?.name || "Khác"}
            </Text>
            {showBudget && budgetStatus.hasBudget && (
              <Box className="flex items-center">
                <StarIcon size={12} color="#6B7280" className="mr-1" />
                <Text size="xSmall" className="text-gray-500">
                  Ngân sách: {formatCurrency(budgetStatus.budget)}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
        <Box className="text-right">
          <Text size="small" className="font-bold text-gray-800">
            <AnimatedNumber value={stat.amount} formatFn={formatCurrency} />
          </Text>
          <Text size="xSmall" className="text-yellow-600 font-medium">
            {stat.percentage.toFixed(1)}%
          </Text>
          {showBudget && budgetStatus.hasBudget && budgetStatus.isExceeded && (
            <Box className="flex items-center justify-end">
              <WarningIcon size={12} color="#DC2626" className="mr-1" />
              <Text size="xSmall" className="text-red-600 font-medium">
                Vượt ngân sách!
              </Text>
            </Box>
          )}
        </Box>
      </Box>
      {/* Progress Bar */}
      <ProgressBar 
        value={stat.percentage} 
        maxValue={100} 
        color={category?.color || "#EAB308"}
        height="sm"
      />
      {/* Budget Progress Bar */}
      {showBudget && budgetStatus.hasBudget && (
        <Box className="mt-3">
          <Box className="flex justify-between items-center mb-2">
            <Text size="xSmall" className="text-gray-600 font-medium">
              So với ngân sách
            </Text>
            <Text
              size="xSmall"
              className={`font-bold ${budgetStatus.isExceeded ? "text-red-600" : "text-yellow-600"}`}
            >
              {budgetStatus.percentage.toFixed(1)}%
            </Text>
          </Box>
          <ProgressBar 
            value={budgetStatus.percentage} 
            maxValue={100} 
            color={budgetStatus.isExceeded ? "#DC2626" : "#EAB308"}
            height="sm"
          />
        </Box>
      )}
    </Card>
  );
};

const ReportsPage: FC = () => {
  const stats = useRecoilValue(monthlyStatsState);
  const categories = useRecoilValue(categoriesState);
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [viewMode, setViewMode] = useState<"category" | "trend">("category");

  const categoryStats = useRecoilValue(
    transactionsByCategoryState(activeTab)
  );
  
  const monthlyTrend = useRecoilValue(monthlyTrendState(6));
  const weeklyTrend = useRecoilValue(weeklyTrendState);

  const getMonthName = (month: number): string => {
    const months = [
      "T1", "T2", "T3", "T4", "T5", "T6",
      "T7", "T8", "T9", "T10", "T11", "T12",
    ];
    return months[month];
  };

  return (
    <Page className="flex flex-col bg-background">
      <AppHeader title="Báo cáo" noBack />
      <Box className="flex-1 overflow-auto pb-20">
        {/* Wallet Selector */}
        <Box className="px-4 pt-3 pb-2">
          <WalletSelector compact={true} />
        </Box>

        {/* Monthly Summary */}
        <Card 
          className="mx-4 mb-3 relative overflow-hidden"
          padding="md"
          style={{
            background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
          }}
        >
          <Box className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12" />
          <Text size="xSmall" className="text-white/80 mb-2 font-medium">
            Tháng này
          </Text>
          <Box className="grid grid-cols-3 gap-2">
            <Box className="bg-white/15 p-2.5 rounded-xl">
              <Text size="xxSmall" className="text-white/80 mb-0.5">Thu nhập</Text>
              <Text className="font-bold text-white text-sm">
                <AnimatedNumber value={stats.income} formatFn={formatCurrency} />
              </Text>
            </Box>
            <Box className="bg-white/15 p-2.5 rounded-xl">
              <Text size="xxSmall" className="text-white/80 mb-0.5">Chi tiêu</Text>
              <Text className="font-bold text-white text-sm">
                <AnimatedNumber value={stats.expense} formatFn={formatCurrency} />
              </Text>
            </Box>
            <Box className="bg-white/15 p-2.5 rounded-xl">
              <Text size="xxSmall" className="text-white/80 mb-0.5">Còn lại</Text>
              <Text className="font-bold text-white text-sm">
                <AnimatedNumber value={stats.balance} formatFn={formatCurrency} />
              </Text>
            </Box>
          </Box>
        </Card>

        {/* Tabs for Expense/Income */}
        <Box className="px-4 pb-3">
          <Box className="flex p-1 bg-gray-100 rounded-xl">
            <Box
              className={`flex-1 flex items-center justify-center py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                activeTab === "expense"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("expense")}
            >
              <ExpenseIcon size={18} color={activeTab === "expense" ? "#DC2626" : "#6B7280"} className="mr-1.5" />
              <Text size="small" className="font-semibold">Chi tiêu</Text>
            </Box>
            <Box
              className={`flex-1 flex items-center justify-center py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                activeTab === "income"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("income")}
            >
              <IncomeIcon size={18} color={activeTab === "income" ? "#16A34A" : "#6B7280"} className="mr-1.5" />
              <Text size="small" className="font-semibold">Thu nhập</Text>
            </Box>
          </Box>
        </Box>

        {/* View Mode Toggle */}
        <Box className="px-4 pb-3">
          <Box className="flex p-1 bg-gray-100 rounded-xl">
            <Box
              className={`flex-1 flex items-center justify-center py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                viewMode === "category"
                  ? "bg-white text-yellow-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              onClick={() => setViewMode("category")}
            >
              <CategoryIcon size={18} color={viewMode === "category" ? "#CA8A04" : "#6B7280"} className="mr-1.5" />
              <Text size="small" className="font-semibold">Danh mục</Text>
            </Box>
            <Box
              className={`flex-1 flex items-center justify-center py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                viewMode === "trend"
                  ? "bg-white text-yellow-600 shadow-sm"
                  : "text-gray-500"
              }`}
              onClick={() => setViewMode("trend")}
            >
              <ChartIcon size={18} color={viewMode === "trend" ? "#CA8A04" : "#6B7280"} className="mr-1.5" />
              <Text size="small" className="font-semibold">Xu hướng</Text>
            </Box>
          </Box>
        </Box>

        {/* Category Breakdown */}
        {viewMode === "category" && (
          <Box className="px-4 pb-4">
            {categoryStats.length === 0 ? (
              <Box className="text-center py-8">
                <Text className="text-gray-400">
                  Chưa có {activeTab === "expense" ? "chi tiêu" : "thu nhập"} nào
                  trong tháng này
                </Text>
              </Box>
            ) : (
              <Box className="space-y-2">
                {categoryStats.map((stat) => {
                  const category = categories.find(
                    (c) => c.id === stat.categoryId
                  );

                  return (
                    <CategoryStatItem
                      key={stat.categoryId}
                      stat={stat}
                      category={category}
                      showBudget={activeTab === "expense"}
                    />
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {/* Trend Charts */}
        {viewMode === "trend" && (
          <Box className="px-4 pb-4">
            {/* Weekly Trend */}
            <Box className="mb-4">
              <Text className="font-bold text-gray-900 mb-2 text-sm">
                Xu hướng theo tuần
              </Text>
              <Box className="bg-white rounded-xl p-3 shadow-sm">
                <TrendChart
                  data={weeklyTrend.map((w) => ({
                    label: `T${w.week}`,
                    value: activeTab === "expense" ? w.expense : w.income,
                    color: activeTab === "expense" ? "#EF4444" : "#10B981",
                  }))}
                  height={150}
                  type="bar"
                />
              </Box>
            </Box>

            {/* Monthly Trend */}
            <Box className="mb-6">
              <Text.Title size="small" className="mb-3">
                Xu hướng 6 tháng
              </Text.Title>
              <Box className="bg-section rounded-xl p-4 shadow-sm">
                <TrendChart
                  data={monthlyTrend.map((m) => ({
                    label: getMonthName(m.month),
                    value: activeTab === "expense" ? m.expense : m.income,
                    color: activeTab === "expense" ? "#EF4444" : "#10B981",
                  }))}
                  height={180}
                  type="line"
                />
              </Box>
            </Box>

            {/* Comparison Chart */}
            <Box>
              <Text.Title size="small" className="mb-3">
                So sánh Thu - Chi (6 tháng)
              </Text.Title>
              <Box className="bg-section rounded-xl p-4 shadow-sm">
                <Box className="space-y-4">
                  {monthlyTrend.map((m, i) => (
                    <Box key={i}>
                      <Box className="flex justify-between items-center mb-2">
                        <Text size="small" className="font-medium">
                          {getMonthName(m.month)} {m.year}
                        </Text>
                        <Text size="xSmall" className={m.income >= m.expense ? "text-green-600" : "text-red-600"}>
                          {formatCurrency(m.income - m.expense)}
                        </Text>
                      </Box>
                      <Box className="flex gap-2">
                        <Box className="flex-1">
                          <Box className="flex justify-between mb-1">
                            <Text size="xSmall" className="text-green-600">Thu</Text>
                            <Text size="xSmall" className="text-green-600">{formatCurrency(m.income)}</Text>
                          </Box>
                          <Box className="w-full bg-gray-100 rounded-full h-2">
                            <Box
                              className="h-2 rounded-full bg-green-600"
                              style={{
                                width: `${Math.max(...monthlyTrend.map(t => t.income)) > 0 ? (m.income / Math.max(...monthlyTrend.map(t => t.income))) * 100 : 0}%`,
                              }}
                            />
                          </Box>
                        </Box>
                        <Box className="flex-1">
                          <Box className="flex justify-between mb-1">
                            <Text size="xSmall" className="text-red-600">Chi</Text>
                            <Text size="xSmall" className="text-red-600">{formatCurrency(m.expense)}</Text>
                          </Box>
                          <Box className="w-full bg-gray-100 rounded-full h-2">
                            <Box
                              className="h-2 rounded-full bg-red-600"
                              style={{
                                width: `${Math.max(...monthlyTrend.map(t => t.expense)) > 0 ? (m.expense / Math.max(...monthlyTrend.map(t => t.expense))) * 100 : 0}%`,
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default ReportsPage;
