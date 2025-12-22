import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import { Page, Box, Text, Input, Sheet, useSnackbar } from "zmp-ui";
import AppHeader from "components/app-header";
import DatePicker from "zmp-ui/date-picker";
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
import { suggestCategoryWithLearning, learnFromHistory } from "services/ai-categorization";
import { formatCurrency } from "utils/format";
import { VoiceInput } from "components/voice-input";
import { parseVoiceInput } from "utils/voice-parser";
import { haptic } from "components/ui";
import { 
  ExpenseIcon, 
  IncomeIcon, 
  MicrophoneIcon, 
  StarIcon, 
  CategoryIcon, 
  WalletIcon, 
  CheckIcon, 
  CalendarIcon,
  CloseIcon,
  ChevronRightIcon,
  getIcon 
} from "components/icons";

// Number pad component
const NumberPad: FC<{
  onInput: (value: string) => void;
  onDelete: () => void;
  onClear: () => void;
}> = ({ onInput, onDelete, onClear }) => {
  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', 'del'];

  const handlePress = (value: string) => {
    haptic.light();
    if (value === 'del') {
      onDelete();
    } else {
      onInput(value);
    }
  };

  return (
    <Box className="grid grid-cols-3 gap-1.5">
      {buttons.map((btn, index) => (
        <Box
          key={index}
          onClick={() => handlePress(btn)}
          className={`
            h-11 rounded-xl flex items-center justify-center cursor-pointer
            transition-all duration-150 active:scale-95
            ${btn === 'del' 
              ? 'bg-gray-200 text-gray-600' 
              : 'bg-white shadow-sm text-gray-800 hover:bg-gray-50'
            }
          `}
        >
          {btn === 'del' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)"/>
              <path d="M19 6H11L5 12L11 18H19C19.5523 18 20 17.5523 20 17V7C20 6.44772 19.5523 6 19 6Z" stroke="#6B7280" strokeWidth="1.5"/>
            </svg>
          ) : (
            <Text className="text-lg font-bold">{btn}</Text>
          )}
        </Box>
      ))}
    </Box>
  );
};

