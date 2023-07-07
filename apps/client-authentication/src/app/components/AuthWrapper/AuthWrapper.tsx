import { FC, useState } from "react";

import { EmrgoBackgroundAnimation } from "@emrgo-frontend/shared-ui";

import * as Styles from "./AuthWrapper.styles";
import { IAuthWrapperProps } from "./AuthWrapper.types";
import { BackButton } from "./BackButton";
import { FaqButton } from "./FaqButton";
import { FaqSidebar } from "./FaqSidebar";

export const AuthWrapper: FC<IAuthWrapperProps> = ({ children, backUrl, hideFAQ = false }) => {
  const [isFaqSidebarOpen, setIsFaqSidebarOpen] = useState(false);

  const openFaqSidebar = () => {
    setIsFaqSidebarOpen(true);
  };

  const closeFaqSidebar = () => {
    setIsFaqSidebarOpen(false);
  };

  return (
    <Styles.SignupFrame>
      <Styles.PageContent>
        <Styles.Header>
          {backUrl ? <BackButton url={backUrl} /> : <span />}
          {!hideFAQ && <FaqButton onClick={openFaqSidebar} />}
        </Styles.Header>
        <Styles.FormContent>{children}</Styles.FormContent>

        <FaqSidebar isOpen={isFaqSidebarOpen} onClose={closeFaqSidebar} />
      </Styles.PageContent>
      <EmrgoBackgroundAnimation />
    </Styles.SignupFrame>
  );
};
