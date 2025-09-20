import { useList } from "../hooks/useList";
import ListHeader from "./ListHeader";
import ListCards from "./ListCards";
import ListFooter from "./ListFooter";
import type { ListDto } from "@ronmordo/contracts";
import { useCards } from "@/features/caspi-playground/List/hooks/useListQueries";
import Spinner from "@/features/caspi-playground/board/components/Spinner";

const List = ({ list }: { list: ListDto }) => {
  const { isEditing, startEditing, stopEditing, updateTitle } = useList(
    list.id,
    list.boardId
  );
  const { data: cards, isLoading, error } = useCards(list.boardId, list.id);

  const hasCards = cards && cards.length > 0;
  const listHeightClass = hasCards
    ? "h-full max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)]"
    : "h-fit";

  return (
    <li
      className={`bg-[#101204] rounded-lg p-3 w-72 flex-shrink-0 list-none ${listHeightClass}`}
      data-testid="list-wrapper"
      data-list-id={list.id}
    >
      <div className="flex flex-col h-full min-h-0" data-testid="list">
        <ListHeader
          list={list}
          isEditing={isEditing}
          onStartEditing={startEditing}
          onStopEditing={stopEditing}
          onUpdateTitle={updateTitle}
        />

        {/* Cards area with proper scrolling */}
        <div
          className={`${
            hasCards ? "flex-1 min-h-0" : "flex-shrink-0"
          } overflow-y-auto overflow-x-hidden scroll-smooth touch-pan-y list-scrollbar`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Spinner label="Loading cards..." size={20} />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center">
              <div className="text-red-400 text-sm py-2">
                Failed to load cards
              </div>
            </div>
          ) : !cards || cards.length === 0 ? (
            <ol className="space-y-2 p-1" data-testid="list-cards" />
          ) : (
            <ListCards cards={cards} boardId={list.boardId} />
          )}
        </div>

        <ListFooter
          listId={list.id}
          boardId={list.boardId}
          nextPosition={
            (cards?.reduce((max, c) => Math.max(max, c.position ?? 0), 0) ??
              0) + 1000
          }
        />
      </div>
    </li>
  );
};

export default List;
