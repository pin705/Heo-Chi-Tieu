import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import { Page, Box, Text, Input, Sheet, useSnackbar } from "zmp-ui";
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
  MicrophoneIcon, 
  CategoryIcon, 
  WalletIcon, 
  CheckIcon, 
  CalendarIcon,
  CloseIcon,
  ChevronDownIcon,
  DeleteIcon,
  getIcon 
} from "components/icons";

// Number pad component matching Sổ Thu Chi style
const NumberPad: FC<{
  onInput: (value: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onVoice: () => void;
  type: TransactionType;
}> = ({ onInput, onDelete, onSubmit, onVoice, type }) => {
  const buttons = ['7', '8', '9', '+', '4', '5', '6', '-', '1', '2', '3', 'del', '.', '0', 'voice', 'submit'];

  const handlePress = (value: string) => {
    haptic.light();
    if (value === 'del') {
      onDelete();
    } else if (value === 'voice') {
      onVoice();
    } else if (value === 'submit') {
      onSubmit();
    } else {
      onInput(value);
    }
  };

  return (
    <Box className="grid grid-cols-4 gap-3">
      {buttons.map((btn, index) => {
        if (btn === 'submit') {
          return (
            <Box
              key={index}
              onClick={onSubmit}
              className={`h-14 rounded-2xl flex items-center justify-center cursor-pointer active:opacity-80 transition-all shadow-md ${
                type === 'expense' ? 'bg-red-500' : 'bg-green-500'
              }`}
            >
              <CheckIcon size={32} color="#FFFFFF" />
            </Box>
          );
        }
        return (
          <Box
            key={index}
            onClick={() => handlePress(btn)}
            className={`h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow-sm ${
              btn === 'voice' ? 'bg-blue-50 active:bg-blue-100' : 'bg-gray-50 active:bg-gray-200'
            }`}
          >
            {btn === 'del' ? (
              <DeleteIcon size={24} color="#374151" />
            ) : btn === 'voice' ? (
              <MicrophoneIcon size={24} color="#2563EB" />
            ) : (
              <Text className="text-2xl font-semibold text-gray-800">{btn}</Text>
            )}
          </Box>
        );
      })}
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
  const [showWalletSheet, setShowWalletSheet] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState<ExpenseCategory | null>(null);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
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
      // Handle operators
      if (['+', '-'].includes(value)) {
        if (prev === '' || ['+', '-'].includes(prev.slice(-1))) return prev;
        return prev + value;
      }
      // Handle decimal point
      if (value === '.') {
        const parts = prev.split(/[+-]/);
        const currentPart = parts[parts.length - 1];
        if (currentPart.includes('.')) return prev;
        return prev === '' ? '0.' : prev + '.';
      }
      const newValue = prev + value;
      // Limit to reasonable length
      if (newValue.length > 20) return prev;
      return newValue;
    });
  }, []);

  const handleNumberDelete = useCallback(() => {
    setAmount(prev => prev.slice(0, -1));
  }, []);

  const handleSubmit = useCallback(() => {
    haptic.medium();
    
    // Evaluate expression
    let finalAmount = 0;
    try {
      // Safe evaluation for + and - only
      if (/[+-]/.test(amount)) {
        // Remove trailing operator if any
        const cleanAmount = ['+', '-'].includes(amount.slice(-1)) ? amount.slice(0, -1) : amount;
        
        finalAmount = cleanAmount.split(/([+-])/).reduce((acc, curr, idx, arr) => {
          if (idx === 0) return parseFloat(curr) || 0;
          if (['+', '-'].includes(curr)) return acc;
          const op = arr[idx - 1];
          const val = parseFloat(curr) || 0;
          return op === '+' ? acc + val : acc - val;
        }, 0);
      } else {
        finalAmount = parseFloat(amount);
      }
    } catch (e) {
      finalAmount = 0;
    }

    // Validation
    if (!finalAmount || finalAmount <= 0) {
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
      amount: finalAmount,
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
            ? wallet.balance + finalAmount
            : wallet.balance - finalAmount,
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
    <Page className="flex flex-col bg-white min-h-screen">
      {/* Yellow Header - Sổ Thu Chi style */}
      <Box 
        className="bg-[#fbbf24]"
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        <Box className="flex items-center justify-between px-4 py-3">
          <Box 
            onClick={() => navigate(-1)}
            className="cursor-pointer active:opacity-70"
          >
            <Text className="text-gray-800 font-medium">Hủy</Text>
          </Box>
          <Text className="text-gray-900 font-bold text-lg">Thêm</Text>
          <Box className="flex items-center space-x-2">
            <Box className="w-6" /> {/* Spacer for Zalo buttons */}
          </Box>
        </Box>

        {/* Type Toggle - Black pill style */}
        <Box className="flex justify-center pb-4">
          <Box className="flex bg-gray-900 rounded-full p-1">
            <Box
              onClick={() => { haptic.light(); setType("expense"); }}
              className={`px-5 py-2 rounded-full cursor-pointer transition-all ${
                type === "expense" ? "bg-white" : ""
              }`}
            >
              <Text className={`text-sm font-medium ${type === "expense" ? "text-gray-900" : "text-white"}`}>
                Chi tiêu
              </Text>
            </Box>
            <Box
              onClick={() => { haptic.light(); setType("income"); }}
              className={`px-5 py-2 rounded-full cursor-pointer transition-all ${
                type === "income" ? "bg-white" : ""
              }`}
            >
              <Text className={`text-sm font-medium ${type === "income" ? "text-gray-900" : "text-white"}`}>
                Thu nhập
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Category Grid - Scrollable */}
      <Box className={`flex-1 overflow-auto transition-all duration-300 ${showKeypad ? "pb-[420px]" : "pb-40"}`}>
        <Box className="grid grid-cols-4 gap-2 p-4">
          {categories.map((category) => {
            const IconComponent = getIcon(category.icon);
            const isSelected = selectedCategory === category.id;
            return (
              <Box
                key={category.id}
                onClick={() => {
                  haptic.light();
                  setSelectedCategory(category.id);
                  setShowKeypad(true);
                }}
                className={`relative p-2 rounded-xl cursor-pointer text-center transition-all active:scale-95 ${
                  isSelected ? "bg-yellow-50" : "bg-transparent"
                }`}
              >
                <Box 
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-1 ${
                    isSelected ? "border-2 border-yellow-400" : ""
                  }`}
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {IconComponent ? <IconComponent size={24} color={category.color} /> : <CategoryIcon size={24} color={category.color} />}
                </Box>
                <Text size="xxSmall" className={`leading-tight line-clamp-2 ${isSelected ? "font-bold text-gray-900" : "text-gray-600"}`}>
                  {category.name}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Bottom Panel - Fixed */}
      <Box className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Wallet and Amount Row */}
        <Box className="flex items-center justify-between px-4 pt-4 pb-2">
          <Box 
            onClick={() => { haptic.light(); setShowWalletSheet(true); }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            {selectedWalletData && (
              <>
                <Box
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${selectedWalletData.color}20` }}
                >
                  {(() => {
                    const IconComponent = getIcon(selectedWalletData.icon);
                    return IconComponent ? <IconComponent size={16} color={selectedWalletData.color} /> : <WalletIcon size={16} color={selectedWalletData.color} />;
                  })()}
                </Box>
                <Text className="text-gray-700 font-medium text-sm">{selectedWalletData.name}</Text>
                <ChevronDownIcon size={16} color="#9CA3AF" />
              </>
            )}
          </Box>
          <Text 
            onClick={() => setShowKeypad(true)}
            className={`text-3xl font-bold cursor-pointer ${type === "expense" ? "text-gray-900" : "text-green-600"}`}
          >
            {amount ? (
              /[+-]/.test(amount) ? amount : formatCurrency(parseFloat(amount))
            ) : "0 ₫"}
          </Text>
        </Box>

        {/* Note and Date Row */}
        <Box className="flex items-center px-4 pb-3 space-x-3">
          <Box 
            onClick={() => { haptic.light(); setShowNoteSheet(true); }}
            className="flex-1 flex items-center bg-gray-50 rounded-lg px-3 py-2 cursor-pointer"
          >
            <Text size="small" className={note ? "text-gray-700" : "text-gray-400"}>
              {note || "Ghi chú"}
            </Text>
          </Box>
          <Box 
            onClick={() => { haptic.light(); setShowDateSheet(true); }}
            className="flex items-center bg-gray-50 rounded-lg px-3 py-2 cursor-pointer space-x-2"
          >
            <CalendarIcon size={16} color="#6B7280" />
            <Text size="small" className="text-gray-700">{formattedDate}</Text>
          </Box>
        </Box>

        {/* Number Pad */}
        {showKeypad && (
          <Box className="px-4 pb-4 animate-enter-active">
            <NumberPad
              onInput={handleNumberInput}
              onDelete={handleNumberDelete}
              onSubmit={handleSubmit}
              onVoice={() => setShowVoiceInput(true)}
              type={type}
            />
          </Box>
        )}
      </Box>

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
                      ? "bg-yellow-50 border-2 border-yellow-400" 
                      : "bg-gray-50 border-2 border-transparent"
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
