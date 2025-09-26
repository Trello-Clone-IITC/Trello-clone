import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useInbox } from "../hooks/useInbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  Check,
  Bell,
  Filter,
  MoreHorizontal,
  Inbox as InboxIcon,
  Mail,
  Smartphone,
  Lock,
} from "lucide-react";
import type { InboxCard } from "../types";
import SlackIcon from "@/assets/icons/slack-color.svg";
import TeamsIcon from "@/assets/icons/microsoft-teams-color.svg";

interface InboxProps {
  className?: string;
  fullWidth?: boolean;
  isSidebar?: boolean;
  isVisible?: boolean;
}

const InboxCardComponent: React.FC<{
  card: InboxCard;
  onUpdate: (id: string, updates: Partial<InboxCard>) => void;
  onDelete: (id: string) => void;
  onToggleCompletion: (id: string) => void;
}> = ({ card, onUpdate, onDelete, onToggleCompletion }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(
    card.description || ""
  );

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(card.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(card.title);
    setEditDescription(card.description || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="bg-[#22272b] rounded-lg p-3 mb-2 border border-[#313133] hover:border-[#44546f] transition-colors">
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-[#1a1a1a] border-[#313133] text-white placeholder:text-gray-400"
            placeholder="Card title"
            autoFocus
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-[#1a1a1a] border-[#313133] text-white placeholder:text-gray-400 resize-none"
            placeholder="Add a description..."
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </Button>
            <Button
              onClick={handleCancel}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="group">
          <div className="flex items-start gap-2">
            <button
              onClick={() => onToggleCompletion(card.id)}
              className={cn(
                "mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                card.isCompleted
                  ? "bg-green-600 border-green-600 text-white"
                  : "border-[#44546f] hover:border-green-600"
              )}
            >
              {card.isCompleted && <Check className="w-3 h-3" />}
            </button>
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "text-sm font-medium text-white cursor-pointer hover:bg-[#313133] rounded px-1 py-0.5 -mx-1 -my-0.5",
                  card.isCompleted && "line-through text-gray-400"
                )}
                onClick={() => setIsEditing(true)}
              >
                {card.title}
              </h3>
              {card.description && (
                <p className="text-xs text-gray-400 mt-1 whitespace-pre-wrap">
                  {card.description}
                </p>
              )}
            </div>
            <button
              onClick={() => onDelete(card.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#313133] rounded transition-all"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Inbox({
  className,
  fullWidth = false,
  isSidebar = false,
  isVisible = true,
}: InboxProps) {
  const {
    cards,
    addCard,
    updateCard,
    deleteCard,
    toggleCardCompletion,
    isLoading,
  } = useInbox();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const addCardRef = useRef<HTMLDivElement>(null);

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

  // Reset animation state when Inbox becomes visible
  useEffect(() => {
    if (isVisible) {
      console.log("Inbox became visible:", {
        cardsLength: cards.length,
        isLoading,
        animationKey,
      });

      setHasAnimatedIn(false);
      setIsTransitioning(false);
      setAnimationKey((prev) => prev + 1); // Force animation reset

      if (cards.length === 0 && !isLoading) {
        const timer = setTimeout(() => {
          console.log("Triggering diamond animation");
          setHasAnimatedIn(true);
        }, 100);
        return () => clearTimeout(timer);
      } else if (cards.length > 0) {
        // If there are cards, show them immediately without animation
        setHasAnimatedIn(true);
      }
    }
  }, [isVisible, cards.length, isLoading]);

  // Trigger transition animation when cards are added
  useEffect(() => {
    if (cards.length > 0 && hasAnimatedIn && !isTransitioning) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 800); // Full duration for the transition
      return () => clearTimeout(timer);
    }
  }, [cards.length, hasAnimatedIn, isTransitioning]);

  if (isLoading) {
    return (
      <div
        className={cn(
          fullWidth
            ? "flex-1 min-w-0 w-full border border-[#313133] overflow-hidden flex items-center justify-center"
            : "flex-grow-0 flex-shrink-0 basis-[272px] w-[272px] border border-[#313133] rounded-lg overflow-hidden flex items-center justify-center",
          "bg-gradient-to-b from-[#0e1b2c] via-[#0f2541] to-[#14365e]",
          className
        )}
      >
        <div className="text-gray-400">Loading inbox...</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        fullWidth
          ? "flex-1 min-w-0 max-w-none w-full self-stretch border border-[#313133] overflow-hidden flex flex-col h-full min-h-0 group"
          : isSidebar
          ? "shrink-0 grow min-w-[272px] max-w-[272px] self-stretch border border-[#313133] rounded-lg overflow-hidden flex flex-col h-full min-h-0 group"
          : "flex-1 min-w-0 self-stretch border border-[#313133] rounded-lg overflow-hidden flex flex-col h-full min-h-0 group",
        "bg-gradient-to-b from-[#0e1b2c] via-[#0f2541] to-[#14365e]",
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 relative">
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
              key={animationKey}
              className={cn(
                "relative transition-all duration-800 ease-out",
                cards.length > 0 && isTransitioning
                  ? "opacity-0 translate-y-8"
                  : "opacity-100 translate-y-0"
              )}
              style={{ width: 180, height: 180, margin: "0 auto" }}
            >
              {/* Top - Email */}
              <div
                className={cn(
                  "absolute right-[25px] top-[-100px] cursor-pointer",
                  hasAnimatedIn && "diamond-email"
                )}
              >
                <div className="w-17 h-17 rounded-full bg-[#1f1f21] flex items-center justify-center text-[#4688ec] shadow-md cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <Mail className="w-6 h-6" />
                </div>
              </div>
              {/* Left - Teams */}
              <div
                className={cn(
                  "absolute -top-10 -translate-y-1/2 left-[-5px] cursor-pointer",
                  hasAnimatedIn && "diamond-teams"
                )}
              >
                <div className="w-14 h-14 rounded-full bg-[#1f1f21] flex items-center justify-center shadow-md cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <img
                    src={TeamsIcon}
                    alt="Microsoft Teams"
                    className="w-6 h-6"
                  />
                </div>
              </div>
              {/* Right - Slack */}
              <div
                className={cn(
                  "absolute top-0 -translate-y-1/2 right-[-10px] cursor-pointer",
                  hasAnimatedIn && "diamond-slack"
                )}
              >
                <div className="w-14 h-14 rounded-full bg-[#1f1f21] flex items-center justify-center shadow-md cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <img src={SlackIcon} alt="Slack" className="w-6 h-6" />
                </div>
              </div>
              {/* Bottom - Phone */}
              <div
                className={cn(
                  "absolute left-15 -translate-x-1/2 bottom-27 cursor-pointer",
                  hasAnimatedIn && "diamond-phone"
                )}
              >
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
              .sort((a, b) => a.position - b.position)
              .map((card) => (
                <InboxCardComponent
                  key={card.id}
                  card={card}
                  onUpdate={updateCard}
                  onDelete={deleteCard}
                  onToggleCompletion={toggleCardCompletion}
                />
              ))}
          </div>
        )}
      </div>

      {/* Bottom dock - show when fullWidth and has cards, or when not fullWidth and has cards */}
      {cards.length > 0 &&
        (fullWidth ? (
          // Full width bottom dock (fixed position)
          <div
            className={cn(
              "fixed bottom-20 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-[800px] px-4",
              isTransitioning ? "bottom-dock-fade-in" : "opacity-0"
            )}
          >
            <div className="flex justify-center py-2 bg-[#303134] rounded-[16px]">
              <div className="flex justify-evenly w-[269px]">
                {/* Email */}
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[#1f1f21] text-[#4688ec] cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <Mail className="w-6 h-6" />
                </div>
                {/* Slack */}
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[#1f1f21] cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <img src={SlackIcon} alt="Slack" className="w-6 h-6" />
                </div>
                {/* Microsoft Teams */}
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[#1f1f21] cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <img
                    src={TeamsIcon}
                    alt="Microsoft Teams"
                    className="w-6 h-6"
                  />
                </div>
                {/* Phone */}
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[#1f1f21] text-[#bfc1c4] cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <Smartphone className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Inline bottom dock (not fullWidth)
          <div
            className={cn(
              "self-center w-full max-w-[800px] p-2",
              isTransitioning ? "bottom-dock-fade-in" : "opacity-0"
            )}
          >
            <div className="flex justify-center py-2 bg-[#303134] rounded-[16px]">
              <div className="flex justify-evenly w-[269px]">
                {/* Email */}
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[#1f1f21] text-[#4688ec] cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <Mail className="w-6 h-6" />
                </div>
                {/* Slack */}
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[#1f1f21] cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <img src={SlackIcon} alt="Slack" className="w-6 h-6" />
                </div>
                {/* Microsoft Teams */}
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[#1f1f21] cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <img
                    src={TeamsIcon}
                    alt="Microsoft Teams"
                    className="w-6 h-6"
                  />
                </div>
                {/* Phone */}
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[#1f1f21] text-[#bfc1c4] cursor-pointer border-2 border-transparent hover:border-[#8fb8f6]">
                  <Smartphone className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
