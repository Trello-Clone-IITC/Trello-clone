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
import { emitMoveCard } from "@/features/final-final/board/socket";

interface InboxProps {
  className?: string;
  fullWidth?: boolean;
  isSidebar?: boolean;
  boardId?: string;
}

export default function Inbox({
  className,
  fullWidth = false,
  isSidebar = false,
  boardId,
}: InboxProps) {
  const { cards, addCard, updateCard, moveCardToInbox } = useInbox();

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

        if (sourceCardId && sourceListId && boardId) {
          // Calculate next position
          const nextPosition =
            cards.length > 0
              ? Math.max(...cards.map((c) => c.position || 0)) + 1000
              : 1000;

          // Emit socket event FIRST to remove card from source list
          emitMoveCard(boardId, sourceCardId, nextPosition, sourceListId, null);

          // Then call API to persist the change
          moveCardToInbox(sourceCardId, nextPosition);
        }
        setIsDragOver(false);
      },
    });

    return cleanup;
  }, [cards, moveCardToInbox, boardId]);

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
      <div className="">
        <h2 className="flex items-center justify-between my-3 mr-2 ml-4 gap-x-2 text-[16px] font-bold leading-5">
          <div className="flex items-center gap-x-2 text-left">
            <InboxIcon className="w-4 h-4 text-white" />
            Inbox
          </div>
          <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <ul className="flex gap-2 m-0 p-0 list-none">
              <Bell className="w-4 h-4" />
              <Filter className="w-4 h-4" />
              <MoreHorizontal className="w-4 h-4" />
            </ul>
          </div>
        </h2>
      </div>

      {/* Add Card (under header) */}
      <div className={cn("", fullWidth ? "flex justify-center" : "")}>
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
            className={cn("w-full self-center mt-3 mb-1.5 px-2 max-w-[800px]")}
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
        className="flex z-1 flex-1 flex-col mx-1 py-1 px-2 overflow-x-hidden overflow-y-auto self-center max-w-[800px] w-full gap-1"
      >
        {cards.length === 0 ? (
          <div className="flex flex-col flex-grow-1 items-center min-h-[404px] overflow-hidden py-16 px-4 text-center">
            <div className="text-center flex flex-col items-center justify-center">
              <h2 className="w-[200px] font-semibold text-[16px]  text-white mb-2">
                Consolidate your to-dos
              </h2>
              <p className="mb-2 pb-10 text-sm font-normal opacity-[0.8]">
                Email it, say it, forward it — however it comes, get it into
                Trello fast.
              </p>
            </div>
            <div className="flex absolute z-2 top-[560px] items-start px-6 text-white text-center">
              <Lock className="w-4 h-4" />
              <span className="mx-2 text-sm">Inbox is only visible to you</span>
            </div>
            {/* Diamond icon layout */}
            <div className="flex flex-grow-1 text-center ">
              {/* Left - Teams */}
              <div className="flex relative flex-grow-1 top-[38px] left-[62px] justify-center cursor-pointer diamond-teams translate-x-0 translate-y-0">
                <div className="flex items-center justify-center w-[84px] h-[84px] text-center ">
                  <div className="w-14 h-14  shadow-md rounded-full bg-[#1f1f21] flex items-center justify-center  cursor-pointer border-2 border-transparent hover:border-[#8fb8f6] ">
                    <img
                      src={TeamsIcon}
                      alt="Microsoft Teams"
                      className="w-6 h-6"
                    />
                  </div>
                </div>
              </div>
              {/* Bottom - Phone */}
              <div className="flex relative flex-grow-1 justify-center top-[112px] left-[25px] z-1 cursor-pointer diamond-phone">
                <div className="flex items-center justify-center w-[84px] h-[84px] text-center ">
                  <div className="w-14 h-14 rounded-full bg-[#1f1f21] border-2 border-transparent hover:border-[#8fb8f6] flex items-center justify-center text-[#bfc1c4] shadow-md cursor-pointer">
                    <Smartphone className="w-6 h-6" />
                  </div>
                </div>
              </div>
              {/* Top - Email */}
              <div className="flex relative flex-grow-1 justify-center  left-[-16px] cursor-pointer diamond-email">
                <div className="flex items-center justify-center w-[104px] h-[104px] text-center ">
                  <div className="w-18 h-18 rounded-full bg-[#1f1f21] flex items-center justify-center text-[#4688ec] shadow-md cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                    <Mail className="w-6 h-6" />
                  </div>
                </div>
              </div>
              {/* Right - Slack */}
              <div className="flex relative flex-grow-1 justfiy-center top-[80px] left-[-60px] cursor-pointer diamond-slack">
                <div className="flex items-center justify-center w-[84px] h-[84px] text-center ">
                  <div className="w-14 h-14 rounded-full bg-[#1f1f21] flex items-center justify-center shadow-md cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                    <img src={SlackIcon} alt="Slack" className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "flex z-1 flex-1 flex-col mx-1 py-1 px-2 overflow-x-hidden overflow-y-auto self-center max-w-[800px] w-full gap-1"
            )}
          >
            {cards
              .sort((a, b) => (a.position || 0) - (b.position || 0))
              .map((card) => (
                <InboxCardComponent
                  key={card.id}
                  card={card}
                  onUpdate={updateCard}
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

      {/* Bottom Dock - Show when cards are present */}
      {cards.length > 0 && (
        <div className="self-center w-full max-w-[800px] p-2">
          <div className="flex justify-center py-2 rounded-[8px] bg-[#303134]">
            <div className="flex justify-evenly w-[269px]">
              {/* Email */}
              <div className="cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-[#1f1f21] flex items-center justify-center text-[#4688ec] shadow-md cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <Mail className="w-6 h-6" />
                </div>
              </div>
              {/* Slack */}
              <div className="cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-[#1f1f21] flex items-center justify-center shadow-md cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <img src={SlackIcon} alt="Slack" className="w-6 h-6" />
                </div>
              </div>
              {/* Teams */}
              <div className="cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-[#1f1f21] flex items-center justify-center shadow-md cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <img
                    src={TeamsIcon}
                    alt="Microsoft Teams"
                    className="w-6 h-6"
                  />
                </div>
              </div>
              {/* Phone */}
              <div className="cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-[#1f1f21] border-2 border-transparent hover:border-[#8fb8f6] flex items-center justify-center text-[#bfc1c4] shadow-md cursor-pointer">
                  <Smartphone className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
