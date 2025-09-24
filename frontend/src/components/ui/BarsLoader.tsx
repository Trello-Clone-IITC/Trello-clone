import React from "react";

type Props = {
  label?: string;
  className?: string;
  barClassName?: string;
};

export const BarsLoader: React.FC<Props> = ({
  label,
  className,
  barClassName,
}) => {
  return (
    <span className={`inline-flex items-center gap-2 ${className || ""}`}>
      <style>
        {`
          @keyframes bars-bounce-ui {
            0%, 80%, 100% { transform: scaleY(0.6); opacity: 0.6; }
            40% { transform: scaleY(1); opacity: 1; }
          }
        `}
      </style>
      <span className="inline-flex items-end gap-[2px] h-[10px] align-middle">
        <span
          className={`w-[3px] bg-gray-400 rounded-sm ${barClassName || ""}`}
          style={{
            height: "6px",
            animation: "bars-bounce-ui 1s infinite ease-in-out",
            animationDelay: "0s",
          }}
        />
        <span
          className={`w-[3px] bg-gray-400 rounded-sm ${barClassName || ""}`}
          style={{
            height: "10px",
            animation: "bars-bounce-ui 1s infinite ease-in-out",
            animationDelay: "0.15s",
          }}
        />
        <span
          className={`w-[3px] bg-gray-400 rounded-sm ${barClassName || ""}`}
          style={{
            height: "8px",
            animation: "bars-bounce-ui 1s infinite ease-in-out",
            animationDelay: "0.3s",
          }}
        />
      </span>
      {label ? <span className="text-xs text-gray-400">{label}</span> : null}
    </span>
  );
};

export default BarsLoader;
