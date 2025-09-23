import React from "react";

type SpinnerProps = {
  label?: string;
  className?: string;
  size?: number;
};

const Spinner: React.FC<SpinnerProps> = ({
  label,
  className = "",
  size = 24,
}) => {
  const dim = `${size}px`;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="animate-spin rounded-full border-2 border-white/30 border-t-white"
        style={{ width: dim, height: dim }}
        aria-label={label || "Loading"}
        role="status"
      />
      {label ? <span className="text-white/90 text-sm">{label}</span> : null}
    </div>
  );
};

export default Spinner;
