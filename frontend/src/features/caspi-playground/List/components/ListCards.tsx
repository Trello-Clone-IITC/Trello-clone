import Card from "@/features/caspi-playground/card/components/Card";
import type { CardDto } from "@ronmordo/contracts";

const ListCards = ({
  cards,
  boardId,
}: {
  cards: CardDto[];
  boardId: string;
}) => {
  return (
    <ol className="space-y-2 p-1" data-testid="list-cards">
      {cards.map((card) => (
        <li key={card.id} className="list-none" data-testid="list-card">
          <div data-testid="list-card-wrapper">
            <Card key={card.id} card={card} boardId={boardId} />
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ListCards;
