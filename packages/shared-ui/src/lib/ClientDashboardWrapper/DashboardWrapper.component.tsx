import { FC } from "react";

import { ensureNotNull } from "@emrgo-frontend/utils";

import { DashboardSidebar } from "./DashboardSidebar";
import { useDashboardWrapperContext } from "./DashboardWrapper.provider";
import * as Styles from "./DashboardWrapper.styles";
import { IDashboardWrapperProps } from "./DashboardWrapper.types";

export const DashboardWrapperComponent: FC<IDashboardWrapperProps> = ({ children }) => {
  const { numberOfNotifications } = ensureNotNull(useDashboardWrapperContext());

  return (
    <Styles.Container>
      <DashboardSidebar />
      <Styles.Content>{children}</Styles.Content>
    </Styles.Container>
  );
};
