import React, { useCallback, useState } from "react";
import ListHeader from "./ListHeader";
import ListCards from "./ListCards";
import ListFooter from "./ListFooter";
import type { Card as CardType } from "../redux/listSlice";
import { emitUpdateList } from "../../../socket";

interface ListProps {
  id: string;
  title: string;
  cards?: CardType[];
  boardId: string;
}

const List: React.FC<ListProps> = ({ id, title, cards = [], boardId }) => {
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = useCallback(() => setIsEditing(true), []);
  const stopEditing = useCallback(() => setIsEditing(false), []);
  const updateTitle = useCallback(
    (newTitle: string) => {
      const trimmed = newTitle.trim();
      if (!trimmed || trimmed === title) return;
      emitUpdateList(boardId, id, { name: trimmed });
    },
    [boardId, id, title]
  );

  return (
    <li
      className="bg-[#101204] rounded-lg p-3 w-80 flex-shrink-0 h-fit max-h-[calc(100vh-2rem)]"
      data-testid="list-wrapper"
      data-list-id={id}
    >
      <div className="flex flex-col h-full" data-testid="list">
        <ListHeader
          id={id}
          title={title}
          isEditing={isEditing}
          onStartEditing={startEditing}
          onStopEditing={stopEditing}
          onUpdateTitle={updateTitle}
        />

        <ListCards listId={id} cards={cards} />

        <ListFooter listId={id} />
      </div>
    </li>
  );
};

export default List;
