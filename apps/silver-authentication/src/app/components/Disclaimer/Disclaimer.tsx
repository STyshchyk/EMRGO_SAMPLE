import { FC } from "react";

import * as Styles from "./Disclaimer.styles";
import { IDisclaimerProps } from "./Disclaimer.types";

export const Disclaimer: FC<IDisclaimerProps> = ({}) => {
  return (
    <Styles.Disclaimer>
      Disclaimer: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce bibendum nulla ac
      bibendum feugiat. Aenean nisl nulla, viverra eleifend tristique quis, iaculis sit amet neque.
    </Styles.Disclaimer>
  );
};
