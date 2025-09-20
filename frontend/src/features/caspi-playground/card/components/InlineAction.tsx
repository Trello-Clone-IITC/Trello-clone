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
    className="inline-flex items-center gap-1.5 rounded-sm border border-gray-600 px-2 py-1.5 text-sm font-medium hover:bg-gray-700 text-white whitespace-nowrap"
  >
    {icon}
    <span>{label}</span>
  </button>
);

