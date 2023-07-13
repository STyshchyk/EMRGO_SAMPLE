import { FC, useEffect } from "react";

import { silverModuleURLs } from "@emrgo-frontend/constants";
import {ensureNotNull} from "@emrgo-frontend/utils";

import {SilverDashboardSidebar} from "./SilverDashboardSidebar";
import {useSilverDashboardWrapperContext} from "./SilverDashboardWrapper.provider";
import * as Styles from "./SilverDashboardWrapper.styles";
import {ISilverDashboardWrapperProps} from "./SilverDashboardWrapper.types";

export const SilverDashboardWrapperComponent: FC<
  ISilverDashboardWrapperProps
> = ({children}: ISilverDashboardWrapperProps) => {
  const {
    showClientTermsModal,
    onAcceptTerms,
    onDownloadTerms,
    onPrintTerms,
    onShareTerms,
    onRejectTerms
  } = ensureNotNull(useSilverDashboardWrapperContext());
  useEffect(() => {
    console.log(silverModuleURLs);
  }, []);
  return (
    <Styles.Container>
      <SilverDashboardSidebar />
      <Styles.Content>
        {children}
      </Styles.Content>
    </Styles.Container>
  );
};
