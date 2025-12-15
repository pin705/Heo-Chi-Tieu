import React, { FC, useState } from "react";
import { Box, Text, Icon, Sheet } from "zmp-ui";
import { useRecoilState, useRecoilValue } from "recoil";
import { walletsState, totalBalanceState } from "expense-state";
import { formatCurrency } from "utils/format";

interface WalletSelectorProps {
  selectedWalletId?: string;
  onWalletChange?: (walletId: string) => void;
  showTotal?: boolean;
  compact?: boolean;
}

export const WalletSelector: FC<WalletSelectorProps> = ({
  selectedWalletId,
  onWalletChange,
  showTotal = true,
  compact = false,
}) => {
  const [wallets] = useRecoilState(walletsState);
  const totalBalance = useRecoilValue(totalBalanceState);
  const [showWalletSheet, setShowWalletSheet] = useState(false);

  // If selectedWalletId is provided, use it; otherwise show total balance
  const selectedWallet = selectedWalletId
    ? wallets.find((w) => w.id === selectedWalletId)
    : null;

  const handleWalletSelect = (walletId: string) => {
    setShowWalletSheet(false);
    if (onWalletChange) {
      onWalletChange(walletId);
    }
  };

  // Reusable wallet selection sheet content
  const renderWalletSheet = () => (
    <Sheet
      visible={showWalletSheet}
      onClose={() => setShowWalletSheet(false)}
      autoHeight
      mask
      handler
      swipeToClose
    >
      <Box className="p-6">
        <Text.Title size="small" className="mb-5 text-center font-bold">
          Chọn ví
        </Text.Title>
        {showTotal && (
          <Box
            className="mb-3 p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-200 transform active:scale-98 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-soft"
            onClick={() => handleWalletSelect("")}
          >
            <Box className="flex items-center space-x-3">
              <Box
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)",
                }}
              >
                <Icon icon="zi-user-circle" className="text-white" size={24} />
              </Box>
              <Box>
                <Text className="font-bold text-gray-900">Tất cả ví</Text>
                <Text size="xSmall" className="text-gray-600">
                  {formatCurrency(totalBalance)}
                </Text>
              </Box>
            </Box>
            {!selectedWalletId && (
              <Icon icon="zi-check-circle-solid" className="text-yellow-600" size={24} />
            )}
          </Box>
        )}
        <Box className="space-y-3">
          {wallets.map((wallet) => (
            <Box
              key={wallet.id}
              className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-200 transform active:scale-98 ${
                selectedWalletId === wallet.id
                  ? "shadow-lg"
                  : "bg-gray-50 hover:bg-gray-100 shadow-soft"
              }`}
              style={{
                background:
                  selectedWalletId === wallet.id
                    ? "linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)"
                    : undefined,
              }}
              onClick={() => handleWalletSelect(wallet.id)}
            >
              <Box className="flex items-center space-x-3">
                <Box
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{
                    background:
                      selectedWalletId === wallet.id
                        ? "rgba(255, 255, 255, 0.2)"
                        : `linear-gradient(135deg, ${wallet.color}15 0%, ${wallet.color}25 100%)`,
                  }}
                >
                  <Icon
                    icon={wallet.icon as any}
                    style={{
                      color:
                        selectedWalletId === wallet.id ? "white" : wallet.color,
                    }}
                    size={24}
                  />
                </Box>
                <Box>
                  <Text
                    className={`font-bold ${
                      selectedWalletId === wallet.id
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {wallet.name}
                  </Text>
                  <Text
                    size="xSmall"
                    className={`${
                      selectedWalletId === wallet.id
                        ? "text-white/80"
                        : "text-gray-500"
                    }`}
                  >
                    {formatCurrency(wallet.balance)}
                  </Text>
                </Box>
              </Box>
              {selectedWalletId === wallet.id && (
                <Icon icon="zi-check-circle-solid" className="text-white" size={24} />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Sheet>
  );

  if (compact) {
    return (
      <>
        <Box
          onClick={() => setShowWalletSheet(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-white rounded-xl shadow-soft cursor-pointer active:scale-98 transition-all"
        >
          {selectedWallet ? (
            <>
              <Box
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${selectedWallet.color}15 0%, ${selectedWallet.color}25 100%)`,
                }}
              >
                <Icon
                  icon={selectedWallet.icon as any}
                  style={{ color: selectedWallet.color }}
                  size={18}
                />
              </Box>
              <Box className="flex-1">
                <Text size="xSmall" className="text-gray-700 font-bold">
                  {selectedWallet.name}
                </Text>
                <Text size="xxSmall" className="text-gray-500">
                  {formatCurrency(selectedWallet.balance)}
                </Text>
              </Box>
            </>
          ) : (
            <>
              <Box
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #EAB30815 0%, #EAB30825 100%)",
                }}
              >
                <Icon icon="zi-user-circle" className="text-yellow-600" size={18} />
              </Box>
              <Box className="flex-1">
                <Text size="xSmall" className="text-gray-700 font-bold">
                  Tất cả ví
                </Text>
                <Text size="xxSmall" className="text-gray-500">
                  {formatCurrency(totalBalance)}
                </Text>
              </Box>
            </>
          )}
          <Icon icon="zi-chevron-down" size={16} className="text-gray-400" />
        </Box>

        {renderWalletSheet()}
      </>
    );
  }

  // Default full-size display
  return (
    <>
      <Box
        onClick={() => setShowWalletSheet(true)}
        className="p-4 rounded-2xl cursor-pointer transition-all duration-200 shadow-card hover:shadow-lg active:scale-98 animate-fade-in"
        style={{
          background: selectedWallet
            ? `linear-gradient(135deg, ${selectedWallet.color}15 0%, ${selectedWallet.color}25 100%)`
            : "linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)",
        }}
      >
        <Box className="flex items-center justify-between">
          <Box className="flex items-center space-x-3">
            <Box
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
              style={{
                background: selectedWallet
                  ? `linear-gradient(135deg, ${selectedWallet.color}30 0%, ${selectedWallet.color}40 100%)`
                  : "rgba(255, 255, 255, 0.2)",
              }}
            >
              <Icon
                icon={
                  selectedWallet
                    ? (selectedWallet.icon as any)
                    : "zi-user-circle"
                }
                style={{
                  color: selectedWallet ? selectedWallet.color : "white",
                }}
                size={26}
              />
            </Box>
            <Box>
              <Text
                size="small"
                className={`${
                  selectedWallet ? "text-gray-700" : "text-white/90"
                } font-semibold mb-1`}
              >
                {selectedWallet ? "Ví hiện tại" : "Tổng số dư"}
              </Text>
              <Text.Title
                size="small"
                className={`${
                  selectedWallet ? "text-gray-900" : "text-white"
                } font-bold`}
              >
                {selectedWallet
                  ? formatCurrency(selectedWallet.balance)
                  : formatCurrency(totalBalance)}
              </Text.Title>
              {selectedWallet && (
                <Text size="xSmall" className="text-gray-600 font-medium">
                  {selectedWallet.name}
                </Text>
              )}
            </Box>
          </Box>
          <Box className="flex flex-col items-center">
            <Icon
              icon="zi-chevron-down"
              size={20}
              className={selectedWallet ? "text-gray-600" : "text-white"}
            />
            <Text
              size="xxSmall"
              className={`${
                selectedWallet ? "text-gray-600" : "text-white/90"
              } font-semibold mt-1`}
            >
              Đổi ví
            </Text>
          </Box>
        </Box>
      </Box>

      {renderWalletSheet()}
    </>
  );
};
