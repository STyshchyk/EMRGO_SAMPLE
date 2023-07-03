import { FC } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { config } from "@emrgo-frontend/constants";

import { AuthWrapper } from "../../components/AuthWrapper";
import { SignupComponent } from "./Signup.component";
import { SignupProvider } from "./Signup.provider";
import { ISignupProps } from "./Signup.types";

export const Signup: FC<ISignupProps> = (props: ISignupProps) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={config.RECAPTCHA_SITE_KEY}
      scriptProps={{ async: true, defer: true, appendTo: "body" }}
      container={{
        parameters: {
          badge: "bottomright", // optional, default undefined
          theme: "light", // optional, default undefined
        },
      }}
    >
      <SignupProvider>
        <AuthWrapper>
          <SignupComponent />
        </AuthWrapper>
      </SignupProvider>
    </GoogleReCaptchaProvider>
  );
};
