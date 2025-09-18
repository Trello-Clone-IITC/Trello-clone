/**
 * Utility functions for generating dynamic favicons based on board data
 */

export interface BoardData {
  name: string;
  background?: string;
}

/**
 * Generates a dynamic favicon based on board background
 * @param boardData - The board data containing background information
 * @returns Promise that resolves when favicon is updated
 */
export const generateBoardFavicon = (boardData: BoardData): Promise<void> => {
  return new Promise((resolve) => {
    // Remove existing favicon
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
      existingFavicon.remove();
    }

    const getFillColor = () => {
      if (!boardData.background) {
        return "#0055cc"; // Darker Trello blue
      }

      // Check if it's a color (hex or rgb)
      if (
        boardData.background.startsWith("#") ||
        boardData.background.startsWith("rgb")
      ) {
        return boardData.background;
      }

      // For image backgrounds, use a default color or extract dominant color
      return "#0055cc";
    };

    // Create canvas to generate favicon with boards-icon structure
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 32;
    canvas.height = 32;

    if (!ctx) {
      resolve();
      return;
    }

    const drawFavicon = (backgroundImage?: HTMLImageElement) => {
      // Clear canvas
      ctx.clearRect(0, 0, 32, 32);

      // Create rounded clipping path for the entire favicon
      ctx.beginPath();
      ctx.roundRect(0, 0, 32, 32, 10);
      ctx.clip();

      // Draw background
      if (backgroundImage) {
        // Draw the background image scaled to fit the canvas
        ctx.drawImage(backgroundImage, 0, 0, 32, 32);
      } else {
        // Draw solid color background
        ctx.fillStyle = getFillColor();
        ctx.fillRect(0, 0, 32, 32);
      }

      // Draw the boards icon structure exactly like boards-icon-dark.svg
      // Scale from 24x24 to 32x32 (scale factor: 32/24 = 1.33)
      const scale = 32 / 24;

      // Outer rounded rectangle (the board outline)
      ctx.fillStyle = backgroundImage ? "rgba(0, 0, 0, 0.1)" : "transparent";
      ctx.strokeStyle = backgroundImage
        ? "rgba(255, 255, 255, 0.3)"
        : "transparent";
      ctx.lineWidth = 1;

      // Rounded rectangle: x=3*scale, y=5*scale, width=18*scale, height=14*scale, radius=4*scale
      const x = 3 * scale;
      const y = 5 * scale;
      const width = 18 * scale;
      const height = 14 * scale;
      const radius = 4 * scale;

      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
      if (backgroundImage) {
        ctx.fill();
        ctx.stroke();
      }

      // White pipes (inner rectangles) with rounded corners
      ctx.fillStyle = "white";

      // Left pipe with rounded corners (medium height)
      ctx.beginPath();
      ctx.roundRect(5 * scale, 5 * scale, 6 * scale, 13 * scale, 2 * scale);
      ctx.fill();

      // Right pipe with rounded corners
      ctx.beginPath();
      ctx.roundRect(13 * scale, 5 * scale, 6 * scale, 8 * scale, 2 * scale);
      ctx.fill();

      // Convert canvas to data URL
      const dataURL = canvas.toDataURL("image/png");

      // Create new favicon link
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.href = dataURL;
      document.head.appendChild(link);

      resolve();
    };

    // Check if background is an image
    if (
      boardData.background &&
      (boardData.background.startsWith("http") ||
        boardData.background.startsWith("/"))
    ) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => drawFavicon(img);
      img.onerror = () => drawFavicon(); // Fallback to solid color
      img.src = boardData.background;
    } else {
      // Solid color background
      drawFavicon();
    }
  });
};

/**
 * Updates the page title based on board data
 * @param boardData - The board data containing name information
 */
export const updatePageTitle = (boardData: BoardData): void => {
  document.title = `${boardData.name} | Trello`;
};

/**
 * Resets the page title to default
 */
export const resetPageTitle = (): void => {
  document.title = "Trello";
};
