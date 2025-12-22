import React, { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Text } from "zmp-ui";
import { BackIcon } from "./icons";
import { haptic } from "./ui";

export interface AppHeaderProps {
  title?: ReactNode;
  className?: string;
  showBackIcon?: boolean; // override
  noBack?: boolean; // force hide
  variant?: "primary" | "neutral"; // visual style, default primary
  rightElement?: ReactNode; // custom right element
  showBorder?: boolean; // show bottom border, default true
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  className = "",
  showBackIcon,
  noBack,
  variant = "primary",
  rightElement,
  showBorder = true,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const autoShowBack = location.key !== "default";
  const shouldShowBack = showBackIcon ?? (!noBack && autoShowBack);

  const handleBack = () => {
    haptic.light();
    navigate(-1);
  };

  return (
    <Box
      className={`flex-none bg-white ${className}`}
    >
      <Box className="h-12 w-full flex items-center px-2 py-2 relative">
        {/* Back button */}
        {shouldShowBack && (
          <Box
            onClick={handleBack}
            className="p-2 -ml-1 cursor-pointer active:bg-gray-100 rounded-lg transition-colors z-10"
          >
            <BackIcon size={24} />
          </Box>
        )}

        {/* Title - centered */}
        <Box className="absolute left-0 right-0 flex justify-center pointer-events-none">
          <Text className="text-lg font-semibold text-gray-800 truncate max-w-[60%]">
            {title}
          </Text>
        </Box>

        {/* Right element */}
        {rightElement && (
          <Box className="ml-auto z-10">
            {rightElement}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AppHeader;
