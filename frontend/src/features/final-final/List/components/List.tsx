import { useList } from "../hooks/useList";
import ListHeader from "./ListHeader";
import ListCards from "./ListCards";
import ListFooter, { type ListFooterRef } from "./ListFooter";
import type { ListDto } from "@ronmordo/contracts";
import { useCards } from "@/features/final-final/List/hooks/useListQueries";
import Spinner from "@/features/final-final/board/components/Spinner";
import { useRef } from "react";

const List = ({ list }: { list: ListDto }) => {
  const { isEditing, startEditing, stopEditing, updateTitle } = useList(
    list.id,
    list.boardId
  );
  const { data: cards, isLoading, error } = useCards(list.boardId, list.id);
  const listFooterRef = useRef<ListFooterRef>(null);
  // Caspi Changed
  return (
    <li
      className={`flex-shrink-0 self-start py-0 px-1.5 h-fit whitespace-nowrap bg-[#101204] rounded-[12px]`}
      data-testid="list-wrapper"
      data-list-id={list.id}
    >
      <div
        className={`flex flex-col relative self-start justify-between w-[272px]  max-h-[75vh] pb-1 rounded-[12px] shadow-sm whitespace-normal scroll-m-[8px]`}
        data-testid="list"
      >
        <ListHeader
          list={list}
          boardId={list.boardId}
          nextPosition={
            (cards?.reduce((max, c) => Math.max(max, c.position ?? 0), 0) ??
              0) + 1000
          }
          isEditing={isEditing}
          onStartEditing={startEditing}
          onStopEditing={stopEditing}
          onUpdateTitle={updateTitle}
          listFooterRef={listFooterRef}
        />

        {/* Cards area with proper scrolling */}
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
          <ol
            className="flex z-1 grow shrink basis-auto flex-col my-0 mx-1 p-1 overflow-x-hidden overflow-y-auto list-none "
            data-testid="list-cards"
          />
        ) : (
          <ListCards cards={cards} boardId={list.boardId} />
        )}

        <ListFooter
          ref={listFooterRef}
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
