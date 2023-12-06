import { FC, useState } from "react";

import { SilverDashboardSidebar } from "./SilverDashboardSidebar";
import { ExpandArrow } from "./SilverDashboardSidebar/SilverDashboardSidebar.styles";
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
