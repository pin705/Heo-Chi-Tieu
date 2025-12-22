import { useVirtualKeyboardVisible } from "hooks";
import React, { FC, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { Box } from "zmp-ui";
import { HomeIcon, CalendarIcon, ChartIcon, SettingsIcon, PlusIcon } from "./icons";
import { haptic } from "./ui";

interface NavItem {
  path: string;
  label: string;
  icon: FC<{ size?: number; active?: boolean; className?: string }>;
}

const tabs: NavItem[] = [
  { path: "/", label: "Trang chủ", icon: HomeIcon },
  { path: "/history", label: "Lịch sử", icon: CalendarIcon },
  { path: "/reports", label: "Báo cáo", icon: ChartIcon },
  { path: "/settings", label: "Cài đặt", icon: SettingsIcon },
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
    <Box className="relative bg-white safe-area-bottom">
      {/* Floating Add Button */}
      <Box
        className="absolute left-1/2 -translate-x-1/2 -top-7 z-50"
        onClick={handleAddClick}
      >
        <Box 
          className="w-14 h-14 rounded-full shadow-floating flex items-center justify-center cursor-pointer active:scale-90 transition-all duration-200 border-4 border-white"
          style={{
            background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
          }}
        >
          <PlusIcon size={28} color="#FFFFFF" />
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
              className={`flex flex-col items-center justify-center py-2 px-4 cursor-pointer transition-all duration-200 rounded-2xl ${
                isActive ? 'bg-yellow-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleNavClick(tab.path)}
            >
              <Box className={`mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                <IconComponent size={24} active={isActive} />
              </Box>
              <span className={`text-[10px] font-semibold transition-colors duration-200 ${
                isActive ? 'text-yellow-600' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
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
              className={`flex flex-col items-center justify-center py-2 px-4 cursor-pointer transition-all duration-200 rounded-2xl ${
                isActive ? 'bg-yellow-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleNavClick(tab.path)}
            >
              <Box className={`mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                <IconComponent size={24} active={isActive} />
              </Box>
              <span className={`text-[10px] font-semibold transition-colors duration-200 ${
                isActive ? 'text-yellow-600' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

