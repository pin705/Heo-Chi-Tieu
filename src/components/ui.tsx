import React, { useState, useEffect, useRef, FC } from "react";

// ===== UI Components cho App Quản Lý Chi Tiêu =====

// ==================== ANIMATED NUMBER ====================
interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatFn?: (value: number) => string;
  className?: string;
}

export const AnimatedNumber: FC<AnimatedNumberProps> = ({
  value,
  duration = 600,
  formatFn = (v) => v.toLocaleString("vi-VN"),
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (endValue - startValue) * easeOut;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return <span className={className}>{formatFn(Math.round(displayValue))}</span>;
};

// ==================== BOTTOM SHEET ====================
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: "auto" | "half" | "full";
}

export const BottomSheet: FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  height = "auto",
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const heightClasses = {
    auto: "max-h-[85vh]",
    half: "h-1/2",
    full: "h-[95vh]",
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby={title ? "sheet-title" : undefined}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl ${
          heightClasses[height]
        } overflow-hidden shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" aria-hidden="true" />
        </div>
        
        {/* Title */}
        {title && (
          <div className="px-4 py-3">
            <h3 id="sheet-title" className="text-lg font-bold text-center text-gray-900">{title}</h3>
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto px-4 pb-6" style={{ maxHeight: "calc(100% - 60px)", paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ==================== CARD ====================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
  style?: React.CSSProperties;
  animate?: boolean;
  delay?: number;
}

export const Card: FC<CardProps> = ({
  children,
  className = "",
  onClick,
  padding = "md",
  style,
  animate = false,
  delay = 0,
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-5",
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-card ${paddingClasses[padding]} ${
        onClick ? "cursor-pointer card-press" : ""
      } ${animate ? "animate-fadeInUp" : ""} ${className}`}
      onClick={onClick}
      style={{ 
        ...style,
        ...(animate && delay ? { animationDelay: `${delay}s` } : {})
      }}
    >
      {children}
    </div>
  );
};

// ==================== FEATURE CARD ====================
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  color?: string;
  index?: number;
}

export const FeatureCard: FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  onClick,
  color = "#EAB308",
  index = 0,
}) => {
  return (
    <Card
      onClick={onClick}
      className="animate-fadeInUp hover:shadow-lg transition-shadow"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex flex-col items-center text-center">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm icon-tap"
          style={{ backgroundColor: `${color}15` }}
        >
          {icon}
        </div>
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        {description && (
          <span className="text-xs text-gray-500 mt-1">{description}</span>
        )}
      </div>
    </Card>
  );
};

// ==================== RESULT CARD ====================
interface ResultCardProps {
  title: string;
  value: string;
  numericValue?: number;
  subtitle?: string;
  color?: string;
  className?: string;
  animate?: boolean;
}

export const ResultCard: FC<ResultCardProps> = ({
  title,
  value,
  numericValue,
  subtitle,
  color = "#EAB308",
  className = "",
  animate = false,
}) => {
  return (
    <Card className={`${animate ? "animate-fadeInUp" : ""} ${className}`}>
      <div className="text-sm text-gray-500 font-medium mb-2">{title}</div>
      <div className="text-2xl font-bold" style={{ color }}>
        {animate && numericValue !== undefined ? (
          <AnimatedNumber 
            value={numericValue} 
            formatFn={(v) => v.toLocaleString("vi-VN") + " ₫"}
            duration={800}
          />
        ) : (
          value
        )}
      </div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </Card>
  );
};

// ==================== EMPTY STATE ====================
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fadeIn">
      {icon && <div className="mb-4 text-gray-300">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl text-sm font-semibold shadow-lg active:scale-95 transition-transform"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// ==================== LOADING SPINNER ====================
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  color = "#EAB308",
}) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full animate-spin`}
        style={{ borderTopColor: color }}
      />
    </div>
  );
};

// ==================== TOAST ====================
interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  isVisible: boolean;
}

export const Toast: FC<ToastProps> = ({
  message,
  type = "info",
  isVisible,
}) => {
  if (!isVisible) return null;

  const styles = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-gray-800",
    warning: "bg-yellow-500",
  };

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        ${styles[type]} text-white px-6 py-4 rounded-2xl shadow-2xl z-50
        animate-scaleIn font-medium`}
    >
      {message}
    </div>
  );
};

// ==================== STEP INDICATOR ====================
interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const StepIndicator: FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                index < currentStep
                  ? "bg-yellow-500 text-white shadow-lg"
                  : index === currentStep
                  ? "bg-yellow-500 text-white ring-4 ring-yellow-200"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index < currentStep ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className={`mt-2 text-xs font-medium ${index <= currentStep ? "text-yellow-600" : "text-gray-400"}`}>
              {step}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-3 rounded-full transition-colors duration-300 ${index < currentStep ? "bg-yellow-500" : "bg-gray-200"}`}/>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ==================== DONUT CHART ====================
