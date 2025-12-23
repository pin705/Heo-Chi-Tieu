import React, { FC, useState, useMemo } from "react";
import { Page, Box, Text, Sheet } from "zmp-ui";
import { useRecoilValue } from "recoil";
import {
  monthlyStatsState,
  transactionsByCategoryState,
  categoriesState,
  budgetStatusState,
  walletsState,
  totalBalanceState,
} from "expense-state";
import { formatCurrency } from "utils/format";
import { useNavigate } from "react-router-dom";
import { Card, AnimatedNumber, ProgressBar } from "components/ui";
import { ChevronRightIcon, getIcon, CategoryIcon, CalendarIcon } from "components/icons";

const ReportsPage: FC = () => {
  const navigate = useNavigate();
  const stats = useRecoilValue(monthlyStatsState);
  const categories = useRecoilValue(categoriesState);
  const budgetStatus = useRecoilValue(budgetStatusState);
  const wallets = useRecoilValue(walletsState);
  const totalBalance = useRecoilValue(totalBalanceState);
  
  const [activeTab, setActiveTab] = useState<"analysis" | "account">("analysis");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  const categoryStats = useRecoilValue(transactionsByCategoryState("expense"));

  const months = [
    "Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6",
    "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"
  ];

  // Calculate total assets and liabilities
  const totalAssets = useMemo(() => {
    return wallets.filter(w => w.balance >= 0).reduce((sum, w) => sum + w.balance, 0);
  }, [wallets]);

  const totalLiabilities = useMemo(() => {
    return Math.abs(wallets.filter(w => w.balance < 0).reduce((sum, w) => sum + w.balance, 0));
  }, [wallets]);

  return (
    <Page className="flex flex-col bg-gray-50 min-h-screen">
      {/* Yellow Header */}
      <Box 
        className="flex-none"
        style={{ 
          background: '#FBBF24',
          paddingTop: 'var(--safe-top)',
        }}
      >
        <Box className="flex items-center justify-center px-4 py-3 pr-24">
          <Text className="text-black text-lg font-bold">Báo cáo</Text>
        </Box>

        {/* Tab Switcher */}
        <Box className="px-4 pb-4">
          <Box className="flex bg-white rounded-full p-1">
            <Box
              className={`flex-1 py-2 rounded-full text-center cursor-pointer transition-all ${
                activeTab === "analysis" ? "bg-black text-white" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("analysis")}
            >
              <Text size="small" className={`font-bold ${activeTab === "analysis" ? "text-white" : "text-gray-600"}`}>
                Phân tích
              </Text>
            </Box>
            <Box
              className={`flex-1 py-2 rounded-full text-center cursor-pointer transition-all ${
                activeTab === "account" ? "bg-black text-white" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("account")}
            >
              <Text size="small" className={`font-bold ${activeTab === "account" ? "text-white" : "text-gray-600"}`}>
                Tài khoản
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box className="flex-1 overflow-auto pb-24">
        {activeTab === "analysis" ? (
          <Box className="p-4 space-y-4">
            {/* Monthly Stats Card */}
            <Box className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <Box 
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => navigate("/history")}
              >
                <Text className="font-bold text-gray-900">Thống kê hàng tháng</Text>
                <ChevronRightIcon size={20} color="#9CA3AF" />
              </Box>
              
              <Box className="flex items-center">
                <Box className="mr-6">
                  <Text size="xSmall" className="text-gray-500">{months[selectedMonth]}</Text>
                </Box>
                <Box className="flex-1 grid grid-cols-3 gap-4">
                  <Box>
                    <Text size="xSmall" className="text-gray-500">Chi tiêu</Text>
                    <Text className="font-bold text-gray-900">
                      {formatCurrency(stats.expense).replace(' ₫', '')}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="xSmall" className="text-gray-500">Thu nhập</Text>
                    <Text className="font-bold text-gray-900">
                      {formatCurrency(stats.income).replace(' ₫', '')}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="xSmall" className="text-gray-500">Số dư</Text>
                    <Text className={`font-bold ${stats.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                      {formatCurrency(stats.balance).replace(' ₫', '')}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Budget Card */}
            <Box className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <Box 
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => navigate("/budget")}
              >
                <Text className="font-bold text-gray-900">Ngân sách hàng tháng</Text>
                <ChevronRightIcon size={20} color="#9CA3AF" />
              </Box>
              
              <Box className="flex items-center">
                {/* Donut Chart Placeholder */}
                <Box className="w-24 h-24 mr-4 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="12"
                    />
                    {budgetStatus.hasBudget && budgetStatus.budget > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={budgetStatus.isExceeded ? "#EF4444" : "#FBBF24"}
                        strokeWidth="12"
                        strokeDasharray={`${Math.min(budgetStatus.percentage, 100) * 2.51} 251`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    )}
                    <text x="50" y="55" textAnchor="middle" className="text-sm font-bold fill-gray-400">
                      {budgetStatus.hasBudget ? `${Math.round(budgetStatus.percentage)}%` : '--'}
                    </text>
                  </svg>
                </Box>
                
                <Box className="flex-1 space-y-2">
                  <Box className="flex justify-between">
                    <Text size="small" className="text-gray-500">Còn lại :</Text>
                    <Text className={`font-bold ${budgetStatus.remaining >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                      {budgetStatus.hasBudget ? formatCurrency(budgetStatus.remaining).replace(' ₫', '') : '0'}
                    </Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Text size="small" className="text-gray-500">Ngân sách :</Text>
                    <Text className="font-bold text-gray-900">
                      {budgetStatus.hasBudget ? formatCurrency(budgetStatus.budget).replace(' ₫', '') : '0'}
                    </Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Text size="small" className="text-gray-500">Chi tiêu :</Text>
                    <Text className="font-bold text-gray-900">
                      {formatCurrency(budgetStatus.spent).replace(' ₫', '')}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Category Breakdown */}
            {categoryStats.length > 0 && (
              <Box className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <Text className="font-bold text-gray-900 mb-4">Chi tiêu theo danh mục</Text>
                <Box className="space-y-3">
                  {categoryStats.slice(0, 5).map((stat) => {
                    const category = categories.find((c) => c.id === stat.categoryId);
                    const IconComponent = getIcon(category?.icon || "");
                    
                    return (
                      <Box key={stat.categoryId} className="flex items-center">
                        <Box
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: category?.color ? `${category.color}20` : '#FEF3C7' }}
                        >
                          {IconComponent ? (
                            <IconComponent size={20} color={category?.color || "#EAB308"} />
                          ) : (
                            <CategoryIcon size={20} color={category?.color || "#EAB308"} />
                          )}
                        </Box>
                        <Box className="flex-1">
                          <Box className="flex justify-between mb-1">
                            <Text size="small" className="font-medium text-gray-900">{category?.name || "Khác"}</Text>
                            <Text size="small" className="font-bold text-gray-900">
                              {formatCurrency(stat.amount).replace(' ₫', '')}
                            </Text>
                          </Box>
                          <Box className="w-full bg-gray-100 rounded-full h-2">
                            <Box
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${stat.percentage}%`,
                                backgroundColor: category?.color || "#EAB308"
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Box className="p-4 space-y-4">
            {/* Net Worth Card */}
            <Box 
              className="rounded-2xl p-4"
              style={{ background: '#FEF3C7' }}
            >
              <Box className="flex items-center justify-between">
                <Box>
                  <Text size="small" className="text-gray-600 mb-1">Giá trị ròng</Text>
                  <Text className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalBalance).replace(' ₫', '')}
                  </Text>
                  <Box className="flex mt-2 space-x-6">
                    <Box>
                      <Text size="xSmall" className="text-gray-500">Tài sản</Text>
                      <Text className="font-bold text-gray-900">{formatCurrency(totalAssets).replace(' ₫', '')}</Text>
                    </Box>
                    <Box>
                      <Text size="xSmall" className="text-gray-500">Nợ phải trả</Text>
                      <Text className="font-bold text-gray-900">{formatCurrency(totalLiabilities).replace(' ₫', '')}</Text>
                    </Box>
                  </Box>
                </Box>
                <Box className="w-16 h-16">
                  <svg viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="24" r="12" fill="#CA8A04" opacity="0.3"/>
                    <ellipse cx="32" cy="50" rx="20" ry="8" fill="#CA8A04" opacity="0.2"/>
                    <circle cx="44" cy="18" r="8" fill="#EAB308"/>
                    <circle cx="44" cy="18" r="4" fill="#FEF3C7"/>
                  </svg>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box className="grid grid-cols-2 gap-3">
              <Box 
                className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 cursor-pointer active:bg-gray-50"
                onClick={() => navigate("/manage-wallets")}
              >
                <Text className="font-medium text-gray-900">Thêm tài khoản</Text>
              </Box>
              <Box 
                className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 cursor-pointer active:bg-gray-50"
                onClick={() => navigate("/manage-wallets")}
              >
                <Text className="font-medium text-gray-900">Quản lý tài khoản</Text>
              </Box>
            </Box>

            {/* Wallet List */}
            <Box className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <Box className="p-4 border-b border-gray-100">
                <Text className="font-bold text-gray-900">Danh sách ví</Text>
              </Box>
              {wallets.map((wallet) => {
                const IconComponent = getIcon(wallet.icon);
                return (
                  <Box 
                    key={wallet.id}
                    className="flex items-center justify-between p-4 border-b border-gray-50 last:border-b-0"
                  >
                    <Box className="flex items-center space-x-3">
                      <Box
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${wallet.color}20` }}
                      >
                        {IconComponent ? (
                          <IconComponent size={20} color={wallet.color} />
                        ) : (
                          <CategoryIcon size={20} color={wallet.color} />
                        )}
                      </Box>
                      <Text className="font-medium text-gray-900">{wallet.name}</Text>
                    </Box>
                    <Text className={`font-bold ${wallet.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                      {formatCurrency(wallet.balance).replace(' ₫', '')}
                    </Text>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default ReportsPage;
