import React from "react";
import { useCardModal } from "../hooks/useCardModal";
import {
  getLabelColorClass,
  getLabelHoverColorClass,
} from "@/shared/constants";

// Simplified label type that matches what CardDto provides
interface CardLabel {
  color: string;
  name?: string | null;
}

interface CardProps {
  id: string;
  title: string;
  description?: string | null;
  labels?: CardLabel[];
}

const Card: React.FC<CardProps> = ({ id, title, description, labels = [] }) => {
  const { openModal } = useCardModal();

  const handleCardClick = () => {
    openModal(id, title);
  };

  const getLabelClassName = (color: string) => {
    const bgClass = getLabelColorClass(color);
    const hoverClass = getLabelHoverColorClass(color);
    return `${bgClass} ${hoverClass} text-[#1d2125]`;
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
              {labels.map((label, index) => (
                <span
                  key={label.name || `label-${index}`}
                  className={`h-4 rounded-[3px] px-1.5 text-xs font-medium cursor-pointer overflow-hidden max-w-full min-w-[32px] leading-4 text-left text-ellipsis transition-opacity ${getLabelClassName(
                    label.color
                  )}`}
                  title={label.name || ""}
                >
                  {label.name || ""}
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
    </>
  );
};

export default Card;
