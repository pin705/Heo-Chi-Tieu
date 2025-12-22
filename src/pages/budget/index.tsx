import React, { FC, useState } from "react";
import {
  Page,
  Box,
  Text,
  List,
  Button,
  Sheet,
  Input,
  Select,
  useSnackbar,
} from "zmp-ui";
import DatePicker from "zmp-ui/date-picker";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  budgetsState,
  expenseCategoriesState,
  currentMonthBudgetState,
  currentMonthCategoryBudgetsState,
} from "expense-state";
import { Budget, BudgetFormData } from "types/budget";
import { formatCurrency } from "utils/format";
import AppHeader from "components/app-header";
import { WalletSelector } from "components/wallet-selector";
import { Card, AnimatedNumber } from "components/ui";
import { BudgetIcon, PlusIcon, DeleteIcon, CategoryIcon, CalendarIcon, CheckIcon, getIcon } from "components/icons";

const BudgetPage: FC = () => {
  const { openSnackbar } = useSnackbar();
  const [budgets, setBudgets] = useRecoilState(budgetsState);
  const expenseCategories = useRecoilValue(expenseCategoriesState);
  const monthlyBudget = useRecoilValue(currentMonthBudgetState);
  const categoryBudgets = useRecoilValue(currentMonthCategoryBudgetsState);

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState<BudgetFormData>({
    type: "monthly",
    amount: "",
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const handleAddBudget = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      openSnackbar({
        type: "error",
        text: "Vui lòng nhập số tiền hợp lệ",
      });
      return;
    }

    if (formData.type === "category" && !formData.categoryId) {
      openSnackbar({
        type: "error",
        text: "Vui lòng chọn danh mục",
      });
      return;
    }

    // Check if budget already exists
    const existingBudget = budgets.find(
      (b) =>
        b.month === formData.month &&
        b.year === formData.year &&
        b.type === formData.type &&
        (formData.type === "monthly" || b.categoryId === formData.categoryId)
    );

    if (existingBudget) {
      // Update existing budget
      setBudgets(
        budgets.map((b) =>
          b.id === existingBudget.id
            ? { ...b, amount: parseFloat(formData.amount) }
            : b
        )
      );
      openSnackbar({
        type: "success",
        text: "Đã cập nhật ngân sách",
      });
    } else {
      // Add new budget
      const newBudget: Budget = {
        id: Date.now().toString(),
        type: formData.type,
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        month: formData.month,
        year: formData.year,
        createdAt: Date.now(),
      };

      setBudgets([...budgets, newBudget]);
      openSnackbar({
        type: "success",
        text: "Đã thêm ngân sách",
      });
    }

    setShowAddSheet(false);
    setFormData({
      type: "monthly",
      amount: "",
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    });
    setSelectedDate(new Date());
  };

  const handleDeleteBudget = (budgetId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa ngân sách này?")) {
      setBudgets(budgets.filter((b) => b.id !== budgetId));
      openSnackbar({
        type: "success",
        text: "Đã xóa ngân sách",
      });
    }
  };

  const getMonthName = (month: number): string => {
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    return months[month];
  };

  return (
    <Page className="flex flex-col bg-background">
      <AppHeader title="Quản lý ngân sách" />
      <Box className="flex-1 overflow-auto pb-20">
        {/* Wallet Selector */}
        <Box className="px-4 pt-4">
          <WalletSelector compact={true} />
        </Box>

        {/* Monthly Budget Section */}
        <Box className="px-4 pt-4">
          <Box className="flex items-center justify-between mb-3">
            <Text.Title size="small" className="font-semibold">Ngân sách tháng</Text.Title>
            <Box
              className="flex items-center px-3 py-2 bg-yellow-500 rounded-xl cursor-pointer active:scale-95 transition-transform shadow-md"
              onClick={() => {
                setFormData({
                  type: "monthly",
                  amount: monthlyBudget?.amount.toString() || "",
                  month: new Date().getMonth(),
                  year: new Date().getFullYear(),
                });
                setShowAddSheet(true);
              }}
            >
              <PlusIcon size={16} color="#FFFFFF" className="mr-1" />
              <Text size="xSmall" className="text-white font-semibold">
                {monthlyBudget ? "Sửa" : "Thêm"}
              </Text>
            </Box>
          </Box>

          {monthlyBudget ? (
            <Card 
              className="animate-fadeIn"
              padding="lg"
              style={{
                background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
              }}
            >
              <Text size="small" className="text-white/90">
                {getMonthName(monthlyBudget.month)} {monthlyBudget.year}
              </Text>
              <Text.Title size="large" className="mt-3 mb-4 font-bold text-white">
                <AnimatedNumber value={monthlyBudget.amount} formatFn={formatCurrency} />
              </Text.Title>
              <Box
                className="flex items-center justify-center px-4 py-2 bg-white/20 rounded-xl cursor-pointer active:scale-95 transition-transform"
                onClick={() => handleDeleteBudget(monthlyBudget.id)}
              >
                <DeleteIcon size={18} color="#FFFFFF" className="mr-2" />
                <Text size="small" className="text-white font-semibold">Xóa ngân sách</Text>
              </Box>
            </Card>
          ) : (
            <Card className="text-center border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
              <CalendarIcon size={48} color="#9CA3AF" className="mx-auto mb-3" />
              <Text className="text-gray-500 font-medium">
                Chưa thiết lập ngân sách cho tháng này
              </Text>
            </Card>
          )}
        </Box>

        {/* Category Budgets Section */}
        <Box className="p-4">
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center">
              <CategoryIcon size={20} color="#8B5CF6" className="mr-2" />
              <Text.Title size="small">Ngân sách theo danh mục</Text.Title>
            </Box>
            <Box
              className="flex items-center px-3 py-2 bg-yellow-500 rounded-xl cursor-pointer active:scale-95 transition-transform shadow-md"
              onClick={() => {
                setFormData({
                  type: "category",
                  amount: "",
                  categoryId: expenseCategories[0]?.id,
                  month: new Date().getMonth(),
                  year: new Date().getFullYear(),
                });
                setSelectedDate(new Date());
                setShowAddSheet(true);
              }}
            >
              <PlusIcon size={16} color="#FFFFFF" className="mr-1" />
              <Text size="xSmall" className="text-white font-semibold">Thêm</Text>
            </Box>
          </Box>

          {categoryBudgets.length === 0 ? (
            <Card className="text-center border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
              <CategoryIcon size={48} color="#9CA3AF" className="mx-auto mb-3" />
              <Text className="text-gray-500 font-medium">
                Chưa có ngân sách theo danh mục
              </Text>
            </Card>
          ) : (
            <Card padding="none" className="overflow-hidden">
              {categoryBudgets.map((budget, index) => {
                const category = expenseCategories.find(
                  (c) => c.id === budget.categoryId
                );
                const IconComponent = getIcon(category?.icon || "other");
                return (
                  <Box
                    key={budget.id}
                    className={`flex items-center justify-between p-4 ${index < categoryBudgets.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <Box className="flex items-center space-x-3">
                      <Box
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `${category?.color}20`,
                        }}
                      >
                        {IconComponent && <IconComponent size={20} color={category?.color || "#6B7280"} />}
                      </Box>
                      <Box>
                        <Text className="font-medium text-gray-900">{category?.name || "Khác"}</Text>
                        <Text size="xSmall" className="text-gray-500">{getMonthName(budget.month)} {budget.year}</Text>
                      </Box>
                    </Box>
                    <Box className="flex items-center space-x-3">
                      <Text className="font-semibold text-gray-900">
                        {formatCurrency(budget.amount)}
                      </Text>
                      <Box
                        className="p-2 rounded-lg cursor-pointer active:bg-red-50 transition-colors"
                        onClick={() => handleDeleteBudget(budget.id)}
                      >
                        <DeleteIcon size={18} color="#EF4444" />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Card>
          )}
        </Box>
      </Box>

      {/* Add/Edit Budget Sheet */}
      <Sheet
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="p-5">
          <Box className="flex items-center justify-center mb-5">
            {formData.type === "monthly" ? (
              <BudgetIcon size={24} color="#EAB308" className="mr-2" />
            ) : (
              <CategoryIcon size={24} color="#8B5CF6" className="mr-2" />
            )}
            <Text.Title>
              {formData.type === "monthly"
                ? "Ngân sách tháng"
                : "Ngân sách danh mục"}
            </Text.Title>
          </Box>

          {formData.type === "category" && (
            <Box className="mb-5">
              <Text size="small" className="mb-3 text-gray-700 font-medium">
                Danh mục
              </Text>
              <Select
                value={formData.categoryId}
                onChange={(value) =>
                  setFormData({ ...formData, categoryId: value as string })
                }
                className="bg-white  rounded-xl"
              >
                {expenseCategories.map((category) => (
                  <Select.Option
                    key={category.id}
                    value={category.id}
                    title={category.name}
                  />
                ))}
              </Select>
            </Box>
          )}

          <Box className="mb-5">
            <Text size="small" className="mb-3 text-gray-700 font-medium">
              Số tiền (VNĐ)
            </Text>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="Nhập số tiền"
              className="bg-white  rounded-xl"
            />
          </Box>

          <Box className="mb-5">
            <DatePicker
              label="Tháng/Năm"
              placeholder="Chọn tháng và năm"
              value={selectedDate}
              onChange={(value) => {
                setSelectedDate(value);
                setFormData({ 
                  ...formData, 
                  month: value.getMonth(), 
                  year: value.getFullYear() 
                });
              }}
              dateFormat="mm/yyyy"
              columnsFormat="MM-DD-YYYY"
              title="Chọn tháng và năm"
              locale="vi-VN"
              mask
              maskClosable
              inputClass="bg-white  rounded-xl"
            />
          </Box>

          <Box className="flex space-x-3">
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setShowAddSheet(false)}
              className="h-12 font-semibold shadow-sm hover:shadow-md transition-shadow"
            >
              Hủy
            </Button>
            <Box
              className="flex-1 flex items-center justify-center h-12 rounded-xl cursor-pointer active:scale-[0.98] transition-transform shadow-md"
              style={{
                background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
              }}
              onClick={handleAddBudget}
            >
              <CheckIcon size={20} color="#FFFFFF" className="mr-2" />
              <Text className="text-white font-semibold">Lưu</Text>
            </Box>
          </Box>
        </Box>
      </Sheet>
    </Page>
  );
};

export default BudgetPage;
