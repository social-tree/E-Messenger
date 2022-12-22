import { createTheme } from "@mui/material";

export const theme: { light: ThemeType; dark: ThemeType } = {
  light: createTheme({
    bg: "#FFFFFF",
    lightBg: "",
    blue: "#2595FF",
    grey: "#CDD5DE",
    text: "#0E1114",
  }),

  dark: createTheme({
    bg: "#181C20",
    lightBg: "#21262B",
    blue: "#2595FF",
    grey: "#CDD5DE",
    text: "#EEF1F4",
  }),
};

export type ThemeType = {
  bg: string;
  lightBg: string;
  blue: string;
  grey: string;
  text: string;
};

declare module "@mui/material/styles" {
  interface Theme extends ThemeType {}
  // allow configuration using `createTheme`
  interface ThemeOptions extends ThemeType {}
}
