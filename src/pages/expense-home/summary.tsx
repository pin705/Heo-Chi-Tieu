import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { monthlyStatsState, totalBalanceState } from "expense-state";
import { formatCurrency } from "utils/format";

export const Summary: FC = () => {
  const stats = useRecoilValue(monthlyStatsState);
  const totalBalance = useRecoilValue(totalBalanceState);

  return (
    <Box className="m-4">
      {/* Total Balance Card */}
      <Box className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-4 shadow-lg">
        <Text size="xSmall" className="text-white opacity-90">
          Tổng số dư
        </Text>
        <Text.Title size="large" className="text-white mt-1">
          {formatCurrency(totalBalance)}
        </Text.Title>
      </Box>

      {/* Monthly Stats */}
      <Box className="bg-gray-50 rounded-2xl p-4">
        <Text.Title size="small" className="mb-3">
          Tháng này
        </Text.Title>
        <Box className="grid grid-cols-2 gap-4">
          <Box>
            <Text size="xSmall" className="text-gray-600">
              Thu nhập
            </Text>
            <Text.Title size="small" className="text-green-600 mt-1">
              +{formatCurrency(stats.income)}
            </Text.Title>
          </Box>
          <Box>
            <Text size="xSmall" className="text-gray-600">
              Chi tiêu
            </Text>
            <Text.Title size="small" className="text-red-600 mt-1">
              -{formatCurrency(stats.expense)}
            </Text.Title>
          </Box>
        </Box>
        <Box className="mt-4 pt-4 border-t border-gray-200">
          <Box className="flex justify-between items-center">
            <Text size="small" className="text-gray-600">
              Còn lại
            </Text>
            <Text.Title
              size="small"
              className={stats.balance >= 0 ? "text-green-600" : "text-red-600"}
            >
              {formatCurrency(stats.balance)}
            </Text.Title>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
