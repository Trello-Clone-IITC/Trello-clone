

// function useDragScroll(ref: React.RefObject<HTMLElement>) {
//     const el = ref.current;
//     if (!el) return;

//     let dragging = false;
//     let startX = 0;
//     let startScrollLeft = 0;
//     let rafId: number | null = null;
//     let pendingScrollLeft: number | null = null;

//     const setDragging = (v: boolean) => {
//       dragging = v;
//       el.classList.toggle("dragging", v);
//       el.style.scrollBehavior = v ? "auto" : "smooth";
//       // Disable text selection globally while dragging
//       (document.body.style as any).userSelect = v ? "none" : "";
//     };

//     const applyScroll = () => {
//       if (pendingScrollLeft == null) return;
//       el.scrollLeft = pendingScrollLeft;
//       rafId = null;
//     };

//     const onPointerDown = (e: PointerEvent) => {
//       // Only left button for mouse; pointerType touch/pen are fine (button==0)
//       if (e.pointerType === "mouse" && e.button !== 0) return;
//       startX = e.clientX;
//       startScrollLeft = el.scrollLeft;
//       setDragging(true);
//       // Prevent default drag (images/text)
//       e.preventDefault();
//       // Listen on window to keep updates even when pointer leaves the element
//       window.addEventListener("pointermove", onPointerMove, { passive: false });
//       window.addEventListener("pointerup", onPointerUp, { passive: false });
//       window.addEventListener("pointercancel", onPointerUp, { passive: false });
//     };

//     const onPointerMove = (e: PointerEvent) => {
//       if (!dragging) return;
//       // Prevent browser gestures/selection
//       e.preventDefault();
//       const dx = e.clientX - startX;
//       pendingScrollLeft = startScrollLeft - dx;
//       if (rafId == null) {
//         rafId = requestAnimationFrame(applyScroll);
//       }
//     };

//     const onPointerUp = () => {
//       if (!dragging) return;
//       setDragging(false);
//       // Cleanup listeners & rAF
//       window.removeEventListener("pointermove", onPointerMove);
//       window.removeEventListener("pointerup", onPointerUp);
//       window.removeEventListener("pointercancel", onPointerUp);
//       if (rafId != null) cancelAnimationFrame(rafId);
//       rafId = null;
//       pendingScrollLeft = null;
//     };

//     el.addEventListener("pointerdown", onPointerDown, { passive: false });

//     return () => {
//       el.removeEventListener("pointerdown", onPointerDown);
//       window.removeEventListener("pointermove", onPointerMove);
//       window.removeEventListener("pointerup", onPointerUp);
//       window.removeEventListener("pointercancel", onPointerUp);
//       if (rafId != null) cancelAnimationFrame(rafId);
//     };
// }
// export { useDragScroll };




import { useEffect } from "react";

type Options = {
  blockSelector?: string;  // elements that should NOT start drag-scroll
  button?: number;         // mouse button (0 = left)
  requireModifier?: "shift" | "alt" | "ctrlOrMeta" | null; // optional
};

const DEFAULT_BLOCK =
  'button,a,input,textarea,select,[contenteditable],[draggable="true"],[data-dnd-item],[data-dnd-handle],.dnd-handle';

export function useDragScroll(
  ref: React.RefObject<HTMLElement>,
  opts: Options = {}
) {
  const { blockSelector = DEFAULT_BLOCK, button = 0, requireModifier = null } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let rafId: number | null = null;
    let pendingScrollLeft: number | null = null;

    const applyScroll = () => {
      if (pendingScrollLeft == null) return;
      el.scrollLeft = pendingScrollLeft;
      rafId = null;
    };

    const allowByModifier = (e: PointerEvent) => {
      if (!requireModifier) return true;
      if (requireModifier === "shift") return e.shiftKey;
      if (requireModifier === "alt") return e.altKey;
      if (requireModifier === "ctrlOrMeta") return e.ctrlKey || e.metaKey;
      return true;
    };

    const onPointerDown = (e: PointerEvent) => {
      // Only left mouse (touch/pen are button 0 too)
      if (e.pointerType === "mouse" && e.button !== button) return;
      if (!allowByModifier(e)) return;

      const target = e.target as HTMLElement | null;
      // Do NOT start drag-scroll if pointer started on draggable/handle/interactive
      if (target && (target.closest(blockSelector) || target.closest("[data-dnd]"))) return;

      // Only start when inside the scroller
      if (!el.contains(target)) return;

      dragging = true;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;

      // Make drag smooth but keep cursor NORMAL
      el.style.scrollBehavior = "auto";
      document.body.style.userSelect = "none";

      // Listen on window so we still get events when pointer leaves the element
      window.addEventListener("pointermove", onPointerMove, { passive: false });
      window.addEventListener("pointerup", onPointerUp, { passive: false });
      window.addEventListener("pointercancel", onPointerUp, { passive: false });

      e.preventDefault(); // stop image/text drag
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      const dx = e.clientX - startX;
      pendingScrollLeft = startScrollLeft - dx;
      if (rafId == null) rafId = requestAnimationFrame(applyScroll);
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;

      // restore
      el.style.scrollBehavior = "smooth";
      document.body.style.userSelect = "";

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = null;
      pendingScrollLeft = null;
    };

    el.addEventListener("pointerdown", onPointerDown, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [ref, blockSelector, button, requireModifier]);
}
