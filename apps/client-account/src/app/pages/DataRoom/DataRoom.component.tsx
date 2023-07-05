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
    onViewClientTermsAndConditions,
    onViewFeeSchedule,
    onViewPlatformTermsAndConditions,
    showPlatformTermsModal,
    onAcceptPlatformTerms,
    onRejectPlatformTerms,
    showClientTermsModal,
    onAcceptClientTerms,
    onRejectClientTerms,
    clientTermsDocumentURL,
    platformTermsDocumentURL,
  } = ensureNotNull(useDataRoomContext());

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
              <Button variant="secondary" onClick={onViewPlatformTermsAndConditions}>
                View
              </Button>
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
              <Button variant="secondary" onClick={onViewClientTermsAndConditions}>
                View
              </Button>
            </AccountPanelFooter>
          </AccountPanel>

          <AccountPanel>
            <AccountPanelHeader>
              <AccountPanelHeaderTitle>Fee Schedule</AccountPanelHeaderTitle>
            </AccountPanelHeader>
            <AccountPanelContent>
              <AccountPanelText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in sodales leo,
                quis volutpat purus. Vestibulum ante ipsum primis in faucibus orci luctus et
                ultrices.
              </AccountPanelText>
            </AccountPanelContent>
            <AccountPanelFooter>
              <Button variant="secondary" onClick={onViewFeeSchedule}>
                View
              </Button>
            </AccountPanelFooter>
          </AccountPanel>
        </Styles.Container>
      </DashboardContent>

      <TermsModal
        title="Platform Terms"
        subtitle="Please accept our platform terms to proceed."
        documentURL={platformTermsDocumentURL}
        isOpen={showPlatformTermsModal}
        onAccept={onAcceptPlatformTerms}
        onReject={onRejectPlatformTerms}
        hasAccepted={false}
      />

      <TermsModal
        title="Client Terms"
        subtitle="Please accept our client terms to proceed."
        documentURL={clientTermsDocumentURL}
        isOpen={showClientTermsModal}
        onAccept={onAcceptClientTerms}
        onReject={onRejectClientTerms}
        hasAccepted={true}
      />
    </>
  );
};
