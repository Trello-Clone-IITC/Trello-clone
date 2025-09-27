import type { BoardBackground } from "@ronmordo/contracts";

// Background image mappings
const backgroundImages: Record<BoardBackground, string> = {
  snow: "/images/background-1-hd.webp",
  tree: "/images/background-2-hd.webp",
  valley: "/images/background-3-hd.webp",
  mountain: "/images/background-4-hd.webp",
};

export const getBackgroundPreviewUrl = (
  background: BoardBackground
): string | null => {
  const backgroundImageUrl = backgroundImages[background];
  return backgroundImageUrl || null;
};
