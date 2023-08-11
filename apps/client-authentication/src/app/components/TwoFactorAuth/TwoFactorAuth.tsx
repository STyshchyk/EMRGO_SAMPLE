import {FC} from "react";
import QRCode from "react-qr-code";
import {Link} from "react-router-dom";

import {Button} from "@emrgo-frontend/shared-ui";
import {Formik} from "formik";
import * as Yup from "yup";

import {Heading, OneCol, SubHeading} from "../Form";
import {SixDigitCodeInput} from "../SixDigitCodeInput";
import * as Styles from "./TwoFactorAuth.styles";
import {MFATYPE} from "./TwoFactorAuth.types";
import {ITwoFactorAuthProps} from "./TwoFactorAuth.types";

export const TwoFactorAuth: FC<ITwoFactorAuthProps> = ({ position, mode, otpauth_url,isQRCodeLoading,onEnableMFA,onVerifyMFA }) => {

  return (
    <Styles.TwoFactorAuth position={position}>
      <Formik
        validateOnMount={true}
        initialValues={{ otp: "" }}
        onSubmit={(values, formikHelpers) => {
          console.log(values);
          if (mode === undefined) return;
          if (mode === MFATYPE.enable) onEnableMFA(values.otp);
           else onVerifyMFA(values.otp);
        }}
        validationSchema={Yup.object().shape({
          otp: Yup.string().required("Required")
            .min(6, "Enter 6 digits")
        })
        }
      >

        {({ values, setFieldValue, errors, handleSubmit, isValid }) => (
          <form onSubmit={handleSubmit}>
            <Styles.MainWrapper isVisible={mode === 1}>
              <Styles.LeftColumn isVisible={mode === 1}>
                <Heading align={"center"}>Setup Two Factor Authentication (2FA)</Heading>
                <SubHeading align={"center"}>
                  Scan the following QR code with a two-factor authentication app on your phone.
                </SubHeading>
                {isQRCodeLoading ? (
                  <span>Generating QR Code...</span>
                ) : ( 
                  <div style={{ height: "224", margin: "0 auto", maxWidth: 224 }}>
                    <QRCode
                      size={256}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      value={otpauth_url ?? ""}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                )}
                <SubHeading align={"center"}>
                  Download on of the supported applications through your mobile phone’s App Store: Google
                  Authenticator, Microsoft Authenticator, Authy or any other 2FA supported app that you
                  currently use
                </SubHeading>
              </Styles.LeftColumn>
              <Styles.RightColumn>
                <Heading align={"center"}>Enter Security Code</Heading>
                <SubHeading align={"center"}>
                  Enter the security code generated by your two-factor authentication app. You will be
                  provided a new security code every 30 seconds.
                </SubHeading>
                <OneCol>
                  <SixDigitCodeInput
                    value={values.otp}
                    onChange={(value) => {
                      setFieldValue("otp", value);
                    }}
                  />
                </OneCol>
                <OneCol>
                  <Button
                    size="large"
                    type={"submit"}
                    disabled={!isValid}
                  >
                    Setup
                  </Button>
                </OneCol>
                <Styles.Spacer />
                <Styles.HelpListItem>
                  <Link to="">Raise support ticket</Link>
                </Styles.HelpListItem>
              </Styles.RightColumn>
            </Styles.MainWrapper>
          </form>
        )}

      </Formik>
    </Styles.TwoFactorAuth>
  );
};