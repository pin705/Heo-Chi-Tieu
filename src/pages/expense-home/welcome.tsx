import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { userState } from "expense-state";
import { SparklesIcon } from "components/icons";

export const Welcome: FC = () => {
  const user = useRecoilValue(userState);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <Box 
      className="relative app-header overflow-hidden"
    >
      {/* Decorative circles */}
      <Box className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-24 -mt-24" />
      <Box className="absolute bottom-0 left-0 w-36 h-36 bg-white opacity-10 rounded-full -ml-18 -mb-18" />
      <Box className="absolute top-1/2 right-10 w-20 h-20 bg-white opacity-5 rounded-full" />
      
      {/* Content */}
      <Box className="relative z-10 px-5 pt-12 pb-8" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}>
        <Box className="flex items-center justify-between">
          <Box className="flex items-center space-x-4">
            <Box className="relative">
              <img
                className="w-14 h-14 rounded-2xl border-2 border-white/30 shadow-lg object-cover"
                src={user.avatar.startsWith("http") ? user.avatar : undefined}
                alt={user.name}
              />
              <Box className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[8px]">✓</span>
              </Box>
            </Box>
            <Box>
              <Text size="xSmall" className="text-gray-400 font-medium mb-0.5">
                {getGreeting()} 
              </Text>
              <Text.Title size="normal" className="font-bold">
                {user.name}
              </Text.Title>
            </Box>
          </Box>
          
          {/* Sparkles decoration */}
          <Box className="animate-float">
            <SparklesIcon size={32} color="rgba(255,255,255,0.8)" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

