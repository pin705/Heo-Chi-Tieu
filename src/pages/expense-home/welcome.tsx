import React, { FC } from "react";
import { Box, Header, Text } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { userState } from "expense-state";

export const Welcome: FC = () => {
  const user = useRecoilValue(userState);

  return (
    <Header
      className="app-header no-border pl-4 flex-none pb-[6px]"
      showBackIcon={false}
      title={
        (
          <Box flex alignItems="center" className="space-x-2">
            <img
              className="w-8 h-8 rounded-lg border-inset"
              src={user.avatar.startsWith("http") ? user.avatar : undefined}
            />
            <Box>
              <Text.Title size="small">Chào {user.name}</Text.Title>
              <Text size="xxSmall" className="text-gray">
                Quản lý chi tiêu của bạn
              </Text>
            </Box>
          </Box>
        ) as any
      }
    />
  );
};
