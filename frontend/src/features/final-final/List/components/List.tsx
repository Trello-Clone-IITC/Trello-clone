import { useList } from "../hooks/useList";
import ListHeader from "./ListHeader";
import ListCards from "./ListCards";
import ListFooter, { type ListFooterRef } from "./ListFooter";
import type { ListDto } from "@ronmordo/contracts";
import { useCards } from "@/features/final-final/List/hooks/useListQueries";
import Spinner from "@/features/final-final/board/components/Spinner";
import { useRef, useEffect, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useCardDnd } from "../hooks/useCardDnd";

const List = ({
  list,
  hideCards = false,
}: {
  list: ListDto;
  hideCards?: boolean;
}) => {
  const { isEditing, startEditing, stopEditing, updateTitle } = useList(
    list.id,
    list.boardId
  );
  const { data: cards, isLoading, error } = useCards(list.boardId, list.id);
  const listFooterRef = useRef<ListFooterRef>(null);
  const listRef = useRef<HTMLLIElement>(null);
  const { handleDrop } = useCardDnd(list.boardId, list.id);
  const [isCardDragOver, setIsCardDragOver] = useState(false);

  // Add card drop target for the entire list
  useEffect(() => {
    const element = listRef.current;
    if (!element) return;

    const cleanup = dropTargetForElements({
      element,
      getData: () => ({
        type: "list-card-drop",
        listId: list.id,
      }),
      canDrop: ({ source }) =>
        source.data?.type === "card" || source.data?.type === "inbox-card",
      onDragEnter: () => {
        setIsCardDragOver(true);
      },
      onDragLeave: () => {
        setIsCardDragOver(false);
      },
      onDrop: ({ source }) => {
        const sourceCardId = source.data?.cardId as string;
        const sourceListId = source.data?.listId as string;
        const isInboxCard = source.data?.type === "inbox-card";

        // Only handle the drop if this is a cross-list move (different listId)
        // or if this is an inbox card, or if this list is empty (no cards)
        if (
          sourceCardId &&
          (sourceListId !== list.id ||
            isInboxCard ||
            !cards ||
            cards.length === 0)
        ) {
          handleDrop({
            sourceCardId,
            targetCardId: "empty",
            edge: "bottom",
            sourceListId: isInboxCard ? "inbox" : sourceListId,
          });
        }
        setIsCardDragOver(false);
      },
    });

    return cleanup;
  }, [list.id, handleDrop, cards]);

  // Caspi Changed
  return (
    <li
      ref={listRef}
      className={`flex-shrink-0 self-start py-0 px-1.5 h-fit whitespace-nowrap bg-[#101204] rounded-[12px] transition-all duration-200 ${
        isCardDragOver ? "ring-inset ring-2 ring-blue-400" : ""
      }`}
      data-testid="list-wrapper"
      data-list-id={list.id}
    >
      <div
        className={`flex flex-col relative self-start justify-between w-[272px]  max-h-[75vh] pb-1 rounded-[12px] shadow-sm whitespace-normal scroll-m-[8px] transition-all duration-200`}
        data-testid="list"
      >
        <ListHeader
          list={list}
          boardId={list.boardId}
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
        ) : hideCards ? (
          <div className="flex-1 min-h-[100px] flex items-center justify-center text-gray-500 text-sm">
            List (ghost)
          </div>
        ) : !cards || cards.length === 0 ? (
          <ol
            className="flex z-1 grow shrink basis-auto flex-col my-0 mx-1 p-1 overflow-x-hidden overflow-y-auto list-none "
            data-testid="list-cards"
          />
        ) : (
          <ListCards cards={cards} boardId={list.boardId} listId={list.id} />
        )}

        <ListFooter
          ref={listFooterRef}
          listId={list.id}
          boardId={list.boardId}
        />
      </div>
    </li>
  );
};

export default List;
