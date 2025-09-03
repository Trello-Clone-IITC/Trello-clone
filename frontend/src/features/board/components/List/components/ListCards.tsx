import React from "react";
import Card from "../../card/components/Card";
import type { Card as CardType } from "../redux/listSlice";

interface ListCardsProps {
  listId: string;
  cards: CardType[];
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
