import { FC } from "react";

import * as Styles from "./Badge.styles";
import { IBadgeProps } from "./Badge.types";

export const Badge: FC<IBadgeProps> = (props) => {
  return <Styles.Badge {...props} />;
};
