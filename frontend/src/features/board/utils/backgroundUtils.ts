import type { BoardBackground } from "@ronmordo/contracts";

// Background image mappings
const backgroundImages: Record<BoardBackground, string> = {
  snow: "/images/background-1-hd.webp",
  tree: "/images/background-2-hd.webp",
  valley: "/images/background-3-hd.webp",
  mountain: "/images/background-4-hd.webp",
};

export const getBoardBackgroundStyle = (
  background: BoardBackground,
  theme: "light" | "dark" | "system"
) => {
  const getMainBackgroundColor = () => {
    if (theme === "light") return "#ffffff";
    return "#1f1f21";
  };

  if (!background) {
    return {
      backgroundColor: getMainBackgroundColor(),
    };
  }

  // Get the background image URL
  const backgroundImageUrl = backgroundImages[background];

  if (backgroundImageUrl) {
    return {
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
    };
  }

  // Default fallback
  return {
    backgroundColor: getMainBackgroundColor(),
  };
};

export const getBackgroundPreviewUrl = (
  background: BoardBackground
): string | null => {
  const backgroundImageUrl = backgroundImages[background];
  return backgroundImageUrl || null;
};

// Determine the appropriate icon color based on background
export const getIconColor = (
  background: BoardBackground | undefined,
  theme: "light" | "dark" | "system"
): string => {
  // If no background, use theme to determine
  if (!background) {
    return theme === "light" ? "#172b4d" : "#ffffff";
  }

  // Define which backgrounds should use dark icons (light backgrounds)
  const lightBackgrounds: BoardBackground[] = [
    "mountain",
    "valley",
    "tree",
    "snow",
  ];

  // Return dark color for light backgrounds, white for dark backgrounds
  return lightBackgrounds.includes(background) ? "#172b4d" : "#ffffff";
};
