import React from "react";
import { Box } from "zmp-ui";

export const AppLogo: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <Box 
      className="flex items-center justify-center rounded-xl bg-white shadow-sm"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none">
        <path 
          d="M12 2L3 7V17L12 22L21 17V7L12 2Z" 
          fill="#FBBF24" 
        />
        <path 
          d="M12 6V18M8 10H16M8 14H16" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
      </svg>
    </Box>
  );
};
