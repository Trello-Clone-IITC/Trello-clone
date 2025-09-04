import React from "react";
// import { useList } from "../hooks/useList";
import ListHeader from "./ListHeader";
import ListCards from "./ListCards";
import ListFooter from "./ListFooter";
import type { Card as CardType } from "../redux/listSlice";

interface ListProps {
  id: string;
  title: string;
  cards?: CardType[];
}

const List: React.FC<ListProps> = ({ id, title, cards = [] }) => {
  const { isEditing, startEditing, stopEditing, updateTitle } = useList(id);

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
