import React from "react";
import Card from "../../card/components/Card";

interface ListCardsProps {
  listId: string;
  cards: Array<{
    id: string;
    title: string;
    description?: string;
    labels?: Array<{
      id: string;
      title: string;
      color: string;
    }>;
  }>;
}

const ListCards: React.FC<ListCardsProps> = ({ listId, cards }) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <ol className="space-y-2" data-testid="list-cards">
        {cards.map((card, index) => (
          <li key={card.id} className="list-none" data-testid="list-card">
            <div data-testid="list-card-wrapper">
              <Card
                id={card.id}
                title={card.title}
                description={card.description}
                listId={listId}
                position={index}
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
