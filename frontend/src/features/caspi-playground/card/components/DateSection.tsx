import React, { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import DatesDropdown from "./DatesModal";

interface DateSectionProps {
  startDate?: string | null;
  dueDate?: string | null;
  isCompleted?: boolean;
  onSave: (payload: {
    startDate?: string | null;
    dueDate?: string | null;
  }) => Promise<void>;
  onClear: () => Promise<void>;
}

export const DateSection: React.FC<DateSectionProps> = ({
  startDate,
  dueDate,
  isCompleted = false,
  onSave,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateRange = () => {
    if (!startDate && !dueDate) return "No due date";

    const start = startDate ? new Date(startDate) : null;
    const due = dueDate ? new Date(dueDate) : null;

    if (start && due) {
      const startStr = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const dueStr = due.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const timeStr = due.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return `${startStr} - ${dueStr}, ${timeStr}`;
    } else if (due) {
      const dueStr = due.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const timeStr = due.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return `${dueStr}, ${timeStr}`;
    } else if (start) {
      const startStr = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `Start: ${startStr}`;
    }

    return "No due date";
  };

  const isOverdue = () => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  };

  const isDueSoon = () => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();

    // Reset time to compare only dates
    const dueDateOnly = new Date(
      due.getFullYear(),
      due.getMonth(),
      due.getDate()
    );
    const todayOnly = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    return dueDateOnly.getTime() === todayOnly.getTime();
  };

  const handleSave = async (payload: {
    startDate?: string | null;
    dueDate?: string | null;
  }) => {
    await onSave(payload);
    setIsOpen(false);
  };

  const handleClear = async () => {
    await onClear();
    setIsOpen(false);
  };

  return (
    <section className="space-y-2">
      <div className="text-sm font-medium text-gray-400">Dates</div>
      <DatesDropdown
        initialStartDate={startDate}
        initialDueDate={dueDate}
        onSave={handleSave}
        onClear={handleClear}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-sm border border-[#46474b] hover:bg-[#303134] text-[#a9abaf] px-2.5 py-1.5 text-sm font-medium"
        >
          <Calendar className="size-4 text-[#a9abaf]" />
          <span className="flex items-center gap-1">
            {formatDateRange()}
            {isCompleted ? (
              <span className="bg-[#94c748] text-[#1f1f21] text-xs px-1.5 py-0.5 rounded">
                Complete
              </span>
            ) : isOverdue() ? (
              <span className="bg-[#42221f] text-[#fd9891] text-xs px-1.5 py-0.5 rounded">
                Overdue
              </span>
            ) : isDueSoon() ? (
              <span className="bg-[#fbc828] text-[#1f1f21] text-xs px-1.5 py-0.5 rounded">
                Due Soon
              </span>
            ) : null}
            <ChevronDown className="size-3" />
          </span>
        </button>
      </DatesDropdown>
    </section>
  );
};
