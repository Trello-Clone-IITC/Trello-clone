export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: number; // in hours
  color: "green" | "orange" | "purple" | "blue";
  day: number; // 0 = Sunday, 1 = Monday, etc.
  startHour: number; // 8 = 8am, 9 = 9am, etc.
}

export interface PlannerProps {
  className?: string;
  fullWidth?: boolean;
}
