import { useList } from "../hooks/useList";
import ListHeader from "./ListHeader";
import ListCards from "./ListCards";
import ListFooter from "./ListFooter";
import type {  ListDto } from "@ronmordo/contracts";
import { useCards } from "@/features/caspi-playground/List/hooks/useListQueries";
import Spinner from "@/features/caspi-playground/board/components/Spinner";



const List= ({ list }:{list:ListDto}) => {
  const { isEditing, startEditing, stopEditing, updateTitle } = useList(list.id);
  const { data: cards, isLoading, error } = useCards(list.boardId, list.id);

  

  return (
    <li
      className="bg-[#101204] rounded-lg p-3 w-80 flex-shrink-0 list-none h-fit max-h-[calc(100vh-2rem)]"
      data-testid="list-wrapper"
      data-list-id={list.id}
    >
      <div className="flex flex-col h-full" data-testid="list">
        <ListHeader
          id={list.id}
          title={list.name}
          isEditing={isEditing}
          onStartEditing={startEditing}
          onStopEditing={stopEditing}
          onUpdateTitle={updateTitle}
        />
        {isLoading ? (
          <div className="flex-1 min-h-0 flex items-center justify-center py-6">
            <Spinner label="Loading cards..." size={20} />
          </div>
        ) : error ? (
          <div className="text-red-400 text-sm py-2">Failed to load cards</div>
        ) : !cards || cards.length === 0 ? (
          <div className="flex-1 min-h-0">
            <ol className="space-y-2" data-testid="list-cards" />
          </div>
        ) : (
          <ListCards cards={cards} />
        )}

        <ListFooter listId={list.id} />
      </div>
    </li>
  );
};

export default List;
