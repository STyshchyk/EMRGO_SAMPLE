import { FC } from "react";
import { Route, Routes } from "react-router-dom";

import { MessageContainer } from "./MessageContainer";
import { SecureSideBar } from "./SecureSideBar";
import * as Styles from "./SilverSecureMessaging.styles";
import { ISilverSecureMessagingProps } from "./SilverSecureMessaging.types";
import { TabHeader } from "./TabHeader";

export const SilverSecureMessagingComponent: FC<ISilverSecureMessagingProps> = ({
  children,
}: ISilverSecureMessagingProps) => {
  return (
    <Styles.SilverSecureMessaging>
      <TabHeader />
      <Styles.Container>
        <SecureSideBar />
        <Styles.Content>
          <Routes>
            <Route path="id/:id" element={<MessageContainer />}></Route>
          </Routes>
        </Styles.Content>
      </Styles.Container>
    </Styles.SilverSecureMessaging>
  );
};
