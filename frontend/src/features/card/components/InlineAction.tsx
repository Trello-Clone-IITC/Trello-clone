import React from "react";

export const InlineAction = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    type="button"
    className="inline-flex items-center gap-1.5 rounded-sm border border-[#46474b] px-2 py-1.5 text-sm font-medium hover:bg-[#303134] text-[#a9abaf] whitespace-nowrap"
  >
    {icon}
    <span>{label}</span>
  </button>
);
