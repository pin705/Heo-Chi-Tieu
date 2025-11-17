import React, { FC } from "react";
import { Box, Text, Button, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";

export const QuickAdd: FC = () => {
  const navigate = useNavigate();

  return (
    <Box className="px-4 py-3">
      <Text.Title size="small" className="mb-3 text-gray-800">
        Ghi chép nhanh
      </Text.Title>
      <Box className="grid grid-cols-2 gap-3">
        {/* Chi tiêu Button */}
        <Box
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500 to-pink-600 p-4 shadow-lg active:shadow-md transition-all cursor-pointer"
          onClick={() => navigate("/add-transaction?type=expense")}
        >
          <Box className="flex flex-col items-center justify-center h-24 relative z-10">
            <Box className="bg-white bg-opacity-20 rounded-full p-3 mb-2">
              <Icon icon="zi-minus-circle" size={28} className="text-white" />
            </Box>
            <Text className="text-white font-semibold text-base">Chi tiêu</Text>
          </Box>
          {/* Decorative circle */}
          <Box className="absolute -right-6 -top-6 w-24 h-24 bg-white opacity-10 rounded-full"></Box>
        </Box>

        {/* Thu nhập Button */}
        <Box
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 shadow-lg active:shadow-md transition-all cursor-pointer"
          onClick={() => navigate("/add-transaction?type=income")}
        >
          <Box className="flex flex-col items-center justify-center h-24 relative z-10">
            <Box className="bg-white bg-opacity-20 rounded-full p-3 mb-2">
              <Icon icon="zi-plus-circle" size={28} className="text-white" />
            </Box>
            <Text className="text-white font-semibold text-base">Thu nhập</Text>
          </Box>
          {/* Decorative circle */}
          <Box className="absolute -right-6 -top-6 w-24 h-24 bg-white opacity-10 rounded-full"></Box>
        </Box>
      </Box>
    </Box>
  );
};
