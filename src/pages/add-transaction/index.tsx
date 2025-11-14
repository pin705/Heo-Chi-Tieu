import React, { FC, useState, useEffect } from "react";
import {
  Page,
  Header,
  Box,
  Text,
  Input,
  Button,
  Sheet,
  Icon,
  useSnackbar,
} from "zmp-ui";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  transactionsState,
  walletsState,
  expenseCategoriesState,
  incomeCategoriesState,
} from "expense-state";
import { Transaction, TransactionType } from "types/transaction";
import { ExpenseCategory } from "types/expense-category";
import { Wallet } from "types/wallet";

const AddTransactionPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSnackbar } = useSnackbar();

  // Get type from URL query params
  const searchParams = new URLSearchParams(location.search);
  const initialType = (searchParams.get("type") as TransactionType) || "expense";

  const [transactions, setTransactions] = useRecoilState(transactionsState);
  const [wallets, setWallets] = useRecoilState(walletsState);
  const expenseCategories = useRecoilValue(expenseCategoriesState);
  const incomeCategories = useRecoilValue(incomeCategoriesState);

  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedWallet, setSelectedWallet] = useState<string>(
    wallets[0]?.id || ""
  );
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showWalletSheet, setShowWalletSheet] = useState(false);

  const categories =
    type === "expense" ? expenseCategories : incomeCategories;

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const handleSubmit = () => {
    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      openSnackbar({
        type: "error",
        text: "Vui lòng nhập số tiền hợp lệ",
      });
      return;
    }

    if (!selectedCategory) {
      openSnackbar({
        type: "error",
        text: "Vui lòng chọn danh mục",
      });
      return;
    }

    if (!selectedWallet) {
      openSnackbar({
        type: "error",
        text: "Vui lòng chọn ví",
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      type,
      categoryId: selectedCategory,
      walletId: selectedWallet,
      date: date.getTime(),
      note: note.trim(),
      createdAt: Date.now(),
    };

    // Update transactions
    setTransactions([...transactions, transaction]);

    // Update wallet balance
    const updatedWallets = wallets.map((wallet) => {
      if (wallet.id === selectedWallet) {
        return {
          ...wallet,
          balance:
            type === "income"
              ? wallet.balance + transaction.amount
              : wallet.balance - transaction.amount,
        };
      }
      return wallet;
    });
    setWallets(updatedWallets);

    openSnackbar({
      type: "success",
      text: `Đã thêm ${type === "income" ? "thu nhập" : "chi tiêu"}`,
    });

    navigate("/");
  };

  const selectedCategoryData = categories.find(
    (c) => c.id === selectedCategory
  );
  const selectedWalletData = wallets.find((w) => w.id === selectedWallet);

  return (
    <Page className="flex flex-col">
      <Header title="Thêm giao dịch" showBackIcon={true} />
      <Box className="flex-1 overflow-auto p-4">
        {/* Type Toggle */}
        <Box className="grid grid-cols-2 gap-2 mb-6">
          <Button
            variant={type === "expense" ? "primary" : "secondary"}
            onClick={() => setType("expense")}
          >
            Chi tiêu
          </Button>
          <Button
            variant={type === "income" ? "primary" : "secondary"}
            onClick={() => setType("income")}
          >
            Thu nhập
          </Button>
        </Box>

        {/* Amount Input */}
        <Box className="mb-6">
          <Text size="xSmall" className="text-gray-600 mb-2">
            Số tiền
          </Text>
          <Input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-2xl"
          />
        </Box>

        {/* Category Selection */}
        <Box
          className="mb-4 p-4 bg-gray-50 rounded-xl cursor-pointer"
          onClick={() => setShowCategorySheet(true)}
        >
          <Text size="xSmall" className="text-gray-600 mb-2">
            Danh mục
          </Text>
          {selectedCategoryData ? (
            <Box className="flex items-center space-x-3">
              <Box
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${selectedCategoryData.color}20`,
                }}
              >
                <Icon
                  icon={selectedCategoryData.icon as any}
                  style={{ color: selectedCategoryData.color }}
                />
              </Box>
              <Text>{selectedCategoryData.name}</Text>
            </Box>
          ) : (
            <Text className="text-gray-400">Chọn danh mục</Text>
          )}
        </Box>

        {/* Wallet Selection */}
        <Box
          className="mb-4 p-4 bg-gray-50 rounded-xl cursor-pointer"
          onClick={() => setShowWalletSheet(true)}
        >
          <Text size="xSmall" className="text-gray-600 mb-2">
            Ví
          </Text>
          {selectedWalletData ? (
            <Box className="flex items-center space-x-3">
              <Box
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${selectedWalletData.color}20`,
                }}
              >
                <Icon
                  icon={selectedWalletData.icon as any}
                  style={{ color: selectedWalletData.color }}
                />
              </Box>
              <Text>{selectedWalletData.name}</Text>
            </Box>
          ) : (
            <Text className="text-gray-400">Chọn ví</Text>
          )}
        </Box>

        {/* Date Input */}
        <Box className="mb-4">
          <Text size="xSmall" className="text-gray-600 mb-2">
            Ngày
          </Text>
          <Input
            type="text"
            value={date.toISOString().split("T")[0]}
            onChange={(e) => setDate(new Date(e.target.value))}
          />
        </Box>

        {/* Note Input */}
        <Box className="mb-6">
          <Text size="xSmall" className="text-gray-600 mb-2">
            Ghi chú
          </Text>
          <Input
            placeholder="Thêm ghi chú (không bắt buộc)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Box>

        {/* Submit Button */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          className="mb-4"
        >
          Lưu giao dịch
        </Button>
      </Box>

      {/* Category Selection Sheet */}
      <Sheet
        visible={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="p-4">
          <Text.Title size="small" className="mb-4">
            Chọn danh mục
          </Text.Title>
          <Box className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <Box
                key={category.id}
                className={`p-3 rounded-xl cursor-pointer text-center ${
                  selectedCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-gray-50"
                }`}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setShowCategorySheet(false);
                }}
              >
                <Icon
                  icon={category.icon as any}
                  className="text-2xl mb-2"
                  style={{
                    color:
                      selectedCategory === category.id
                        ? "white"
                        : category.color,
                  }}
                />
                <Text
                  size="xSmall"
                  className={
                    selectedCategory === category.id
                      ? "text-white"
                      : "text-gray-700"
                  }
                >
                  {category.name}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Sheet>

      {/* Wallet Selection Sheet */}
      <Sheet
        visible={showWalletSheet}
        onClose={() => setShowWalletSheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="p-4">
          <Text.Title size="small" className="mb-4">
            Chọn ví
          </Text.Title>
          <Box className="space-y-2">
            {wallets.map((wallet) => (
              <Box
                key={wallet.id}
                className={`p-4 rounded-xl cursor-pointer flex items-center justify-between ${
                  selectedWallet === wallet.id ? "bg-primary" : "bg-gray-50"
                }`}
                onClick={() => {
                  setSelectedWallet(wallet.id);
                  setShowWalletSheet(false);
                }}
              >
                <Box className="flex items-center space-x-3">
                  <Box
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor:
                        selectedWallet === wallet.id
                          ? "white"
                          : `${wallet.color}20`,
                    }}
                  >
                    <Icon
                      icon={wallet.icon as any}
                      style={{
                        color:
                          selectedWallet === wallet.id
                            ? wallet.color
                            : wallet.color,
                      }}
                    />
                  </Box>
                  <Text
                    className={
                      selectedWallet === wallet.id
                        ? "text-white"
                        : "text-gray-700"
                    }
                  >
                    {wallet.name}
                  </Text>
                </Box>
                <Text
                  size="small"
                  className={
                    selectedWallet === wallet.id
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(wallet.balance)}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Sheet>
    </Page>
  );
};

export default AddTransactionPage;
