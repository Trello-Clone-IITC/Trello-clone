import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import ListActions from "./ListActions";
import type { ListDto } from "@ronmordo/contracts";

interface ListHeaderProps {
  list: ListDto;
  isEditing: boolean;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onUpdateTitle: (newTitle: string) => void;
}

export default function ListHeader({
  list,
  isEditing,
  onStartEditing,
  onStopEditing,
  onUpdateTitle,
}: ListHeaderProps) {
  const [editTitle, setEditTitle] = useState(list.name);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditTitle(list.name);
  }, [list.name]);

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== list.name) {
      onUpdateTitle(editTitle.trim());
    }
    onStopEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setEditTitle(list.name);
      onStopEditing();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <div
      className="flex items-center justify-between mb-3"
      data-testid="list-header"
    >
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full h-8 py-1 px-2 rounded-[3px] border border-[#7e8188] bg-[#22272b] text-white text-sm font-semibold leading-tight resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-[#85b8ff] focus-visible:border"
            maxLength={512}
            spellCheck={false}
            data-testid="list-name-textarea"
            aria-label={list.name}
          />
        ) : (
          <h2
            className="text-sm font-semibold text-white leading-tight cursor-pointer"
            onClick={onStartEditing}
            data-testid="list-name"
            id={`list-${list.id}`}
          >
            {list.name}
          </h2>
        )}
      </div>

      <ListActions list={list}>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-300 hover:bg-white/20"
          data-testid="list-edit-menu-button"
          aria-label={`More actions on ${list.name}`}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </ListActions>
    </div>
  );
}
