import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColor {
    gradient?: string;
  }

  interface SimplePaletteColorOptions {
    gradient?: string;
  }

  interface Palette {
    sidebar: {
      main: string;
      gradient?: string;
    };
    navbar: {
      main: string;
      gradient?: string;
    };
    gray: Palette["primary"];
  }

  interface PaletteOptions {
    sidebar?: {
      main?: string;
      gradient?: string;
    };
    navbar?: {
      main?: string;
      gradient?: string;
    };
    gray: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    gray: true;
  }
}
