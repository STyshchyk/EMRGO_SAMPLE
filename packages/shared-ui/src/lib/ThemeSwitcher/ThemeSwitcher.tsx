import { FC } from "react";

import { ReactComponent as MoonFilledIcon } from "./assets/moon-filled.svg";
import { ReactComponent as MoonIcon } from "./assets/moon.svg";
import { ReactComponent as SunFilledIcon } from "./assets/sun-filled.svg";
import { ReactComponent as SunIcon } from "./assets/sun.svg";
import * as Styles from "./ThemeSwitcher.styles";
import { IThemeSwitcherProps } from "./ThemeSwitcher.types";

export const ThemeSwitcher: FC<IThemeSwitcherProps> = ({
  theme = "light",
  variant = "standard",
  onToggle,
}: IThemeSwitcherProps) => {
  return (
    <Styles.Label $variant={variant}>
      <Styles.Input type="checkbox" checked={theme === "light"} onChange={onToggle} />

      {theme === "light" && (
        <>
          <Styles.ActiveIcon>
            <SunFilledIcon />
          </Styles.ActiveIcon>

          {variant == "standard" && (
            <Styles.Icon>
              <MoonIcon />
            </Styles.Icon>
          )}
        </>
      )}

      {theme === "dark" && (
        <>
          {variant === "standard" && (
            <Styles.Icon>
              <SunIcon />
            </Styles.Icon>
          )}

          <Styles.ActiveIcon>
            <MoonFilledIcon />
          </Styles.ActiveIcon>
        </>
      )}
    </Styles.Label>
  );
};
