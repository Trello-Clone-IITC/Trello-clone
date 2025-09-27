import React from "react";
import UserModal from "./UserModal";
import { MembersPopover } from "./MembersPopover";
import { addMembersIconDark, addMembersIconLight } from "@/assets";
import { useTheme } from "@/hooks/useTheme";

type Member = {
  id: string;
  fullName: string;
  username: string;
  avatarUrl?: string | null;
};

type AssignedMembersProps = {
  assignees: Member[];
  boardMembers: any[] | undefined;
  onAssign: { mutate: (userId: string) => void };
  onRemove: { mutate: (assigneeId: string) => void };
};

export const AssignedMembers: React.FC<AssignedMembersProps> = ({
  assignees,
  boardMembers,
  onAssign,
  onRemove,
}) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!assignees?.length) return null;

  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-gray-400 mb-2">Members</div>
      <div className="flex items-center gap-2">
        {assignees.map((a) => (
          <UserModal
            key={a.id}
            trigger={
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <img
                  src={a.avatarUrl || undefined}
                  alt={a.fullName || ""}
                  className="w-9 h-9 rounded-full object-cover"
                />
              </div>
            }
            user={{
              fullName: a.fullName,
              username: a.username,
              avatarUrl: a.avatarUrl || undefined,
            }}
            onRemove={() => onRemove.mutate(a.id)}
          >
            <button
              onClick={() => onRemove.mutate(a.id)}
              className="w-full text-left px-4 py-3 text-sm text-[#bfc1c4] hover:bg-[#32373c]"
            >
              Remove from card
            </button>
          </UserModal>
        ))}
        <MembersPopover
          members={(boardMembers ?? []).map((m) => ({
            id: m.userId,
            fullName: m.user.fullName || "Member",
            username: m.user.username || "",
            avatarUrl: m.user.avatarUrl,
          }))}
          selectedIds={assignees.map((m) => m.id)}
          onSelect={(member) => onAssign.mutate(member.id)}
        >
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[#393b3e] text-[#a9abaf] text-lg font-bold border-none hover:bg-[#44474a] transition-colors"
            aria-label="Add member"
          >
            {isLight ? (
              <img
                src={addMembersIconLight}
                alt="Members"
                className="w-4 h-4"
              />
            ) : (
              <img src={addMembersIconDark} alt="Members" className="w-4 h-4" />
            )}
          </button>
        </MembersPopover>
      </div>
    </div>
  );
};

export default AssignedMembers;
