import { FC } from "react";

import { Button, ClientTermsModal, DashboardContent } from "@emrgo-frontend/shared-ui";
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
    onDownloadPlatformTerms,
    onPrintPlatformTerms,
    onRejectPlatformTerms,
    onSharePlatformTerms,
    showClientTermsModal,
    onAcceptClientTerms,
    onDownloadClientTerms,
    onPrintClientTerms,
    onRejectClientTerms,
    onShareClientTerms,
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

      <ClientTermsModal
        documentURL=""
        isOpen={showPlatformTermsModal}
        onAccept={onAcceptPlatformTerms}
        onDownload={onDownloadPlatformTerms}
        onPrint={onPrintPlatformTerms}
        onReject={onRejectPlatformTerms}
        onShare={onSharePlatformTerms}
      />

      <ClientTermsModal
        documentURL=""
        isOpen={showClientTermsModal}
        onAccept={onAcceptClientTerms}
        onDownload={onDownloadClientTerms}
        onPrint={onPrintClientTerms}
        onReject={onRejectClientTerms}
        onShare={onShareClientTerms}
      />
    </>
  );
};
