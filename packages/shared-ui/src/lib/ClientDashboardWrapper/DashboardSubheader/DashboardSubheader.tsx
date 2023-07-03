import { FC } from "react";

import * as Styles from "./DashboardSubheader.styles";
import { IDashboardSubheaderProps } from "./DashboardSubheader.types";

export const DashboardSubheader: FC<IDashboardSubheaderProps> = ({ children }) => {
  return <Styles.Subheader>{children}</Styles.Subheader>;
};
