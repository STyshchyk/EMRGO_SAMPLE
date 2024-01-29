import { FC } from "react";

import { useLocalStorage } from "usehooks-ts";

import { SilverDashboardSidebar } from "./SilverDashboardSidebar";
import * as Styles from "./SilverDashboardWrapper.styles";
import { ISilverDashboardWrapperProps } from "./SilverDashboardWrapper.types";

export const SilverDashboardWrapperComponent: FC<ISilverDashboardWrapperProps> = ({
  children,
}: ISilverDashboardWrapperProps) => {
  const [isMenuHidden, setMenuHidded] = useLocalStorage("SideBarState", false);
  return (
    <Styles.Container $isHidden={isMenuHidden}>
      <SilverDashboardSidebar isHidden={isMenuHidden} />

      <Styles.Content>{children}</Styles.Content>
    </Styles.Container>
  );
};
