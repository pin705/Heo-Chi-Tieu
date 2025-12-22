import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { monthlyStatsState, totalBalanceState, budgetStatusState } from "expense-state";
import { formatCurrency } from "utils/format";
import { useNavigate } from "react-router-dom";
import { Card, AnimatedNumber, DonutChart, ProgressBar } from "components/ui";
import { WalletIcon, BudgetIcon, WarningIcon, SuccessIcon, IncomeIcon, ExpenseIcon, ChevronRightIcon, ChartIcon } from "components/icons";

export const Summary: FC = () => {
  const stats = useRecoilValue(monthlyStatsState);
  const totalBalance = useRecoilValue(totalBalanceState);
  const budgetStatus = useRecoilValue(budgetStatusState);
  const navigate = useNavigate();

  return (
    <Box className="px-4 pt-4 pb-2 -mt-3 relative z-10">
      {/* Total Balance Card with Gradient */}
      <Card 
        className="mb-3 relative overflow-hidden"
        padding="md"
        style={{
          background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
        }}
      >
        <Box className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
        <Box className="relative">
          <Box className="flex items-center mb-2">
            <Box className="bg-white/20 rounded-xl p-2 mr-2">
              <WalletIcon size={18} color="#FFFFFF" />
            </Box>
            <Text size="xSmall" className="text-white/80 font-medium">
              Tổng số dư
            </Text>
          </Box>
          <Box className="flex items-baseline">
            <Text className="font-bold text-white text-3xl">
              <AnimatedNumber 
                value={totalBalance} 
                formatFn={(v) => formatCurrency(v).replace(' ₫', '')}
                duration={800}
              />
            </Text>
            <Text className="text-white/70 ml-1.5 font-medium">₫</Text>
          </Box>
        </Box>
      </Card>

      {/* Budget Alert with modern styling */}
      {budgetStatus.hasBudget && budgetStatus.isExceeded && (
        <Card className="mb-3 bg-gradient-to-r from-red-50 to-rose-50" padding="sm">
          <Box className="flex items-center space-x-2">
            <Box className="bg-red-500 rounded-lg p-2 flex-shrink-0">
              <WarningIcon size={16} color="#FFFFFF" />
            </Box>
            <Box className="flex-1">
              <Text className="text-red-800 font-bold text-xs">
                Vượt ngân sách! Chi tiêu vượt {formatCurrency(Math.abs(budgetStatus.remaining))}
              </Text>
            </Box>
          </Box>
        </Card>
      )}

      {/* Budget Progress Card */}
      {budgetStatus.hasBudget && (
        <Card className="mb-3" padding="md">
          <Box className="flex items-center justify-between mb-3">
            <Box className="flex items-center">
              <Box className="bg-yellow-100 rounded-lg p-2 mr-2">
                <BudgetIcon size={18} color="#EAB308" />
              </Box>
              <Text className="font-bold text-gray-900 text-sm">
                Ngân sách tháng
              </Text>
            </Box>
            <Box
              className="flex items-center px-2 py-1 rounded-lg bg-yellow-50 cursor-pointer active:scale-95 transition-transform"
              onClick={() => navigate("/budget")}
            >
              <Text size="xxSmall" className="text-yellow-600 font-semibold mr-0.5">Chi tiết</Text>
              <ChevronRightIcon size={12} color="#CA8A04" />
            </Box>
          </Box>
          
          <Box className="flex justify-between items-center mb-2">
            <Text size="xSmall" className="text-gray-600 font-medium">
              <AnimatedNumber value={budgetStatus.spent} formatFn={formatCurrency} duration={600} /> / {formatCurrency(budgetStatus.budget)}
            </Text>
            <Box className={`px-2 py-0.5 rounded-lg ${budgetStatus.isExceeded ? 'bg-red-100' : 'bg-yellow-100'}`}>
              <Text size="xSmall" className={`font-bold ${budgetStatus.isExceeded ? "text-red-600" : "text-yellow-600"}`}>
                {budgetStatus.percentage.toFixed(0)}%
              </Text>
            </Box>
          </Box>
          
          <ProgressBar 
            value={budgetStatus.spent} 
            maxValue={budgetStatus.budget} 
            color={budgetStatus.isExceeded ? "#EF4444" : "#EAB308"}
            height="sm"
          />
          
          {!budgetStatus.isExceeded && (
            <Box className="flex items-center mt-3 px-3 py-2 bg-emerald-50 rounded-xl">
              <SuccessIcon size={16} color="#22C55E" className="mr-1.5" />
              <Text size="xSmall" className="text-emerald-700 font-semibold">
                Còn lại: {formatCurrency(budgetStatus.remaining)}
              </Text>
            </Box>
          )}
        </Card>
      )}

      {/* Monthly Stats Card */}
      <Card className="mb-3" padding="md">
        <Box className="flex items-center mb-3">
          <Box className="bg-gray-100 rounded-lg p-2 mr-2">
            <ChartIcon size={18} color="#6B7280" />
          </Box>
          <Text className="font-bold text-gray-900 text-sm">
            Tháng này
          </Text>
        </Box>
        
        <Box className="grid grid-cols-2 gap-2 mb-3">
          <Box className="bg-emerald-50 rounded-xl p-3">
            <Box className="flex items-center mb-1">
              <IncomeIcon size={16} color="#22C55E" className="mr-1.5" />
              <Text size="xSmall" className="text-emerald-700 font-semibold">
                Thu nhập
              </Text>
            </Box>
            <Text className="text-emerald-600 font-bold text-base">
              <AnimatedNumber value={stats.income} formatFn={formatCurrency} duration={700} />
            </Text>
          </Box>
          <Box className="bg-rose-50 rounded-xl p-3">
            <Box className="flex items-center mb-1">
              <ExpenseIcon size={16} color="#EF4444" className="mr-1.5" />
              <Text size="xSmall" className="text-rose-700 font-semibold">
                Chi tiêu
              </Text>
            </Box>
            <Text className="text-rose-600 font-bold text-base">
              <AnimatedNumber value={stats.expense} formatFn={formatCurrency} duration={700} />
            </Text>
          </Box>
        </Box>
        
        <Box className="pt-2">
          <Box className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
            <Box className="flex items-center">
              <WalletIcon size={16} color="#6B7280" className="mr-1.5" />
              <Text size="xSmall" className="text-gray-700 font-bold">
                Còn lại
              </Text>
            </Box>
            <Text
              className={`font-bold text-base ${stats.balance >= 0 ? "text-yellow-600" : "text-red-600"}`}
            >
              {stats.balance >= 0 ? "+" : ""}<AnimatedNumber value={stats.balance} formatFn={formatCurrency} duration={700} />
            </Text>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

