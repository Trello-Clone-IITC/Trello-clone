import type { ListDto } from "@ronmordo/contracts";
import { List } from "../../List/components";
import { useEffect, useRef } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

type BoardListProbs = {
  list: ListDto;
};

export default function BoardLists({ list }: BoardListProbs) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
    });
  }, []);

  return (
    <div ref={ref}>
      <List key={list.id} list={list} />;
    </div>
  );
}
