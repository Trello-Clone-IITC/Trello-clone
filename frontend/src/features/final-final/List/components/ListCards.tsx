import Card from "@/features/final-final/card/components/Card";
import type { CardDto } from "@ronmordo/contracts";
import { useAppContext } from "@/hooks/useAppContext";

const ListCards = ({
  cards,
  boardId,
}: {
  cards: CardDto[];
  boardId: string;
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
            <Card key={card.id} card={card} boardId={boardId} />
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ListCards;
