import React from "react";
import { useCardModal } from "../hooks/useCardModal";

interface TestCardProps {
  id: string;
  title: string;
  description?: string;
}

const TestCard: React.FC<TestCardProps> = ({ id, title, description }) => {
  const { isOpen, cardId, openModal } = useCardModal();

  const handleCardClick = () => {
    openModal(id, title);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow mb-2"
      onClick={handleCardClick}
    >
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      )}
      <div className="text-xs text-gray-400 mt-2">
        Card ID: {id} | Modal Open: {isOpen ? "Yes" : "No"} | Active Card:{" "}
        {cardId || "None"}
      </div>
    </div>
  );
};

export default TestCard;
