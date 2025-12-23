import { useVirtualKeyboardVisible } from "hooks";
import React, { FC, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { Box, Text } from "zmp-ui";
import { HomeIcon, ChartIcon, PlusIcon, ReportIcon, UserIcon } from "./icons";
import { haptic } from "./ui";

interface NavItem {
  path: string;
  label: string;
  icon: FC<{ size?: number; active?: boolean; color?: string; className?: string }>;
}

const tabs: NavItem[] = [
  { path: "/", label: "Trang chủ", icon: HomeIcon },
  { path: "/reports", label: "Biểu đồ", icon: ChartIcon },
  { path: "/history", label: "Báo cáo", icon: ReportIcon },
  { path: "/settings", label: "Tôi", icon: UserIcon },
];

export const NO_BOTTOM_NAVIGATION_PAGES = [
  "/add-transaction",
  "/manage-wallets",
  "/manage-categories",
  "/guide",
  "/export",
  "/backup",
];

export const Navigation: FC = () => {
  const keyboardVisible = useVirtualKeyboardVisible();
  const navigate = useNavigate();
  const location = useLocation();

  const noBottomNav = useMemo(() => {
    return NO_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);

  if (noBottomNav || keyboardVisible) {
    return null;
  }

  const handleNavClick = (path: string) => {
    haptic.selection();
    navigate(path);
  };

  const handleAddClick = () => {
    haptic.medium();
    navigate("/add-transaction");
  };

  const firstHalf = tabs.slice(0, 2);
  const secondHalf = tabs.slice(2);

  return (
    <Box className="relative bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)] safe-area-bottom">
      {/* Floating Add Button */}
      <Box
        className="absolute left-1/2 -translate-x-1/2 -top-6 z-50"
        onClick={handleAddClick}
      >
        <Box 
          className="w-14 h-14 rounded-full shadow-[0_4px_15px_rgba(251,191,36,0.4)] border-4 border-white flex items-center justify-center cursor-pointer active:scale-90 transition-all duration-200"
          style={{
            background: '#FBBF24',
          }}
        >
          <PlusIcon size={28} color="#000000" />
        </Box>
      </Box>

      {/* Navigation Bar */}
      <Box className="flex items-center justify-around px-2 pt-2 pb-2" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        {firstHalf.map((tab) => {
          const isActive = location.pathname === tab.path;
          const IconComponent = tab.icon;
          
          return (
            <Box
              key={tab.path}
              className="flex flex-col items-center justify-center py-1 px-4 cursor-pointer"
              onClick={() => handleNavClick(tab.path)}
            >
              <Box className="mb-0.5">
                <IconComponent size={24} color={isActive ? "#FBBF24" : "#9CA3AF"} />
              </Box>
              <Text 
                size="xxSmall" 
                className={`font-medium ${isActive ? 'text-yellow-500' : 'text-gray-400'}`}
              >
                {tab.label}
              </Text>
            </Box>
          );
        })}
        
        {/* Spacer for floating button */}
        <Box className="w-16" />
        
        {secondHalf.map((tab) => {
          const isActive = location.pathname === tab.path;
          const IconComponent = tab.icon;
          
          return (
            <Box
              key={tab.path}
              className="flex flex-col items-center justify-center py-1 px-4 cursor-pointer"
              onClick={() => handleNavClick(tab.path)}
            >
              <Box className="mb-0.5">
                <IconComponent size={24} color={isActive ? "#FBBF24" : "#9CA3AF"} />
              </Box>
              <Text 
                size="xxSmall" 
                className={`font-medium ${isActive ? 'text-yellow-500' : 'text-gray-400'}`}
              >
                {tab.label}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

