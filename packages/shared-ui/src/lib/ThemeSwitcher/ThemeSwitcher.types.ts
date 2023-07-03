import { TThemeType } from "@emrgo-frontend/types";

export interface IThemeSwitcherProps {
  /** Theme type */
  theme?: TThemeType;
  /** Callback fired when theme type changes */
  onToggle?: () => void;
  /** The variant to use */
  variant?: TThemeSwitchVariant;
}

export type TThemeSwitchVariant = "standard" | "compact";
