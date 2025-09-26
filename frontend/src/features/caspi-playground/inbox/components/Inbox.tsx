import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useInbox } from "../hooks/useInbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
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

export default function Inbox({ className, fullWidth = false }: InboxProps) {
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

  if (isLoading) {
    return (
      <div
        className={cn(
          fullWidth
            ? "flex-1 min-w-0 w-full border border-[#313133] rounded-lg overflow-hidden flex items-center justify-center"
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
          ? "flex-1 min-w-0 max-w-none w-full self-stretch border border-[#313133] rounded-lg overflow-hidden flex flex-col h-full min-h-0"
          : "shrink-0 grow min-w-[272px] max-w-[272px] self-stretch border border-[#313133] rounded-lg overflow-hidden flex flex-col h-full min-h-0",
        "bg-gradient-to-b from-[#0e1b2c] via-[#0f2541] to-[#14365e]",
        className
      )}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-[#263956] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <InboxIcon className="w-4 h-4 text-[#9bb4d1]" />
          <h2 className="text-[14px] font-semibold text-[#dfe6ef]">Inbox</h2>
        </div>
        <div className="flex items-center gap-2 text-[#9bb4d1]">
          <Bell className="w-4 h-4" />
          <Filter className="w-4 h-4" />
          <MoreHorizontal className="w-4 h-4" />
        </div>
      </div>

      {/* Add Card (under header) */}
      <div className="p-3">
        {isAddingCard ? (
          <div ref={addCardRef} className="space-y-2">
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
          <Button
            onClick={() => setIsAddingCard(true)}
            className="w-full justify-start bg-[#242528] rounded-[8px] text-white hover:bg-[#2b2c2f]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add a card
          </Button>
        )}
      </div>

      {/* Cards / Empty state */}
      <div className="flex-1 overflow-y-auto p-3 relative">
        {cards.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-3">
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
            <div className="relative mt-6" style={{ width: 180, height: 180 }}>
              {/* Top - Email */}
              <div className="absolute right-[23px] translate-x-0 translate-y-0 top-[-15px]">
                <div className="w-14 h-14 rounded-full bg-[#1f1f21] flex items-center justify-center text-[#4688ec] shadow-md">
                  <Mail className="w-6 h-6" />
                </div>
              </div>
              {/* Left - Teams */}
              <div className="absolute top-15 -translate-y-1/2 left-5">
                <div className="w-14 h-14 rounded-full bg-[#1f1f21] flex items-center justify-center shadow-md">
                  <img
                    src={TeamsIcon}
                    alt="Microsoft Teams"
                    className="w-6 h-6"
                  />
                </div>
              </div>
              {/* Right - Slack */}
              <div className="absolute top-1/2 -translate-y-1/2 right-0">
                <div className="w-12 h-12 rounded-full bg-[#1d2d49] border border-[#263956] flex items-center justify-center shadow-md">
                  <img src={SlackIcon} alt="Slack" className="w-5 h-5" />
                </div>
              </div>
              {/* Bottom - Phone */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
                <div className="w-12 h-12 rounded-full bg-[#1d2d49] border border-[#263956] flex items-center justify-center text-[#9bb4d1] shadow-md">
                  <Smartphone className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="mt-6 text-[#9bb4d1] text-[12px] flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Inbox is only visible to you</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
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

      {/* Bottom dock (hidden when empty) */}
      {cards.length > 0 && (
        <div className="px-3 pb-3 pt-1">
          <div className="flex items-center justify-between gap-2">
            {/* Email */}
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#1d2d49] text-[#9bb4d1] border border-[#263956]">
              <Mail className="w-4 h-4" />
            </div>
            {/* Slack */}
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#1d2d49] border border-[#263956]">
              <span className="inline-block" aria-label="Slack">
                <svg
                  width="24"
                  height="24"
                  role="presentation"
                  focusable="false"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  data-testid="SlackColorIcon"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.86632 4C8.98186 4.00065 8.26606 4.71698 8.26671 5.59967C8.26606 6.48236 8.98251 7.1987 9.86697 7.19935H11.4672V5.60033C11.4679 4.71764 10.7514 4.0013 9.86632 4C9.86697 4 9.86697 4 9.86632 4ZM9.86632 8.26667H5.60026C4.7158 8.26732 3.99935 8.98365 4 9.86634C3.99869 10.749 4.71515 11.4654 5.59961 11.4667H9.86632C10.7508 11.466 11.4672 10.7497 11.4666 9.86699C11.4672 8.98365 10.7508 8.26732 9.86632 8.26667Z"
                    fill="#36C5F0"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.9998 9.86634C20.0004 8.98365 19.284 8.26732 18.3995 8.26667C17.5151 8.26732 16.7986 8.98365 16.7993 9.86634V11.4667H18.3995C19.284 11.466 20.0004 10.7497 19.9998 9.86634ZM15.7331 9.86634V5.59967C15.7337 4.71764 15.0179 4.0013 14.1335 4C13.249 4.00065 12.5326 4.71698 12.5332 5.59967V9.86634C12.5319 10.749 13.2484 11.4654 14.1328 11.4667C15.0173 11.466 15.7337 10.7497 15.7331 9.86634Z"
                    fill="#2EB67D"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.1335 20C15.0179 19.9994 15.7344 19.2831 15.7337 18.4004C15.7344 17.5177 15.0179 16.8013 14.1335 16.8007H12.5332V18.4004C12.5325 19.2824 13.249 19.9987 14.1335 20ZM14.1335 15.7327H18.4002C19.2846 15.7321 20.0011 15.0157 20.0004 14.133C20.0017 13.2503 19.2853 12.534 18.4008 12.5327H14.1341C13.2497 12.5334 12.5332 13.2497 12.5339 14.1324C12.5332 15.0157 13.249 15.7321 14.1335 15.7327Z"
                    fill="#ECB22E"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 14.1331C3.99935 15.0158 4.7158 15.7321 5.60026 15.7328C6.48472 15.7321 7.20118 15.0158 7.20052 14.1331V12.5334H5.60026C4.7158 12.5341 3.99935 13.2504 4 14.1331ZM8.26671 14.1331V18.3998C8.2654 19.2825 8.98186 19.9988 9.86632 20.0001C10.7508 19.9995 11.4672 19.2831 11.4666 18.4004V14.1344C11.4679 13.2517 10.7514 12.5354 9.86697 12.5341C8.98186 12.5341 8.26606 13.2504 8.26671 14.1331Z"
                    fill="#E01E5A"
                  ></path>
                </svg>
              </span>
            </div>
            {/* Microsoft Teams */}
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#1d2d49] border border-[#263956]">
              <span className="inline-block" aria-label="Microsoft Teams">
                <svg
                  data-testid="microsoft-teams-icon"
                  aria-hidden="true"
                  width="16"
                  height="16"
                  role="presentation"
                  focusable="false"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip-:rk:)">
                    <path
                      d="M10.6333 6.44971H14.0774C14.4027 6.44971 14.6665 6.71346 14.6665 7.03884V10.1759C14.6665 11.3718 13.6971 12.3412 12.5012 12.3412H12.491C11.2952 12.3413 10.3256 11.3721 10.3254 10.1762C10.3254 10.1761 10.3254 10.176 10.3254 10.1759V6.75761C10.3254 6.58754 10.4633 6.44971 10.6333 6.44971Z"
                      fill="#5059C9"
                    ></path>
                    <path
                      d="M12.9613 5.82976C13.7319 5.82976 14.3566 5.20504 14.3566 4.43441C14.3566 3.66378 13.7319 3.03906 12.9613 3.03906C12.1906 3.03906 11.5659 3.66378 11.5659 4.43441C11.5659 5.20504 12.1906 5.82976 12.9613 5.82976Z"
                      fill="#5059C9"
                    ></path>
                    <path
                      d="M8.62002 5.82988C9.73316 5.82988 10.6355 4.9275 10.6355 3.81435C10.6355 2.70121 9.73316 1.79883 8.62002 1.79883C7.50687 1.79883 6.60449 2.70121 6.60449 3.81435C6.60449 4.9275 7.50687 5.82988 8.62002 5.82988Z"
                      fill="#7B83EB"
                    ></path>
                    <path
                      d="M11.3075 6.44971H5.62256C5.30108 6.45766 5.04671 6.72447 5.05419 7.04601V10.624C5.00926 12.5534 6.53574 14.1544 8.46507 14.2016C10.3944 14.1544 11.9208 12.5534 11.8759 10.624V7.04601C11.8834 6.72447 11.6291 6.45766 11.3075 6.44971Z"
                      fill="#7B83EB"
                    ></path>
                    <path
                      opacity="0.1"
                      d="M8.77505 6.44971V11.4637C8.7735 11.6937 8.63417 11.9002 8.42156 11.9877C8.35384 12.0164 8.2811 12.0311 8.20758 12.0312H5.32696C5.28664 11.9289 5.24944 11.8265 5.21845 11.7211C5.10993 11.3653 5.05453 10.9954 5.05412 10.6234V7.04506C5.04664 6.72405 5.30058 6.45766 5.62153 6.44971H8.77505Z"
                      fill="black"
                    ></path>
                    <path
                      opacity="0.2"
                      d="M8.46499 6.44971V11.7738C8.46499 11.8473 8.45022 11.92 8.42156 11.9877C8.33404 12.2003 8.12748 12.3397 7.89752 12.3412H5.47269C5.41999 12.2389 5.3704 12.1366 5.32696 12.0312C5.28353 11.9258 5.24944 11.8265 5.21845 11.7211C5.10993 11.3653 5.05453 10.9954 5.05412 10.6234V7.04506C5.04664 6.72405 5.30058 6.45766 5.62153 6.44971H8.46499Z"
                      fill="black"
                    ></path>
                    <path
                      opacity="0.2"
                      d="M8.46499 6.44971V11.1536C8.4626 11.466 8.20997 11.7187 7.89758 11.721H5.21845C5.10993 11.3652 5.05453 10.9953 5.05412 10.6233V7.04506C5.04664 6.72405 5.30058 6.45766 5.62153 6.44971H8.46499Z"
                      fill="black"
                    ></path>
                    <path
                      opacity="0.2"
                      d="M8.15488 6.44971V11.1536C8.15248 11.466 7.89985 11.7187 7.58746 11.721H5.21845C5.10993 11.3652 5.05453 10.9953 5.05412 10.6233V7.04506C5.04664 6.72405 5.30058 6.45766 5.62153 6.44971H8.15488Z"
                      fill="black"
                    ></path>
                    <path
                      opacity="0.1"
                      d="M8.77517 4.84665V5.82343C8.72247 5.82654 8.67288 5.82965 8.62011 5.82965C8.56735 5.82965 8.51782 5.82654 8.46505 5.82343C8.36037 5.81649 8.25657 5.79986 8.155 5.77383C7.5271 5.62512 7.00833 5.18476 6.75965 4.58935C6.71687 4.48939 6.68361 4.38554 6.6604 4.2793H8.2077C8.52063 4.28043 8.77398 4.53378 8.77517 4.84665Z"
                      fill="black"
                    ></path>
                    <path
                      opacity="0.2"
                      d="M8.46517 5.1572V5.82391C8.36049 5.81697 8.25669 5.80034 8.15512 5.77432C7.52722 5.6256 7.00845 5.18525 6.75977 4.58984H7.89776C8.21063 4.59098 8.46398 4.84433 8.46517 5.1572Z"
                      fill="black"
                    ></path>
                    <path
                      opacity="0.2"
                      d="M8.46517 5.1572V5.82391C8.36049 5.81697 8.25669 5.80034 8.46517 5.77432C7.52722 5.6256 7.00845 5.18525 6.75977 4.58984H7.89776C8.21063 4.59098 8.46398 4.84433 8.46517 5.1572Z"
                      fill="black"
                    ></path>
                    <path
                      opacity="0.2"
                      d="M8.15512 5.15726V5.77432C7.52722 5.6256 7.00845 5.18525 6.75977 4.58984H7.5877C7.90057 4.59104 8.15392 4.84439 8.15512 5.15726Z"
                      fill="black"
                    ></path>
                    <path
                      d="M1.90162 4.58984H7.58658C7.90046 4.58984 8.15495 4.84433 8.15495 5.15821V10.8432C8.15495 11.1571 7.90046 11.4115 7.58658 11.4115H1.90162C1.58774 11.4115 1.33325 11.1571 1.33325 10.8432V5.15821C1.33325 4.84433 1.58774 4.58984 1.90162 4.58984Z"
                      fill="url(#gradient-:rk:)"
                    ></path>
                    <path
                      d="M6.24018 6.75364H5.10374V9.84823H4.37971V6.75364H3.24854V6.15332H6.24018V6.75364Z"
                      fill="white"
                    ></path>
                  </g>
                  <defs>
                    <linearGradient
                      id="gradient-:rk:"
                      x1="2.51832"
                      y1="4.14573"
                      x2="6.96989"
                      y2="11.8557"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#5A62C3"></stop>
                      <stop offset="0.5" stopColor="#4D55BD"></stop>
                      <stop offset="1" stopColor="#3940AB"></stop>
                    </linearGradient>
                    <clipPath id="clip-:rk:">
                      <rect
                        width="13.3333"
                        height="12.4031"
                        fill="transparent"
                        transform="translate(1.33325 1.79883)"
                      ></rect>
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </div>
            {/* Phone */}
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#1d2d49] text-[#9bb4d1] border border-[#263956]">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
