import { getLabelColorClass, getLabelHoverColorClass } from "@/shared/constants";
import type { CardDto } from "@ronmordo/contracts";
import { CardStats } from "./CardStats";
import { useState } from "react";
import CardModal from "./CardModal";

type Props = { card: CardDto; boardId: string };

const Card: React.FC<Props> = ({ card, boardId }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleCardClick = () => setOpenModal(true);

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
        <div className="bg-[#216e4e] h-8 w-full"></div>
        <div className="p-3">
          {card.labels && card.labels.length > 0 && (
            <div className="flex items-center gap-1 mb-2 flex-wrap">
              {card.labels.map((label, index) => (
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

          <h3 className="font-medium text-white mb-1 text-sm leading-tight">
            {card.title}
          </h3>
          <CardStats card={card} />
        </div>
      </div>

      {openModal && (
        <CardModal open={openModal} onClose={() => setOpenModal(false)} boardId={boardId} card={card} />
      )}
    </>
  );
};

export default Card;
