import React, { FC } from "react";
import { Page, Box, Text, useSnackbar } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, walletsState, transactionsState, categoriesState } from "expense-state";
import { ChevronRightIcon, getIcon } from "components/icons";

const SettingsPage: FC = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const { openSnackbar } = useSnackbar();
  const setWallets = useSetRecoilState(walletsState);
  const setTransactions = useSetRecoilState(transactionsState);
  const setCategories = useSetRecoilState(categoriesState);

  const handleClearData = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu?")) {
      setWallets([]);
      setTransactions([]);
      setCategories([]);
      window.location.reload();
      openSnackbar({
        type: "success",
        text: "Đã xóa toàn bộ dữ liệu",
      });
    }
  };

  const menuItems = [
    {
      icon: "👍",
      label: "Giới thiệu cho bạn bè",
      onClick: () => openSnackbar({ text: "Tính năng đang phát triển" }),
    },
    {
      icon: "🚫",
      label: "Chặn quảng cáo",
      onClick: () => openSnackbar({ text: "Tính năng đang phát triển" }),
    },
    {
      icon: "⚙️",
      label: "Cài đặt",
      onClick: () => navigate("/manage-categories"),
      showSubmenu: true,
    },
    {
      icon: "📱",
      label: "Ứng dụng của chúng tôi",
      onClick: () => openSnackbar({ text: "Tính năng đang phát triển" }),
      badge: true,
    },
  ];

  return (
    <Page className="flex flex-col bg-gray-50 min-h-screen">
      {/* Yellow Header with User Info */}
      <Box 
        className="flex-none"
        style={{ 
          background: '#FBBF24',
          paddingTop: 'var(--safe-top)',
        }}
      >
        <Box className="px-4 py-6 pr-24">
          <Box className="flex items-center space-x-4">
            {/* User Avatar */}
            <Box className="relative">
              {user.avatar.startsWith("http") ? (
                <img
                  className="w-16 h-16 rounded-full border-2 border-white shadow-lg object-cover"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <Box className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-lg">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="#9CA3AF" strokeWidth="2"/>
                    <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </Box>
              )}
            </Box>
            <Box>
              <Text className="text-black text-lg font-bold">{user.name || "Đăng nhập"}</Text>
              <Text size="small" className="text-black/70">
                {user.name ? `ID: ${user.id?.slice(0, 8)}...` : "Đăng nhập, thú vị hơn!"}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box className="flex-1 overflow-auto pb-24 -mt-2">
        {/* Premium Card */}
        <Box className="mx-4 mb-3">
          <Box 
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:bg-gray-50"
            onClick={() => openSnackbar({ text: "Tính năng đang phát triển" })}
          >
            <Box className="flex items-center space-x-3">
              <Text className="text-2xl">👑</Text>
              <Text className="font-bold text-gray-900">Thành viên Premium</Text>
            </Box>
            <ChevronRightIcon size={20} color="#9CA3AF" />
          </Box>
        </Box>

        {/* Menu Items */}
        <Box className="mx-4">
          <Box className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {menuItems.map((item, index) => (
              <Box
                key={index}
                className={`flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 ${
                  index < menuItems.length - 1 ? "border-b border-gray-100" : ""
                }`}
                onClick={item.onClick}
              >
                <Box className="flex items-center space-x-3">
                  <Text className="text-xl">{item.icon}</Text>
                  <Text className="font-medium text-gray-900">{item.label}</Text>
                </Box>
                <Box className="flex items-center space-x-2">
                  {item.badge && (
                    <Box className="w-2 h-2 rounded-full bg-red-500" />
                  )}
                  <ChevronRightIcon size={20} color="#9CA3AF" />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Quick Access */}
        <Box className="mx-4 mt-4">
          <Text size="xSmall" className="text-gray-500 font-medium mb-2 px-1">QUẢN LÝ</Text>
          <Box className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <Box
              className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 border-b border-gray-100"
              onClick={() => navigate("/manage-wallets")}
            >
              <Box className="flex items-center space-x-3">
                <Text className="text-xl">💼</Text>
                <Text className="font-medium text-gray-900">Quản lý ví</Text>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
            <Box
              className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 border-b border-gray-100"
              onClick={() => navigate("/manage-categories")}
            >
              <Box className="flex items-center space-x-3">
                <Text className="text-xl">📂</Text>
                <Text className="font-medium text-gray-900">Quản lý danh mục</Text>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
            <Box
              className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 border-b border-gray-100"
              onClick={() => navigate("/budget")}
            >
              <Box className="flex items-center space-x-3">
                <Text className="text-xl">💰</Text>
                <Text className="font-medium text-gray-900">Ngân sách</Text>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
            <Box
              className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 border-b border-gray-100"
              onClick={() => navigate("/export")}
            >
              <Box className="flex items-center space-x-3">
                <Text className="text-xl">📊</Text>
                <Text className="font-medium text-gray-900">Xuất dữ liệu</Text>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
            <Box
              className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50"
              onClick={() => navigate("/backup")}
            >
              <Box className="flex items-center space-x-3">
                <Text className="text-xl">☁️</Text>
                <Text className="font-medium text-gray-900">Sao lưu & Khôi phục</Text>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
          </Box>
        </Box>

        {/* Danger Zone */}
        <Box className="mx-4 mt-4">
          <Box
            onClick={handleClearData}
            className="flex items-center justify-center p-4 bg-red-50 rounded-2xl cursor-pointer active:scale-[0.98] transition-all border border-red-200"
          >
            <Text className="text-red-600 font-semibold">🗑️ Xóa toàn bộ dữ liệu</Text>
          </Box>
        </Box>

        {/* Footer */}
        <Box className="px-4 py-6 text-center">
          <Text size="xSmall" className="text-gray-400">
            Sổ Thu Chi v1.0.0 • © 2025
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default SettingsPage;
