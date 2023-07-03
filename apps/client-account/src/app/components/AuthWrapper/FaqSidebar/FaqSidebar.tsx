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
        <AccordionPanel id="phone-number">
          <AccordionTitle>Why does Emrgo need my phone number?</AccordionTitle>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et massa elementum,
            molestie lorem vel, sagittis metus. Fusce mi massa, semper in viverra vel, gravida eget
            urna. Phasellus tristique, orci id feugiat placerat, metus dolor tempor diam, ac tempor
            eros nisi ac risus. Morbi vitae quam porta, feugiat orci ac, dignissim ipsum
          </AccordionDetails>
        </AccordionPanel>
        <AccordionPanel id="landline-for-verification">
          <AccordionTitle>
            Why can&apos;t I use a landline to get a verification code?
          </AccordionTitle>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et massa elementum,
            molestie lorem vel, sagittis metus. Fusce mi massa, semper in viverra vel, gravida eget
            urna. Phasellus tristique, orci id feugiat placerat, metus dolor tempor diam, ac tempor
            eros nisi ac risus. Morbi vitae quam porta, feugiat orci ac, dignissim ipsum
          </AccordionDetails>
        </AccordionPanel>
        <AccordionPanel id="lorem">
          <AccordionTitle>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</AccordionTitle>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et massa elementum,
            molestie lorem vel, sagittis metus. Fusce mi massa, semper in viverra vel, gravida eget
            urna. Phasellus tristique, orci id feugiat placerat, metus dolor tempor diam, ac tempor
            eros nisi ac risus. Morbi vitae quam porta, feugiat orci ac, dignissim ipsum
          </AccordionDetails>
        </AccordionPanel>
      </Accordion>
    </Styles.Drawer>
  );
};
