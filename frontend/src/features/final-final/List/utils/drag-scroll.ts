import { useEffect, useRef } from "react";

type DragScrollOptions = {
  blockSelector?: string;
};

// Simple drag-to-scroll utility for horizontal lanes
export function useDragScroll(
  ref: React.RefObject<HTMLElement>,
  options: DragScrollOptions = {}
) {
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const blockSelector =
      options.blockSelector ||
      'button,a,input,textarea,select,[contenteditable],[draggable="true"],[data-dnd-item],[data-dnd-handle],.dnd-handle';

    let prevScrollBehavior: string | null = null;

    const onMouseDown = (e: MouseEvent) => {
      // Ignore when starting drag over interactive elements
      const target = e.target as HTMLElement;
      if (target.closest(blockSelector)) return;
      isDownRef.current = true;
      // Force immediate scroll changes (no smoothing)
      prevScrollBehavior = (el.style as any).scrollBehavior ?? null;
      (el.style as any).scrollBehavior = "auto";
      startXRef.current = e.pageX - el.offsetLeft;
      scrollLeftRef.current = el.scrollLeft;
    };

    const onMouseLeave = () => {
      isDownRef.current = false;
      if (prevScrollBehavior !== null)
        (el.style as any).scrollBehavior = prevScrollBehavior;
    };

    const onMouseUp = () => {
      isDownRef.current = false;
      if (prevScrollBehavior !== null)
        (el.style as any).scrollBehavior = prevScrollBehavior;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDownRef.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startXRef.current) * 1; // scroll-fastness
      el.scrollLeft = scrollLeftRef.current - walk;
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, [ref, options.blockSelector]);
}
