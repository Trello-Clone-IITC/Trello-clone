import Card from "@/features/caspi-playground/card/components/Card";
import type { CardDto } from "@ronmordo/contracts";

const ListCards = ({
  cards,
  boardId,
  labelsExpanded,
  onLabelClick,
}: {
  cards: CardDto[];
  boardId: string;
  labelsExpanded: boolean;
  onLabelClick: () => void;
}) => {
  return (
    // Changed ol styling
    <ol
      className="flex z-1 flex-1 min-h-0 flex-col my-0 mx-1 p-1 overflow-x-hidden overflow-y-auto list-none gap-2 list-scrollbar"
      data-testid="list-cards"
    >
      {cards.map((card) => (
        <li
          key={card.id}
          className="flex flex-col gap-y-2 scroll-m-[80px]"
          data-testid="list-card"
        >
          <div data-testid="list-card-wrapper" className="rounded-[8px]">
            <Card
              key={card.id}
              card={card}
              boardId={boardId}
              labelsExpanded={labelsExpanded}
              onLabelClick={onLabelClick}
            />
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ListCards;
