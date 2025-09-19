# Label Colors Utility

This utility provides a mapping of all label color names to their corresponding hex values.

## Usage

```typescript
import {
  getLabelColor,
  LABEL_COLORS,
  isValidLabelColor,
} from "@/shared/constants";

// Get a specific color
const greenColor = getLabelColor("green"); // Returns '#216e4e'
const boldRedColor = getLabelColor("bold_red"); // Returns '#f87168'

// Check if a color is valid
if (isValidLabelColor("subtle_blue")) {
  console.log("Valid color!");
}

// Access all colors directly
const allColors = LABEL_COLORS;
const specificColor = LABEL_COLORS.bold_purple; // Returns '#c97cf4'
```

## Available Colors

### Subtle Colors

- `subtle_green`, `subtle_yellow`, `subtle_orange`, `subtle_red`, `subtle_purple`
- `subtle_blue`, `subtle_sky`, `subtle_lime`, `subtle_pink`, `subtle_black`

### Regular Colors

- `green`, `yellow`, `orange`, `red`, `purple`
- `blue`, `sky`, `lime`, `pink`, `black`

### Bold Colors

- `bold_green`, `bold_yellow`, `bold_orange`, `bold_red`, `bold_purple`
- `bold_blue`, `bold_sky`, `bold_lime`, `bold_pink`, `bold_black`

### Default

- `default` - Fallback color for unknown color names
