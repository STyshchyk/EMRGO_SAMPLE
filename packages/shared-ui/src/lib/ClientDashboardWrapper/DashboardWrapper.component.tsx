import { FC } from "react";

import { ExpandArrow } from "@emrgo-frontend/shared-ui";
import { useLocalStorage } from "usehooks-ts";

import { DashboardSidebar } from "./DashboardSidebar";
import * as Styles from "./DashboardWrapper.styles";
import { IDashboardWrapperProps } from "./DashboardWrapper.types";

export const DashboardWrapperComponent: FC<IDashboardWrapperProps> = ({ children }) => {
  const [isMenuHidden, setMenuHidded] = useLocalStorage("SideBarState", false);
  return (
    <Styles.Container $isHidden={isMenuHidden}>
      <DashboardSidebar isHidden={isMenuHidden} />
      <ExpandArrow
        sx={{ transition: "all 1s ease" }}
        fontSize={"large"}
        $isHidden={isMenuHidden}
        onClick={() => {
          setMenuHidded((prevState) => (prevState = !prevState));
        }}
      />
      <Styles.Content>{children}</Styles.Content>
    </Styles.Container>
  );
};
