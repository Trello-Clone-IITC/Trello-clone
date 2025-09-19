import Card from "@/features/caspi-playground/card/components/Card";
import type { CardDto } from "@ronmordo/contracts";



const ListCards = ({ cards }:{cards: CardDto[]}) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <ol className="space-y-2" data-testid="list-cards">
        {cards.map((card) => (
          <li key={card.id} className="list-none" data-testid="list-card">
            <div data-testid="list-card-wrapper">
              <Card
                id={card.id}
                title={card.title}
                description={card.description}
                labels={card.labels}
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ListCards;
