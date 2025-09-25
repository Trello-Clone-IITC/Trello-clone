import { useState, useEffect, createContext } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type AppProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  labelsExpanded: boolean;
  setLabelsExpanded: (expanded: boolean) => void;
  toggleLabelsExpanded: () => void;
  navbarBorderHidden: boolean;
  setNavbarBorderHidden: (hidden: boolean) => void;
};

const initialState: AppProviderState = {
  theme: "system",
  setTheme: () => null,
  labelsExpanded: false,
  setLabelsExpanded: () => null,
  toggleLabelsExpanded: () => null,
  navbarBorderHidden: false,
  setNavbarBorderHidden: () => null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const AppProviderContext = createContext<AppProviderState>(initialState);

export function AppProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [labelsExpanded, setLabelsExpanded] = useState(false);
  const [navbarBorderHidden, setNavbarBorderHidden] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const toggleLabelsExpanded = () => {
    setLabelsExpanded(!labelsExpanded);
  };

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    labelsExpanded,
    setLabelsExpanded,
    toggleLabelsExpanded,
    navbarBorderHidden,
    setNavbarBorderHidden,
  };

  return (
    <AppProviderContext.Provider {...props} value={value}>
      {children}
    </AppProviderContext.Provider>
  );
}

// Keep the old ThemeProvider for backward compatibility
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  return (
    <AppProvider defaultTheme={defaultTheme} storageKey={storageKey} {...props}>
      {children}
    </AppProvider>
  );
}
