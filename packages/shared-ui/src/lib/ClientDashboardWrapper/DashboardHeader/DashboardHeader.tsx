import { FC } from "react";

import * as Styles from "./DashboardHeader.styles";
import { IDashboardHeaderProps } from "./DashboardHeader.types";

export const DashboardHeader: FC<IDashboardHeaderProps> = ({ children }) => {
  return <Styles.Header>{children}</Styles.Header>;
};
