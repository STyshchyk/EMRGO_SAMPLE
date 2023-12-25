import { FC, useState } from "react";

import { ExpandArrow } from "@emrgo-frontend/shared-ui";

import { DashboardSidebar } from "./DashboardSidebar";
import * as Styles from "./DashboardWrapper.styles";
import { IDashboardWrapperProps } from "./DashboardWrapper.types";

export const DashboardWrapperComponent: FC<IDashboardWrapperProps> = ({ children }) => {
  const [isMenuHidden, setMenuHidded] = useState(false);
  return (
    <Styles.Container $isHidden={isMenuHidden}>
      <DashboardSidebar isHidden={isMenuHidden} />
      <ExpandArrow
        $isHidden={isMenuHidden}
        onClick={() => {
          setMenuHidded((prevState) => (prevState = !prevState));
        }}
      />
      <Styles.Content>{children}</Styles.Content>
    </Styles.Container>
  );
};
