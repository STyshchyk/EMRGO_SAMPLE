import { FC } from "react";

import { Button, Disclaimer, Logo } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { Footer, Heading, SubHeading } from "../../../components/Shared";
import { useInvestmentProfileThankYouContext } from "./InvestmentProfileThankYou.provider";
import * as Styles from "./InvestmentProfileThankYou.styles";
import { IInvestmentProfileThankYouProps } from "./InvestmentProfileThankYou.types";

export const InvestmentProfileThankYouComponent: FC<IInvestmentProfileThankYouProps> = (
  props: IInvestmentProfileThankYouProps
) => {
  const { onGoBackToPlatform } = ensureNotNull(useInvestmentProfileThankYouContext());

  return (
    <Styles.InvestmentProfileThankYou>
      <Logo />

      <div>
        <Heading>Thank you for your submission.</Heading>
        <SubHeading>
          We are reviewing your profile and will respond by email within 24 hours.
        </SubHeading>
      </div>

      <div>
        <Button size="large" onClick={onGoBackToPlatform}>
          Back to the Platform
        </Button>
      </div>

      <Footer>
        <Disclaimer />
      </Footer>
    </Styles.InvestmentProfileThankYou>
  );
};
