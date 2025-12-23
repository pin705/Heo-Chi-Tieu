import React, { FC, useState } from "react";
import { Page, Box, Text, Button, useSnackbar, Sheet, Input, Select, Tabs } from "zmp-ui";
import AppHeader from "components/app-header";
import { useRecoilState } from "recoil";
import { categoriesState } from "expense-state";
import { ExpenseCategory } from "types/expense-category";
import { 
  getIcon, 
  CategoryIcon, 
  PlusIcon, 
  EditIcon, 
  DeleteIcon,
  FoodIcon,
  ShoppingIcon,
  TransportIcon,
  EntertainmentIcon
} from "components/icons";

const CATEGORY_ICONS = [
  { value: "food", label: "Ăn uống" },
  { value: "shopping", label: "Mua sắm" },
  { value: "transport", label: "Di chuyển" },
  { value: "entertainment", label: "Giải trí" },
  { value: "coffee", label: "Cafe" },
  { value: "bill", label: "Hóa đơn" },
  { value: "health", label: "Sức khỏe" },
  { value: "education", label: "Giáo dục" },
  { value: "family", label: "Gia đình" },
  { value: "salary", label: "Lương" },
  { value: "investment", label: "Đầu tư" },
  { value: "gift", label: "Quà tặng" },
  { value: "other", label: "Khác" },
];

const CATEGORY_COLORS = [
  { value: "#ef4444", label: "Đỏ" },
  { value: "#f59e0b", label: "Cam" },
  { value: "#ec4899", label: "Hồng" },
  { value: "#8b5cf6", label: "Tím" },
  { value: "#06b6d4", label: "Xanh dương nhạt" },
  { value: "#10b981", label: "Xanh lá" },
  { value: "#3b82f6", label: "Xanh dương" },
  { value: "#6366f1", label: "Xanh tím" },
];

