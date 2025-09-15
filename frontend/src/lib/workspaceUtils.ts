/**
 * Utility functions for workspace display properties
 */

// Color gradients for workspace icons
export const WORKSPACE_COLORS = [
  "bg-gradient-to-b from-blue-300 to-blue-200",
  "bg-gradient-to-b from-green-300 to-green-200",
  "bg-gradient-to-b from-purple-300 to-purple-200",
  "bg-gradient-to-b from-red-300 to-red-200",
  "bg-gradient-to-b from-yellow-300 to-yellow-200",
  "bg-gradient-to-b from-indigo-300 to-indigo-200",
  "bg-gradient-to-b from-pink-300 to-pink-200",
  "bg-gradient-to-b from-orange-300 to-orange-200",
] as const;

/**
 * Gets workspace display properties including initial letter and color
 * @param name - The workspace name
 * @param index - The index of the workspace (used for color selection)
 * @param isLight - Whether the current theme is light mode
 * @returns Object containing initial letter and color class
 */
export const getWorkspaceDisplayProps = (
  name: string,
  index: number,
  isLight: boolean
) => {
  const initial = name.charAt(0).toUpperCase();
  const textColor = isLight ? "!text-[#1f1f21]" : "!text-white";
  const color = `${
    WORKSPACE_COLORS[index % WORKSPACE_COLORS.length]
  } ${textColor}`;

  return {
    initial,
    color,
  };
};

/**
 * Gets just the color class for a workspace icon
 * @param index - The index of the workspace
 * @param isLight - Whether the current theme is light mode
 * @returns Color class string
 */
export const getWorkspaceColor = (index: number, isLight: boolean) => {
  const textColor = isLight ? "!text-[#1f1f21]" : "!text-white";
  return `${WORKSPACE_COLORS[index % WORKSPACE_COLORS.length]} ${textColor}`;
};

/**
 * Gets the initial letter of a workspace name
 * @param name - The workspace name
 * @returns Uppercase initial letter
 */
export const getWorkspaceInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};
