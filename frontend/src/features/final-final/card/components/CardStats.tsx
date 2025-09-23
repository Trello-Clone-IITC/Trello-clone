import React from "react";
import type { CardDto } from "@ronmordo/contracts";

export type CardStatsProps = {
  card: CardDto;
  isCompleted?: boolean;
};

const formatDue = (iso?: string | null) => {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    const now = new Date();
    const isPast = d.getTime() < now.getTime();

    // Check if it's the same day (Due Soon)
    const dueDateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const todayOnly = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const isDueSoon = dueDateOnly.getTime() === todayOnly.getTime();

    const label = d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    return { label, isPast, isDueSoon };
  } catch {
    return null;
  }
};

export const CardStats: React.FC<CardStatsProps> = ({
  card,
  isCompleted = false,
}) => {
  const due = formatDue(card.dueDate as any);
  const showDescription = !!card.description;
  const showComments = (card.commentsCount ?? 0) > 0;
  const showAttachments = (card.attachmentsCount ?? 0) > 0;
  const showChecklist = (card.checklistItemsCount ?? 0) > 0;
  const isWatched = !!card.isWatch;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between">
        {/* Left: stats */}
        <div className="flex flex-wrap gap-1.5">
          {isWatched && (
            <span
              className="flex items-center text-gray-400 text-xs"
              title="Watching"
            >
              <svg
                className="w-3.5 h-3.5 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12.0006 18C7.46367 18 4.00142 13.74 4.00142 12C4.00142 9.999 7.45967 6 12.0006 6C16.3775 6 19.9988 9.973 19.9988 12C19.9988 13.74 16.5366 18 12.0006 18ZM12.0006 4C6.48003 4 2.00012 8.841 2.00012 12C2.00012 15.086 6.5771 20 12.0006 20C17.4241 20 22.0001 15.086 22.0001 12C22.0001 8.841 17.5212 4 12.0006 4ZM11.9775 13.9844C10.8745 13.9844 9.97752 13.0874 9.97752 11.9844C9.97752 10.8814 10.8745 9.9844 11.9775 9.9844C13.0805 9.9844 13.9775 10.8814 13.9775 11.9844C13.9775 13.0874 13.0805 13.9844 11.9775 13.9844ZM11.9775 7.9844C9.77152 7.9844 7.97752 9.7784 7.97752 11.9844C7.97752 14.1904 9.77152 15.9844 11.9775 15.9844C14.1835 15.9844 15.9775 14.1904 15.9775 11.9844C15.9775 9.7784 14.1835 7.9844 11.9775 7.9844Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}

          {due && (
            <span
              className={`flex items-center text-xs px-1.5 py-0.5 rounded ${
                isCompleted
                  ? "text-[#1f1f21] bg-[#94c748]"
                  : due.isPast
                  ? "text-[#fd9891] bg-[#42221f]"
                  : due.isDueSoon
                  ? "text-[#1f1f21] bg-[#fbc828]"
                  : "text-gray-300 bg-white/10"
              }`}
              title="Due date"
            >
              <svg
                className="w-3.5 h-3.5 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L13.7929 15.2071C14.1834 15.5976 14.8166 15.5976 15.2071 15.2071C15.5976 14.8166 15.5976 14.1834 15.2071 13.7929L13 11.5858V6Z" />
                <path
                  fillRule="evenodd"
                  d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                  clipRule="evenodd"
                />
              </svg>
              {due.label}
            </span>
          )}

          {showDescription && (
            <span
              className="flex items-center text-gray-400 text-xs"
              title="Description"
            >
              <svg
                className="w-3.5 h-3.5 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM4 9C3.44772 9 3 9.44772 3 10C3 10.5523 3.44772 11 4 11H20C20.5523 11 21 10.5523 21 10C21 9.44772 20.5523 9 20 9H4ZM3 14C3 13.4477 3.44772 13 4 13H12C12.5523 13 13 13.4477 13 14C13 14.5523 12.5523 15 12 15H4C3.44772 15 3 14.5523 3 14Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}

          {showComments && (
            <span
              className="flex items-center text-gray-400 text-xs"
              title="Comments"
            >
              <svg
                className="w-3.5 h-3.5 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M16 17H12.5L8.28037 20.4014C6.97772 21.4869 5 20.5606 5 18.865V16.1973C3.2066 15.1599 2 13.2208 2 11C2 7.68629 4.68629 5 8 5H16C19.3137 5 22 7.68629 22 11C22 14.3137 19.3137 17 16 17ZM16 7H8C5.79086 7 4 8.79086 4 11C4 12.8638 5.27477 14.4299 7 14.874V19L12 15H16C18.2091 15 20 13.2091 20 11C20 8.79086 18.2091 7 16 7Z"
                  clipRule="evenodd"
                />
              </svg>
              {card.commentsCount}
            </span>
          )}

          {showAttachments && (
            <span
              className="flex items-center text-gray-400 text-xs"
              title="Attachments"
            >
              <svg
                className="w-3.5 h-3.5 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M11.6426 17.9647C10.1123 19.46 7.62736 19.4606 6.10092 17.9691C4.57505 16.478 4.57769 14.0467 6.10253 12.5566L13.2505 5.57184C14.1476 4.6952 15.5861 4.69251 16.4832 5.56921C17.3763 6.44184 17.3778 7.85135 16.4869 8.72199L9.78361 15.2722C9.53288 15.5172 9.12807 15.5163 8.86954 15.2636C8.61073 15.0107 8.60963 14.6158 8.86954 14.3618L15.0989 8.27463C15.4812 7.90109 15.4812 7.29546 15.0989 6.92192C14.7167 6.54838 14.0969 6.54838 13.7146 6.92192L7.48523 13.0091C6.45911 14.0118 6.46356 15.618 7.48523 16.6163C8.50674 17.6145 10.1511 17.6186 11.1679 16.6249L17.8712 10.0747C19.5274 8.45632 19.5244 5.83555 17.8676 4.2165C16.2047 2.59156 13.5266 2.59657 11.8662 4.21913L4.71822 11.2039C2.42951 13.4404 2.42555 17.083 4.71661 19.3218C7.00774 21.5606 10.7323 21.5597 13.0269 19.3174L19.7133 12.7837C20.0956 12.4101 20.0956 11.8045 19.7133 11.431C19.331 11.0574 18.7113 11.0574 18.329 11.431L11.6426 17.9647Z"
                  clipRule="evenodd"
                />
              </svg>
              {card.attachmentsCount}
            </span>
          )}

          {showChecklist && (
            <span
              className="flex items-center text-gray-400 text-xs"
              title="Checklist"
            >
              <svg
                className="w-3.5 h-3.5 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13C20 12.4477 19.5523 12 19 12C18.4477 12 18 12.4477 18 13V18H6V6L16 6C16.5523 6 17 5.55228 17 5C17 4.44772 16.5523 4 16 4H6ZM8.73534 10.3223C8.36105 9.91618 7.72841 9.89038 7.3223 10.2647C6.91619 10.639 6.89039 11.2716 7.26467 11.6777L10.8768 15.597C11.4143 16.1231 12.2145 16.1231 12.7111 15.6264L13.0754 15.2683C13.3699 14.9785 13.6981 14.6556 14.0516 14.3075C15.0614 13.313 16.0713 12.3169 17.014 11.3848L17.0543 11.3449C18.7291 9.68869 20.0004 8.42365 20.712 7.70223C21.0998 7.30904 21.0954 6.67589 20.7022 6.28805C20.309 5.90022 19.6759 5.90457 19.2881 6.29777C18.5843 7.01131 17.3169 8.27244 15.648 9.92281L15.6077 9.96263C14.6662 10.8937 13.6572 11.8889 12.6483 12.8825L11.8329 13.6851L8.73534 10.3223Z"
                  clipRule="evenodd"
                />
              </svg>
              {card.completedChecklistItemsCount}/{card.checklistItemsCount}
            </span>
          )}
        </div>

        {/* Right: members */}
        <div className="flex -space-x-1">
          {card.cardAssignees?.slice(0, 3).map((u) => (
            <div
              key={u.id}
              className="relative inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#22272b] hover:z-10 transition-transform hover:scale-110 bg-gray-500 text-white text-[10px] font-medium"
              title={`${u.fullName}${u.username ? ` (${u.username})` : ""}`}
            >
              {u.avatarUrl && (
                <img
                  src={u.avatarUrl}
                  alt={u.fullName}
                  className="w-6 h-6 rounded-full"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
