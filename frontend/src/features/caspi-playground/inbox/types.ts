export interface InboxCard {
  id: string;
  title: string;
  description?: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  isCompleted?: boolean;
}

// Context type removed; Inbox is now a regular component using a self-contained hook
