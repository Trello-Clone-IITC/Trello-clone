import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useInbox } from "../hooks/useInbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Filter,
  MoreHorizontal,
  Inbox as InboxIcon,
  Mail,
  Smartphone,
  Lock,
} from "lucide-react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import InboxCardComponent from "./InboxCard";
import { useInboxCardDnd } from "../hooks/useInboxCardDnd";
import SlackIcon from "@/assets/icons/slack-color.svg";
import TeamsIcon from "@/assets/icons/microsoft-teams-color.svg";

interface InboxProps {
  className?: string;
  fullWidth?: boolean;
  isSidebar?: boolean;
}

export default function Inbox({
  className,
  fullWidth = false,
  isSidebar = false,
}: InboxProps) {
  const {
    cards,
    addCard,
    updateCard,
    deleteCard,
    toggleCardCompletion,
    moveCardToInbox,
  } = useInbox();

  const {
    scrollRef: inboxScrollRef,
    setDraggingId,
    setPreview,
  } = useInboxCardDnd();

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const addCardRef = useRef<HTMLDivElement>(null);
  const inboxRef = useRef<HTMLDivElement>(null);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCard(newCardTitle.trim(), newCardDescription.trim() || undefined);
      setNewCardTitle("");
      setNewCardDescription("");
      setIsAddingCard(false);
    }
  };

  const handleCancelAdd = () => {
    setNewCardTitle("");
    setNewCardDescription("");
    setIsAddingCard(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddCard();
    } else if (e.key === "Escape") {
      handleCancelAdd();
    }
  };

  // Auto-focus the input when adding a card
  useEffect(() => {
    if (isAddingCard && addCardRef.current) {
      const input = addCardRef.current.querySelector("input");
      input?.focus();
    }
  }, [isAddingCard]);

  // Set up drop target for cards from board lists
  useEffect(() => {
    const element = inboxRef.current;
    if (!element) return;

    const cleanup = dropTargetForElements({
      element,
      getData: () => ({
        type: "inbox-drop",
        inboxId: "inbox",
      }),
      canDrop: ({ source }) => source.data?.type === "card",
      onDragEnter: () => {
        setIsDragOver(true);
      },
      onDragLeave: () => {
        setIsDragOver(false);
      },
      onDrop: ({ source }) => {
        const sourceCardId = source.data?.cardId as string;
        const sourceListId = source.data?.listId as string;

        if (sourceCardId && sourceListId) {
          // Move card from list to inbox
          const nextPosition =
            cards.length > 0
              ? Math.max(...cards.map((c) => c.position || 0)) + 1000
              : 1000;
          moveCardToInbox(sourceCardId, nextPosition);
        }
        setIsDragOver(false);
      },
    });

    return cleanup;
  }, [cards, moveCardToInbox]);

  return (
    <div
      ref={inboxRef}
      className={cn(
        fullWidth
          ? "flex-1 min-w-0 max-w-none w-full self-stretch border border-[#313133] overflow-hidden flex flex-col h-full min-h-0 group"
          : isSidebar
          ? "shrink-0 grow min-w-[272px] max-w-[272px] self-stretch border border-[#313133] rounded-lg overflow-hidden flex flex-col h-full min-h-0 group"
          : "flex-1 min-w-0 self-stretch border border-[#313133] rounded-lg overflow-hidden flex flex-col h-full min-h-0 group",
        "bg-[#0f2541]",
        isDragOver && "ring-2 ring-blue-400 ring-inset",
        className
      )}
    >
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <InboxIcon className="w-4 h-4 text-white" />
          <h2 className="text-[14px] font-semibold text-white">Inbox</h2>
        </div>
        <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Bell className="w-4 h-4" />
          <Filter className="w-4 h-4" />
          <MoreHorizontal className="w-4 h-4" />
        </div>
      </div>

      {/* Add Card (under header) */}
      <div className={cn("p-3", fullWidth ? "flex justify-center" : "")}>
        {isAddingCard ? (
          <div
            ref={addCardRef}
            className={cn(
              "space-y-2",
              fullWidth ? "w-full max-w-[800px]" : "w-full"
            )}
          >
            <Input
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-[#0f2541] border-[#294265] text-[#e3ebf6] placeholder:text-[#8fa8c7]"
              placeholder="Add a card"
            />
            <Textarea
              value={newCardDescription}
              onChange={(e) => setNewCardDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-[#0f2541] border-[#294265] text-[#e3ebf6] placeholder:text-[#8fa8c7] resize-none"
              placeholder="Add a description (optional)"
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddCard}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Card
              </Button>
              <Button
                onClick={handleCancelAdd}
                size="sm"
                variant="ghost"
                className="text-[#9bb4d1] hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "w-full",
              fullWidth ? "self-center max-w-[800px]" : ""
            )}
          >
            <Button
              onClick={() => setIsAddingCard(true)}
              className="w-full justify-start min-h-6 py-2 px-3 rounded-[8px] text-left font-normal bg-[#242528] text-[#96999e] hover:bg-[#2b2c2f] cursor-pointer"
            >
              Add a card
            </Button>
          </div>
        )}
      </div>

      {/* Cards / Empty state */}
      <div
        ref={inboxScrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 relative"
      >
        {cards.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-around px-3 ">
            <div className="text-center">
              <h2 className="font-semibold text-[16px] text-white mb-2">
                Consolidate your to-dos
              </h2>
              <p className="mb-2 pb-10 text-sm font-normal">
                Email it, say it, forward it — however it comes, get it into
                Trello fast.
              </p>
            </div>
            {/* Diamond icon layout */}
            <div
              className="relative transition-all duration-800 ease-out opacity-0 animate-fade-in"
              style={{ width: 180, height: 180, margin: "0 auto" }}
            >
              {/* Top - Email */}
              <div className="absolute right-[25px] top-[-100px] cursor-pointer diamond-email">
                <div className="w-14 h-14 rounded-full bg-[#1f1f21] flex items-center justify-center text-[#4688ec] shadow-md cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <Mail className="w-6 h-6" />
                </div>
              </div>
              {/* Left - Teams */}
              <div className="absolute -top-10 -translate-y-1/2 left-[-5px] cursor-pointer diamond-teams">
                <div className="w-14 h-14 rounded-full bg-[#1f1f21] flex items-center justify-center shadow-md cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <img
                    src={TeamsIcon}
                    alt="Microsoft Teams"
                    className="w-6 h-6"
                  />
                </div>
              </div>
              {/* Right - Slack */}
              <div className="absolute top-0 -translate-y-1/2 right-[-10px] cursor-pointer diamond-slack">
                <div className="w-14 h-14 rounded-full bg-[#1f1f21] flex items-center justify-center shadow-md cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <img src={SlackIcon} alt="Slack" className="w-6 h-6" />
                </div>
              </div>
              {/* Bottom - Phone */}
              <div className="absolute left-15 -translate-x-1/2 bottom-27 cursor-pointer diamond-phone">
                <div className="w-14 h-14 rounded-full bg-[#1f1f21] border-2 border-transparent hover:border-[#8fb8f6] flex items-center justify-center text-[#bfc1c4] shadow-md cursor-pointer">
                  <Smartphone className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="mt-6 text-[#9bb4d1] text-[12px] flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Inbox is only visible to you</span>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "space-y-2",
              fullWidth ? "w-full max-w-[800px] mx-auto" : "w-full"
            )}
          >
            {cards
              .sort((a, b) => (a.position || 0) - (b.position || 0))
              .map((card) => (
                <InboxCardComponent
                  key={card.id}
                  card={card}
                  onUpdate={updateCard}
                  onDelete={deleteCard}
                  onToggleCompletion={toggleCardCompletion}
                  onDragStart={setDraggingId}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setPreview(null);
                  }}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
