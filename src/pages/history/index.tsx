import React, { FC, useState, useMemo } from "react";
import { Page, Box, Text, Icon, Input, Select, Sheet, Button } from "zmp-ui";
import AppHeader from "components/app-header";
import DatePicker from "zmp-ui/date-picker";
import { useRecoilValue } from "recoil";
import { sortedTransactionsState, categoriesState, walletsState } from "expense-state";
import { formatCurrency } from "utils/format";
import { Transaction } from "types/transaction";
import { WalletSelector } from "components/wallet-selector";

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
    const dateKey = date.toLocaleDateString("vi-VN");

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
      <AppHeader title="Lịch sử giao dịch" />
      
      {/* Wallet Selector */}
    
      
      {/* Search and Filter Bar */}
      <Box className="p-4 bg-white shadow-soft rounded-b-2xl animate-fade-in">
          <Box className="flex gap-2.5 mb-3">
          <Input
            type="text"
            placeholder="Tìm kiếm giao dịch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-gray-50 border-none rounded-2xl shadow-soft"
            prefix={<Icon icon="zi-search" />}
            clearable
          />
          <Box
            className={`px-5 py-2 rounded-2xl flex items-center gap-2 cursor-pointer transition-all duration-200 transform active:scale-95 ${
              activeFiltersCount > 0 
                ? "shadow-lg"
                : "bg-white  shadow-soft hover:shadow-md"
            }`}
            style={{
              background: activeFiltersCount > 0 
                ? 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)'
                : undefined,
            }}
            onClick={() => setShowFilterSheet(true)}
          >
            <Icon icon="zi-filter" className={activeFiltersCount > 0 ? "text-white" : "text-gray-600"} />
            {activeFiltersCount > 0 && (
              <Box className="bg-white text-yellow-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                {activeFiltersCount}
              </Box>
            )}
          </Box>
        </Box>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <Box className="flex flex-wrap gap-2 animate-slide-up">
            {filterType !== "all" && (
              <Box className="bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-soft">
                <Text size="xSmall" className="font-bold">
                  {filterType === "income" ? "Thu nhập" : "Chi tiêu"}
                </Text>
                <Box className="cursor-pointer hover:bg-yellow-200 rounded-full p-0.5 transition-colors" onClick={() => setFilterType("all")}>
                  <Icon icon="zi-close" size={12} />
                </Box>
              </Box>
            )}
            {filterCategory !== "all" && (
              <Box className="bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-soft">
                <Text size="xSmall" className="font-bold">
                  {categories.find((c) => c.id === filterCategory)?.name}
                </Text>
                <Box className="cursor-pointer hover:bg-yellow-200 rounded-full p-0.5 transition-colors" onClick={() => setFilterCategory("all")}>
                  <Icon icon="zi-close" size={12} />
                </Box>
              </Box>
            )}
            {filterWallet !== "all" && (
              <Box className="bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-soft">
                <Text size="xSmall" className="font-bold">
                  {wallets.find((w) => w.id === filterWallet)?.name}
                </Text>
                <Box className="cursor-pointer hover:bg-yellow-200 rounded-full p-0.5 transition-colors" onClick={() => setFilterWallet("all")}>
                  <Icon icon="zi-close" size={12} />
                </Box>
              </Box>
            )}
            {filterStartDate && (
              <Box className="bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-soft">
                <Text size="xSmall" className="font-bold">
                  Từ {filterStartDate.toLocaleDateString("vi-VN")}
                </Text>
                <Box className="cursor-pointer hover:bg-yellow-200 rounded-full p-0.5 transition-colors" onClick={() => setFilterStartDate(undefined)}>
                  <Icon icon="zi-close" size={12} />
                </Box>
              </Box>
            )}
            {filterEndDate && (
              <Box className="bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-soft">
                <Text size="xSmall" className="font-bold">
                  Đến {filterEndDate.toLocaleDateString("vi-VN")}
                </Text>
                <Box className="cursor-pointer hover:bg-yellow-200 rounded-full p-0.5 transition-colors" onClick={() => setFilterEndDate(undefined)}>
                  <Icon icon="zi-close" size={12} />
                </Box>
              </Box>
            )}
            <Box
              className="px-3 py-1.5 text-xs cursor-pointer hover:bg-yellow-50 rounded-full transition-colors active:scale-95"
              onClick={clearFilters}
            >
              <Text size="xSmall" className="text-yellow-600 font-bold">✕ Xóa tất cả</Text>
            </Box>
          </Box>
        )}
      </Box>

  <Box className="px-4 pt-4">
        <WalletSelector 
          selectedWalletId={filterWallet !== "all" ? filterWallet : undefined}
          onWalletChange={(walletId) => setFilterWallet(walletId || "all")}
          compact={true}
        />
      </Box>
      
      <Box className="flex-1 overflow-auto px-4 pt-4">
        {Object.keys(groupedTransactions).length === 0 ? (
          <Box className="text-center py-16 bg-white rounded-2xl shadow-card animate-fade-in">
            <Box className="bg-gradient-to-br from-gray-100 to-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="zi-search" size={40} className="text-gray-300" />
            </Box>
            <Text className="text-gray-400 font-medium">
              {searchTerm || activeFiltersCount > 0
                ? "Không tìm thấy giao dịch nào"
                : "Chưa có giao dịch nào"}
            </Text>
            <Text size="xSmall" className="text-gray-300 mt-1">
              {searchTerm || activeFiltersCount > 0
                ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                : "Bắt đầu thêm giao dịch ngay"}
            </Text>
          </Box>
        ) : (
          Object.entries(groupedTransactions).map(([dateKey, dayTransactions]) => {
            const dayTotal = dayTransactions.reduce((sum, t) => {
              return t.type === "income" ? sum + t.amount : sum - t.amount;
            }, 0);

            return (
              <Box key={dateKey} className="mb-4 animate-slide-up">
                <Box 
                  className="px-5 py-3 flex justify-between items-center rounded-t-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
                  }}
                >
                  <Text size="small" className="font-bold text-white">
                    {dateKey}
                  </Text>
                  <Box
                    className={`px-3 py-1.5 rounded-xl font-bold ${
                      dayTotal >= 0 
                        ? "bg-emerald-400/90 text-white" 
                        : "bg-rose-400/90 text-white"
                    }`}
                  >
                    <Text size="small" className="font-bold">
                      {dayTotal >= 0 ? "+" : ""}
                      {formatCurrency(dayTotal)}
                    </Text>
                  </Box>
                </Box>
                <Box className="bg-white rounded-b-2xl shadow-card overflow-hidden">
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
                        className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-all duration-200 cursor-pointer active:scale-98"
                      >
                        <Box className="flex items-center space-x-3 flex-1">
                          <Box
                            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
                            style={{
                              background: `linear-gradient(135deg, ${category?.color}15 0%, ${category?.color}25 100%)`,
                            }}
                          >
                            <Icon
                              icon={(category?.icon || "zi-more-grid") as any}
                              style={{ color: category?.color }}
                              size={24}
                            />
                          </Box>
                          <Box className="flex-1 min-w-0">
                            <Text size="small" className="font-bold text-gray-900">
                              {category?.name || "Khác"}
                            </Text>
                            <Text size="xSmall" className="text-gray-500">
                              {time}
                              {transaction.note && ` • ${transaction.note}`}
                            </Text>
                          </Box>
                        </Box>
                        <Box
                          className={`px-3 py-1.5 rounded-xl flex-shrink-0 ml-2 ${
                            transaction.type === "income"
                              ? "bg-gradient-to-r from-emerald-50 to-green-50"
                              : "bg-gradient-to-r from-rose-50 to-red-50"
                          }`}
                        >
                          <Text
                            size="small"
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
                { value: "all", label: "Tất cả", icon: "zi-list", activeColor: "text-gray-900" },
                { value: "income", label: "Thu nhập", icon: "zi-plus-circle", activeColor: "text-green-600" },
                { value: "expense", label: "Chi tiêu", icon: "zi-minus-circle", activeColor: "text-red-600" },
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
                  <Icon icon={option.icon as any} className="mr-1.5" size={18} />
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
              prefixIcon={<Icon icon="zi-delete" />}
            >
              Xóa bộ lọc
            </Button>
            <Button 
              fullWidth 
              onClick={() => setShowFilterSheet(false)}
              className="h-12 font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center justify-center bg-yellow-500 text-white border-none"
              prefixIcon={<Icon icon="zi-check-circle" />}
            >
              Áp dụng
            </Button>
          </Box>
        </Box>
      </Sheet>
    </Page>
  );
};

export default HistoryPage;