interface DonutChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  primaryColor?: string;
  secondaryColor?: string;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const DonutChart: FC<DonutChartProps> = ({
  percentage,
  size = 120,
  strokeWidth = 12,
  primaryColor = "#EAB308",
  secondaryColor = "#F3F4F6",
  label,
  sublabel,
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={secondaryColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={percentage > 100 ? "#EF4444" : primaryColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${percentage > 100 ? "text-red-500" : "text-gray-900"}`} style={{ fontSize: size / 5 }}>
            {Math.round(percentage)}%
          </span>
          {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
        </div>
      </div>
      {label && <span className="text-sm text-gray-600 mt-3 font-medium">{label}</span>}
    </div>
  );
};

// ==================== PROGRESS BAR ====================
interface ProgressBarProps {
  value: number;
  maxValue: number;
  color?: string;
  showLabel?: boolean;
  label?: string;
  height?: "sm" | "md" | "lg";
  animate?: boolean;
  className?: string;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  value,
  maxValue,
  color = "#EAB308",
  showLabel = false,
  label,
  height = "md",
  animate = true,
  className = "",
}) => {
  const [animated, setAnimated] = useState(false);
  const percent = maxValue > 0 ? (value / maxValue) * 100 : 0;
  
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimated(true), 100);
      return () => clearTimeout(timer);
    }
    setAnimated(true);
    return undefined;
  }, [animate]);

  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-700 font-medium">{label}</span>
          <span className="text-gray-500">{Math.round(percent)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div
          className={`${heightClasses[height]} rounded-full transition-all duration-700 ease-out`}
          style={{
            width: animated ? `${Math.min(percent, 100)}%` : '0%',
            backgroundColor: percent > 100 ? '#EF4444' : color,
          }}
        />
      </div>
    </div>
  );
};

// ==================== SWIPEABLE ITEM ====================
interface SwipeableItemProps {
  children: React.ReactNode;
  onDelete: () => void;
  deleteLabel?: string;
}

export const SwipeableItem: FC<SwipeableItemProps> = ({
  children,
  onDelete,
  deleteLabel = "Xóa",
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const startX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const DELETE_BUTTON_WIDTH = 80;
  const THRESHOLD = 40;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX.current;
    const newTranslate = isOpen ? diff - DELETE_BUTTON_WIDTH : diff;
    setTranslateX(Math.min(0, Math.max(-DELETE_BUTTON_WIDTH, newTranslate)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (translateX < -THRESHOLD) {
      setTranslateX(-DELETE_BUTTON_WIDTH);
      setIsOpen(true);
    } else {
      setTranslateX(0);
      setIsOpen(false);
    }
  };

  const handleDelete = () => {
    if (containerRef.current) {
      containerRef.current.style.transition = 'all 0.3s ease-out';
      containerRef.current.style.opacity = '0';
      containerRef.current.style.height = '0';
      containerRef.current.style.marginBottom = '0';
    }
    setTimeout(onDelete, 300);
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden mb-2">
      {/* Delete button */}
      <div 
        className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-red-500 text-white font-semibold text-sm cursor-pointer transition-opacity"
        style={{ 
          width: DELETE_BUTTON_WIDTH,
          opacity: translateX < 0 ? 1 : 0,
        }}
        onClick={handleDelete}
      >
        {deleteLabel}
      </div>
      
      {/* Content */}
      <div
        className="relative bg-white rounded-2xl"
        style={{ 
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};

// ==================== COLLAPSIBLE CARD ====================
interface CollapsibleCardProps {
  title: string;
  summary?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export const CollapsibleCard: FC<CollapsibleCardProps> = ({
  title,
  summary,
  isOpen,
  onToggle,
  children,
  className = "",
}) => {
  return (
    <Card className={className} padding="none">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-4 text-left">
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          {!isOpen && summary && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{summary}</p>
          )}
        </div>
        <div className={`ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </Card>
  );
};

// ==================== SUCCESS CELEBRATION ====================
interface SuccessCelebrationProps {
  isVisible: boolean;
  message?: string;
  onComplete?: () => void;
}

export const SuccessCelebration: FC<SuccessCelebrationProps> = ({
  isVisible,
  message = "Hoàn thành!",
  onComplete,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      haptic.success();
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isVisible, onComplete]);

  if (!show) return null;

  const confettiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#EAB308'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-confetti"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: '50%',
              backgroundColor: confettiColors[i % confettiColors.length],
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>
      
      {/* Success message */}
      <div className="bg-white rounded-3xl shadow-2xl px-10 py-8 animate-bounceIn">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark"/>
            </svg>
          </div>
          <p className="text-xl font-bold text-gray-900">{message}</p>
        </div>
      </div>
    </div>
  );
};

