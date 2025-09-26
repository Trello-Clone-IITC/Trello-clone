// import { useState } from "react"; // Will be used for drag and drop
import { cn } from "@/lib/utils";
import { Calendar, Lock, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlannerProps {
  className?: string;
  fullWidth?: boolean;
  isSidebar?: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: number; // in hours
  color: "green" | "orange" | "purple" | "blue";
  day: number; // 0 = Sunday, 1 = Monday, etc.
  startHour: number; // 8 = 8am, 9 = 9am, etc.
}

// Mock data for events
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "9am",
    time: "9:00 AM",
    duration: 1,
    color: "green",
    day: 1, // Monday
    startHour: 9,
  },
  {
    id: "2",
    title: "9:30am",
    time: "9:30 AM",
    duration: 1,
    color: "green",
    day: 3, // Wednesday
    startHour: 9.5,
  },
  {
    id: "3",
    title: "11am",
    time: "11:00 AM",
    duration: 1,
    color: "orange",
    day: 2, // Tuesday
    startHour: 11,
  },
  {
    id: "4",
    title: "11:30 - 12:30pm",
    time: "11:30 AM - 12:30 PM",
    duration: 1,
    color: "green",
    day: 3, // Wednesday
    startHour: 11.5,
  },
  {
    id: "8",
    title: "9am",
    time: "9:00 AM",
    duration: 0.5,
    color: "green",
    day: 3, // Wednesday
    startHour: 9,
  },
  {
    id: "9",
    title: "9:30am",
    time: "9:30 AM",
    duration: 0.5,
    color: "green",
    day: 3, // Wednesday
    startHour: 9.5,
  },
  {
    id: "10",
    title: "11am",
    time: "11:00 AM",
    duration: 0.5,
    color: "orange",
    day: 3, // Wednesday
    startHour: 11,
  },
  {
    id: "5",
    title: "11:30 - 12:30pm",
    time: "11:30 AM - 12:30 PM",
    duration: 1,
    color: "purple",
    day: 4, // Thursday
    startHour: 11.5,
  },
  {
    id: "6",
    title: "9 - 10am",
    time: "9:00 AM - 10:00 AM",
    duration: 1,
    color: "blue",
    day: 5, // Friday
    startHour: 9,
  },
  {
    id: "7",
    title: "10:30 - 11:30am",
    time: "10:30 AM - 11:30 AM",
    duration: 1,
    color: "blue",
    day: 5, // Friday
    startHour: 10.5,
  },
];

const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
const dates = ["20", "21", "22", "23", "24", "25", "26"];
const timeSlots = [8, 9, 10, 11, 12, 13, 14, 15, 16]; // 8am to 4pm

