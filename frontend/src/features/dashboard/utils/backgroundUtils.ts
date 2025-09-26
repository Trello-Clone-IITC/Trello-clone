import type { BoardBackground } from "@ronmordo/contracts";

// Background image mappings
const backgroundImages: Record<BoardBackground, string> = {
  mountain: "/images/background-1-hd.webp", // Mountain landscape
  valley: "/images/background-2-hd.webp", // Valley/landscape
  tree: "/images/background-3-hd.webp", // Tree/forest
  snow: "/images/background-4-hd.webp", // Snowy landscape
};

export const getBackgroundPreviewUrl = (
  background: BoardBackground
): string | null => {
  const backgroundImageUrl = backgroundImages[background];
  return backgroundImageUrl || null;
};
