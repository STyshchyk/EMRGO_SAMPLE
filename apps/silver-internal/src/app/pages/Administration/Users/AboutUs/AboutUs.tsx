import { FC } from "react";

import { ChatIcon, CloseIcon, CustodyIcon, EyeIcon, HandshakeIcon } from "@emrgo-frontend/shared-ui";

import * as Styles from "./AboutUs.styles";
import { IAboutUsProps } from "./AboutUs.types";

export const AboutUs: FC<IAboutUsProps> = ({ onClose }: IAboutUsProps) => {
  return (
    <Styles.Container>
      <Styles.Header>
        <Styles.Title>About us</Styles.Title>
        <Styles.CloseButton onClick={onClose}>
          <CloseIcon />
        </Styles.CloseButton>
      </Styles.Header>
      <Styles.Content>
        <Styles.Text>
          We are a capital markets group focused on the emerging private markets. With our deep
          market knowledge and fintech innovation, we unlock opportunities missed by the incumbents.
        </Styles.Text>
        <Styles.Features>
          <Styles.Feature>
            <Styles.FeatureIcon>
              <EyeIcon />
            </Styles.FeatureIcon>
            Discover opportunities
          </Styles.Feature>
          <Styles.Feature>
            <Styles.FeatureIcon>
              <ChatIcon />
            </Styles.FeatureIcon>
            Communicate with our sales team
          </Styles.Feature>
          <Styles.Feature>
            <Styles.FeatureIcon>
              <HandshakeIcon />
            </Styles.FeatureIcon>
            Execute trades
          </Styles.Feature>
          <Styles.Feature>
            <Styles.FeatureIcon>
              <CustodyIcon />
            </Styles.FeatureIcon>
            Custody your securities
          </Styles.Feature>
        </Styles.Features>
        <Styles.Text>
          We are transparent with our fees. We only charge a placement fee to the Issuers, we do not
          charge you the Investor. We only charge you a very competitive Custody fee upon Execution.
        </Styles.Text>
      </Styles.Content>
    </Styles.Container>
  );
};
