import React, { FC } from "react";
import { Box, Text, Button, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";

export const QuickAdd: FC = () => {
  const navigate = useNavigate();

  return (
    <Box className="m-4">
      <Text.Title size="small" className="mb-3">
        Ghi chép nhanh
      </Text.Title>
      <Box className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          className="h-24 flex flex-col items-center justify-center hover:shadow-md transition-all duration-200"
          onClick={() => navigate("/add-transaction?type=expense")}
        >
          <Icon icon="zi-minus-circle" size={32} className="mb-2 text-red-500" />
          <Text size="small" className="font-medium">Chi tiêu</Text>
        </Button>
        <Button
          variant="secondary"
          className="h-24 flex flex-col items-center justify-center hover:shadow-md transition-all duration-200"
          onClick={() => navigate("/add-transaction?type=income")}
        >
          <Icon icon="zi-plus-circle" size={32} className="mb-2 text-green-500" />
          <Text size="small" className="font-medium">Thu nhập</Text>
        </Button>
      </Box>
    </Box>
  );
};
