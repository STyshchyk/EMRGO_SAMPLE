import { FC } from "react";

import { ExpandArrow } from "@emrgo-frontend/shared-ui";
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
      <ExpandArrow
        $isHidden={isMenuHidden}
        color="primary"
        onClick={() => {
          setMenuHidded((prevState) => (prevState = !prevState));
        }}
      />

      <Styles.Content>{children}</Styles.Content>
    </Styles.Container>
  );
};
