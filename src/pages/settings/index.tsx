import React, { FC } from "react";
import { Page, Header, Box, Text, List, Icon, Button, useSnackbar } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, walletsState, transactionsState, categoriesState } from "expense-state";
import { openWebview } from "zmp-sdk";

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
    <Page className="flex flex-col bg-white">
      <Header title="Cài đặt" showBackIcon={false} />
      <Box className="flex-1 overflow-auto bg-gray-50">
        {/* User Info */}
        <Box className="p-4 bg-gradient-to-r from-green-500 to-emerald-600">
          <Box className="flex items-center space-x-3">
            <img
              className="w-16 h-16 rounded-full border-2 border-white"
              src={user.avatar.startsWith("http") ? user.avatar : undefined}
            />
            <Box>
              <Text.Title className="text-white font-bold">{user.name}</Text.Title>
              <Text size="small" className="text-white opacity-95">
                ID: {user.id}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Settings List */}
        <Box className="mt-4 bg-white">
          <Box className="px-4 py-2">
            <Text size="xSmall" className="text-gray-500 font-medium">QUẢN LÝ</Text>
          </Box>
          <List>
            <List.Item
              prefix={<Icon icon="zi-user" className="text-blue-500" />}
              title="Quản lý ví"
              suffix={<Icon icon="zi-chevron-right" className="text-gray-400" />}
              onClick={() => navigate("/manage-wallets")}
            />
            <List.Item
              prefix={<Icon icon="zi-list-1" className="text-purple-500" />}
              title="Quản lý danh mục"
              suffix={<Icon icon="zi-chevron-right" className="text-gray-400" />}
              onClick={() => navigate("/manage-categories")}
            />
            <List.Item
              prefix={<Icon icon="zi-star" className="text-yellow-500" />}
              title="Quản lý ngân sách"
              suffix={<Icon icon="zi-chevron-right" className="text-gray-400" />}
              onClick={() => navigate("/budget")}
            />
            <List.Item
              prefix={<Icon icon="zi-calendar" className="text-green-500" />}
              title="Lịch sử giao dịch"
              suffix={<Icon icon="zi-chevron-right" className="text-gray-400" />}
              onClick={() => navigate("/history")}
            />
          </List>
        </Box>

        <Box className="mt-4 bg-white">
          <Box className="px-4 py-2">
            <Text size="xSmall" className="text-gray-500 font-medium">HỖ TRỢ</Text>
          </Box>
          <List>
            <List.Item
              prefix={<Icon icon="zi-help-circle" className="text-orange-500" />}
              title="Hướng dẫn sử dụng"
              suffix={<Icon icon="zi-chevron-right" className="text-gray-400" />}
              onClick={() => navigate("/guide")}
            />
            <List.Item
              prefix={<Icon icon="zi-info-circle" className="text-cyan-500" />}
              title="Giới thiệu"
              suffix={<Icon icon="zi-chevron-right" className="text-gray-400" />}
              onClick={() => {
                openSnackbar({
                  text: "Quản lý Chi Tiêu v1.0.0",
                });
              }}
            />
          </List>
        </Box>

        {/* Danger Zone */}
        <Box className="p-4 mt-4 bg-white">
          <Box className="px-0 py-2">
            <Text size="xSmall" className="text-red-600 font-medium">VÙNG NGUY HIỂM</Text>
          </Box>
          <Button
            variant="secondary"
            fullWidth
            onClick={handleClearData}
            className="border-red-500 text-red-600 hover:bg-red-50"
          >
            <Icon icon="zi-delete" className="mr-2" />
            Xóa toàn bộ dữ liệu
          </Button>
        </Box>

        {/* Footer */}
        <Box className="p-4 text-center bg-gray-50">
          <Text size="xSmall" className="text-gray-500 block">
            Phiên bản 1.0.0
          </Text>
          <Text size="xSmall" className="text-gray-500 block mt-1">
            © 2024 Quản Lý Chi Tiêu
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default SettingsPage;
