import { FC } from "react";

import { Accordion } from "./Accordion";
import { AccordionDetails } from "./Accordion/AccordionDetails";
import { AccordionPanel } from "./Accordion/AccordionPanel";
import { AccordionTitle } from "./Accordion/AccordionTitle";
import { CloseButton } from "./CloseButton";
import * as Styles from "./FaqSidebar.styles";
import { IFaqSidebarProps } from "./FaqSidebar.types";

export const FaqSidebar: FC<IFaqSidebarProps> = ({ onClose, isOpen }) => {
  return (
    <Styles.Drawer $isOpen={isOpen}>
      <Styles.Header>
        <Styles.Title>About Emrgo</Styles.Title>
        <CloseButton onClick={onClose} />
      </Styles.Header>

      <Styles.AboutPoints>
        <li>Direct access to Emerging Markets</li>
        <li>Exclusive access to Primary Issuances</li>
        <li>Secondary opportunities </li>
        <li>Custody your portfolio</li>
      </Styles.AboutPoints>

      <Styles.Divider />

      <Styles.Title>FAQs</Styles.Title>

      <Accordion>
       <AccordionPanel id="steps-client-platform">
          <AccordionTitle>What are the steps to becoming a Client on the Platform?</AccordionTitle>
          <AccordionDetails>
            <p>
              First, you will complete Registration to become a user of the Platform by providing
              personal details such as your Name, the Corporate Entity you work for and your
              Corporate Email Address.
            </p>
            <br />
            <p>
              Second, you are required to complete and submit the Client Questionnaire along with an
              ID proof. This will be reviewed by our Relationship Manager.
            </p>
            <br />
            <p>
              Third, the Administrator for your Entity will be required to complete KYC on behalf of
              the Entity. Upon Approval of the KYC, you will be granted access to the relevant
              module.
            </p>
          </AccordionDetails>
        </AccordionPanel>
        <AccordionPanel id="details-kyc">
          <AccordionTitle>What details will be asked as part of KYC?</AccordionTitle>
          <AccordionDetails>
            Corporate Details, Shareholders/Ultimate Beneficial Owners, Key Individiuals &
            Supporting Documents
          </AccordionDetails>
        </AccordionPanel>
        <AccordionPanel id="account-secure">
          <AccordionTitle>How does the Platform keep my account secure?</AccordionTitle>
          <AccordionDetails>
            We require all users to set a strong password. Additionally we also enforce 2 Factor
            Authentication for an additional layer of security.
          </AccordionDetails>
        </AccordionPanel>
        <AccordionPanel id="help-desk">
          <AccordionTitle>How can i reach out to the Helpdesk?</AccordionTitle>
          <AccordionDetails>
            Once within the platform, we have a short cut in the bottom left side of the screen to contact our helpdesk. You may also write to them directly on helpdesk@difc.emrgo.com
          </AccordionDetails>
        </AccordionPanel>
      </Accordion>
    </Styles.Drawer>
  );
};
