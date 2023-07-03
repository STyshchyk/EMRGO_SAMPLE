/**
 * Force dark theme to have the same shape as light theme
 */

import { lightTheme } from "@emrgo-frontend/theme";

export type TTheme = typeof lightTheme;
export type TThemeType = "light" | "dark";
