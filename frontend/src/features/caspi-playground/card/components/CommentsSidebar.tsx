import React, { useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import type { CommentDto } from "@ronmordo/contracts";
import { useCreateCardComment } from "../hooks/useCardMutations";
import { useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "@/features/caspi-playground/board/hooks";
import { useUser } from "@clerk/clerk-react";

export const CommentsSidebar = ({
  showDetails,
  setShowDetails,
  comments,
  boardId,
  listId,
  cardId,
  checklistsCount,
  attachmentsCount,
}: {
  showDetails: boolean;
  setShowDetails: (v: boolean) => void;
  comments: CommentDto[] | undefined;
  boardId: string;
  listId: string;
  cardId: string;
  checklistsCount: number;
  attachmentsCount: number;
}) => {
  const [text, setText] = useState("");
  const [pending, setPending] = useState<CommentDto[]>([]);
  const queryClient = useQueryClient();
  const createCommentMut = useCreateCardComment(boardId, listId, cardId);
  const { user } = useUser();

  // Try to infer if a comment belongs to the current user
  const isFromCurrentUser = (c: any) => {
    if (!c) return false;
    // Match by nested user.clerkId if present
    if (c.user && user?.id && c.user.clerkId === user.id) return true;
    // Some APIs may store the app user id on Clerk metadata
    const appUserId =
      (user as any)?.publicMetadata?.userId ||
      (user as any)?.unsafeMetadata?.userId;
    if (appUserId && c.userId === appUserId) return true;
    // As a fallback, if the raw id matches (in some impls comment.userId may be Clerk id)
    if (user?.id && c.userId === user.id) return true;
    return false;
  };

  const getDisplayName = (c: any) => {
    if (isFromCurrentUser(c)) return user?.fullName || user?.username || "You";
    return c?.user?.fullName || c?.user?.username || "Member";
  };

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    // Also keep a local pending display for immediate UX while hook updates cache
    const temp: CommentDto = {
      id: `temp-${Date.now()}` as any,
      cardId,
      userId: "temp-user" as any,
      text: trimmed,
      createdAt: new Date().toISOString() as any,
    } as any;
    setPending((p) => [temp, ...p]);
    setText("");
    try {
      await createCommentMut.mutateAsync(trimmed);
      // Refetch comments to replace temp item with server one
      queryClient.invalidateQueries({
        queryKey: boardKeys.cardComments(boardId, listId, cardId),
      });
      // Remove the temp after server confirms
      setPending((p) => p.filter((c) => c.id !== temp.id));
    } catch (e) {
      // Revert on failure
      setPending((p) => p.filter((c) => c.id !== temp.id));
      setText(trimmed);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderAvatar = (c: any) => {
    const avatar = isFromCurrentUser(c)
      ? user?.imageUrl
      : (c?.user?.avatarUrl as string | undefined);
    const initials = (getDisplayName(c) || "?")
      .split(/\s+/)
      .map((p: string) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return avatar ? (
      <img
        src={avatar}
        alt="avatar"
        className="size-8 shrink-0 rounded-full object-cover"
      />
    ) : (
      <div className="size-8 shrink-0 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
        {initials}
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
          <MessageSquare className="size-4" />
          Comments and activity
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm font-medium text-[#b1bcca] bg-[#21272c] hover:bg-[#2d363c] px-3 py-1.5 rounded"
        >
          {showDetails ? "Hide details" : "Show details"}
        </button>
      </div>
      <div className="space-y-3 flex-1 px-4 pb-4 pt-2">
        <div className="flex gap-3">
          <div className="size-8 shrink-0 rounded-full bg-gray-600" />
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Write a comment..."
              className="rounded-md border border-gray-600 bg-[#161a1d] p-2 text-sm text-gray-400 w-full resize-none"
              rows={2}
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="inline-flex items-center gap-2 rounded-sm border border-gray-600 hover:bg-gray-700 text-white px-2.5 py-1.5 text-sm font-medium disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {/* Pending (optimistic) comments first */}
          {pending.map((c) => (
            <div key={c.id} className="flex gap-3 opacity-80">
              {/* No user data yet for pending */}
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="avatar"
                  className="size-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="size-8 shrink-0 rounded-full bg-gray-600" />
              )}
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">
                  {user?.fullName || user?.username || "You"}
                </div>
                <div className="rounded-md border border-gray-600 bg-[#161a1d] p-2 text-sm text-white">
                  {c.text}
                </div>
                <div className="text-xs text-gray-400 mt-1">Sending…</div>
              </div>
            </div>
          ))}
          {/* Server comments */}
          {comments?.map((c) => (
            <div key={c.id} className="flex gap-3">
              {renderAvatar(c)}
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">
                  {getDisplayName(c)}
                </div>
                <div className="rounded-md border border-gray-600 bg-[#161a1d] p-2 text-sm text-white">
                  {c.text}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(c.createdAt as any).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        {showDetails && (
          <div className="text-xs text-gray-400">
            {`Comments: ${
              comments?.length ?? 0
            } • Checklists: ${checklistsCount} • Attachments: ${attachmentsCount}`}
          </div>
        )}
      </div>
    </>
  );
};
