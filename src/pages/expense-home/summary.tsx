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
    <Box className="px-4 pt-6 pb-2 -mt-6 relative z-10">
      {/* Total Balance Card with Gradient */}
      <Card 
        className="mb-4 relative overflow-hidden animate-fadeInUp"
        padding="lg"
        style={{
          background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
        }}
      >
        <Box className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
        <Box className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16" />
        <Box className="relative">
          <Box className="flex items-center mb-3">
            <Box className="bg-white/20 rounded-2xl p-2.5 mr-3">
              <WalletIcon size={22} color="#FFFFFF" />
            </Box>
            <Text size="small" className="text-white/90 font-semibold">
              Tổng số dư
            </Text>
          </Box>
          <Box className="flex items-baseline">
            <Text.Title className="font-bold text-white" style={{ fontSize: '34px' }}>
              <AnimatedNumber 
                value={totalBalance} 
                formatFn={(v) => formatCurrency(v).replace(' ₫', '')}
                duration={800}
              />
            </Text.Title>
            <Text className="text-white/80 ml-2 font-semibold">₫</Text>
          </Box>
        </Box>
      </Card>

      {/* Budget Alert with modern styling */}
      {budgetStatus.hasBudget && budgetStatus.isExceeded && (
        <Card className="mb-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
          <Box className="flex items-start space-x-3">
            <Box className="bg-red-500 rounded-2xl p-3 flex items-center justify-center shadow-md flex-shrink-0">
              <WarningIcon size={22} color="#FFFFFF" />
            </Box>
            <Box className="flex-1">
              <Text className="text-red-800 font-bold text-sm mb-1">
                Vượt ngân sách!
              </Text>
              <Text size="xSmall" className="text-red-600 font-medium">
                Chi tiêu vượt {formatCurrency(Math.abs(budgetStatus.remaining))} so với kế hoạch
              </Text>
            </Box>
          </Box>
        </Card>
      )}

      {/* Budget Progress Card */}
      {budgetStatus.hasBudget && (
        <Card className="mb-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center">
              <Box className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl p-2.5 mr-3 shadow-sm">
                <BudgetIcon size={20} color="#EAB308" />
              </Box>
              <Text.Title size="small" className="font-bold text-gray-900">
                Ngân sách tháng này
              </Text.Title>
            </Box>
            <Box
              className="flex items-center px-3 py-1.5 rounded-full bg-yellow-50 cursor-pointer active:scale-95 transition-transform"
              onClick={() => navigate("/budget")}
            >
              <Text size="xSmall" className="text-yellow-600 font-semibold mr-1">Chi tiết</Text>
              <ChevronRightIcon size={14} color="#CA8A04" />
            </Box>
          </Box>
          
          <Box className="flex justify-between items-center mb-3">
            <Text size="small" className="text-gray-600 font-semibold">
              <AnimatedNumber value={budgetStatus.spent} formatFn={formatCurrency} duration={600} /> / {formatCurrency(budgetStatus.budget)}
            </Text>
            <Box className={`px-3 py-1 rounded-full ${budgetStatus.isExceeded ? 'bg-red-100' : 'bg-yellow-100'}`}>
              <Text size="small" className={`font-bold ${budgetStatus.isExceeded ? "text-red-600" : "text-yellow-600"}`}>
                {budgetStatus.percentage.toFixed(0)}%
              </Text>
            </Box>
          </Box>
          
          <ProgressBar 
            value={budgetStatus.spent} 
            maxValue={budgetStatus.budget} 
            color={budgetStatus.isExceeded ? "#EF4444" : "#EAB308"}
            height="md"
          />
          
          {!budgetStatus.isExceeded && (
            <Box className="flex items-center mt-4 px-4 py-3 bg-emerald-50 rounded-2xl">
              <SuccessIcon size={18} color="#22C55E" className="mr-2" />
              <Text size="small" className="text-emerald-700 font-semibold">
                Còn lại: {formatCurrency(budgetStatus.remaining)}
              </Text>
            </Box>
          )}
        </Card>
      )}

      {/* Monthly Stats Card */}
      <Card className="animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
        <Box className="flex items-center mb-4">
          <Box className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-2.5 mr-3 shadow-sm">
            <ChartIcon size={20} color="#6B7280" />
          </Box>
          <Text.Title size="small" className="font-bold text-gray-900">
            Tháng này
          </Text.Title>
        </Box>
        
        <Box className="grid grid-cols-2 gap-3 mb-4">
          <Box className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 shadow-sm">
            <Box className="flex items-center mb-2">
              <IncomeIcon size={18} color="#22C55E" className="mr-2" />
              <Text size="xSmall" className="text-emerald-700 font-bold">
                Thu nhập
              </Text>
            </Box>
            <Text.Title size="small" className="text-emerald-600 font-bold">
              <AnimatedNumber value={stats.income} formatFn={formatCurrency} duration={700} />
            </Text.Title>
          </Box>
          <Box className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-4 shadow-sm">
            <Box className="flex items-center mb-2">
              <ExpenseIcon size={18} color="#EF4444" className="mr-2" />
              <Text size="xSmall" className="text-rose-700 font-bold">
                Chi tiêu
              </Text>
            </Box>
            <Text.Title size="small" className="text-rose-600 font-bold">
              <AnimatedNumber value={stats.expense} formatFn={formatCurrency} duration={700} />
            </Text.Title>
          </Box>
        </Box>
        
        <Box className="pt-3 border-t border-gray-100">
          <Box className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-4">
            <Box className="flex items-center">
              <WalletIcon size={18} color="#6B7280" className="mr-2" />
              <Text size="small" className="text-gray-700 font-bold">
                Còn lại
              </Text>
            </Box>
            <Text.Title
              size="small"
              className={`font-bold ${stats.balance >= 0 ? "text-yellow-600" : "text-red-600"}`}
            >
              {stats.balance >= 0 ? "+" : ""}<AnimatedNumber value={stats.balance} formatFn={formatCurrency} duration={700} />
            </Text.Title>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

