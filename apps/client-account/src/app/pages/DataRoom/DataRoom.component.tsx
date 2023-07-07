import { FC } from "react";

import { Button, DashboardContent, TermsModal } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { AccountPanel } from "../../components/AccountPanel";
import { AccountPanelContent } from "../../components/AccountPanelContent";
import { AccountPanelFooter } from "../../components/AccountPanelFooter";
import { AccountPanelHeader } from "../../components/AccountPanelHeader";
import { AccountPanelHeaderTitle } from "../../components/AccountPanelHeaderTitle";
import { AccountPanelText } from "../../components/AccountPanelText";
import { useDataRoomContext } from "./DataRoom.provider";
import * as Styles from "./DataRoom.styles";
import { IDataRoomProps } from "./DataRoom.types";

export const DataRoomComponent: FC<IDataRoomProps> = (props: IDataRoomProps) => {
  const {
    user,
    onViewClientTermsAndConditions,
    onViewPlatformTermsAndConditions,
    onAcceptPlatformTerms,
    onRejectPlatformTerms,
    onAcceptClientTerms,
    onRejectClientTerms,
    showTermsModal,
    termsDocumentURL,
  } = ensureNotNull(useDataRoomContext());

  const hasAcceptedPlatformTerms = user?.hasAcceptedSilverTnc;
  const hasAcceptedClientTerms = user?.hasAcceptedClientTerms;

  return (
    <>
      <DashboardContent>
        <Styles.Container>
          <AccountPanel>
            <AccountPanelHeader>
              <AccountPanelHeaderTitle>Platform Terms & Conditions</AccountPanelHeaderTitle>
            </AccountPanelHeader>
            <AccountPanelContent>
              <AccountPanelText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in sodales leo,
                quis volutpat purus. Vestibulum ante ipsum primis in faucibus orci luctus et
                ultrices.
              </AccountPanelText>
            </AccountPanelContent>
            <AccountPanelFooter>
              {!hasAcceptedPlatformTerms ? (
                <Button variant="primary" onClick={onViewPlatformTermsAndConditions}>
                  View & Accept
                </Button>
              ) : (
                <Button variant="secondary" onClick={onViewPlatformTermsAndConditions}>
                  View
                </Button>
              )}
            </AccountPanelFooter>
          </AccountPanel>

          <AccountPanel>
            <AccountPanelHeader>
              <AccountPanelHeaderTitle>Client Terms & Conditions</AccountPanelHeaderTitle>
            </AccountPanelHeader>
            <AccountPanelContent>
              <AccountPanelText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in sodales leo,
                quis volutpat purus. Vestibulum ante ipsum primis in faucibus orci luctus et
                ultrices.
              </AccountPanelText>
            </AccountPanelContent>
            <AccountPanelFooter>
              {!hasAcceptedClientTerms ? (
                <Button variant="primary" onClick={onViewClientTermsAndConditions}>
                  View & Accept
                </Button>
              ) : (
                <Button variant="secondary" onClick={onViewClientTermsAndConditions}>
                  View
                </Button>
              )}
            </AccountPanelFooter>
          </AccountPanel>
        </Styles.Container>
      </DashboardContent>

      <TermsModal
        title="Platform Terms"
        subtitle={!hasAcceptedPlatformTerms ? "Please accept our platform terms to proceed." : ""}
        documentURL={termsDocumentURL}
        isOpen={showTermsModal === "tnc"}
        onAccept={onAcceptPlatformTerms}
        onReject={onRejectPlatformTerms}
        hasAccepted={hasAcceptedPlatformTerms}
        type={showTermsModal}
      />

      <TermsModal
        title="Client Terms"
        subtitle={!hasAcceptedClientTerms ? "Please accept our client terms to proceed." : ""}
        documentURL={termsDocumentURL}
        isOpen={showTermsModal === "client_terms"}
        onAccept={onAcceptClientTerms}
        onReject={onRejectClientTerms}
        hasAccepted={hasAcceptedClientTerms}
        type={showTermsModal}
      />
    </>
  );
};
