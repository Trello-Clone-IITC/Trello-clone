import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setLists } from "./List/redux/listSlice";
import List from "./List/components/List";
import type { List as ListType } from "./List/redux/listSlice";
import { getCardsByListId } from "./card/data";
import CardModal from "./card/components/CardModal";

// Sample lists with realistic data
const sampleLists: ListType[] = [
  {
    id: "list-landing",
    title: "Landing Page",
    boardId: "board-1",
    position: 0,
    cards: getCardsByListId("list-landing"),
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "list-progress",
    title: "In Progress",
    boardId: "board-1",
    position: 1,
    cards: getCardsByListId("list-progress"),
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T09:00:00Z",
  },
  {
    id: "list-done",
    title: "Done",
    boardId: "board-1",
    position: 2,
    cards: getCardsByListId("list-done"),
    createdAt: "2024-01-14T09:00:00Z",
    updatedAt: "2024-01-14T09:00:00Z",
  },
  {
    id: "list-backlog",
    title: "Backlog",
    boardId: "board-1",
    position: 3,
    cards: getCardsByListId("list-backlog"),
    createdAt: "2024-01-17T09:00:00Z",
    updatedAt: "2024-01-17T09:00:00Z",
  },
];

const Board: React.FC = () => {
  const dispatch = useDispatch();
  const lists = useSelector((state: RootState) => state.list.lists);

  // Initialize with sample data if no lists exist
  React.useEffect(() => {
    if (lists.length === 0) {
      dispatch(setLists(sampleLists));
    }
  }, [dispatch, lists.length]);

  return (
    <div className="flex gap-4 p-4 overflow-x-auto min-h-screen bg-[#1d2125]">
      {lists.map((list) => (
        <List
          key={list.id}
          id={list.id}
          title={list.title}
          cards={list.cards}
        />
      ))}
      <CardModal />
    </div>
  );
};

export default Board;
