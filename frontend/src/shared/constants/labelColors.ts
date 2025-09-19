/**
 * Label color mapping utility
 * Maps color names from the backend DTO to their corresponding hex values
 */

export const LABEL_COLORS = {
  // Subtle colors
  subtle_green: "#164b35",
  subtle_yellow: "#533f04",
  subtle_orange: "#693200",
  subtle_red: "#5d1f1a",
  subtle_purple: "#48245d",
  subtle_blue: "#123263",
  subtle_sky: "#164555",
  subtle_lime: "#37471f",
  subtle_pink: "#50253f",
  subtle_black: "#4b4d51",

  // Regular colors
  green: "#216e4e",
  yellow: "#7f5f01",
  orange: "#9e4c00",
  red: "#ae2e24",
  purple: "#803fa5",
  blue: "#1558bc",
  sky: "#206a83",
  lime: "#4c6b1f",
  pink: "#943d73",
  black: "#63666b",

  // Bold colors
  bold_green: "#4bce97",
  bold_yellow: "#ddb30e",
  bold_orange: "#fca700",
  bold_red: "#f87168",
  bold_purple: "#c97cf4",
  bold_blue: "#669df1",
  bold_sky: "#6cc3e0",
  bold_lime: "#94c748",
  bold_pink: "#e774bb",
  bold_black: "#96999e",

  // Default fallback
  default: "#8fbc8f",
} as const;

export type LabelColorName = keyof typeof LABEL_COLORS;

/**
 * Get the hex color value for a given color name
 * @param colorName - The color name from the backend DTO
 * @returns The corresponding hex color value or the default color if not found
 */
export const getLabelColor = (colorName: string): string => {
  return LABEL_COLORS[colorName as LabelColorName] || LABEL_COLORS.default;
};

/**
 * Check if a color name is valid
 * @param colorName - The color name to check
 * @returns True if the color name exists in the mapping
 */
export const isValidLabelColor = (
  colorName: string
): colorName is LabelColorName => {
  return colorName in LABEL_COLORS;
};

/**
 * Get all available color names
 * @returns Array of all available color names
 */
export const getAllLabelColorNames = (): LabelColorName[] => {
  return Object.keys(LABEL_COLORS) as LabelColorName[];
};

/**
 * Get all available color values
 * @returns Array of all available hex color values
 */
export const getAllLabelColorValues = (): string[] => {
  return Object.values(LABEL_COLORS);
};

/**
 * Get the Tailwind CSS class name for a given color name
 * @param colorName - The color name from the backend DTO
 * @returns The corresponding Tailwind class name
 */
export const getLabelColorClass = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    subtle_green: "bg-label-subtle-green",
    subtle_yellow: "bg-label-subtle-yellow",
    subtle_orange: "bg-label-subtle-orange",
    subtle_red: "bg-label-subtle-red",
    subtle_purple: "bg-label-subtle-purple",
    subtle_blue: "bg-label-subtle-blue",
    subtle_sky: "bg-label-subtle-sky",
    subtle_lime: "bg-label-subtle-lime",
    subtle_pink: "bg-label-subtle-pink",
    subtle_black: "bg-label-subtle-black",
    green: "bg-label-green",
    yellow: "bg-label-yellow",
    orange: "bg-label-orange",
    red: "bg-label-red",
    purple: "bg-label-purple",
    blue: "bg-label-blue",
    sky: "bg-label-sky",
    lime: "bg-label-lime",
    pink: "bg-label-pink",
    black: "bg-label-black",
    bold_green: "bg-label-bold-green",
    bold_yellow: "bg-label-bold-yellow",
    bold_orange: "bg-label-bold-orange",
    bold_red: "bg-label-bold-red",
    bold_purple: "bg-label-bold-purple",
    bold_blue: "bg-label-bold-blue",
    bold_sky: "bg-label-bold-sky",
    bold_lime: "bg-label-bold-lime",
    bold_pink: "bg-label-bold-pink",
    bold_black: "bg-label-bold-black",
  };

  return colorMap[colorName] || "bg-label-default";
};

/**
 * Get the Tailwind CSS hover class name for a given color name
 * @param colorName - The color name from the backend DTO
 * @returns The corresponding Tailwind hover class name
 */
export const getLabelHoverColorClass = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    subtle_green: "hover:bg-label-subtle-green/80",
    subtle_yellow: "hover:bg-label-subtle-yellow/80",
    subtle_orange: "hover:bg-label-subtle-orange/80",
    subtle_red: "hover:bg-label-subtle-red/80",
    subtle_purple: "hover:bg-label-subtle-purple/80",
    subtle_blue: "hover:bg-label-subtle-blue/80",
    subtle_sky: "hover:bg-label-subtle-sky/80",
    subtle_lime: "hover:bg-label-subtle-lime/80",
    subtle_pink: "hover:bg-label-subtle-pink/80",
    subtle_black: "hover:bg-label-subtle-black/80",
    green: "hover:bg-label-green/80",
    yellow: "hover:bg-label-yellow/80",
    orange: "hover:bg-label-orange/80",
    red: "hover:bg-label-red/80",
    purple: "hover:bg-label-purple/80",
    blue: "hover:bg-label-blue/80",
    sky: "hover:bg-label-sky/80",
    lime: "hover:bg-label-lime/80",
    pink: "hover:bg-label-pink/80",
    black: "hover:bg-label-black/80",
    bold_green: "hover:bg-label-bold-green/80",
    bold_yellow: "hover:bg-label-bold-yellow/80",
    bold_orange: "hover:bg-label-bold-orange/80",
    bold_red: "hover:bg-label-bold-red/80",
    bold_purple: "hover:bg-label-bold-purple/80",
    bold_blue: "hover:bg-label-bold-blue/80",
    bold_sky: "hover:bg-label-bold-sky/80",
    bold_lime: "hover:bg-label-bold-lime/80",
    bold_pink: "hover:bg-label-bold-pink/80",
    bold_black: "hover:bg-label-bold-black/80",
  };

  return colorMap[colorName] || "hover:bg-label-default/80";
};
