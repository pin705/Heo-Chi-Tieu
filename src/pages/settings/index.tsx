import React, { FC } from "react";
import { Page, Box, Text, List, Button, useSnackbar } from "zmp-ui";
import AppHeader from "components/app-header";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, walletsState, transactionsState, categoriesState } from "expense-state";
import { openWebview } from "zmp-sdk";
import { Card } from "components/ui";
import { WalletIcon, CategoryIcon, BudgetIcon, CalendarIcon, ExportIcon, BackupIcon, GuideIcon, InfoIcon, DeleteIcon, ChevronRightIcon } from "components/icons";

const SettingsPage: FC = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const { openSnackbar } = useSnackbar();
  const setWallets = useSetRecoilState(walletsState);
  const setTransactions = useSetRecoilState(transactionsState);
  const setCategories = useSetRecoilState(categoriesState);

  const handleClearData = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu?")) {
      // Reset to default values by clearing storage
      setWallets([]);
      setTransactions([]);
      setCategories([]);
      
      // Reload the page to reinitialize with defaults
      window.location.reload();
      
      openSnackbar({
        type: "success",
        text: "Đã xóa toàn bộ dữ liệu",
      });
    }
  };

  return (
    <Page className="flex flex-col bg-background">
      <AppHeader title="Cài đặt" noBack />
      <Box className="flex-1 overflow-auto pb-20">
        {/* User Info */}
        <Card 
          className="m-4 animate-fadeIn"
          style={{
            background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
          }}
        >
          <Box className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
          <Box className="flex items-center space-x-3 relative z-10">
            <img
              className="w-16 h-16 rounded-2xl border-3 border-white shadow-lg"
              src={user.avatar.startsWith("http") ? user.avatar : undefined}
            />
            <Box className="flex-1">
              <Text.Title className="text-white font-bold text-lg">{user.name}</Text.Title>
              <Text size="small" className="text-white/80">
                ID: {user.id}
              </Text>
            </Box>
          </Box>
        </Card>

        {/* Settings List - Management */}
        <Box className="mt-4 mx-4">
          <Box className="px-1 mb-2">
            <Text size="xSmall" className="text-gray-600 font-semibold tracking-wide">QUẢN LÝ</Text>
          </Box>
          <Card padding="none" className="overflow-hidden">
            <Box 
              className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/manage-wallets")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <WalletIcon size={22} color="#EAB308" />
                </Box>
                <Text className="font-medium text-gray-900">Quản lý ví</Text>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
            <Box 
              className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/manage-categories")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <CategoryIcon size={22} color="#8B5CF6" />
                </Box>
                <Text className="font-medium text-gray-900">Quản lý danh mục</Text>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
            <Box 
              className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/budget")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <BudgetIcon size={22} color="#F59E0B" />
                </Box>
                <Text className="font-medium text-gray-900">Quản lý ngân sách</Text>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
            <Box 
              className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/history")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <CalendarIcon size={22} />
                </Box>
                <Text className="font-medium text-gray-900">Lịch sử giao dịch</Text>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
          </Card>
        </Box>

        {/* Data Management */}
        <Box className="mt-4 mx-4">
          <Box className="px-1 mb-2">
            <Text size="xSmall" className="text-gray-600 font-semibold tracking-wide">DỮ LIỆU</Text>
          </Box>
          <Card padding="none" className="overflow-hidden">
            <Box 
              className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/export")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <ExportIcon size={22} color="#22C55E" />
                </Box>
                <Box>
                  <Text className="font-medium text-gray-900">Xuất dữ liệu</Text>
                  <Text size="xSmall" className="text-gray-500">CSV, Excel, PDF</Text>
                </Box>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
            <Box 
              className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/backup")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <BackupIcon size={22} color="#3B82F6" />
                </Box>
                <Box>
                  <Text className="font-medium text-gray-900">Sao lưu & Khôi phục</Text>
                  <Text size="xSmall" className="text-gray-500">Bảo vệ dữ liệu của bạn</Text>
                </Box>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
          </Card>
        </Box>

        {/* Support */}
        <Box className="mt-4 mx-4">
          <Box className="px-1 mb-2">
            <Text size="xSmall" className="text-gray-600 font-semibold tracking-wide">HỖ TRỢ</Text>
          </Box>
          <Card padding="none" className="overflow-hidden">
            <Box 
              className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/guide")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <GuideIcon size={22} color="#F97316" />
                </Box>
                <Text className="font-medium text-gray-900">Hướng dẫn sử dụng</Text>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
            <Box 
              className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => {
                openSnackbar({
                  text: "Quản lý Chi Tiêu v1.0.0",
                });
              }}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <InfoIcon size={22} color="#06B6D4" />
                </Box>
                <Text className="font-medium text-gray-900">Giới thiệu</Text>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
          </Card>
        </Box>

        {/* Danger Zone */}
        <Box className="px-4 mt-4 mb-4">
          <Card>
            <Box className="mb-3">
              <Text size="xSmall" className="text-red-600 font-semibold tracking-wide">VÙNG NGUY HIỂM</Text>
            </Box>
            <Box
              onClick={handleClearData}
              className="flex items-center justify-center p-4 bg-red-50 rounded-2xl cursor-pointer active:scale-[0.98] transition-all border border-red-200"
            >
              <DeleteIcon size={20} color="#DC2626" className="mr-2" />
              <Text className="text-red-600 font-semibold">Xóa toàn bộ dữ liệu</Text>
            </Box>
          </Card>
        </Box>

        {/* Footer */}
        <Box className="px-4 pb-4 text-center">
          <Text size="xSmall" className="text-gray-500 block">
            Phiên bản 1.0.0
          </Text>
          <Text size="xSmall" className="text-gray-400 block mt-1">
            © 2025 Quản Lý Chi Tiêu
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default SettingsPage;
