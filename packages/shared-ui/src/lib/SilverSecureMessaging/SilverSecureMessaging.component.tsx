import { FC } from "react";
import { Route, Routes } from "react-router-dom";

import { ensureNotNull } from "@emrgo-frontend/utils";

import { MessagesContainerCommon, TabHeader } from "../SecureMessagingCommon";
import { CreateNewMessageContainer } from "./CreateNewMessageContainer";
import { SecureSideBar } from "./SecureSideBar";
import { useSilverSecureMessagingContext } from "./SilverSecureMessaging.provider";
import * as Styles from "./SilverSecureMessaging.styles";
import { ISilverSecureMessagingProps } from "./SilverSecureMessaging.types";

export const SilverSecureMessagingComponent: FC<ISilverSecureMessagingProps> = ({
  children,
}: ISilverSecureMessagingProps) => {
  const { isNewMsgGroup } = ensureNotNull(useSilverSecureMessagingContext());
  return (
    <Styles.SilverSecureMessaging>
      <TabHeader />
      <Styles.Container>
        <SecureSideBar />
        <Styles.Content>
          {isNewMsgGroup ? (
            <CreateNewMessageContainer key={"sendMsgMode"} />
          ) : (
            <Routes>
              <Route
                path="id/:id"
                element={<MessagesContainerCommon sendMode={"internal"} />}
              ></Route>
            </Routes>
          )}
        </Styles.Content>
      </Styles.Container>
    </Styles.SilverSecureMessaging>
  );
};
