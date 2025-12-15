import React, { FC } from "react";
import { Box, Header, Text } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { userState } from "expense-state";
import { Header as ZmpHeader } from "zmp-ui";

export const Welcome: FC = () => {
  const user = useRecoilValue(userState);

  return (
    <Box 
      className="relative app-header overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 50%, #A16207 100%)',
      }}
    >
      <ZmpHeader
        showBackIcon={false}
        title={
          (
            <Box flex alignItems="center" className="space-x-3">
              <Box className="relative">
                <img
                  className="w-12 h-12 rounded-full border-2 border-white/30 shadow-lg"
                  src={user.avatar.startsWith("http") ? user.avatar : undefined}
                />
                <Box className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
              </Box>
              <Box>
                <Text.Title size="small" className="font-bold">
                  Chào {user.name}!
                </Text.Title>
                <Text size="xxSmall" className="font-medium">
                  Quản lý chi tiêu thông minh
                </Text>
              </Box>
            </Box>
          ) as any
        }
      />
      {/* Decorative elements */}
      <Box className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
      <Box className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16" />
    </Box>
  );
};
