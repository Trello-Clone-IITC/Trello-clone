import { useList } from "../hooks/useList";
import ListHeader from "./ListHeader";
import ListCards from "./ListCards";
import ListFooter, { type ListFooterRef } from "./ListFooter";
import type {  ListDto } from "@ronmordo/contracts";
import { useCards } from "@/features/final-aiman/List/hooks/useListQueries";
import Spinner from "@/features/final-aiman/board/components/Spinner";
import { useRef } from "react";



const List= ({ list }:{list:ListDto}) => {
  const { isEditing, startEditing, stopEditing, updateTitle } = useList(list.id, list.boardId);
  const { data: cards, isLoading, error } = useCards(list.boardId, list.id);
    const listFooterRef = useRef<ListFooterRef>(null);
  const hasCards = cards && cards.length > 0;
  const listHeightClass = hasCards
    ? "h-full max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)]"
    : "h-fit";

  

//   return (
//     <li
//       className="bg-[#101204] rounded-lg p-3 w-80 flex-shrink-0 list-none h-fit max-h-[calc(100vh-2rem)]"
//       data-testid="list-wrapper"
//       data-list-id={list.id}
//     >
//       <div className="flex flex-col h-full" data-testid="list">
//         <ListHeader
//           id={list.id}
//           title={list.name}
//           isEditing={isEditing}
//           onStartEditing={startEditing}
//           onStopEditing={stopEditing}
//           onUpdateTitle={updateTitle}
//         />
//         {isLoading ? (
//           <div className="flex-1 min-h-0 flex items-center justify-center py-6">
//             <Spinner label="Loading cards..." size={20} />
//           </div>
//         ) : error ? (
//           <div className="text-red-400 text-sm py-2">Failed to load cards</div>
//         ) : !cards || cards.length === 0 ? (
//           <div className="flex-1 min-h-0">
//             <ol className="space-y-2" data-testid="list-cards" />
//           </div>
//         ) : (
//           <ListCards cards={cards} boardId={list.boardId} />
//         )}

//         <ListFooter
//           listId={list.id}
//           boardId={list.boardId}
//           nextPosition={
//             (cards?.reduce((max, c) => Math.max(max, c.position ?? 0), 0) ?? 0) +
//             1000
//           }
//         />
//       </div>
//     </li>
//   );
// };
  return (
    <li
      className={`bg-[#101204] rounded-lg p-1.5 self-start whitespace-nowrap flex-shrink-0 list-none ${listHeightClass}`}
      data-testid="list-wrapper"
      data-list-id={list.id}
    >
      <div
        className="flex flex-col h-full min-h-0 w-[272px] max-h-full justify-between self-start pb-1 rounded-[12px] shadow-[0px_1px_1px_#091e4240,0px_0px_1px_#091e424f] scroll-m-2"
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
