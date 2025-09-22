import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import type { ListDto } from "@ronmordo/contracts";
import { useQueryClient } from "@tanstack/react-query";
import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import BoardLists from "./Boardlists";
import { boardKeys } from "@/features/final-aiman/board/hooks";
import {
  emitCreateList,
  emitUpdateList,
} from "@/features/final-aiman/board/socket";

const listSpacing = 1000;

const getSortedLists = (items: ListDto[]) =>
  [...items].sort(
    (a, b) => (a.position ?? listSpacing) - (b.position ?? listSpacing)
  );

const haveSameOrder = (a: ListDto[], b: ListDto[]) =>
  a.length === b.length && a.every((item, index) => item.id === b[index]?.id);

const haveSameOrderAndPositions = (a: ListDto[], b: ListDto[]) =>
  a.length === b.length &&
  a.every(
    (item, index) =>
      item.id === b[index]?.id &&
      (item.position ?? 0) === (b[index]?.position ?? 0)
  );

type DragData = {
  itemType: "board-list";
  listId: string;
};

type DraggableBoardListsProps = {
  boardId: string;
  lists: ListDto[];
};

const isBoardListData = (
  data: Record<string, unknown>
): data is DragData =>
  data.itemType === "board-list" && typeof data.listId === "string";

const DraggableBoardLists = ({ boardId, lists }: DraggableBoardListsProps) => {
  const queryClient = useQueryClient();
  const [orderedLists, setOrderedLists] = useState<ListDto[]>([]);
  const orderedListsRef = useRef<ListDto[]>([]);
  const dragStateRef = useRef<{
    listId: string;
    startOrder: ListDto[];
  } | null>(null);
  const listsContainerRef = useRef<HTMLDivElement>(null);

  const [isCreatingList, setIsCreatingList] = useState(false);
  const [listName, setListName] = useState("");

  useEffect(() => {
    const sorted = getSortedLists(lists);

    setOrderedLists((prev) => {
      if (haveSameOrderAndPositions(prev, sorted)) {
        return prev;
      }
      return sorted;
    });
  }, [lists]);

  useEffect(() => {
    orderedListsRef.current = orderedLists;
  }, [orderedLists]);

  useEffect(() => {
    const el = listsContainerRef.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      getData: () => ({ itemType: "board-list-container" }),
    });
  }, []);

  const getDestinationIndex = useCallback(
    ({
      dropTargets,
      items,
      sourceId,
      input,
    }: {
      dropTargets: Array<{ data: Record<string | symbol, unknown>; element: Element }>;
      items: ListDto[];
      sourceId: string;
      input: { clientX: number };
    }) => {
      for (const record of dropTargets) {
        const data = record.data as Record<string, unknown>;
        if (data.itemType === "board-list") {
          const targetId = data.listId;
          if (typeof targetId !== "string" || targetId === sourceId) {
            continue;
          }

          const targetIndex = items.findIndex((list) => list.id === targetId);
          if (targetIndex === -1) {
            continue;
          }

          const rect = (record.element as HTMLElement).getBoundingClientRect();
          const isAfter = input.clientX > rect.left + rect.width / 2;
          return targetIndex + (isAfter ? 1 : 0);
        }

        if (data.itemType === "board-list-container") {
          const rect = (record.element as HTMLElement).getBoundingClientRect();
          const isAfter = input.clientX >= rect.left + rect.width / 2;
          return isAfter ? items.length : 0;
        }
      }

      return -1;
    },
    []
  );

  const persistReorder = useCallback(
    (nextOrder: ListDto[], previousOrder: ListDto[]) => {
      const updates: Array<{ id: string; position: number }> = [];
      const normalized = nextOrder.map((list, index) => {
        const expectedPosition = (index + 1) * listSpacing;
        if ((list.position ?? 0) !== expectedPosition) {
          updates.push({ id: list.id, position: expectedPosition });
          return { ...list, position: expectedPosition };
        }
        return list;
      });

      if (haveSameOrder(previousOrder, nextOrder) && updates.length === 0) {
        const fallback = previousOrder.slice();
        setOrderedLists(fallback);
        orderedListsRef.current = fallback;
        return;
      }

      setOrderedLists(normalized);
      orderedListsRef.current = normalized;

      queryClient.setQueryData<ListDto[] | undefined>(
        boardKeys.lists(boardId),
        normalized
      );

      updates.forEach(({ id, position }) => {
        emitUpdateList(boardId, id, { position });
      });
    },
    [boardId, queryClient]
  );

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => isBoardListData(source.data as Record<string, unknown>),
      onDragStart: ({ source }) => {
        const data = source.data as Record<string, unknown>;
        if (!isBoardListData(data)) return;

        dragStateRef.current = {
          listId: data.listId,
          startOrder: orderedListsRef.current.slice(),
        };
      },
      onDrag: ({ location, source }) => {
        const data = source.data as Record<string, unknown>;
        if (!isBoardListData(data)) return;

        const dropTargets = location.current.dropTargets;
        const input = location.current.input;

        setOrderedLists((prev) => {
          const startIndex = prev.findIndex((list) => list.id === data.listId);
          if (startIndex === -1) {
            return prev;
          }

          const finishIndex = getDestinationIndex({
            dropTargets,
            items: prev,
            sourceId: data.listId,
            input,
          });

          if (finishIndex === -1) {
            const fallback = dragStateRef.current?.startOrder ?? prev;
            return fallback === prev ? prev : fallback.slice();
          }

          if (finishIndex === startIndex) {
            return prev;
          }

          return reorder({ list: prev, startIndex, finishIndex });
        });
      },
      onDrop: ({ location, source }) => {
        const data = source.data as Record<string, unknown>;
        if (!isBoardListData(data)) {
          dragStateRef.current = null;
          return;
        }

        const dropTargets = location.current.dropTargets;
        const input = location.current.input;
        const currentOrder = orderedListsRef.current;
        const startOrder = dragStateRef.current?.startOrder ?? currentOrder;
        const startIndex = currentOrder.findIndex((list) => list.id === data.listId);

        if (startIndex === -1) {
          dragStateRef.current = null;
          return;
        }

        const finishIndex = getDestinationIndex({
          dropTargets,
          items: currentOrder,
          sourceId: data.listId,
          input,
        });

        if (finishIndex === -1) {
          const fallbackBase = dragStateRef.current?.startOrder ?? currentOrder;
          const fallback = fallbackBase.slice();
          setOrderedLists(fallback);
          orderedListsRef.current = fallback;
          dragStateRef.current = null;
          return;
        }

        const finalOrder = reorder({
          list: currentOrder,
          startIndex,
          finishIndex,
        });

        persistReorder(finalOrder, startOrder);
        dragStateRef.current = null;
      },
    });
  }, [getDestinationIndex, persistReorder]);

  const handleAddList = () => {
    setIsCreatingList(true);
  };

  const handleCancelCreateList = () => {
    setIsCreatingList(false);
    setListName("");
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    const name = listName.trim();
    if (!name) return;
    const nextPosition =
      (orderedLists.reduce(
        (max, l) => Math.max(max, l.position ?? 0),
        0
      ) || 0) +
      listSpacing;
    emitCreateList(boardId, name, nextPosition);
    setIsCreatingList(false);
    setListName("");
  };

  return (
    <div
      ref={listsContainerRef}
      className="flex gap-4 p-4 overflow-x-auto min-h-screen"
    >
      {orderedLists.map((list) => (
        <BoardLists key={list.id} list={list} />
      ))}

      <div className="min-w-[272px]">
        {isCreatingList ? (
          <form
            onSubmit={handleCreateList}
            className="bg-[#101204] hover:bg-[#101204] rounded-md p-2"
          >
            <Input
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Enter list name..."
              className="bg-white text-[#bfc1c4] placeholder:text-gray-500 mb-2"
              autoFocus
              onBlur={(e) => {
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (
                  !relatedTarget ||
                  !relatedTarget.closest('button[type="submit"]')
                ) {
                  handleCancelCreateList();
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={!listName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add list
              </Button>
              <Button
                type="button"
                onClick={handleCancelCreateList}
                className="text-[#bfc1c4] hover:bg-[#2a2c21] bg-transparent text-lg p-1.5 has-[>svg]:px-1.5 flex items-center justify-center cursor-pointer rounded-[3px] text-[14px]"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </form>
        ) : (
          <Button
            onClick={handleAddList}
            type="button"
            className="bg-[#ffffff3d] hover:bg-[#ffffff52] text-white px-3 py-2 rounded-md flex"
          >
            <Plus className="w-4 h-4" />
            Add a list
          </Button>
        )}
      </div>
    </div>
  );
};

export default DraggableBoardLists;
