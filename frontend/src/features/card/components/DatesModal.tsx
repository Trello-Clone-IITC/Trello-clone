import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

type DatesDropdownProps = {
  children: React.ReactNode;
  initialStartDate?: string | null;
  initialDueDate?: string | null;
  onSave: (payload: {
    startDate?: string | null;
    dueDate?: string | null;
  }) => void;
  onClear: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function DatesDropdown({
  children,
  initialStartDate,
  initialDueDate,
  onSave,
  onClear,
  open,
  onOpenChange,
}: DatesDropdownProps) {
  const initialStart = initialStartDate
    ? new Date(initialStartDate)
    : undefined;
  const initialDue = initialDueDate ? new Date(initialDueDate) : undefined;
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    initialStart
  );
  const [selectedDueDate, setSelectedDueDate] = useState<Date | undefined>(
    initialDue
  );
  const [startDateEnabled, setStartDateEnabled] = useState(!!initialStartDate);
  const [dueDateEnabled, setDueDateEnabled] = useState(!!initialDueDate);
  const [dueTime, setDueTime] = useState("12:00 PM");
  const [reminder, setReminder] = useState("1 Day before");
  const [currentMode, setCurrentMode] = useState<"start" | "due">("due");

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (currentMode === "start") {
      setSelectedStartDate(date);
    } else {
      setSelectedDueDate(date);
    }
  };

  const getCurrentSelectedDate = () => {
    return currentMode === "start" ? selectedStartDate : selectedDueDate;
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        alignOffset={0}
        sideOffset={-200}
        className="w-80 bg-[#2b2c2f] border-gray-600 text-white p-0 overflow-y-auto dates-dropdown"
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Dates</h3>
          </div>

          {/* Calendar Section */}
          <div className="mb-3 flex flex-col items-center justify-center">
            <div className="calendar-container">
              <Calendar
                mode="single"
                selected={getCurrentSelectedDate()}
                onSelect={handleDateSelect}
              />
            </div>
          </div>

          {/* Functions Section */}
          <div className="space-y-2">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Start date
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStartDateEnabled(!startDateEnabled)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer ${
                    startDateEnabled
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-500"
                  }`}
                >
                  {startDateEnabled && <Check className="size-3 text-white" />}
                </button>
                <input
                  type="text"
                  value={formatDate(selectedStartDate)}
                  placeholder="M/D/YYYY"
                  disabled={!startDateEnabled}
                  onClick={() => setCurrentMode("start")}
                  className={`px-2 py-1 rounded  text-sm w-[90px] cursor-pointer ${
                    startDateEnabled
                      ? "bg-[#242528] text-[#bfc1c4]"
                      : "bg-[#303134] text-gray-500 "
                  }`}
                  readOnly
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Due date
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDueDateEnabled(!dueDateEnabled)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer ${
                    dueDateEnabled
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-500"
                  }`}
                >
                  {dueDateEnabled && <Check className="size-3 text-white" />}
                </button>
                <input
                  type="text"
                  value={formatDate(selectedDueDate)}
                  disabled={!dueDateEnabled}
                  onClick={() => setCurrentMode("due")}
                  className={`px-2 py-1 rounded  text-sm w-[90px] cursor-pointer ${
                    dueDateEnabled
                      ? "bg-[#242528] text-[#bfc1c4] "
                      : "bg-[#303134] text-gray-500"
                  }`}
                  readOnly
                />
                <input
                  type="text"
                  value={dueTime}
                  disabled={!dueDateEnabled}
                  className={`px-2 py-1 rounded  text-sm w-20 ${
                    dueDateEnabled
                      ? "bg-[#242528] text-[#bfc1c4] "
                      : "bg-[#303134] text-gray-500 "
                  }`}
                  onChange={(e) => setDueTime(e.target.value)}
                />
              </div>
            </div>

            {/* Reminder */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Set due date reminder
              </label>
              <Select value={reminder} onValueChange={setReminder}>
                <SelectTrigger className="flex items-center justify-between min-h-[40px] rounded-[3px] border-2 w-full py-[2px] px-[6px] cursor-pointer focus-visible:ring-0 bg-[#242528] placeholder:text-[#bfc1c4] border-[#7e8188] focus-visible:border-[#596e8f]">
                  <SelectValue
                    className="placeholder:text-[#bfc1c4]"
                    placeholder="Select reminder"
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#2b2c2f] border-[#7e8188]">
                  <SelectItem
                    value="1 Day before"
                    className="text-[#bfc1c4] hover:bg-[#3d3f43] focus:bg-[#3d3f43]"
                  >
                    1 Day before
                  </SelectItem>
                  <SelectItem
                    value="2 Days before"
                    className="text-[#bfc1c4] hover:bg-[#3d3f43] focus:bg-[#3d3f43]"
                  >
                    2 Days before
                  </SelectItem>
                  <SelectItem
                    value="1 Week before"
                    className="text-[#bfc1c4] hover:bg-[#3d3f43] focus:bg-[#3d3f43]"
                  >
                    1 Week before
                  </SelectItem>
                  <SelectItem
                    value="On due date"
                    className="text-[#bfc1c4] hover:bg-[#3d3f43] focus:bg-[#3d3f43]"
                  >
                    On due date
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">
                Reminders will be sent to all members and watchers of this card.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <Button
                className="bg-[#579DFF] hover:bg-[#85b8ff] text-[#1d2125] text-sm py-2 rounded-[6px] cursor-pointer"
                onClick={() => {
                  const toIso = (d?: Date) =>
                    d ? new Date(d).toISOString() : null;

                  // Create due date with time if due date is enabled
                  let dueDateWithTime = null;
                  if (dueDateEnabled && selectedDueDate) {
                    const [time, period] = dueTime.split(" ");
                    const [hours, minutes] = time.split(":").map(Number);
                    let hour24 = hours;

                    if (period === "PM" && hours !== 12) {
                      hour24 = hours + 12;
                    } else if (period === "AM" && hours === 12) {
                      hour24 = 0;
                    }

                    const dueDate = new Date(selectedDueDate);
                    dueDate.setHours(hour24, minutes, 0, 0);
                    dueDateWithTime = dueDate.toISOString();
                  }

                  onSave({
                    startDate: startDateEnabled
                      ? toIso(selectedStartDate)
                      : null,
                    dueDate: dueDateWithTime,
                  });
                  onOpenChange?.(false);
                }}
              >
                Save
              </Button>
              <Button
                className="bg-[#37383b] hover:bg-[#424346] rounded-[6px] text-[#aab4c2] hover:text-[#aab4c2] border-transparent text-sm py-2 cursor-pointer"
                onClick={() => {
                  onClear();
                  onOpenChange?.(false);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
