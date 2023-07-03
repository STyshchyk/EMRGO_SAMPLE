import { FC } from "react";

import { Button, Disclaimer, Logo } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { Footer, Heading, SubHeading } from "../../../components/Shared";
import { useKYCThankYouContext } from "./KYCThankYou.provider";
import * as Styles from "./KYCThankYou.styles";
import { IKYCThankYouProps } from "./KYCThankYou.types";

export const KYCThankYouComponent: FC<IKYCThankYouProps> = (props: IKYCThankYouProps) => {
  const { onGoBackToPlatform } = ensureNotNull(useKYCThankYouContext());

  return (
    <Styles.KYCThankYou>
      <Logo />

      <div>
        <Heading>Thank you for your submission.</Heading>
        <SubHeading>We are reviewing your profile and will respond by email soon.</SubHeading>
      </div>

      <div>
        <Button size="large" onClick={onGoBackToPlatform}>
          Back to the Platform
        </Button>
      </div>

      <Footer>
        <Disclaimer />
      </Footer>
    </Styles.KYCThankYou>
  );
};
