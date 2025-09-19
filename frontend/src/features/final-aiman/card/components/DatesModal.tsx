import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";

type DatesDropdownProps = {
  children: React.ReactNode;
};

export default function DatesDropdown({ children }: DatesDropdownProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(2025, 8, 3)
  ); // September 3, 2025
  const [startDateEnabled, setStartDateEnabled] = useState(false);
  const [dueDateEnabled, setDueDateEnabled] = useState(true);
  const [dueTime, setDueTime] = useState("12:34 PM");
  const [reminder, setReminder] = useState("1 Day before");

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        alignOffset={0}
        sideOffset={-200}
        className="w-80 bg-[#22272b] border-gray-600 text-white p-0 overflow-y-auto dates-dropdown"
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
                selected={selectedDate}
                onSelect={setSelectedDate}
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
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    startDateEnabled
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-500"
                  }`}
                >
                  {startDateEnabled && <Check className="size-3 text-white" />}
                </button>
                <input
                  type="text"
                  placeholder="M/D/YYYY"
                  disabled={!startDateEnabled}
                  className={`px-2 py-1 rounded border text-sm w-[90px] ${
                    startDateEnabled
                      ? "bg-white text-black border-gray-300"
                      : "bg-gray-700 text-gray-500 border-gray-600"
                  }`}
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
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    dueDateEnabled
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-500"
                  }`}
                >
                  {dueDateEnabled && <Check className="size-3 text-white" />}
                </button>
                <input
                  type="text"
                  value={formatDate(selectedDate)}
                  disabled={!dueDateEnabled}
                  className={`px-2 py-1 rounded border text-sm w-[90px] ${
                    dueDateEnabled
                      ? "bg-white text-black border-gray-300"
                      : "bg-gray-700 text-gray-500 border-gray-600"
                  }`}
                  readOnly
                />
                <input
                  type="text"
                  value={dueTime}
                  disabled={!dueDateEnabled}
                  className={`px-2 py-1 rounded border text-sm w-20 ${
                    dueDateEnabled
                      ? "bg-white text-black border-gray-300"
                      : "bg-gray-700 text-gray-500 border-gray-600"
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
              <select
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="w-full px-2 py-1 rounded border border-gray-600 bg-[#22272b] text-white text-sm"
              >
                <option value="1 Day before">1 Day before</option>
                <option value="2 Days before">2 Days before</option>
                <option value="1 Week before">1 Week before</option>
                <option value="On due date">On due date</option>
              </select>
              <p className="text-xs text-gray-400">
                Reminders will be sent to all members and watchers of this card.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <Button className="bg-[#579DFF] hover:bg-[#85b8ff] text-[#1d2125] text-sm py-2">
                Save
              </Button>
              <Button
                variant="outline"
                className="bg-[#A1BDD914] hover:bg-[#3d474f] text-[#aab4c2] hover:text-[#aab4c2] border-transparent text-sm py-2"
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
