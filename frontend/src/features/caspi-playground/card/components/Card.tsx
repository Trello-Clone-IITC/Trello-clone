import {
  getLabelColorClass,
  getLabelHoverColorClass,
} from "@/shared/constants";
import type { CardDto } from "@ronmordo/contracts";
import { CardStats } from "./CardStats";
import { useState } from "react";
import CardModal from "./CardModal";
import { Circle, CheckCircle2 } from "lucide-react";

type Props = { card: CardDto; boardId: string };

const Card: React.FC<Props> = ({ card, boardId }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleCardClick = () => setOpenModal(true);

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCompleted(!isCompleted);
    console.log("Mark card complete:", card.id, "Completed:", !isCompleted);
  };

  const getLabelClassName = (color: string) => {
    const bgClass = getLabelColorClass(color);
    const hoverClass = getLabelHoverColorClass(color);
    return `${bgClass} ${hoverClass} text-[#1d2125]`;
  };

  return (
    <>
      <div
        className="group relative bg-[#22272b] min-h-[36px] rounded-[8px] cursor-pointer shadow-[0px_1px_1px_#091e4240,_0px_0px_1px_#091e424f] hover:bg-[#2c2e33] transition-colors"
        onClick={handleCardClick}
      >
        <div className="bg-[#216e4e] h-9 overflow-hidden rounded-t-[8px]"></div>
        <div className="z-10 min-h-[24px] px-3 pt-2 pb-1">
          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {card.labels.map((label, index) => (
                <span
                  key={label.name || `label-${index}`}
                  className={`h-2 my-0 px-0 rounded-[4px] text-transparent text-xs font-medium cursor-pointer overflow-hidden max-w-[40px] min-w-[40px] leading-4 text-left text-ellipsis transition-opacity ${getLabelClassName(
                    label.color
                  )}`}
                  title={label.name || ""}
                ></span>
              ))}
            </div>
          )}

          {/* Title with completion circle */}
          <div className="relative">
            {/* Completion circle - appears on hover/focus next to title */}
            <span
              role="img"
              aria-label={`Mark this card complete (${card.title})`}
              className={`absolute left-0 top-0.5 transition-all duration-500 ease-out cursor-pointer rounded-full z-20 ${
                isCompleted
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-[#ffffff1a]"
              }`}
              onClick={handleComplete}
            >
              {isCompleted ? (
                <CheckCircle2
                  className="w-4 h-4  transition-all duration-300"
                  fill="#a5cd6b"
                  stroke="#242528"
                  strokeWidth="2"
                />
              ) : (
                <Circle
                  className="w-4 h-4 text-[#626F86] hover:text-[#ffffff] transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              )}
            </span>

            <h3
              className={`font-medium text-white mb-1 text-sm leading-tight transition-all duration-500 ease-out ${
                isCompleted
                  ? "ml-6"
                  : "group-hover:ml-6 group-focus-within:ml-8"
              }`}
            >
              {card.title}
            </h3>
          </div>

          <CardStats card={card} />

          {/* Member avatar - bottom right */}
          {card.cardAssignees && card.cardAssignees.length > 0 && (
            <div className="flex justify-end mt-2">
              <div className="flex -space-x-1">
                {card.cardAssignees.slice(0, 3).map((assignee, index) => (
                  <div
                    key={assignee.id}
                    className="relative"
                    title={assignee.fullName}
                  >
                    <img
                      src={assignee.avatarUrl}
                      alt={assignee.fullName}
                      className="w-6 h-6 rounded-full border-2 border-[#22272b] bg-[#dfe1e6] object-cover"
                    />
                    {index === 2 && card.cardAssignees.length > 3 && (
                      <div className="absolute inset-0 w-6 h-6 rounded-full border-2 border-[#22272b] bg-[#dfe1e6] flex items-center justify-center text-xs font-medium text-[#5e6c84]">
                        +{card.cardAssignees.length - 3}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {openModal && (
        <CardModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          boardId={boardId}
          card={card}
        />
      )}
    </>
  );
};

export default Card;
