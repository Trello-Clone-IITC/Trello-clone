import React from "react";
import { useCardModal } from "../hooks/useCardModal";
import CardModal from "./CardModal";
import type { Card as CardType } from "../../List/redux/listSlice";

interface CardProps {
  id: string;
  title: string;
  description?: string;
  listId: string;
  position: number;
  labels?: Array<{
    id: string;
    title: string;
    color: string;
  }>;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  listId,
  position,
  labels = [],
}) => {
  const { isOpen, cardId, cardTitle, openModal, closeModal } = useCardModal();

  const handleCardClick = () => {
    openModal(id, title);
  };

  const getLabelColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      green: "bg-[#4bce97] hover:bg-[#7ee2b8] text-[#1d2125]",
      pink: "bg-[#e774bb] hover:bg-[#f797d2] text-[#1d2125]",
      blue: "bg-[#579DFF] hover:bg-[#85b8ff] text-[#1d2125]",
      yellow: "bg-[#f5cd47] hover:bg-[#f7d96b] text-[#1d2125]",
      red: "bg-[#f87462] hover:bg-[#fa9a8b] text-[#1d2125]",
      orange: "bg-[#ff9f1a] hover:bg-[#ffb84d] text-[#1d2125]",
      purple: "bg-[#9f8fef] hover:bg-[#b5a9f3] text-[#1d2125]",
      gray: "bg-[#8fbc8f] hover:bg-[#a8d1a8] text-[#1d2125]",
    };
    return colorMap[color] || "bg-gray-400 hover:bg-gray-500 text-white";
  };

  return (
    <>
      <div
        className="bg-[#22272b] rounded-md shadow-sm border border-[#2d363c] cursor-pointer hover:shadow-md transition-shadow mb-2 overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Cover section */}
        <div className="bg-[#216e4e] h-8 w-full"></div>

        {/* Card content */}
        <div className="p-3">
          {/* Labels */}
          {labels.length > 0 && (
            <div className="flex items-center gap-1 mb-2 flex-wrap">
              {labels.map((label) => (
                <span
                  key={label.id}
                  className={`h-4 rounded-[3px] px-1.5 text-xs font-medium cursor-pointer overflow-hidden max-w-full min-w-[32px] leading-4 text-left text-ellipsis ${getLabelColorClass(
                    label.color
                  )}`}
                  title={label.title}
                >
                  {label.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-medium text-white mb-1 text-sm leading-tight">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      <CardModal
        open={isOpen && cardId === id}
        onOpenChange={closeModal}
        title={cardTitle}
      />
    </>
  );
};

export default Card;
