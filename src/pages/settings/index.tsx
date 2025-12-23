import React, { FC } from "react";
import { Page, Box, Text, useSnackbar } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, walletsState, transactionsState, categoriesState } from "expense-state";
import { 
  ChevronRightIcon, 
  getIcon, 
  ShareIcon, 
  AdBlockIcon, 
  SettingsIcon, 
  AppIcon, 
  WalletIcon, 
  CategoryIcon, 
  BudgetIcon, 
  ExportIcon, 
  BackupIcon, 
  DeleteIcon,
  TrophyIcon
} from "components/icons";
import { AppLogo } from "components/logo";

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

  return (
    <Page className="flex flex-col  min-h-screen">
      {/* Yellow Header with User Info */}
      <Box 
        className="flex-none relative z-10"
        style={{ 
          background: '#FBBF24',
          paddingTop: 'var(--safe-top)',
        }}
      >
        <Box className="px-4 py-8 pr-24">
          <Box className="flex items-center space-x-4">
            {/* User Avatar */}
            <Box className="relative">
              {user.avatar.startsWith("http") ? (
                <img
                  className="w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <Box className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-xl">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="#9CA3AF" strokeWidth="2"/>
                    <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </Box>
              )}
              <Box className="absolute bottom-0 right-0 bg-yellow-500 border-2 border-white rounded-full p-1 shadow-md">
                <TrophyIcon size={12} color="#FFFFFF" />
              </Box>
            </Box>
            <Box>
              <Text className="text-black text-xl font-bold">{user.name || "Đăng nhập"}</Text>
              <Text size="small" className="text-black/70 font-medium">
                {user.name ? `ID: ${user.id?.slice(0, 8)}` : "Đăng nhập để đồng bộ dữ liệu"}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box className="flex-1 overflow-auto pb-24 -mt-4">
        {/* Premium Card */}
        {/* <Box className="mx-4 mb-4">
          <Box 
            className="bg-gray-900 rounded-2xl p-5 shadow-lg flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
            onClick={() => openSnackbar({ text: "Tính năng đang phát triển" })}
          >
            <Box className="flex items-center space-x-4">
              <Box className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center shadow-inner">
                <TrophyIcon size={28} color="#000000" />
              </Box>
              <Box>
                <Text className="font-bold text-white text-lg">Nâng cấp Premium</Text>
                <Text size="xSmall" className="text-yellow-400 font-medium">Mở khóa tất cả tính năng</Text>
              </Box>
            </Box>
            <ChevronRightIcon size={24} color="#FBBF24" />
          </Box>
        </Box> */}

        {/* Quick Access */}
        <Box className="mx-4 mt-6">
          <Text size="xSmall" className="text-gray-400 font-bold mb-3 px-1 tracking-wider uppercase">Quản lý dữ liệu</Text>
          <Box className="bg-white rounded-2xl shadow-sm overflow-hidden ">
            {[
              { icon: <WalletIcon size={20} color="#F59E0B" />, label: "Quản lý ví", path: "/manage-wallets" },
              { icon: <CategoryIcon size={20} color="#10B981" />, label: "Quản lý danh mục", path: "/manage-categories" },
              { icon: <BudgetIcon size={20} color="#3B82F6" />, label: "Ngân sách", path: "/budget" },
              { icon: <ExportIcon size={20} color="#8B5CF6" />, label: "Xuất dữ liệu", path: "/export" },
              { icon: <BackupIcon size={20} color="#EC4899" />, label: "Sao lưu & Khôi phục", path: "/backup" },
            ].map((item, index, arr) => (
              <Box
                key={index}
                className={`flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 ${
                  index < arr.length - 1 ? "" : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                <Box className="flex items-center space-x-4">
                  <Box className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    {item.icon}
                  </Box>
                  <Text className="font-semibold text-gray-800">{item.label}</Text>
                </Box>
                <ChevronRightIcon size={20} color="#D1D5DB" />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Danger Zone */}
        <Box className="mx-4 mt-8">
          <Box
            onClick={handleClearData}
            className="flex items-center justify-center p-4 bg-red-50 rounded-2xl cursor-pointer active:scale-[0.98] transition-all border border-red-100"
          >
            <DeleteIcon size={20} color="#EF4444" className="mr-2" />
            <Text className="text-red-600 font-bold">Xóa toàn bộ dữ liệu</Text>
          </Box>
        </Box>

        {/* Footer */}
        <Box className="px-4 py-10 flex flex-col items-center justify-center space-y-3">
          <AppLogo size={56} />
          <Box className="text-center">
            <Text className="text-gray-900 font-black text-lg tracking-tight">Heo Chi Tiêu</Text>
            <Text size="xSmall" className="text-gray-400 font-medium">
              Phiên bản 1.0.0 • Made with ❤️
            </Text>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default SettingsPage;
