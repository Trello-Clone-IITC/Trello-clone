import { useList } from "../hooks/useList";
import ListHeader from "./ListHeader";
import ListCards from "./ListCards";
import ListFooter, { type ListFooterRef } from "./ListFooter";
import type { ListDto } from "@ronmordo/contracts";
import { useCards } from "@/features/caspi-playground/List/hooks/useListQueries";
import Spinner from "@/features/caspi-playground/board/components/Spinner";
import { useRef } from "react";

const List = ({ list }: { list: ListDto }) => {
  const { isEditing, startEditing, stopEditing, updateTitle } = useList(
    list.id,
    list.boardId
  );
  const { data: cards, isLoading, error } = useCards(list.boardId, list.id);
  const listFooterRef = useRef<ListFooterRef>(null);

  return (
    <li
      className={`bg-[#101204] rounded-lg p-1.5 self-start flex-shrink-0 list-none w-[272px]`}
      data-testid="list-wrapper"
      data-list-id={list.id}
    >
      <div
        className={`flex flex-col h-full max-h-[80vh] pb-1 rounded-[12px] shadow-[0px_1px_1px_#091e4240,0px_0px_1px_#091e424f] `}
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
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-smooth touch-pan-y list-scrollbar">
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
        </div>

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
