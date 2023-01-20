import { createTheme } from '@mui/material'

export const theme: { light: ThemeType; dark: ThemeType } = {
  light: createTheme({
    bg: '#FFFFFF',
    lightBg: '#FFFFFF',
    blue: '#2595FF',
    darkBlue: '#4f81a3',
    grey: '#CDD5DE',
    darkGrey: '#616C76',
    text: '#0E1114',
    green: `#1D9745`,
  }),

  dark: createTheme({
    bg: '#181C20',
    lightBg: '#21262B',
    blue: '#2595FF',
    darkBlue: '#4f81a3',
    grey: '#4A545C',
    darkGrey: '#616C76',
    text: '#EEF1F4',
    green: `#1D9745`,
  }),
}

export type ThemeType = {
  bg: string
  lightBg: string
  blue: string
  darkBlue: string
  darkGrey: string
  grey: string
  green: string
  text: string
}

//including the custom theme type for mui
declare module '@mui/material/styles/index' {
  interface Theme extends ThemeType {}
  // allow configuration using `createTheme`
  interface ThemeOptions extends ThemeType {}
}

//including the custom theme type for emotion
declare module '@emotion/react/types/index' {
  interface Theme extends ThemeType {}
  // allow configuration using `createTheme`
  interface ThemeOptions extends ThemeType {}
}
