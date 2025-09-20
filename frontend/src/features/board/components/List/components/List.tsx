import React from "react";
import ListHeader from "./ListHeader";
import ListCards from "./ListCards";
import ListFooter from "./ListFooter";
import type { CardDto, ListDto } from "@ronmordo/contracts";

const List: React.FC<ListDto> = () => {
  return (
    <li className="bg-[#101204] rounded-lg p-3 w-80 flex-shrink-0 list-none h-fit max-h-[calc(100vh-2rem)]">
      <div className="flex flex-col h-full" data-testid="list">
        <ListHeader />

        <ListCards cards={cards} />

        <ListFooter listId={id} />
      </div>
    </li>
  );
};

export default List;
