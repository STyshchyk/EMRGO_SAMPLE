import { FC, useState } from "react";

import { ExpandArrow } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { DashboardSidebar } from "./DashboardSidebar";
import { useDashboardWrapperContext } from "./DashboardWrapper.provider";
import * as Styles from "./DashboardWrapper.styles";
import { IDashboardWrapperProps } from "./DashboardWrapper.types";

export const DashboardWrapperComponent: FC<IDashboardWrapperProps> = ({ children }) => {
  const { numberOfNotifications } = ensureNotNull(useDashboardWrapperContext());
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
