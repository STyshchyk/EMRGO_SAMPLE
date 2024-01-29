// eslint-disable-next-line simple-import-sort/imports
import * as React from "react";
import { FC } from "react";

import { useLocalStorage } from "usehooks-ts";

import * as Styles from "./ExpandArrow.styles";

export const ExpandArrow: FC<{ onClick?: () => void }> = ({ onClick }) => {
  const [isMenuHidden, setMenuHidded] = useLocalStorage("SideBarState", false);

  return (
    <Styles.ExpandArrow
      sx={{ transition: "all 1s ease" }}
      $isHidden={isMenuHidden}
      color="primary"
      onClick={() => {
        setMenuHidded((prevState) => (prevState = !prevState));
        if (onClick) onClick();
      }}
    />
  );
};
