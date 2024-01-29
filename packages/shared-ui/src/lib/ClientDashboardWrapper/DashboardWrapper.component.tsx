import { FC } from "react";

import { useLocalStorage } from "usehooks-ts";

import { DashboardSidebar } from "./DashboardSidebar";
import * as Styles from "./DashboardWrapper.styles";
import { IDashboardWrapperProps } from "./DashboardWrapper.types";

export const DashboardWrapperComponent: FC<IDashboardWrapperProps> = ({ children }) => {
  const [isMenuHidden, setMenuHidded] = useLocalStorage("SideBarState", false);
  return (
    <Styles.Container $isHidden={isMenuHidden}>
      <DashboardSidebar isHidden={isMenuHidden} />
      <Styles.Content>{children}</Styles.Content>
    </Styles.Container>
  );
};
