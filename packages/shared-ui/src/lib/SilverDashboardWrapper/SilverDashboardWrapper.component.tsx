import { FC, useState } from "react";

import { ExpandArrow } from "@emrgo-frontend/shared-ui";

import { SilverDashboardSidebar } from "./SilverDashboardSidebar";
import * as Styles from "./SilverDashboardWrapper.styles";
import { ISilverDashboardWrapperProps } from "./SilverDashboardWrapper.types";

export const SilverDashboardWrapperComponent: FC<ISilverDashboardWrapperProps> = ({
  children,
}: ISilverDashboardWrapperProps) => {
  const [isMenuHidden, setMenuHidded] = useState(false);
  return (
    <Styles.Container $isHidden={isMenuHidden}>
      <SilverDashboardSidebar isHidden={isMenuHidden} />
      <ExpandArrow
        sx={{ transition: "all 1s ease" }}
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