const ManageCategoriesPage: FC = () => {
  const [categories, setCategories] = useRecoilState(categoriesState);
  const { openSnackbar } = useSnackbar();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [formData, setFormData] = useState({
    name: "",
    icon: "food",
    color: "#ef4444",
    type: "expense" as "expense" | "income",
  });

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  const handleOpenAddSheet = (type: "expense" | "income") => {
    setEditingCategory(null);
    setFormData({
      name: "",
      icon: "food",
      color: "#ef4444",
      type,
    });
    setSheetVisible(true);
  };

  const handleOpenEditSheet = (category: ExpenseCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
      type: category.type,
    });
    setSheetVisible(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      openSnackbar({
        type: "error",
        text: "Vui lòng nhập tên danh mục",
      });
      return;
    }

    if (editingCategory) {
      // Update existing category
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: formData.name,
                icon: formData.icon,
                color: formData.color,
              }
            : c
        )
      );
      openSnackbar({
        type: "success",
        text: "Cập nhật danh mục thành công",
      });
    } else {
      // Add new category
      const newCategory: ExpenseCategory = {
        id: Date.now().toString(),
        name: formData.name,
        icon: formData.icon,
        color: formData.color,
        type: formData.type,
      };
      setCategories([...categories, newCategory]);
      openSnackbar({
        type: "success",
        text: "Thêm danh mục thành công",
      });
    }

    setSheetVisible(false);
  };

  const handleDelete = (categoryId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      setCategories(categories.filter((c) => c.id !== categoryId));
      openSnackbar({
        type: "success",
        text: "Xóa danh mục thành công",
      });
    }
  };

  const renderCategoryList = (categoryList: ExpenseCategory[], type: "expense" | "income") => (
    <Box className="p-4 pb-24 space-y-2.5">
      {categoryList.length === 0 ? (
        <Box className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <Box className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CategoryIcon size={40} color="#9CA3AF" />
          </Box>
          <Text className="text-gray-600 font-medium">Chưa có danh mục nào</Text>
          <Text size="xSmall" className="text-gray-400 mt-2">
            Nhấn nút + bên dưới để thêm danh mục
          </Text>
        </Box>
      ) : (
        categoryList.map((category) => {
          const IconComponent = getIcon(category.icon) || CategoryIcon;
          return (
            <Box
              key={category.id}
              className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] active:scale-[0.99] transition-all"
            >
              <Box className="flex items-center justify-between">
                <Box className="flex items-center flex-1">
                  <Box
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-inner"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <IconComponent
                      size={28}
                      color={category.color}
                    />
                  </Box>
                  <Box className="flex-1">
                    <Text className="font-bold text-gray-900 mb-1 text-lg">
                      {category.name}
                    </Text>
                    <Text size="xSmall" className="text-gray-500 font-medium">
                      {category.type === "expense" ? "Chi tiêu" : "Thu nhập"}
                    </Text>
                  </Box>
                </Box>
                <Box className="flex gap-3">
                  <Box
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleOpenEditSheet(category)}
                  >
                    <EditIcon size={20} color="#4B5563" />
                  </Box>
                  <Box
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 active:bg-red-100 cursor-pointer transition-colors"
                    onClick={() => handleDelete(category.id)}
                  >
                    <DeleteIcon size={20} color="#EF4444" />
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })
      )}
      
      {/* Add Button */}
      <Box className="fixed bottom-8 right-6 z-50">
        <Box
          onClick={() => handleOpenAddSheet(type)}
          className="w-16 h-16 rounded-full shadow-xl flex items-center justify-center bg-yellow-400 cursor-pointer active:scale-90 transition-all hover:shadow-2xl"
        >
          <PlusIcon size={32} color="#1F2937" />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Page className="flex flex-col bg-gray-50">
      <AppHeader title="Quản lý danh mục" />
      <Box className="flex-1 overflow-auto pb-4">
        {/* Header Info */}
        <Box className="rounded-2xl m-4 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 relative overflow-hidden">
          <Box className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 opacity-10 rounded-full -mr-16 -mt-16" />
          <Box className="relative z-10">
            <Text.Title className="text-gray-900 text-2xl font-black mb-3">
              Danh mục thu chi
            </Text.Title>
            <Box className="flex gap-8">
              <Box>
                <Text size="xSmall" className="text-gray-500 font-medium mb-1 uppercase tracking-wider">
                  Chi tiêu
                </Text>
                <Text className="text-gray-900 font-bold text-xl">
                  {expenseCategories.length} danh mục
                </Text>
              </Box>
              <Box>
                <Text size="xSmall" className="text-gray-500 font-medium mb-1 uppercase tracking-wider">
                  Thu nhập
                </Text>
                <Text className="text-gray-900 font-bold text-xl">
                  {incomeCategories.length} danh mục
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
       <Box className="mx-4 rounded-2xl overflow-hidden shadow-sm">
         <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as "expense" | "income")}
          className="bg-white"
        >
          <Tabs.Tab key="expense" label="Chi tiêu">
            {renderCategoryList(expenseCategories, "expense")}
          </Tabs.Tab>
          <Tabs.Tab key="income" label="Thu nhập">
            {renderCategoryList(incomeCategories, "income")}
          </Tabs.Tab>
        </Tabs>
        </Box>

        {/* Add/Edit Sheet */}
        <Sheet
          visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
          autoHeight
          mask
          handler
          swipeToClose
        >
          <Box className="p-4 pb-8">
            <Text.Title className="mb-4">
              {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </Text.Title>

            <Box className="space-y-4">
              <Box>
                <Text size="small" className="mb-2 text-gray-700">
                  Tên danh mục <span className="text-red-500">*</span>
                </Text>
                <Input
                  type="text"
                  placeholder="VD: Ăn uống, Lương..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Box>

              <Box>
                <Text size="small" className="mb-2 text-gray-700">
                  Loại
                </Text>
                <Select
                  value={formData.type}
                  onChange={(value) =>
                    setFormData({ ...formData, type: value as "expense" | "income" })
                  }
                  disabled={!!editingCategory}
                >
                  <option value="expense">Chi tiêu</option>
                  <option value="income">Thu nhập</option>
                </Select>
              </Box>

              <Box>
                <Text size="small" className="mb-2 text-gray-700">
                  Biểu tượng
                </Text>
                <Select
                  value={formData.icon}
                  onChange={(value) =>
                    setFormData({ ...formData, icon: value as string })
                  }
                >
                  {CATEGORY_ICONS.map((icon) => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text size="small" className="mb-2 text-gray-700">
                  Màu sắc
                </Text>
                <Box className="grid grid-cols-8 gap-2">
                  {CATEGORY_COLORS.map((color) => (
                    <Box
                      key={color.value}
                      className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                        formData.color === color.value
                          ? "border-gray-800"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() =>
                        setFormData({ ...formData, color: color.value })
                      }
                    />
                  ))}
                </Box>
              </Box>

              <Box className="flex gap-2 pt-2">
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={() => setSheetVisible(false)}
                >
                  Hủy
                </Button>
                <Button fullWidth variant="primary" onClick={handleSave}>
                  {editingCategory ? "Cập nhật" : "Thêm"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Sheet>
      </Box>
    </Page>
  );
};

export default ManageCategoriesPage;
