import { FC, Fragment } from "react";

import { Button, DashboardContent, EnterOTPCodeModal, Input } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { AccountPanel } from "../../components/AccountPanel";
import { AccountPanelContent } from "../../components/AccountPanelContent";
import { AccountPanelFooter } from "../../components/AccountPanelFooter";
import { AccountPanelHeader } from "../../components/AccountPanelHeader";
import { AccountPanelHeaderTitle } from "../../components/AccountPanelHeaderTitle";
import { AccountPanelText } from "../../components/AccountPanelText";
import { EditCorporateLegalNameModal } from "./EditCorporateLegalNameModal";
import { EditEmailAddressModal } from "./EditEmailAddressModal/EditEmailAddressModal";
import { EditNameModal } from "./EditNameModal/EditNameModal";
import { EditPhoneNumberModal } from "./EditPhoneNumberModal/EditPhoneNumberModal";
import { useUserDetailsContext } from "./UserDetails.provider";
import * as Styles from "./UserDetails.styles";
import { IUserDetailsProps } from "./UserDetails.types";

export const UserDetailsComponent: FC<IUserDetailsProps> = (props: IUserDetailsProps) => {
  const {
    user,
    setStateOfEditNameModal,
    setStateOfEditCorporateLegalNameModal,
    setStateOfEditEmailAddressModal,
    setStateOfEditCorporateMobileNumberModal,
    isOTPCodeModalOpen,
    setStateOfOTPCodeModal,
    onVerifyCorporateMobileNumber,
    onLogOut,
  } = ensureNotNull(useUserDetailsContext());

  return (
    <DashboardContent>
      <Styles.Container>
        <AccountPanel>
          <AccountPanelHeader>
            <AccountPanelHeaderTitle>Name</AccountPanelHeaderTitle>
          </AccountPanelHeader>
          <AccountPanelContent>
            <Styles.UserNameDetails>
              <Input label="First name" disabled value={user?.firstName || ""} />
              <Input label="Last name" disabled value={user?.lastName || ""} />
            </Styles.UserNameDetails>
          </AccountPanelContent>
          <AccountPanelFooter>
            <Button variant="secondary" size="large" onClick={() => setStateOfEditNameModal(true)}>
              Edit Name
            </Button>
          </AccountPanelFooter>
        </AccountPanel>

        <AccountPanel>
          <AccountPanelHeader>
            <AccountPanelHeaderTitle>Corporate legal name</AccountPanelHeaderTitle>
          </AccountPanelHeader>
          <AccountPanelContent>
            <Input disabled value={user?.entityName || ""} />
          </AccountPanelContent>
          <AccountPanelFooter>
            <Button
              variant="secondary"
              size="large"
              onClick={() => setStateOfEditCorporateLegalNameModal(true)}
            >
              Update corporate legal name
            </Button>
          </AccountPanelFooter>
        </AccountPanel>

        <AccountPanel>
          <AccountPanelHeader>
            <AccountPanelHeaderTitle>Corporate email address</AccountPanelHeaderTitle>
          </AccountPanelHeader>
          <AccountPanelContent>
            <Input disabled value={user?.email || ""} />
          </AccountPanelContent>
          <AccountPanelFooter>
            <Button
              variant="secondary"
              size="large"
              onClick={() => setStateOfEditEmailAddressModal(true)}
            >
              Update email address
            </Button>
          </AccountPanelFooter>
        </AccountPanel>

        <AccountPanel>
          <AccountPanelHeader>
            <AccountPanelHeaderTitle>Corporate mobile number</AccountPanelHeaderTitle>
          </AccountPanelHeader>

          <Fragment>
            <AccountPanelContent>
              {user?.phone ? (
                <Input disabled value={user?.phone || ""} />
              ) : (
                <AccountPanelText>
                  Add your corporate mobile number for extra security.
                </AccountPanelText>
              )}
            </AccountPanelContent>
            <AccountPanelFooter>
              <Button
                variant={user?.phone ? "secondary" : "primary"}
                size="large"
                onClick={() => setStateOfEditCorporateMobileNumberModal(true, user?.phone === null)}
              >
                {user?.phone ? "Update" : "Add"} corporate mobile number
              </Button>
            </AccountPanelFooter>
          </Fragment>
        </AccountPanel>

        <AccountPanel>
          <AccountPanelHeader>
            <AccountPanelHeaderTitle>Log out of your account</AccountPanelHeaderTitle>
          </AccountPanelHeader>
          <AccountPanelFooter>
            <Button size="large" variant="secondary" color="error" onClick={onLogOut}>
              Log out
            </Button>
          </AccountPanelFooter>
        </AccountPanel>
      </Styles.Container>

      <EditNameModal user={user || null} />
      <EditCorporateLegalNameModal user={user || null} />
      <EditEmailAddressModal user={user || null} />

      <EditPhoneNumberModal user={user || null} />

      <EnterOTPCodeModal
        isOpen={isOTPCodeModalOpen}
        onClose={() => setStateOfOTPCodeModal(false)}
        onSetup={(otp: string) => onVerifyCorporateMobileNumber({ code: otp })}
        title="Enter the otp sent to your new phone"
        subtitle="To reset your corporate mobile phone, enter the 6-digit verification code sent to your mobile number"
        buttonText="Verify"
      />
    </DashboardContent>
  );
};
