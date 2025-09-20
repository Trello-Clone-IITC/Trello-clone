import Card from "@/features/final-aiman/card/components/Card";
import type { CardDto } from "@ronmordo/contracts";



const ListCards = ({ cards, boardId }:{cards: CardDto[]; boardId: string}) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <ol className="space-y-2" data-testid="list-cards">
        {cards.map((card) => (
          <li key={card.id} className="list-none" data-testid="list-card">
            <div data-testid="list-card-wrapper">
              <Card key={card.id} card={card} boardId={boardId} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ListCards;
