import { FC, useEffect } from "react";

import { silverModuleURLs } from "@emrgo-frontend/constants";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { SilverDashboardSidebar } from "./SilverDashboardSidebar";
import { useSilverDashboardWrapperContext } from "./SilverDashboardWrapper.provider";
import * as Styles from "./SilverDashboardWrapper.styles";
import { ISilverDashboardWrapperProps } from "./SilverDashboardWrapper.types";

export const SilverDashboardWrapperComponent: FC<ISilverDashboardWrapperProps> = ({
  children,
}: ISilverDashboardWrapperProps) => {


  return (
    <Styles.Container>
      <SilverDashboardSidebar />
      <Styles.Content>{children}</Styles.Content>
    </Styles.Container>
  );
};
