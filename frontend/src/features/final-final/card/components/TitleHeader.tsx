import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Circle, CheckCircle2 } from "lucide-react";

export const TitleHeader = ({
  title,
  isCompleted,
  onComplete,
}: {
  title: string;
  isCompleted: boolean;
  onComplete: (e: React.MouseEvent) => void;
}) => (
  <DialogHeader className="px-6 pt-6 pb-4">
    <div className="flex items-center gap-3">
      <span
        role="img"
        aria-label={`Mark this card complete (${title})`}
        className="cursor-pointer rounded-full transition-all duration-300 hover:bg-[#ffffff1a]"
        onClick={onComplete}
      >
        {isCompleted ? (
          <CheckCircle2
            className="w-4 h-4 transition-all duration-300 "
            fill="#a5cd6b"
            stroke="#242528"
            strokeWidth="2"
          />
        ) : (
          <Circle
            className="w-4 h-4 text-[#626F86] hover:text-[#ffffff] transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <DialogTitle className="text-xl font-semibold text-white leading-tight">
          {title}
        </DialogTitle>
      </div>
    </div>
  </DialogHeader>
);
