import React, { FC } from "react";
import { Box, Text } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { userState } from "expense-state";
import { SparklesIcon, BellIcon } from "components/icons";
import { useNavigate } from "react-router-dom";

export const Welcome: FC = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <Box 
      className="relative overflow-hidden"
      style={{ paddingTop: "var(--safe-top)" }}
    >
      {/* Decorative circles */}
      <Box className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
      <Box className="absolute bottom-0 left-0 w-28 h-28 bg-white opacity-10 rounded-full -ml-14 -mb-14" />
      
      {/* Content */}
      <Box className="relative z-10 px-4 pr-24 pb-6">
        <Box className="flex items-center justify-between">
          <Box className="flex items-center space-x-3">
            <Box className="relative">
              <img
                className="w-12 h-12 rounded-xl border-2 border-white/30 shadow-md object-cover"
                src={user.avatar.startsWith("http") ? user.avatar : undefined}
                alt={user.name}
              />
              <Box className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[6px]">✓</span>
              </Box>
            </Box>
            <Box>
              <Text size="xSmall" className="text-gray-300 font-medium">
                {getGreeting()} 
              </Text>
              <Text className="font-bold text-base">
                {user.name}
              </Text>
            </Box>
          </Box>
          
          {/* Notification button */}
          <Box 
            onClick={() => navigate("/notification")}
            className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          >
            <BellIcon size={20} color="#FFFFFF" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

