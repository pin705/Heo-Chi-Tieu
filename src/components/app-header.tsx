import React, { ReactNode } from "react";
import { useNavigate, Header as ZmpHeader } from "zmp-ui";
import { useLocation } from "react-router-dom";
import { BackIcon } from "./icons";

export interface AppHeaderProps {
  title?: ReactNode;
  className?: string;
  showBackIcon?: boolean; // override
  noBack?: boolean; // force hide
  variant?: "primary" | "neutral"; // visual style, default primary
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  className,
  showBackIcon,
  noBack,
  variant = "primary",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [handle] = useRouteHandle();
  const autoShowBack = location.key !== "default";
  const shouldShowBack = showBackIcon ?? (!noBack && autoShowBack);
  const variantClass =
    variant === "primary" ? "" : "";

  return (

     <div className="h-12 w-full flex items-center px-2 py-2 bg-white">
      {true && (
        <button
          className="p-2 -ml-1 cursor-pointer active:bg-section rounded-lg transition-colors"
          onClick={() => navigate(-1)}
        >
          <BackIcon />
        </button>
      )}
      <div className="flex-1 text-lg font-semibold text-foreground text-center pr-10">
        {title}
      </div>
     </div>
  );
};

export default AppHeader;
