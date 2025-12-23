import React, { FC, useState } from "react";
import { Page, Box, Text, Button, useSnackbar, Sheet, Input, Select } from "zmp-ui";
import AppHeader from "components/app-header";
import { useRecoilState } from "recoil";
import { walletsState } from "expense-state";
import { Wallet } from "types/wallet";
import { formatCurrency } from "utils/format";
import { 
  getIcon, 
  WalletIcon, 
  PlusIcon, 
  EditIcon, 
  DeleteIcon,
  StarIcon,
  UserIcon,
  HomeIcon
} from "components/icons";

const WALLET_ICONS = [
  { value: "wallet", label: "Ví" },
  { value: "home", label: "Nhà" },
  { value: "star", label: "Ngôi sao" },
  { value: "user", label: "Cá nhân" },
  { value: "piggy-bank", label: "Heo đất" },
];

const WALLET_COLORS = [
  { value: "#10b981", label: "Xanh lá" },
  { value: "#3b82f6", label: "Xanh dương" },
  { value: "#006af5", label: "Xanh Zalo" },
  { value: "#f59e0b", label: "Cam" },
  { value: "#ef4444", label: "Đỏ" },
  { value: "#8b5cf6", label: "Tím" },
  { value: "#ec4899", label: "Hồng" },
];

const ManageWalletsPage: FC = () => {
  const [wallets, setWallets] = useRecoilState(walletsState);
  const { openSnackbar } = useSnackbar();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    balance: "0",
    icon: "wallet",
    color: "#10b981",
  });

  const handleOpenAddSheet = () => {
    setEditingWallet(null);
    setFormData({
      name: "",
      balance: "0",
      icon: "wallet",
      color: "#10b981",
    });
    setSheetVisible(true);
  };

  const handleOpenEditSheet = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setFormData({
      name: wallet.name,
      balance: wallet.balance.toString(),
      icon: wallet.icon,
      color: wallet.color,
    });
    setSheetVisible(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      openSnackbar({
        type: "error",
        text: "Vui lòng nhập tên ví",
      });
      return;
    }

    const balance = parseFloat(formData.balance) || 0;

    if (editingWallet) {
      // Update existing wallet
      setWallets(
        wallets.map((w) =>
          w.id === editingWallet.id
            ? {
                ...w,
                name: formData.name,
                balance,
                icon: formData.icon,
                color: formData.color,
              }
            : w
        )
      );
      openSnackbar({
        type: "success",
        text: "Cập nhật ví thành công",
      });
    } else {
      // Add new wallet
      const newWallet: Wallet = {
        id: Date.now().toString(),
        name: formData.name,
        balance,
        icon: formData.icon,
        color: formData.color,
      };
      setWallets([...wallets, newWallet]);
      openSnackbar({
        type: "success",
        text: "Thêm ví thành công",
      });
    }

    setSheetVisible(false);
  };

  const handleDelete = (walletId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa ví này?")) {
      setWallets(wallets.filter((w) => w.id !== walletId));
      openSnackbar({
        type: "success",
        text: "Xóa ví thành công",
      });
    }
  };

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  return (
    <Page className="flex flex-col bg-background">
      <AppHeader title="Quản lý ví" />
      <Box className="flex-1 overflow-auto pb-24">
        {/* Total Balance */}
        <Box className="rounded-2xl m-4 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 relative overflow-hidden">
          <Box className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 opacity-10 rounded-full -mr-16 -mt-16" />
          <Box className="relative z-10">
            <Text size="xSmall" className="text-gray-500 font-medium mb-1 uppercase tracking-wider">
              Tổng số dư
            </Text>
            <Text.Title className="text-gray-900 text-3xl font-black mb-2">
              {formatCurrency(totalBalance)}
            </Text.Title>
            <Text size="xSmall" className="text-gray-500 font-medium">
              {wallets.length} ví đang hoạt động
            </Text>
          </Box>
        </Box>

        {/* Wallets List */}
        <Box className="px-4 space-y-3">
          {wallets.length === 0 ? (
            <Box className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <Box className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <WalletIcon size={40} color="#9CA3AF" />
              </Box>
              <Text className="text-gray-600 font-medium">Chưa có ví nào</Text>
              <Text size="xSmall" className="text-gray-400 mt-2">
                Nhấn nút + bên dưới để thêm ví
              </Text>
            </Box>
          ) : (
            wallets.map((wallet) => {
              const IconComponent = getIcon(wallet.icon) || WalletIcon;
              return (
                <Box
                  key={wallet.id}
                  className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] active:scale-[0.99] transition-all"
                >
                  <Box className="flex items-center justify-between">
                    <Box className="flex items-center flex-1">
                      <Box
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-inner"
                        style={{ backgroundColor: `${wallet.color}15` }}
                      >
                        <IconComponent
                          size={28}
                          color={wallet.color}
                        />
                      </Box>
                      <Box className="flex-1">
                        <Text className="font-bold text-gray-900 mb-1 text-lg">
                          {wallet.name}
                        </Text>
                        <Text className="text-base font-semibold" style={{ color: wallet.color }}>
                          {formatCurrency(wallet.balance)}
                        </Text>
                      </Box>
                    </Box>
                    <Box className="flex gap-3">
                      <Box
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => handleOpenEditSheet(wallet)}
                      >
                        <EditIcon size={20} color="#4B5563" />
                      </Box>
                      <Box
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 active:bg-red-100 cursor-pointer transition-colors"
                        onClick={() => handleDelete(wallet.id)}
                      >
                        <DeleteIcon size={20} color="#EF4444" />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>

        {/* Add Button */}
        <Box className="fixed bottom-8 right-6 z-50">
          <Box
            onClick={handleOpenAddSheet}
            className="w-16 h-16 rounded-full shadow-xl flex items-center justify-center bg-yellow-400 cursor-pointer active:scale-90 transition-all hover:shadow-2xl"
          >
            <PlusIcon size={32} color="#1F2937" />
          </Box>
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
              {editingWallet ? "Chỉnh sửa ví" : "Thêm ví mới"}
            </Text.Title>

            <Box className="space-y-4">
              <Box>
                <Text size="small" className="mb-2 text-gray-700">
                  Tên ví <span className="text-red-500">*</span>
                </Text>
                <Input
                  type="text"
                  placeholder="VD: Tiền mặt, Ngân hàng..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Box>

              <Box>
                <Text size="small" className="mb-2 text-gray-700">
                  Số dư ban đầu
                </Text>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.balance}
                  onChange={(e) =>
                    setFormData({ ...formData, balance: e.target.value })
                  }
                />
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
                  {WALLET_ICONS.map((icon) => (
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
                <Box className="grid grid-cols-7 gap-2">
                  {WALLET_COLORS.map((color) => (
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
                  {editingWallet ? "Cập nhật" : "Thêm"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Sheet>
      </Box>
    </Page>
  );
};

export default ManageWalletsPage;