// ==================== HAPTIC FEEDBACK ====================
export const vibrate = (pattern: number | number[] = 10) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Vibration not supported
    }
  }
};

export const haptic = {
  light: () => vibrate(10),
  medium: () => vibrate(20),
  heavy: () => vibrate(30),
  success: () => vibrate([10, 50, 10]),
  error: () => vibrate([30, 50, 30]),
  selection: () => vibrate(5),
};

// ==================== PULL TO REFRESH ====================
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
  threshold?: number;
}

export const PullToRefresh: FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  disabled = false,
  threshold = 80,
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing || startY.current === 0) return;
    
    const currentY = e.touches[0].clientY;
    const diff = Math.max(0, (currentY - startY.current) * 0.5);
    setPullDistance(Math.min(diff, threshold * 1.5));
  };

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing) return;
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      haptic.medium();
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    startY.current = 0;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-auto h-full"
    >
      {/* Pull indicator */}
      <div 
        className="absolute left-0 right-0 flex justify-center transition-transform duration-200"
        style={{ 
          transform: `translateY(${pullDistance - 40}px)`,
          opacity: pullDistance / threshold,
        }}
      >
        <div className={`w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg ${isRefreshing ? 'animate-spin' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M4 12C4 7.58172 7.58172 4 12 4C15.0736 4 17.7368 5.69233 19.1994 8.18182" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M20 12C20 16.4183 16.4183 20 12 20C8.92636 20 6.26318 18.3077 4.80058 15.8182" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M15 4H20V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 20H4V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div style={{ 
        transform: `translateY(${pullDistance}px)`, 
        transition: pullDistance === 0 ? 'transform 0.2s' : 'none' 
      }}>
        {children}
      </div>
    </div>
  );
};

// ==================== SKELETON COMPONENTS ====================
export const SkeletonPulse: FC<{ className?: string; style?: React.CSSProperties }> = ({ 
  className = "", 
  style 
}) => (
  <div className={`skeleton rounded ${className}`} style={style} />
);

export const SkeletonText: FC<{ width?: string; height?: string; className?: string }> = ({ 
  width = "w-full", 
  height = "h-4", 
  className = "" 
}) => (
  <SkeletonPulse className={`${width} ${height} ${className}`} />
);

export const SkeletonCircle: FC<{ size?: number; className?: string }> = ({ 
  size = 40, 
  className = "" 
}) => (
  <SkeletonPulse className={`rounded-full flex-shrink-0 ${className}`} style={{ width: size, height: size }} />
);

export const SkeletonCard: FC<{ height?: string; className?: string; delay?: number }> = ({ 
  height = "h-24", 
  className = "", 
  delay = 0 
}) => (
  <div className={`bg-white rounded-2xl p-4 ${height} ${className}`} style={{ animationDelay: `${delay}ms` }}>
    <SkeletonText width="w-1/3" height="h-3" className="mb-3" />
    <SkeletonText width="w-2/3" height="h-6" className="mb-2" />
    <SkeletonText width="w-1/2" height="h-3" />
  </div>
);

// ==================== INPUT FIELD ====================
interface InputFieldProps {
  label?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "email" | "password";
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

export const InputField: FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  suffix,
  error,
  hint,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className={`flex items-center bg-gray-50 rounded-2xl px-4 py-3 border-2 transition-colors ${error ? 'border-red-300 focus-within:border-red-500' : 'border-transparent focus-within:border-yellow-500'}`}>
        {prefix && <span className="mr-3 text-gray-400">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 disabled:opacity-50"
        />
        {suffix && <span className="ml-3 text-gray-400">{suffix}</span>}
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
};

// ==================== BUTTON ====================
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  className = "",
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/25 hover:shadow-xl",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50",
    ghost: "text-gray-600 hover:bg-gray-100",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-6 py-3 text-sm gap-2",
    lg: "px-8 py-4 text-base gap-2.5",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <LoadingSpinner size="sm" color={variant === "primary" || variant === "danger" ? "#FFFFFF" : "#EAB308"} />
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

// ==================== STAT ITEM ====================
interface StatItemProps {
  label: string;
  value: string | number;
  color?: string;
  icon?: React.ReactNode;
  animate?: boolean;
}

export const StatItem: FC<StatItemProps> = ({
  label,
  value,
  color = "#EAB308",
  icon,
  animate = false,
}) => {
  return (
    <div className="flex flex-col items-center p-3">
      {icon && <div className="mb-2">{icon}</div>}
      <p className="text-lg font-bold" style={{ color }}>
        {animate && typeof value === 'number' ? (
          <AnimatedNumber value={value} duration={600} />
        ) : (
          value
        )}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
};

// ==================== BADGE ====================
interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "sm",
  className = "",
}) => {
  const variantStyles = {
    primary: "bg-yellow-100 text-yellow-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-orange-100 text-orange-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
