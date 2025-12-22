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
          className="mx-4 mt-3 relative overflow-hidden"
          padding="md"
          style={{
            background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
          }}
        >
          <Box className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12" />
          <Box className="flex items-center space-x-3">
            <img
              className="w-14 h-14 rounded-xl border-2 border-white/30 shadow-md"
              src={user.avatar.startsWith("http") ? user.avatar : undefined}
            />
            <Box className="flex-1">
              <Text className="text-white font-bold text-base">{user.name}</Text>
              <Text size="xSmall" className="text-white/70">
                ID: {user.id}
              </Text>
            </Box>
          </Box>
        </Card>

        {/* Settings List - Management */}
        <Box className="mt-4 mx-4">
          <Box className="px-1 mb-2">
            <Text size="xxSmall" className="text-gray-500 font-semibold tracking-wider">QUẢN LÝ</Text>
          </Box>
          <Card padding="none" className="overflow-hidden shadow-sm">
            <Box 
              className="flex items-center justify-between p-3 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/manage-wallets")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <WalletIcon size={20} color="#EAB308" />
                </Box>
                <Text className="font-medium text-gray-900 text-sm">Quản lý ví</Text>
              </Box>
              <ChevronRightIcon size={18} color="#9CA3AF" />
            </Box>
            <Box 
              className="flex items-center justify-between p-3 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/manage-categories")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                  <CategoryIcon size={20} color="#8B5CF6" />
                </Box>
                <Text className="font-medium text-gray-900 text-sm">Quản lý danh mục</Text>
              </Box>
              <ChevronRightIcon size={18} color="#9CA3AF" />
            </Box>
            <Box 
              className="flex items-center justify-between p-3 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/budget")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <BudgetIcon size={20} color="#F59E0B" />
                </Box>
                <Text className="font-medium text-gray-900 text-sm">Quản lý ngân sách</Text>
              </Box>
              <ChevronRightIcon size={18} color="#9CA3AF" />
            </Box>
            <Box 
              className="flex items-center justify-between p-3 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/history")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <CalendarIcon size={20} />
                </Box>
                <Text className="font-medium text-gray-900 text-sm">Lịch sử giao dịch</Text>
              </Box>
              <ChevronRightIcon size={18} color="#9CA3AF" />
            </Box>
          </Card>
        </Box>

        {/* Data Management */}
        <Box className="mt-4 mx-4">
          <Box className="px-1 mb-2">
            <Text size="xxSmall" className="text-gray-500 font-semibold tracking-wider">DỮ LIỆU</Text>
          </Box>
          <Card padding="none" className="overflow-hidden shadow-sm">
            <Box 
              className="flex items-center justify-between p-3 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/export")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                  <ExportIcon size={20} color="#22C55E" />
                </Box>
                <Box>
                  <Text className="font-medium text-gray-900 text-sm">Xuất dữ liệu</Text>
                  <Text size="xxSmall" className="text-gray-500">CSV, Excel, PDF</Text>
                </Box>
              </Box>
              <ChevronRightIcon size={18} color="#9CA3AF" />
            </Box>
            <Box 
              className="flex items-center justify-between p-3 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/backup")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BackupIcon size={20} color="#3B82F6" />
                </Box>
                <Box>
                  <Text className="font-medium text-gray-900 text-sm">Sao lưu & Khôi phục</Text>
                  <Text size="xxSmall" className="text-gray-500">Bảo vệ dữ liệu của bạn</Text>
                </Box>
              </Box>
              <ChevronRightIcon size={18} color="#9CA3AF" />
            </Box>
          </Card>
        </Box>

        {/* Support */}
        <Box className="mt-4 mx-4">
          <Box className="px-1 mb-2">
            <Text size="xxSmall" className="text-gray-500 font-semibold tracking-wider">HỖ TRỢ</Text>
          </Box>
          <Card padding="none" className="overflow-hidden shadow-sm">
            <Box 
              className="flex items-center justify-between p-3 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => navigate("/guide")}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                  <GuideIcon size={20} color="#F97316" />
                </Box>
                <Text className="font-medium text-gray-900 text-sm">Hướng dẫn sử dụng</Text>
              </Box>
              <ChevronRightIcon size={18} color="#9CA3AF" />
            </Box>
            <Box 
              className="flex items-center justify-between p-3 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => {
                openSnackbar({
                  text: "Quản lý Chi Tiêu v1.0.0",
                });
              }}
            >
              <Box className="flex items-center space-x-3">
                <Box className="w-9 h-9 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <InfoIcon size={20} color="#06B6D4" />
                </Box>
                <Text className="font-medium text-gray-900 text-sm">Giới thiệu</Text>
              </Box>
              <ChevronRightIcon size={18} color="#9CA3AF" />
            </Box>
          </Card>
        </Box>

        {/* Danger Zone */}
        <Box className="px-4 mt-4 mb-4">
          <Box className="px-1 mb-2">
            <Text size="xxSmall" className="text-red-500 font-semibold tracking-wider">VÙNG NGUY HIỂM</Text>
          </Box>
          <Box
            onClick={handleClearData}
            className="flex items-center justify-center p-3 bg-red-50 rounded-xl cursor-pointer active:scale-[0.98] transition-all border border-red-200"
          >
            <DeleteIcon size={18} color="#DC2626" className="mr-2" />
            <Text className="text-red-600 font-semibold text-sm">Xóa toàn bộ dữ liệu</Text>
          </Box>
        </Box>

        {/* Footer */}
        <Box className="px-4 pb-4 text-center">
          <Text size="xxSmall" className="text-gray-400 block">
            Phiên bản 1.0.0 • © 2025 Quản Lý Chi Tiêu
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default SettingsPage;
