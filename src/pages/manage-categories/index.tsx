import React, { FC, useState } from "react";
import {
  Page,
  Header,
  Box,
  Text,
  Button,
  Icon,
  useSnackbar,
  Sheet,
  Input,
  Select,
  Tabs,
} from "zmp-ui";
import { useRecoilState } from "recoil";
import { categoriesState } from "expense-state";
import { ExpenseCategory } from "types/expense-category";

const CATEGORY_ICONS = [
  { value: "zi-home", label: "Nhà" },
  { value: "zi-location", label: "Vị trí" },
  { value: "zi-gallery", label: "Mua sắm" },
  { value: "zi-play", label: "Giải trí" },
  { value: "zi-note", label: "Ghi chú" },
  { value: "zi-heart", label: "Yêu thích" },
  { value: "zi-star", label: "Ngôi sao" },
  { value: "zi-user-circle", label: "Người dùng" },
  { value: "zi-calendar", label: "Lịch" },
  { value: "zi-clock", label: "Đồng hồ" },
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
    icon: "zi-home",
    color: "#ef4444",
    type: "expense" as "expense" | "income",
  });

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  const handleOpenAddSheet = (type: "expense" | "income") => {
    setEditingCategory(null);
    setFormData({
      name: "",
      icon: "zi-home",
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
    <Box className="p-4 space-y-3">
      {categoryList.length === 0 ? (
        <Box className="bg-white rounded-xl p-8 text-center">
          <Icon icon="zi-home" size={48} className="text-gray-300 mb-3" />
          <Text className="text-gray-500">Chưa có danh mục nào</Text>
          <Text size="xSmall" className="text-gray-400 mt-1">
            Nhấn nút + bên dưới để thêm danh mục
          </Text>
        </Box>
      ) : (
        categoryList.map((category) => (
          <Box
            key={category.id}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <Box className="flex items-center justify-between">
              <Box className="flex items-center flex-1">
                <Box
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: category.color + "20" }}
                >
                  <Icon
                    icon={category.icon as any}
                    size={24}
                    style={{ color: category.color }}
                  />
                </Box>
                <Box className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    {category.name}
                  </Text>
                  <Text size="xSmall" className="text-gray-500">
                    {category.type === "expense" ? "Chi tiêu" : "Thu nhập"}
                  </Text>
                </Box>
              </Box>
              <Box className="flex gap-2">
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => handleOpenEditSheet(category)}
                >
                  <Icon icon="zi-edit" size={16} />
                </Button>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600"
                >
                  <Icon icon="zi-delete" size={16} />
                </Button>
              </Box>
            </Box>
          </Box>
        ))
      )}
      
      {/* Add Button */}
      <Box className="fixed bottom-20 right-4 z-10">
        <Button
          variant="primary"
          onClick={() => handleOpenAddSheet(type)}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
        >
          <Icon icon="zi-plus" size={24} />
        </Button>
      </Box>
    </Box>
  );

  return (
    <Page className="flex flex-col bg-gray-50">
      <Header title="Quản lý danh mục" showBackIcon={true} />
      <Box className="flex-1 overflow-auto pb-4">
        {/* Header Info */}
        <Box className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
          <Text.Title className="text-white text-2xl font-bold mb-2">
            Danh mục thu chi
          </Text.Title>
          <Box className="flex gap-4 mt-3">
            <Box>
              <Text size="xSmall" className="text-white opacity-90">
                Chi tiêu
              </Text>
              <Text className="text-white font-bold text-lg">
                {expenseCategories.length} danh mục
              </Text>
            </Box>
            <Box>
              <Text size="xSmall" className="text-white opacity-90">
                Thu nhập
              </Text>
              <Text className="text-white font-bold text-lg">
                {incomeCategories.length} danh mục
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
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
