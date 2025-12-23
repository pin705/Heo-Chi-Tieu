import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { MinusIcon, PlusIcon } from "components/icons";

export const QuantityPicker: FC<{
  value: number;
  onChange: (quantity: number) => void;
}> = ({ value, onChange }) => {
  return (
    <Box flex className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-full p-1.5 items-center">
      <Box
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
          value < 1 ? "bg-gray-100 cursor-not-allowed" : "bg-gray-100 active:bg-gray-200 cursor-pointer"
        }`}
        onClick={() => value >= 1 && onChange(value - 1)}
      >
        <MinusIcon size={20} color={value < 1 ? "#9CA3AF" : "#374151"} />
      </Box>
      
      <Box flex justifyContent="center" alignItems="center" className="flex-1 px-4">
        <Text size="large" className="font-semibold text-gray-800">
          Số lượng: {value}
        </Text>
      </Box>

      <Box
        className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 active:bg-yellow-600 cursor-pointer transition-colors shadow-sm"
        onClick={() => onChange(value + 1)}
      >
        <PlusIcon size={20} color="#FFFFFF" />
      </Box>
    </Box>
  );
};
