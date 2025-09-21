import type { BoardBackground } from "@ronmordo/contracts";

// Background image mappings
const backgroundImages: Record<BoardBackground, string> = {
  mountain: "/src/assets/background-1-hd.webp", // Mountain landscape
  valley: "/src/assets/background-2-hd.webp", // Valley/landscape
  tree: "/src/assets/background-3-hd.webp", // Tree/forest
  snow: "/src/assets/background-4-hd.webp", // Snowy landscape
};

export const getBackgroundPreviewUrl = (
  background: BoardBackground
): string | null => {
  const backgroundImageUrl = backgroundImages[background];
  return backgroundImageUrl || null;
};
