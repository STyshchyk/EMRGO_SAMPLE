import { FC } from "react";
import QRCode from "react-qr-code";

import {
  ArrowBackwardIcon,
  Button,
  CodeInput,
  IconButton,
  Modal,
  ModalHeader,
  SixDigitCodeInput,
} from "@emrgo-frontend/shared-ui";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";

import QRImage from "./assets/qr.jpg";
import { SetupTwoFactorAuthenticationFormSchema } from "./SetupTwoFactorAuthenticationModal.schema";
import * as Styles from "./SetupTwoFactorAuthenticationModal.styles";
import {
  ISetupTwoFactorAuthenticationFormProps,
  ISetupTwoFactorAuthenticationModalProps,
} from "./SetupTwoFactorAuthenticationModal.types";

export const SetupTwoFactorAuthenticationModal: FC<ISetupTwoFactorAuthenticationModalProps> = ({
  isOpen,
  onBack,
  isQRCodeLoading,
  authenticatorURL,
  onSetup,
}) => {
  const form = useFormik<ISetupTwoFactorAuthenticationFormProps>({
    initialValues: {
      otp: "",
    },
    validateOnMount: true,
    validationSchema: SetupTwoFactorAuthenticationFormSchema,
    onSubmit: (values, { setSubmitting,resetForm }) => {
      onSetup(values.otp);
      setSubmitting(false);
      resetForm()
    },
  });

  return (
    <Modal isOpen={isOpen} width={"70%"}>
      <ModalHeader>
        <IconButton onClick={onBack}>
          <ArrowBackwardIcon />
        </IconButton>
      </ModalHeader>
      <Styles.Content>
        <Styles.Section>
          <Styles.Header>
            <Styles.Title>Setup Two Factor Authentication (2FA)</Styles.Title>
            <Styles.Description>
              Scan the following QR code with a two-factor authentication app on your phone
            </Styles.Description>
          </Styles.Header>
          {isQRCodeLoading ? (
            <span>Generating QR Code...</span>
          ) : (
            <Styles.QRCodeWrapper>
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={authenticatorURL ?? ""}
                // viewBox={`0 0 256 256`}
              />
            </Styles.QRCodeWrapper>
          )}
          {/* <Styles.QRCodeImage src={QRImage} /> */}
          <Styles.DownloadInstructions>
            Download one of the supported applications through your mobile phone&apos;s App Store:
            Google Authenticator, Microsoft Authenticator, Authy or any other 2FA supported app that
            you currently use
          </Styles.DownloadInstructions>
        </Styles.Section>

        <Styles.Section>
          <Styles.Header>
            <Styles.Title>Enter Security Code</Styles.Title>
            <Styles.Description>
              Enter the security code generated by your two-factor authentication app. You will be
              provided a new security code every 30 seconds
            </Styles.Description>
          </Styles.Header>
          <SixDigitCodeInput
            value={form.values.otp}
            onChange={(otp) => {
              form.setFieldValue("otp", otp);
            }}
            size="large"
          />
          <Button
            type="submit"
            onClick={() => form.handleSubmit()}
            size="large"
            disabled={!form.isValid || form.isSubmitting}
          >
            Setup
          </Button>
          <Styles.SupportLink href="#">Raise support ticket</Styles.SupportLink>
        </Styles.Section>
      </Styles.Content>
    </Modal>
  );
};
