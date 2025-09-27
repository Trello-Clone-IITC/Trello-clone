import React from "react";
import { LabelsPopover } from "./LabelsPopover";

type Label = { id: string; name?: string | null; color: string };

type LabelsRowProps = {
  labels: Label[];
  boardLabels: Label[] | undefined;
  selectedLabelIds: string[];
  getLabelClassName: (color: string) => string;
  onToggle: (labelId: string, isSelected: boolean) => void;
};

export const LabelsRow: React.FC<LabelsRowProps> = ({
  labels,
  boardLabels,
  selectedLabelIds,
  getLabelClassName,
  onToggle,
}) => {
  return (
    <section className="space-y-2">
      <div className="text-sm font-medium text-gray-400">Labels</div>
      <div className="flex items-center gap-2 flex-wrap">
        {labels.map((label, idx) => (
          <span
            key={label.name || idx}
            className={`h-8 rounded-[3px] px-3 text-sm font-normal cursor-pointer overflow-hidden max-w-full min-w-[48px] leading-8 text-left text-ellipsis transition-opacity ${getLabelClassName(
              label.color
            )} text-black text-opacity-100 mix-blend-normal`}
            title={label.name || ""}
          >
            {label.name || ""}
          </span>
        ))}
        <LabelsPopover
          availableLabels={boardLabels || []}
          selectedLabelIds={selectedLabelIds}
          onToggle={onToggle}
          onCreateLabel={() => {}}
          onEditLabel={() => {}}
        >
          <button className="h-8 w-8 rounded-sm flex items-center justify-center text-gray-400 hover:text-gray-300 bg-[#2c3339] p-1.5">
            <span className="font-medium">
              <svg
                width="16"
                height="16"
                role="presentation"
                focusable="false"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3C11.4477 3 11 3.44772 11 4V11L4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H11V20C11 20.5523 11.4477 21 12 21C12.5523 21 13 20.5523 13 20V13H20C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11L13 11V4C13 3.44772 12.5523 3 12 3Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </button>
        </LabelsPopover>
      </div>
    </section>
  );
};

export default LabelsRow;
