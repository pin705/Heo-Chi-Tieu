import React from "react";

// ===== Icons cho App Quản Lý Chi Tiêu =====

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  active?: boolean;
}

// ==================== NAVIGATION ICONS ====================

// Icon Trang chủ
export const HomeIcon: React.FC<IconProps> = ({ size = 24, active, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
      stroke={active ? "#EAB308" : "#6F7071"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? "#EAB308" : "none"}
      fillOpacity={active ? 0.15 : 0}
    />
  </svg>
);

// Icon Ví tiền
export const WalletIcon: React.FC<IconProps> = ({ size = 24, color = "#EAB308", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="5" width="20" height="15" rx="3" stroke={color} strokeWidth="1.5"/>
    <path d="M2 10H22" stroke={color} strokeWidth="1.5"/>
    <circle cx="17" cy="14" r="1.5" fill={color}/>
    <path d="M6 8V5C6 3.89543 6.89543 3 8 3H16C17.1046 3 18 3.89543 18 5V8" stroke={color} strokeWidth="1.5"/>
  </svg>
);

// Icon Lịch sử / Lịch
export const CalendarIcon: React.FC<IconProps> = ({ size = 24, active, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="4" width="18" height="17" rx="2" stroke={active ? "#EAB308" : "#6F7071"} strokeWidth="1.5" fill={active ? "#EAB308" : "none"} fillOpacity={active ? 0.15 : 0}/>
    <path d="M3 9H21" stroke={active ? "#EAB308" : "#6F7071"} strokeWidth="1.5"/>
    <path d="M8 2V6" stroke={active ? "#EAB308" : "#6F7071"} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 2V6" stroke={active ? "#EAB308" : "#6F7071"} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="8" cy="14" r="1" fill={active ? "#EAB308" : "#6F7071"}/>
    <circle cx="12" cy="14" r="1" fill={active ? "#EAB308" : "#6F7071"}/>
    <circle cx="16" cy="14" r="1" fill={active ? "#EAB308" : "#6F7071"}/>
  </svg>
);

// Icon Báo cáo / Biểu đồ
export const ChartIcon: React.FC<IconProps> = ({ size = 24, active, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 20H20" stroke={active ? "#EAB308" : "#6F7071"} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 16V10" stroke={active ? "#EAB308" : "#6F7071"} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 16V6" stroke={active ? "#EAB308" : "#6F7071"} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 16V12" stroke={active ? "#EAB308" : "#6F7071"} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M19 16V4" stroke={active ? "#EAB308" : "#6F7071"} strokeWidth="1.5" strokeLinecap="round"/>
    {active && (
      <>
        <circle cx="4" cy="10" r="2" fill="#EAB308" fillOpacity="0.3"/>
        <circle cx="9" cy="6" r="2" fill="#EAB308" fillOpacity="0.3"/>
        <circle cx="14" cy="12" r="2" fill="#EAB308" fillOpacity="0.3"/>
        <circle cx="19" cy="4" r="2" fill="#EAB308" fillOpacity="0.3"/>
      </>
    )}
  </svg>
);

// Icon Cài đặt
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, active, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="3" stroke={active ? "#EAB308" : "#6F7071"} strokeWidth="1.5" fill={active ? "#EAB308" : "none"} fillOpacity={active ? 0.15 : 0}/>
    <path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke={active ? "#EAB308" : "#6F7071"} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Thêm
export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = "#FFFFFF", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// ==================== ACTION ICONS ====================

// Icon Quay lại
export const BackIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon Chevron phải
export const ChevronRightIcon: React.FC<IconProps> = ({ size = 20, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 6L15 12L9 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon Chevron xuống
export const ChevronDownIcon: React.FC<IconProps> = ({ size = 20, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon Chevron lên
export const ChevronUpIcon: React.FC<IconProps> = ({ size = 20, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 15L12 9L6 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon Đóng
export const CloseIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Icon Tìm kiếm
export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.5"/>
    <path d="M21 21L16.5 16.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Lọc
export const FilterIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 6H21M6 12H18M9 18H15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Check
export const CheckIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ==================== CATEGORY ICONS ====================

// Icon Đồ ăn
export const FoodIcon: React.FC<IconProps> = ({ size = 24, color = "#F97316", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 3V10C18 12.2091 16.2091 14 14 14H13V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 3V9C6 10.6569 7.34315 12 9 12V12C10.6569 12 12 10.6569 12 9V3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 3V6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 12V21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Mua sắm
export const ShoppingIcon: React.FC<IconProps> = ({ size = 24, color = "#EC4899", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 6H21L19 16H8L6 6Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L5 3H2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="20" r="1.5" stroke={color} strokeWidth="1.5"/>
    <circle cx="17" cy="20" r="1.5" stroke={color} strokeWidth="1.5"/>
  </svg>
);

// Icon Di chuyển
export const TransportIcon: React.FC<IconProps> = ({ size = 24, color = "#3B82F6", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="5" width="18" height="11" rx="2" stroke={color} strokeWidth="1.5"/>
    <circle cx="7" cy="19" r="2" stroke={color} strokeWidth="1.5"/>
    <circle cx="17" cy="19" r="2" stroke={color} strokeWidth="1.5"/>
    <path d="M5 16V17" stroke={color} strokeWidth="1.5"/>
    <path d="M19 16V17" stroke={color} strokeWidth="1.5"/>
    <path d="M8 10H10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 10H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Giải trí
export const EntertainmentIcon: React.FC<IconProps> = ({ size = 24, color = "#8B5CF6", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <path d="M10 9L16 12L10 15V9Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

// Icon Hóa đơn
export const BillIcon: React.FC<IconProps> = ({ size = 24, color = "#EF4444", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 4C5 3.44772 5.44772 3 6 3H18C18.5523 3 19 3.44772 19 4V20L16 18L13 20L10 18L7 20V4H5Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 8H15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 12H15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 16H12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Sức khỏe
export const HealthIcon: React.FC<IconProps> = ({ size = 24, color = "#10B981", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 21C12 21 4 15.5 4 10C4 7 6.5 4 9.5 4C11 4 12 5 12 5C12 5 13 4 14.5 4C17.5 4 20 7 20 10C20 15.5 12 21 12 21Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 8V14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 11H15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Giáo dục
export const EducationIcon: React.FC<IconProps> = ({ size = 24, color = "#0EA5E9", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M2 8V16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 10V17C6 17 9 19 12 19C15 19 18 17 18 17V10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon Làm đẹp
export const BeautyIcon: React.FC<IconProps> = ({ size = 24, color = "#F472B6", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5"/>
    <path d="M12 12V21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 16L12 12L16 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon Khác
export const OtherIcon: React.FC<IconProps> = ({ size = 24, color = "#6B7280", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="2" fill={color}/>
    <circle cx="6" cy="12" r="2" fill={color}/>
    <circle cx="18" cy="12" r="2" fill={color}/>
  </svg>
);

// ==================== INCOME ICONS ====================

// Icon Lương
export const SalaryIcon: React.FC<IconProps> = ({ size = 24, color = "#22C55E", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5"/>
    <path d="M12 9V15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 12L9 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5"/>
  </svg>
);

// Icon Đầu tư
export const InvestmentIcon: React.FC<IconProps> = ({ size = 24, color = "#22C55E", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 21H21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 17L10 11L14 15L21 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 8H21V13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon Quà tặng / Bonus
export const GiftIcon: React.FC<IconProps> = ({ size = 24, color = "#F59E0B", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="8" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5"/>
    <path d="M12 8V21" stroke={color} strokeWidth="1.5"/>
    <path d="M3 12H21" stroke={color} strokeWidth="1.5"/>
    <path d="M7 8C7 6 8 4 10 4C12 4 12 6 12 8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 8C17 6 16 4 14 4C12 4 12 6 12 8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ==================== STATUS ICONS ====================

// Icon Cảnh báo
export const WarningIcon: React.FC<IconProps> = ({ size = 24, color = "#EF4444", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3L2 21H22L12 3Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 10V14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="18" r="1" fill={color}/>
  </svg>
);

// Icon Info
export const InfoIcon: React.FC<IconProps> = ({ size = 24, color = "#3B82F6", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <path d="M12 8V12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1" fill={color}/>
  </svg>
);

// Icon Thành công
export const SuccessIcon: React.FC<IconProps> = ({ size = 24, color = "#22C55E", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ==================== FEATURE ICONS ====================

// Icon Ngân sách
export const BudgetIcon: React.FC<IconProps> = ({ size = 24, color = "#EAB308", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <path d="M12 6V18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 9C9 8 10 7 12 7C14 7 15 8 15 9C15 10 14 11 12 11C10 11 9 12 9 13C9 14 10 15 12 15C14 15 15 14 15 13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Xuất dữ liệu
export const ExportIcon: React.FC<IconProps> = ({ size = 24, color = "#22C55E", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3V15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 10L12 15L17 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 17V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Sao lưu
export const BackupIcon: React.FC<IconProps> = ({ size = 24, color = "#3B82F6", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 12C4 7.58172 7.58172 4 12 4C15.5264 4 18.5122 6.32711 19.5 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 12C20 16.4183 16.4183 20 12 20C8.47364 20 5.48779 17.6729 4.5 14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 9.5H20V5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14.5H4V18.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon Hướng dẫn
export const GuideIcon: React.FC<IconProps> = ({ size = 24, color = "#F97316", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <path d="M9 10C9 8.5 10 7 12 7C14 7 15 8.5 15 10C15 11.5 14 12 12 12V14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1" fill={color}/>
  </svg>
);

// Icon Xóa
export const DeleteIcon: React.FC<IconProps> = ({ size = 24, color = "#EF4444", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 7H19L18 20C18 20.5523 17.5523 21 17 21H7C6.44772 21 6 20.5523 6 20L5 7Z" stroke={color} strokeWidth="1.5"/>
    <path d="M4 7H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7" stroke={color} strokeWidth="1.5"/>
    <path d="M10 11V17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 11V17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Chỉnh sửa
export const EditIcon: React.FC<IconProps> = ({ size = 24, color = "#3B82F6", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 20H8L18.5 9.5C19.3284 8.67157 19.3284 7.32843 18.5 6.5L17.5 5.5C16.6716 4.67157 15.3284 4.67157 14.5 5.5L4 16V20Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12.5 7.5L16.5 11.5" stroke={color} strokeWidth="1.5"/>
  </svg>
);

// Icon User
export const UserIcon: React.FC<IconProps> = ({ size = 24, color = "#6F7071", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5"/>
    <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Clock
export const ClockIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <path d="M12 7V12L15 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon Thu nhập (Income)
export const IncomeIcon: React.FC<IconProps> = ({ size = 24, color = "#22C55E", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <path d="M12 7V17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 11L12 7L16 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon Chi tiêu (Expense)
export const ExpenseIcon: React.FC<IconProps> = ({ size = 24, color = "#EF4444", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <path d="M12 7V17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 13L12 17L16 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon Microphone
export const MicrophoneIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="8" y="2" width="8" height="12" rx="4" stroke={color} strokeWidth="1.5"/>
    <path d="M5 10C5 14 8 17 12 17C16 17 19 14 19 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 17V21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 21H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Danh mục
export const CategoryIcon: React.FC<IconProps> = ({ size = 24, color = "#8B5CF6", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth="1.5"/>
    <rect x="13" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth="1.5"/>
    <rect x="3" y="13" width="8" height="8" rx="2" stroke={color} strokeWidth="1.5"/>
    <rect x="13" y="13" width="8" height="8" rx="2" stroke={color} strokeWidth="1.5"/>
  </svg>
);

// Icon Nhà
export const HouseIcon: React.FC<IconProps> = ({ size = 24, color = "#6366F1", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 21V14H15V21" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

// Icon Wifi / Internet
export const WifiIcon: React.FC<IconProps> = ({ size = 24, color = "#0EA5E9", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M2 9C6 5 10 4 12 4C14 4 18 5 22 9" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 13C7.5 10.5 10 10 12 10C14 10 16.5 10.5 19 13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 17C9.5 15.5 11 15 12 15C13 15 14.5 15.5 16 17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="20" r="1.5" fill={color}/>
  </svg>
);

// Icon Flame (Streak/Fire)
export const FlameIcon: React.FC<IconProps> = ({ size = 24, color = "#F97316", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 22C16 22 19 18.5 19 14.5C19 11 17 8 15 6C15 8 14 10 12 10C12 7 10 4 8 2C8 5 7 8 5 10C3 12 3 14 4 16C5 18 8 20 9 20C7 19 6 17 7 15C8 14 9 14 10 15C11 16 12 18 10 20C11 20.5 11.5 21 12 22Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={color} fillOpacity="0.15"/>
  </svg>
);

// Icon Trophy
export const TrophyIcon: React.FC<IconProps> = ({ size = 24, color = "#F59E0B", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 21H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 17V21" stroke={color} strokeWidth="1.5"/>
    <path d="M7 4H17V10C17 13.3137 14.7614 16 12 16C9.23858 16 7 13.3137 7 10V4Z" stroke={color} strokeWidth="1.5"/>
    <path d="M7 7H4C4 7 3 8 3 10C3 12 4 13 5 13H7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 7H20C20 7 21 8 21 10C21 12 20 13 19 13H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon Refresh
export const RefreshIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 12C4 7.58172 7.58172 4 12 4C15.0736 4 17.7368 5.69233 19.1994 8.18182" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 12C20 16.4183 16.4183 20 12 20C8.92636 20 6.26318 18.3077 4.80058 15.8182" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 4H20V9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 20H4V15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon Star
export const StarIcon: React.FC<IconProps> = ({ size = 24, color = "#F59E0B", className, active }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={active ? color : "none"} fillOpacity={active ? 0.15 : 0}/>
  </svg>
);

// Icon Sparkles
export const SparklesIcon: React.FC<IconProps> = ({ size = 24, color = "#EAB308", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3L13.5 8.5L19 7L14.5 11L19 15L13.5 13.5L12 19L10.5 13.5L5 15L9.5 11L5 7L10.5 8.5L12 3Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="19" cy="5" r="1.5" fill={color}/>
    <circle cx="5" cy="19" r="1.5" fill={color}/>
  </svg>
);

// Icon Calculator
export const CalculatorIcon: React.FC<IconProps> = ({ size = 24, color = "#3B82F6", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="1.5"/>
    <rect x="6" y="4" width="12" height="4" rx="1" stroke={color} strokeWidth="1.5"/>
    <circle cx="8" cy="12" r="1" fill={color}/>
    <circle cx="12" cy="12" r="1" fill={color}/>
    <circle cx="16" cy="12" r="1" fill={color}/>
    <circle cx="8" cy="16" r="1" fill={color}/>
    <circle cx="12" cy="16" r="1" fill={color}/>
    <circle cx="16" cy="16" r="1" fill={color}/>
    <circle cx="8" cy="20" r="1" fill={color}/>
    <rect x="11" y="19" width="6" height="2" rx="1" fill={color}/>
  </svg>
);

// Icon Lightbulb (Tips)
export const LightbulbIcon: React.FC<IconProps> = ({ size = 24, color = "#F59E0B", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 21H15M12 3C8.68629 3 6 5.68629 6 9C6 11.2208 7.2066 13.1599 9 14.1973V17C9 17.5523 9.44772 18 10 18H14C14.5523 18 15 17.5523 15 17V14.1973C16.7934 13.1599 18 11.2208 18 9C18 5.68629 15.3137 3 12 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 15H15" stroke={color} strokeWidth="1.5"/>
  </svg>
);

// Icon Receipt (Hóa đơn chi tiết)
export const ReceiptIcon: React.FC<IconProps> = ({ size = 24, color = "#6366F1", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V21L17.5 19L15 21L12.5 19L10 21L7.5 19L5 21V4H4Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8 8H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 12H14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 16H12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon PiggyBank (Tiết kiệm)
export const PiggyBankIcon: React.FC<IconProps> = ({ size = 24, color = "#EC4899", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <ellipse cx="12" cy="13" rx="8" ry="6" stroke={color} strokeWidth="1.5"/>
    <path d="M5 13V17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M19 13V17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 7V10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="9" cy="12" r="1" fill={color}/>
    <path d="M4 11C2.5 10 2 8 3 6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Download
export const DownloadIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4V16M12 16L7 11M12 16L17 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 17V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon Upload
export const UploadIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 16V4M12 4L7 9M12 4L17 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 17V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Icon MenuGrid
export const MenuGridIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5"/>
  </svg>
);

// Export all icons as a mapping for dynamic usage
export const iconMap: Record<string, React.FC<IconProps>> = {
  home: HomeIcon,
  wallet: WalletIcon,
  calendar: CalendarIcon,
  chart: ChartIcon,
  settings: SettingsIcon,
  plus: PlusIcon,
  back: BackIcon,
  "chevron-right": ChevronRightIcon,
  "chevron-down": ChevronDownIcon,
  "chevron-up": ChevronUpIcon,
  close: CloseIcon,
  search: SearchIcon,
  filter: FilterIcon,
  check: CheckIcon,
  food: FoodIcon,
  shopping: ShoppingIcon,
  transport: TransportIcon,
  entertainment: EntertainmentIcon,
  bill: BillIcon,
  health: HealthIcon,
  education: EducationIcon,
  beauty: BeautyIcon,
  other: OtherIcon,
  salary: SalaryIcon,
  investment: InvestmentIcon,
  gift: GiftIcon,
  warning: WarningIcon,
  info: InfoIcon,
  success: SuccessIcon,
  budget: BudgetIcon,
  export: ExportIcon,
  backup: BackupIcon,
  guide: GuideIcon,
  delete: DeleteIcon,
  edit: EditIcon,
  user: UserIcon,
  clock: ClockIcon,
  income: IncomeIcon,
  expense: ExpenseIcon,
  microphone: MicrophoneIcon,
  category: CategoryIcon,
  house: HouseIcon,
  wifi: WifiIcon,
  flame: FlameIcon,
  trophy: TrophyIcon,
  refresh: RefreshIcon,
  star: StarIcon,
  sparkles: SparklesIcon,
  calculator: CalculatorIcon,
  lightbulb: LightbulbIcon,
  receipt: ReceiptIcon,
  "piggy-bank": PiggyBankIcon,
  download: DownloadIcon,
  upload: UploadIcon,
  "menu-grid": MenuGridIcon,
};

// Helper function to get icon by name
export const getIcon = (name: string): React.FC<IconProps> | undefined => {
  return iconMap[name];
};