// Quick amount buttons
const QuickAmounts: FC<{
  onSelect: (amount: number) => void;
  type: TransactionType;
}> = ({ onSelect, type }) => {
  const amounts = type === 'expense' 
    ? [10000, 20000, 50000, 100000, 200000, 500000]
    : [100000, 500000, 1000000, 2000000, 5000000, 10000000];

  const formatQuickAmount = (amount: number) => {
    if (amount >= 1000000) return `${amount / 1000000}tr`;
    return `${amount / 1000}k`;
  };

  return (
    <Box className="grid grid-cols-6 gap-1.5 mb-3">
      {amounts.map((amount) => (
        <Box
          key={amount}
          onClick={() => {
            haptic.light();
            onSelect(amount);
          }}
          className="py-2 bg-white rounded-lg shadow-sm cursor-pointer active:scale-95 transition-transform text-center"
        >
          <Text size="xSmall" className="font-bold text-gray-600">
            {formatQuickAmount(amount)}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

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
  const [suggestedCategory, setSuggestedCategory] = useState<ExpenseCategory | null>(null);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [showNoteSheet, setShowNoteSheet] = useState(false);

  const categories = type === "expense" ? expenseCategories : incomeCategories;

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // AI category suggestion based on note
  useEffect(() => {
    if (note.trim().length > 2 && type === "expense") {
      const patterns = learnFromHistory(transactions, expenseCategories);
      const suggested = suggestCategoryWithLearning(note, patterns, expenseCategories);
      setSuggestedCategory(suggested);
    } else {
      setSuggestedCategory(null);
    }
  }, [note, type, transactions, expenseCategories]);

  // Number pad handlers
  const handleNumberInput = useCallback((value: string) => {
    setAmount(prev => {
      const newValue = prev + value;
      // Limit to reasonable amount
      if (parseFloat(newValue) > 9999999999) return prev;
      return newValue;
    });
  }, []);

  const handleNumberDelete = useCallback(() => {
    setAmount(prev => prev.slice(0, -1));
  }, []);

  const handleNumberClear = useCallback(() => {
    setAmount("");
  }, []);

  const handleQuickAmount = useCallback((quickAmount: number) => {
    setAmount(quickAmount.toString());
  }, []);

  const handleSubmit = useCallback(() => {
    haptic.medium();
    
    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      openSnackbar({ type: "error", text: "Vui lòng nhập số tiền hợp lệ" });
      return;
    }

    if (!selectedCategory) {
      openSnackbar({ type: "error", text: "Vui lòng chọn danh mục" });
      return;
    }

    if (!selectedWallet) {
      openSnackbar({ type: "error", text: "Vui lòng chọn ví" });
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
          balance: type === "income"
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
  }, [amount, selectedCategory, selectedWallet, type, date, note, transactions, wallets, setTransactions, setWallets, navigate, openSnackbar]);

  // Maximum allowed transaction amount (1 billion VND)
  const MAX_TRANSACTION_AMOUNT = 1000000000;

  const handleVoiceResult = useCallback((text: string) => {
    const parsed = parseVoiceInput(text);
    
    if (parsed.amount !== null) {
      if (parsed.amount > 0 && parsed.amount <= MAX_TRANSACTION_AMOUNT) {
        setAmount(parsed.amount.toString());
      } else {
        openSnackbar({ type: "error", text: "Số tiền không hợp lệ. Vui lòng thử lại." });
        return;
      }
    }
    
    if (parsed.note) setNote(parsed.note);
    if (parsed.isIncome) setType("income"); else setType("expense");

    setShowVoiceInput(false);
    openSnackbar({ type: "success", text: "Đã nhận dạng giọng nói thành công" });
  }, [openSnackbar]);

  const handleVoiceError = useCallback((error: string) => {
    openSnackbar({ type: "error", text: error });
  }, [openSnackbar]);

  const selectedCategoryData = useMemo(() => 
    categories.find((c) => c.id === selectedCategory), 
    [categories, selectedCategory]
  );
  
  const selectedWalletData = useMemo(() => 
    wallets.find((w) => w.id === selectedWallet), 
    [wallets, selectedWallet]
  );

  // Format date for display
  const formattedDate = useMemo(() => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) return "Hôm nay";
    if (isYesterday) return "Hôm qua";
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  }, [date]);

  return (
    <Page className="flex flex-col bg-gray-100 min-h-screen">
      {/* Fixed Header with Type Toggle */}
      <Box 
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: type === "expense" 
            ? 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)'
            : 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        }}
      >
        {/* Back button and title */}
        <Box className="flex items-center justify-between px-4 pb-2">
          <Box 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            <CloseIcon size={20} color="#FFFFFF" />
          </Box>
          <Text className="text-white text-lg font-bold">
            {type === "expense" ? "Chi tiêu" : "Thu nhập"}
          </Text>
          <Box 
            onClick={() => setShowVoiceInput(true)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            <MicrophoneIcon size={20} color="#FFFFFF" />
          </Box>
        </Box>

        {/* Type Toggle Tabs */}
        <Box className="flex px-4 pb-4">
          <Box className="flex bg-white/20 rounded-2xl p-1 w-full">
            <Box
              onClick={() => { haptic.light(); setType("expense"); }}
              className={`flex-1 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                type === "expense" ? "bg-white shadow-md" : ""
              }`}
            >
              <Box className="flex items-center justify-center space-x-2">
                <ExpenseIcon size={18} color={type === "expense" ? "#EF4444" : "#FFFFFF"} />
                <Text className={`font-bold text-sm ${type === "expense" ? "text-red-500" : "text-white/80"}`}>
                  Chi tiêu
                </Text>
              </Box>
            </Box>
            <Box
              onClick={() => { haptic.light(); setType("income"); }}
              className={`flex-1 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                type === "income" ? "bg-white shadow-md" : ""
              }`}
            >
              <Box className="flex items-center justify-center space-x-2">
                <IncomeIcon size={18} color={type === "income" ? "#10B981" : "#FFFFFF"} />
                <Text className={`font-bold text-sm ${type === "income" ? "text-green-500" : "text-white/80"}`}>
                  Thu nhập
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Amount Display */}
        <Box className="px-6 pb-6">
          <Text size="xSmall" className="text-white/70 mb-1">Số tiền</Text>
          <Box className="flex items-baseline">
            <Text className="text-white text-5xl font-bold tracking-tight">
              {amount ? formatCurrency(parseFloat(amount)).replace('₫', '').trim() : "0"}
            </Text>
            <Text className="text-white/70 text-2xl ml-2 font-medium">₫</Text>
          </Box>
        </Box>
      </Box>

      {/* Scrollable Content Area */}
      <Box className="flex-1 pt-56 pb-safe overflow-auto">
        {/* Quick Amount Buttons */}
        <Box className="px-4 pt-2 mb-3">
          <QuickAmounts onSelect={handleQuickAmount} type={type} />
        </Box>

        {/* Selection Cards */}
        <Box className="px-4 space-y-3">
          {/* Category Selection */}
          <Box
            onClick={() => { haptic.light(); setShowCategorySheet(true); }}
            className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
          >
            <Box className="flex items-center justify-between">
              <Box className="flex items-center space-x-3">
                {selectedCategoryData ? (
                  <>
                    <Box
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${selectedCategoryData.color}15` }}
                    >
                      {(() => {
                        const IconComponent = getIcon(selectedCategoryData.icon);
                        return IconComponent ? <IconComponent size={24} color={selectedCategoryData.color} /> : <CategoryIcon size={24} color={selectedCategoryData.color} />;
                      })()}
                    </Box>
                    <Box>
                      <Text size="xSmall" className="text-gray-500">Danh mục</Text>
                      <Text className="font-bold text-gray-900">{selectedCategoryData.name}</Text>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <CategoryIcon size={24} color="#9CA3AF" />
                    </Box>
                    <Box>
                      <Text size="xSmall" className="text-gray-500">Danh mục</Text>
                      <Text className="text-gray-400">Chọn danh mục</Text>
                    </Box>
                  </>
                )}
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
          </Box>

          {/* AI Category Suggestion */}
          {suggestedCategory && selectedCategory !== suggestedCategory.id && (
            <Box
              onClick={() => { haptic.light(); setSelectedCategory(suggestedCategory.id); }}
              className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-200 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <Box className="flex items-center justify-between">
                <Box className="flex items-center space-x-3">
                  <Box className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                    <StarIcon size={20} color="#FFFFFF" active />
                  </Box>
                  <Box>
                    <Text size="xSmall" className="text-yellow-700">AI gợi ý</Text>
                    <Text className="font-bold text-yellow-900">{suggestedCategory.name}</Text>
                  </Box>
                </Box>
                <Box className="px-3 py-1.5 bg-yellow-500 rounded-xl">
                  <Text size="xSmall" className="text-white font-bold">Áp dụng</Text>
                </Box>
              </Box>
            </Box>
          )}

          {/* Wallet Selection */}
          <Box
            onClick={() => { haptic.light(); setShowWalletSheet(true); }}
            className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
          >
            <Box className="flex items-center justify-between">
              <Box className="flex items-center space-x-3">
                {selectedWalletData ? (
                  <>
                    <Box
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${selectedWalletData.color}15` }}
                    >
                      {(() => {
                        const IconComponent = getIcon(selectedWalletData.icon);
                        return IconComponent ? <IconComponent size={24} color={selectedWalletData.color} /> : <WalletIcon size={24} color={selectedWalletData.color} />;
                      })()}
                    </Box>
                    <Box>
                      <Text size="xSmall" className="text-gray-500">Ví</Text>
                      <Text className="font-bold text-gray-900">{selectedWalletData.name}</Text>
                      <Text size="xSmall" className="text-gray-500">{formatCurrency(selectedWalletData.balance)}</Text>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <WalletIcon size={24} color="#9CA3AF" />
                    </Box>
                    <Box>
                      <Text size="xSmall" className="text-gray-500">Ví</Text>
                      <Text className="text-gray-400">Chọn ví</Text>
                    </Box>
                  </>
                )}
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
          </Box>

          {/* Date Selection */}
          <Box
            onClick={() => { haptic.light(); setShowDateSheet(true); }}
            className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
          >
            <Box className="flex items-center justify-between">
              <Box className="flex items-center space-x-3">
                <Box className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <CalendarIcon size={24} color="#3B82F6" />
                </Box>
                <Box>
                  <Text size="xSmall" className="text-gray-500">Ngày</Text>
                  <Text className="font-bold text-gray-900">{formattedDate}</Text>
                </Box>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
          </Box>

          {/* Note Selection */}
          <Box
            onClick={() => { haptic.light(); setShowNoteSheet(true); }}
            className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
          >
            <Box className="flex items-center justify-between">
              <Box className="flex items-center space-x-3">
                <Box className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                  {(() => {
                    const NoteIcon = getIcon("receipt");
                    return NoteIcon ? <NoteIcon size={24} color="#6B7280" /> : null;
                  })()}
                </Box>
                <Box>
                  <Text size="xSmall" className="text-gray-500">Ghi chú</Text>
                  <Text className={`${note ? "font-bold text-gray-900" : "text-gray-400"}`}>
                    {note || "Thêm ghi chú"}
                  </Text>
                </Box>
              </Box>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Box>
          </Box>
        </Box>

        {/* Number Pad */}
        <Box className="px-4 mt-4 mb-4">
          <NumberPad
            onInput={handleNumberInput}
            onDelete={handleNumberDelete}
            onClear={handleNumberClear}
          />
        </Box>

        {/* Submit Button */}
        <Box className="px-4 pb-6">
          <Box
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl cursor-pointer transition-all duration-200 active:scale-[0.98] shadow-lg"
            style={{
              background: type === "expense" 
                ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            }}
          >
            <Box className="flex items-center justify-center space-x-2">
              <CheckIcon size={24} color="#FFFFFF" />
              <Text className="text-white text-lg font-bold">
                {type === "expense" ? "Lưu chi tiêu" : "Lưu thu nhập"}
              </Text>
            </Box>
          </Box>
        </Box>
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
        <Box className="p-4 pb-8">
          <Box className="flex items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Chọn danh mục</Text>
            <Box
              onClick={() => setShowCategorySheet(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
            >
              <CloseIcon size={16} color="#6B7280" />
            </Box>
          </Box>
          <Box className="grid grid-cols-4 gap-3 max-h-[50vh] overflow-visible p-1">
            {categories.map((category) => {
              const IconComponent = getIcon(category.icon);
              const isSelected = selectedCategory === category.id;
              return (
                <Box
                  key={category.id}
                  onClick={() => {
                    haptic.light();
                    setSelectedCategory(category.id);
                    setShowCategorySheet(false);
                  }}
                  className={`relative p-3 rounded-2xl cursor-pointer text-center transition-all duration-200 active:scale-95 ${
                    isSelected ? "bg-yellow-50 shadow-md" : "bg-gray-50"
                  }`}
                  style={{
                    border: isSelected ? '2px solid #EAB308' : '2px solid transparent'
                  }}
                >
                  {isSelected && (
                    <Box className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center shadow-md">
                      <CheckIcon size={12} color="#FFFFFF" />
                    </Box>
                  )}
                  <Box 
                    className="w-11 h-11 mx-auto rounded-xl flex items-center justify-center mb-1.5"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {IconComponent ? <IconComponent size={22} color={category.color} /> : <CategoryIcon size={22} color={category.color} />}
                  </Box>
                  <Text size="xxSmall" className="text-gray-700 font-medium line-clamp-2 leading-tight">
                    {category.name}
                  </Text>
                </Box>
              );
            })}
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
        <Box className="p-4 pb-8">
          <Box className="flex items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Chọn ví</Text>
            <Box
              onClick={() => setShowWalletSheet(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
            >
              <CloseIcon size={16} color="#6B7280" />
            </Box>
          </Box>
          <Box className="space-y-2 max-h-[50vh] overflow-auto">
            {wallets.map((wallet) => {
              const IconComponent = getIcon(wallet.icon) || WalletIcon;
              const isSelected = selectedWallet === wallet.id;
              return (
                <Box
                  key={wallet.id}
                  onClick={() => {
                    haptic.light();
                    setSelectedWallet(wallet.id);
                    setShowWalletSheet(false);
                  }}
                  className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-200 active:scale-[0.98] ${
                    isSelected 
                      ? "bg-yellow-50 ring-2 ring-yellow-400" 
                      : "bg-gray-50"
                  }`}
                >
                  <Box className="flex items-center space-x-3">
                    <Box
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${wallet.color}20` }}
                    >
                      <IconComponent size={24} color={wallet.color} />
                    </Box>
                    <Box>
                      <Text className="font-bold text-gray-900">{wallet.name}</Text>
                      <Text size="xSmall" className="text-gray-500">{formatCurrency(wallet.balance)}</Text>
                    </Box>
                  </Box>
                  {isSelected && (
                    <Box className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                      <CheckIcon size={14} color="#FFFFFF" />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Sheet>

      {/* Date Selection Sheet */}
      <Sheet
        visible={showDateSheet}
        onClose={() => setShowDateSheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="p-4 pb-8">
          <Box className="flex items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Chọn ngày</Text>
            <Box
              onClick={() => setShowDateSheet(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
            >
              <CloseIcon size={16} color="#6B7280" />
            </Box>
          </Box>
          {/* Quick date options */}
          <Box className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "Hôm nay", value: 0 },
              { label: "Hôm qua", value: -1 },
              { label: "2 ngày trước", value: -2 },
            ].map((option) => {
              const optionDate = new Date();
              optionDate.setDate(optionDate.getDate() + option.value);
              const isSelected = date.toDateString() === optionDate.toDateString();
              return (
                <Box
                  key={option.value}
                  onClick={() => {
                    haptic.light();
                    setDate(optionDate);
                  }}
                  className={`py-3 rounded-xl cursor-pointer text-center transition-all active:scale-95 ${
                    isSelected ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Text size="small" className={`font-bold ${isSelected ? "text-white" : "text-gray-700"}`}>
                    {option.label}
                  </Text>
                </Box>
              );
            })}
          </Box>
          <DatePicker
            value={date}
            onChange={(value) => {
              setDate(value);
              setShowDateSheet(false);
            }}
            dateFormat="dd/mm/yyyy"
            title="Chọn ngày giao dịch"
          />
        </Box>
      </Sheet>

      {/* Note Input Sheet */}
      <Sheet
        visible={showNoteSheet}
        onClose={() => setShowNoteSheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="p-4 pb-8">
          <Box className="flex items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Ghi chú</Text>
            <Box
              onClick={() => setShowNoteSheet(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
            >
              <CloseIcon size={16} color="#6B7280" />
            </Box>
          </Box>
          <Input
            placeholder="Nhập ghi chú cho giao dịch này..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-gray-50 rounded-2xl mb-3"
          />
          {/* Quick note suggestions */}
          <Text size="xSmall" className="text-gray-500 mb-2">Gợi ý nhanh:</Text>
          <Box className="flex flex-wrap gap-1.5">
            {(type === "expense" 
              ? ["Ăn sáng", "Ăn trưa", "Ăn tối", "Cafe", "Đi chợ", "Xăng xe", "Gửi xe", "Mua sắm"]
              : ["Lương tháng", "Thưởng", "Freelance", "Đầu tư", "Cho thuê", "Bán hàng"]
            ).map((suggestion) => (
              <Box
                key={suggestion}
                onClick={() => {
                  haptic.light();
                  setNote(suggestion);
                }}
                className={`px-3 py-1.5 rounded-lg cursor-pointer active:scale-95 transition-transform ${
                  note === suggestion ? "bg-yellow-100 border border-yellow-400" : "bg-gray-100"
                }`}
              >
                <Text size="xSmall" className={note === suggestion ? "text-yellow-700 font-medium" : "text-gray-600"}>{suggestion}</Text>
              </Box>
            ))}
          </Box>
          <Box
            onClick={() => setShowNoteSheet(false)}
            className="mt-4 py-3 bg-yellow-500 rounded-2xl cursor-pointer text-center active:scale-[0.98] transition-transform"
          >
            <Text className="text-white font-bold">Xong</Text>
          </Box>
        </Box>
      </Sheet>

      {/* Voice Input Sheet */}
      <Sheet
        visible={showVoiceInput}
        onClose={() => setShowVoiceInput(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="p-4 pb-8">
          <Box className="flex items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Nhập bằng giọng nói</Text>
            <Box
              onClick={() => setShowVoiceInput(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
            >
              <CloseIcon size={16} color="#6B7280" />
            </Box>
          </Box>
          <Box className="bg-purple-50 rounded-2xl p-4 mb-4">
            <Text size="small" className="text-purple-700 font-medium mb-2">
              💡 Mẹo sử dụng:
            </Text>
            <Box className="space-y-1">
              <Text size="xSmall" className="text-purple-600">• "Chi 50 nghìn ăn sáng"</Text>
              <Text size="xSmall" className="text-purple-600">• "Mua cafe 35k"</Text>
              <Text size="xSmall" className="text-purple-600">• "Thu nhập 5 triệu lương"</Text>
            </Box>
          </Box>
          <VoiceInput
            onResult={handleVoiceResult}
            onError={handleVoiceError}
            placeholder="Nhấn để bắt đầu"
          />
        </Box>
      </Sheet>
    </Page>
  );
};

export default AddTransactionPage;
