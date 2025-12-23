import React from "react";
import { Box } from "zmp-ui";

export const AppLogo: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <Box 
      className="flex items-center justify-center rounded-xl bg-white shadow-sm"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 512 512" fill="none">
        <path d="M380 200C380 155.817 344.183 120 300 120H180C135.817 120 100 155.817 100 200V220C100 231.046 91.0457 240 80 240C68.9543 240 60 248.954 60 260V280C60 291.046 68.9543 300 80 300H100V340C100 362.091 117.909 380 140 380H160C182.091 380 200 362.091 200 340V320H280V340C280 362.091 297.909 380 320 380H340C362.091 380 380 362.091 380 340V200Z" fill="#FBBF24"/>
        <path d="M300 120L320 80H360L340 120H300Z" fill="#FBBF24"/>
        <circle cx="320" cy="180" r="12" fill="white"/>
        <rect x="200" y="140" width="80" height="12" rx="6" fill="white" fillOpacity="0.4"/>
        <circle cx="240" cy="90" r="36" fill="#FBBF24"/>
        <path d="M240 72V108M222 90H258" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Box>
  );
};
