import React, { FC, useState, useMemo } from "react";
import { Page, Box, Text, Input, Select, Sheet, Button } from "zmp-ui";
import AppHeader from "components/app-header";
import DatePicker from "zmp-ui/date-picker";
import { useRecoilValue } from "recoil";
import { sortedTransactionsState, categoriesState, walletsState } from "expense-state";
import { formatCurrency } from "utils/format";
import { Transaction } from "types/transaction";
import { WalletSelector } from "components/wallet-selector";
import { Card, EmptyState } from "components/ui";
import { SearchIcon, FilterIcon, CloseIcon, CheckIcon, DeleteIcon, getIcon, IncomeIcon, ExpenseIcon, MenuGridIcon } from "components/icons";

const HistoryPage: FC = () => {
  const transactions = useRecoilValue(sortedTransactionsState);
  const categories = useRecoilValue(categoriesState);
  const wallets = useRecoilValue(walletsState);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterWallet, setFilterWallet] = useState<string>("all");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(undefined);
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(undefined);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Type filter
      if (filterType !== "all" && transaction.type !== filterType) {
        return false;
      }

      // Category filter
      if (filterCategory !== "all" && transaction.categoryId !== filterCategory) {
        return false;
      }

      // Wallet filter
      if (filterWallet !== "all" && transaction.walletId !== filterWallet) {
        return false;
      }

      // Date range filter
      if (filterStartDate) {
        const startOfDay = new Date(filterStartDate);
        startOfDay.setHours(0, 0, 0, 0);
        if (transaction.date < startOfDay.getTime()) {
          return false;
        }
      }

      if (filterEndDate) {
        const endOfDay = new Date(filterEndDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (transaction.date > endOfDay.getTime()) {
          return false;
        }
      }

      // Search filter
      if (searchTerm) {
        const category = categories.find((c) => c.id === transaction.categoryId);
        const searchLower = searchTerm.toLowerCase();
        
        const matchesNote = transaction.note?.toLowerCase().includes(searchLower);
        const matchesCategory = category?.name.toLowerCase().includes(searchLower);
        const matchesAmount = transaction.amount.toString().includes(searchTerm);

        return matchesNote || matchesCategory || matchesAmount;
      }

      return true;
    });
  }, [transactions, searchTerm, filterType, filterCategory, filterWallet, filterStartDate, filterEndDate, categories]);

  const activeFiltersCount = [
    filterType !== "all",
    filterCategory !== "all",
    filterWallet !== "all",
    filterStartDate !== undefined,
    filterEndDate !== undefined,
  ].filter(Boolean).length;

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey = date.toLocaleDateString("vi-VN");
    if (date.toDateString() === today.toDateString()) {
      dateKey = "Hôm nay";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = "Hôm qua";
    }

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const clearFilters = () => {
    setFilterType("all");
    setFilterCategory("all");
    setFilterWallet("all");
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
    setSearchTerm("");
  };

  return (
    <Page className="flex flex-col bg-background">
      <AppHeader title="Lịch sử giao dịch" noBack={true} />
      
      {/* Wallet Selector */}
    
      
      {/* Search and Filter Bar */}
      <Box className="px-4 pt-4 pb-3">
        <Box className="flex gap-2 mb-3">
          <Box className="flex-1 relative">
            <Box className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <SearchIcon size={18} color="#9CA3AF" />
            </Box>
            <Input
              type="text"
              placeholder="Tìm kiếm giao dịch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white border-none rounded-xl shadow-sm"
              clearable
            />
          </Box>
          <Box
            className={`px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all duration-200 active:scale-95 ${
              activeFiltersCount > 0 
                ? "shadow-md"
                : "bg-white shadow-sm"
            }`}
            style={{
              background: activeFiltersCount > 0 
                ? 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)'
                : undefined,
            }}
            onClick={() => setShowFilterSheet(true)}
          >
            <FilterIcon size={18} color={activeFiltersCount > 0 ? "#FFFFFF" : "#6B7280"} />
            {activeFiltersCount > 0 && (
              <Box className="bg-white text-yellow-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {activeFiltersCount}
              </Box>
            )}
          </Box>
        </Box>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <Box className="flex flex-wrap gap-1.5 mt-2">
            {filterType !== "all" && (
              <Box className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                <Text size="xSmall" className="font-semibold">
                  {filterType === "income" ? "Thu nhập" : "Chi tiêu"}
                </Text>
                <Box className="cursor-pointer" onClick={() => setFilterType("all")}>
                  <CloseIcon size={12} color="#92400E" />
                </Box>
              </Box>
            )}
            {filterCategory !== "all" && (
              <Box className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                <Text size="xSmall" className="font-semibold">
                  {categories.find((c) => c.id === filterCategory)?.name}
                </Text>
                <Box className="cursor-pointer" onClick={() => setFilterCategory("all")}>
                  <CloseIcon size={12} color="#92400E" />
                </Box>
              </Box>
            )}
            {filterWallet !== "all" && (
              <Box className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                <Text size="xSmall" className="font-semibold">
                  {wallets.find((w) => w.id === filterWallet)?.name}
                </Text>
                <Box className="cursor-pointer" onClick={() => setFilterWallet("all")}>
                  <CloseIcon size={12} color="#92400E" />
                </Box>
              </Box>
            )}
            {filterStartDate && (
              <Box className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                <Text size="xSmall" className="font-semibold">
                  Từ {filterStartDate.toLocaleDateString("vi-VN")}
                </Text>
                <Box className="cursor-pointer" onClick={() => setFilterStartDate(undefined)}>
                  <CloseIcon size={12} color="#92400E" />
                </Box>
              </Box>
            )}
            {filterEndDate && (
              <Box className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                <Text size="xSmall" className="font-semibold">
                  Đến {filterEndDate.toLocaleDateString("vi-VN")}
                </Text>
                <Box className="cursor-pointer" onClick={() => setFilterEndDate(undefined)}>
                  <CloseIcon size={12} color="#92400E" />
                </Box>
              </Box>
            )}
            <Box
              className="px-2.5 py-1 text-xs cursor-pointer bg-red-50 rounded-lg active:scale-95"
              onClick={clearFilters}
            >
              <Text size="xSmall" className="text-red-600 font-semibold">Xóa lọc</Text>
            </Box>
          </Box>
        )}
      </Box>

      {/* Wallet Selector */}
      <Box className="px-4 py-2">
        <WalletSelector 
          selectedWalletId={filterWallet !== "all" ? filterWallet : undefined}
          onWalletChange={(walletId) => setFilterWallet(walletId || "all")}
          compact={true}
        />
      </Box>
      
      <Box className="flex-1 overflow-auto px-4 pt-2 pb-20">
        {Object.keys(groupedTransactions).length === 0 ? (
          <EmptyState
            icon={<SearchIcon size={48} color="#D1D5DB" />}
            title={searchTerm || activeFiltersCount > 0 ? "Không tìm thấy giao dịch nào" : "Chưa có giao dịch nào"}
            description={searchTerm || activeFiltersCount > 0 ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm" : "Bắt đầu thêm giao dịch ngay"}
          />
        ) : (
          Object.entries(groupedTransactions).map(([dateKey, dayTransactions]) => {
            const dayTotal = dayTransactions.reduce((sum, t) => {
              return t.type === "income" ? sum + t.amount : sum - t.amount;
            }, 0);

            return (
              <Box key={dateKey} className="mb-5">
                <Box className="flex justify-between items-end px-1 mb-2">
                  <Text size="small" className="font-bold text-gray-900">
                    {dateKey}
                  </Text>
                  <Text size="xSmall" className={`font-bold ${dayTotal >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {dayTotal >= 0 ? "+" : ""}{formatCurrency(dayTotal)}
                  </Text>
                </Box>
                <Box className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
                  <Box>
                    {dayTransactions.map((transaction, index) => {
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
                      const IconComponent = getIcon(category?.icon || "other");

                      return (
                        <Box
                          key={transaction.id}
                          className={`flex items-center justify-between p-4 active:bg-gray-50 transition-colors cursor-pointer ${
                            index < dayTransactions.length - 1 ? '' : ''
                          }`}
                        >
                          <Box className="flex items-center space-x-3 flex-1 min-w-0">
                            <Box
                              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                              style={{ 
                                backgroundColor: category?.color ? `${category.color}15` : '#F3F4F6',
                              }}
                            >
                              {IconComponent && <IconComponent size={22} color={category?.color || "#6B7280"} />}
                            </Box>
                            <Box className="flex-1 min-w-0">
                              <Text className="font-bold text-gray-900 text-sm">
                                {category?.name || "Khác"}
                              </Text>
                              <Box className="flex items-center space-x-1.5">
                                <Text size="xxSmall" className="text-gray-400">
                                  {time}
                                </Text>
                                {transaction.note && (
                                  <>
                                    <Box className="w-1 h-1 rounded-full bg-gray-300" />
                                    <Text size="xxSmall" className="text-gray-400 truncate">
                                      {transaction.note}
                                    </Text>
                                  </>
                                )}
                              </Box>
                            </Box>
                          </Box>
                          <Box className="text-right ml-2">
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
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* Filter Sheet */}
      <Sheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="p-5">
          <Text.Title className="mb-5 text-center">Bộ lọc</Text.Title>

          {/* Type Filter */}
          <Box className="mb-5">
            <Text size="small" className="mb-3 text-gray-700 font-medium">
              Loại giao dịch
            </Text>
            <Box className="flex p-1 bg-gray-100 rounded-xl">
              {[
                { value: "all", label: "Tất cả", Icon: MenuGridIcon, activeColor: "text-gray-900" },
                { value: "income", label: "Thu nhập", Icon: IncomeIcon, activeColor: "text-green-600" },
                { value: "expense", label: "Chi tiêu", Icon: ExpenseIcon, activeColor: "text-red-600" },
              ].map((option) => (
                <Box
                  key={option.value}
                  className={`flex-1 flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                    filterType === option.value
                      ? `bg-white shadow-sm ${option.activeColor}`
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                  onClick={() => setFilterType(option.value as any)}
                >
                  <option.Icon size={18} color={filterType === option.value ? (option.value === "income" ? "#22C55E" : option.value === "expense" ? "#EF4444" : "#111827") : "#6B7280"} className="mr-1.5" />
                  <Text size="small" className="font-medium">
                    {option.label}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Category Filter */}
          <Box className="mb-5">
            <Text size="small" className="mb-3 text-gray-700 font-medium">
              Danh mục
            </Text>
            <Select
              value={filterCategory}
              onChange={(value) => setFilterCategory(value as string)}
              className="bg-white  rounded-xl"
            >
              <Select.Option value="all" title="Tất cả danh mục" />
              {categories.map((category) => (
                <Select.Option
                  key={category.id}
                  value={category.id}
                  title={category.name}
                />
              ))}
            </Select>
          </Box>

          {/* Wallet Filter */}
          <Box className="mb-5">
            <Text size="small" className="mb-3 text-gray-700 font-medium">
              Ví
            </Text>
            <Select
              value={filterWallet}
              onChange={(value) => setFilterWallet(value as string)}
              className="bg-white  rounded-xl"
            >
              <Select.Option value="all" title="Tất cả ví" />
              {wallets.map((wallet) => (
                <Select.Option
                  key={wallet.id}
                  value={wallet.id}
                  title={wallet.name}
                />
              ))}
            </Select>
          </Box>

          {/* Date Range Filter */}
          <Box className="mb-5">
            <Text size="small" className="mb-3 text-gray-700 font-medium">
              Khoảng thời gian
            </Text>
            <Box className="space-y-3">
              <DatePicker
                placeholder="Từ ngày"
                value={filterStartDate}
                onChange={(value) => setFilterStartDate(value)}
                dateFormat="dd/mm/yyyy"
                columnsFormat="DD-MM-YYYY"
                title="Chọn ngày bắt đầu"
                locale="vi-VN"
                mask
                maskClosable
                inputClass="bg-white  rounded-xl"
              />
              <DatePicker
                placeholder="Đến ngày"
                value={filterEndDate}
                onChange={(value) => setFilterEndDate(value)}
                dateFormat="dd/mm/yyyy"
                columnsFormat="DD-MM-YYYY"
                title="Chọn ngày kết thúc"
                locale="vi-VN"
                mask
                maskClosable
                startDate={filterStartDate}
                inputClass="bg-white  rounded-xl"
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box className="flex gap-3">
            <Button
              fullWidth
              variant="secondary"
              onClick={() => {
                clearFilters();
                setShowFilterSheet(false);
              }}
              className="h-12 font-semibold shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
            >
              <Box className="flex items-center">
                <DeleteIcon size={18} color="#6B7280" className="mr-2" />
                <span>Xóa bộ lọc</span>
              </Box>
            </Button>
            <Button 
              fullWidth 
              onClick={() => setShowFilterSheet(false)}
              className="h-12 font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center justify-center bg-yellow-500 text-white border-none"
            >
              <Box className="flex items-center">
                <CheckIcon size={18} color="#FFFFFF" className="mr-2" />
                <span>Áp dụng</span>
              </Box>
            </Button>
          </Box>
        </Box>
      </Sheet>
    </Page>
  );
};

export default HistoryPage;
