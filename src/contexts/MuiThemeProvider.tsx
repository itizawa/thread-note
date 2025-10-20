"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { TypographyTheme } from "./themes/TypographyTheme";

const theme = createTheme({
  palette: {
    mode: "light",
    text: {
      primary: "#404040",
      secondary: "#757575",
    },
    primary: {
      main: "#512da8",
      light: "#7357b9",
      dark: "#381f75",
    },
    secondary: {
      main: "#FFB300",
      light: "#ffc233",
      dark: "#b27d00",
      contrastText: "#fff",
    },
    background: {
      default: "#f7f7f7",
      paper: "#ffffff",
    },
    divider: "#e0e0e0",
    sidebar: {
      main: "#fefcff",
      gradient: "linear-gradient(135deg, #fefcff 0%, #f3e5f5 100%)",
    },
    navbar: {
      main: "#512da8",
      gradient: "linear-gradient(135deg, #512da8 0%, #381f75 100%)",
    },
  },
  typography: TypographyTheme,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
        },
      },
    },
  },
});

export function MuiThemeProvider({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