const getEventColorClasses = (color: string) => {
  switch (color) {
    case "green":
      return "bg-green-500";
    case "orange":
      return "bg-orange-500";
    case "purple":
      return "bg-purple-500";
    case "blue":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const getEventPosition = (day: number, startHour: number, duration: number) => {
  const dayWidth = 100 / 7; // 7 days
  const hourHeight = 60; // 60px per hour
  const left = day * dayWidth;
  const top = (startHour - 8) * hourHeight; // 8am is the first hour
  const height = duration * hourHeight;

  return {
    left: `${left}%`,
    top: `${top}px`,
    height: `${height}px`,
    width: `${dayWidth}%`,
  };
};

export default function Planner({
  className,
  fullWidth = false,
  isSidebar = false,
}: PlannerProps) {
  // TODO: Add drag and drop functionality
  // const [isDragging, setIsDragging] = useState(false);
  // const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  if (isSidebar) {
    // Sidebar layout - single day view
    return (
      <div
        className={cn(
          "shrink-0 grow min-w-[272px] max-w-[272px] self-stretch border border-[#313133] rounded-lg overflow-hidden flex flex-col h-full min-h-0",
          "bg-gradient-to-b from-[#0e1b2c] via-[#0f2541] to-[#14365e]",
          className
        )}
      >
        {/* Compact Header */}
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-white mb-2">Planner</h1>
          <p className="text-gray-300 text-sm mb-3">
            Drag, drop, get it done. Schedule your to-dos on your calendar and
            make time for what truly matters.
          </p>
          <a
            href="#"
            className="text-blue-400 hover:text-blue-300 text-xs mb-2 block"
          >
            Try Premium for free to schedule your to-dos on your Planner.
          </a>
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
            <Lock className="w-3 h-3" />
            <span>Wed 23</span>
            <span>Only you can see your Planner.</span>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm">
            <RefreshCw className="w-3 h-3" />
            Connect a calendar
          </Button>
        </div>

        {/* Single Day Calendar */}
        <div className="flex-1 px-4 pb-4">
          <div className="bg-[#2c2e33] rounded-lg border border-[#404244] overflow-hidden">
            {/* Day Header */}
            <div className="p-3 border-b border-[#404244]">
              <div className="text-center">
                <div className="text-gray-400 text-sm">Wed</div>
                <div className="text-white font-semibold text-lg">23</div>
              </div>
            </div>

            {/* Single Day Timeline */}
            <div className="relative">
              {/* Time Column and Grid */}
              <div className="flex">
                {/* Time Labels */}
                <div className="w-12 border-r border-[#404244]">
                  {timeSlots.map((hour) => (
                    <div
                      key={hour}
                      className="h-15 border-b border-[#404244] flex items-center justify-end pr-2"
                    >
                      <span className="text-gray-400 text-xs">
                        {hour === 12
                          ? "12pm"
                          : hour > 12
                          ? `${hour - 12}pm`
                          : `${hour}am`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Day Column */}
                <div className="flex-1">
                  {timeSlots.map((hour) => (
                    <div
                      key={hour}
                      className="h-15 border-b border-[#404244] hover:bg-[#353738] transition-colors"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Event Blocks for Single Day */}
              {mockEvents
                .filter((event) => event.day === 3) // Wednesday (day 3)
                .map((event) => {
                  const position = getEventPosition(
                    0,
                    event.startHour,
                    event.duration
                  ); // Use day 0 for single column
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "absolute rounded-md p-1 text-white text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity",
                        getEventColorClasses(event.color)
                      )}
                      style={{
                        ...position,
                        left: "48px", // Offset for time column
                        width: "calc(100% - 48px)", // Full width minus time column
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-white/20 rounded-sm"></div>
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  );
                })}

              {/* Drop Zone for Single Day */}
              <div className="absolute left-12 top-[120px] right-0 h-15 border-2 border-dashed border-purple-400 bg-purple-400/10 rounded-md flex items-center justify-center">
                <Plus className="w-4 h-4 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full width layout or 50/50 split - weekly calendar view
  return (
    <div
      className={cn(
        fullWidth
          ? "flex-1 min-w-0 max-w-none w-full self-stretch border border-[#313133] overflow-hidden flex flex-col h-full min-h-0"
          : "flex-1 min-w-0 self-stretch border border-[#313133] rounded-lg overflow-hidden flex flex-col h-full min-h-0",
        "bg-gradient-to-b from-[#0e1b2c] via-[#0f2541] to-[#14365e]",
        className
      )}
    >
      {/* Header Section */}
      <div className="px-6 py-8">
        <div className="flex items-start justify-between">
          {/* Left Side - Icon, Title, Description */}
          <div className="flex items-start gap-4">
            {/* Calendar Icon with Sparkles */}
            <div className="relative">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              {/* Sparkle lines around the icon */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full opacity-60"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-300 rounded-full opacity-40"></div>
              <div className="absolute top-1 -left-3 w-2 h-2 bg-purple-500 rounded-full opacity-50"></div>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-white">Planner</h1>
              <p className="text-gray-300 text-lg max-w-md">
                Drag, drop, get it done. Schedule your to-dos on your calendar
                and make time for what truly matters.
              </p>
              <div className="flex flex-col gap-1">
                <a
                  href="#"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Try Premium for free to schedule your to-dos on your Planner.
                </a>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Only you can see your Planner.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Connect Calendar Button */}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Connect a calendar
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 px-6 pb-6">
        <div className="bg-[#2c2e33] rounded-lg border border-[#404244] overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b border-[#404244]">
            <div className="p-3 border-r border-[#404244]"></div>{" "}
            {/* Empty cell for time column */}
            {daysOfWeek.map((day, index) => (
              <div
                key={day}
                className="p-3 border-r border-[#404244] last:border-r-0"
              >
                <div className="text-center">
                  <div className="text-gray-400 text-sm">{day}</div>
                  <div className="text-white font-semibold text-lg">
                    {dates[index]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="relative">
            {/* Time Slots and Grid Lines */}
            <div className="grid grid-cols-8">
              {/* Time Column */}
              <div className="border-r border-[#404244]">
                {timeSlots.map((hour) => (
                  <div
                    key={hour}
                    className="h-15 border-b border-[#404244] flex items-center justify-end pr-3"
                  >
                    <span className="text-gray-400 text-sm">
                      {hour === 12
                        ? "12pm"
                        : hour > 12
                        ? `${hour - 12}pm`
                        : `${hour}am`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              {daysOfWeek.map((_, dayIndex) => (
                <div
                  key={dayIndex}
                  className="border-r border-[#404244] last:border-r-0"
                >
                  {timeSlots.map((hour) => (
                    <div
                      key={hour}
                      className="h-15 border-b border-[#404244] hover:bg-[#353738] transition-colors"
                    ></div>
                  ))}
                </div>
              ))}
            </div>

            {/* Event Blocks */}
            {mockEvents.map((event) => {
              const position = getEventPosition(
                event.day,
                event.startHour,
                event.duration
              );
              return (
                <div
                  key={event.id}
                  className={cn(
                    "absolute rounded-md p-2 text-white text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity",
                    getEventColorClasses(event.color)
                  )}
                  style={position}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-white/20 rounded-sm"></div>
                    <span className="truncate">{event.title}</span>
                  </div>
                </div>
              );
            })}

            {/* Drop Zone Indicator */}
            <div className="absolute left-[42.85%] top-[240px] w-[14.28%] h-15 border-2 border-dashed border-purple-400 bg-purple-400/10 rounded-md flex items-center justify-center">
              <Plus className="w-6 h-6 text-purple-400" />
            </div>

            {/* TODO: Add dragging card when drag and drop is implemented */}
          </div>
        </div>
      </div>
    </div>
  );
}
