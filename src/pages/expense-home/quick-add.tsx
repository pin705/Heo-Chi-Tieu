import React, { FC } from "react";
import { Box, Text, Button } from "zmp-ui";
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
          className="h-24 flex flex-col items-center justify-center"
          onClick={() => navigate("/add-transaction?type=expense")}
        >
          <Box className="text-3xl mb-2">📤</Box>
          <Text size="small">Chi tiêu</Text>
        </Button>
        <Button
          variant="secondary"
          className="h-24 flex flex-col items-center justify-center"
          onClick={() => navigate("/add-transaction?type=income")}
        >
          <Box className="text-3xl mb-2">📥</Box>
          <Text size="small">Thu nhập</Text>
        </Button>
      </Box>
    </Box>
  );
};
