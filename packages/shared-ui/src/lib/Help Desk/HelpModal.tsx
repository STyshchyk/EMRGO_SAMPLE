// eslint-disable-next-line simple-import-sort/imports
import { FC } from "react";

import { Button, Modal } from "@emrgo-frontend/shared-ui";

import * as Styles from "./HelpModal.styles";
import { IHelpModalProps } from "./HelpModal.types";

import "@react-pdf-viewer/core/lib/styles/index.css";

const HELP_DESK_EMAIL_ADDRESS = "helpdesk@difc.emrgo.com";
const HELP_DESK_EMAIL_ADDRESS_KSA = "helpdesk@wethaqcapital.sa"; // update this when there's a ksa version for emrgo

export const HelpModal: FC<IHelpModalProps> = ({ isOpen, onClose }) => {
  const helpDeskEmailAddress = HELP_DESK_EMAIL_ADDRESS;

  return (
    <Modal isOpen={isOpen} width={"40%"} variant="darkened">
      <Styles.Wrapper>
        <Styles.Title>Connect with Emrgo?</Styles.Title>
        <Styles.Subtitle>
          Please contact{" "}
          <a target="_blank" rel="noopener noreferrer" href={`mailto:${helpDeskEmailAddress}`}>
            {helpDeskEmailAddress}
          </a>{" "}
          for any support related queries
        </Styles.Subtitle>
        <Styles.Footer>
          <Styles.Spacer />
          <Button
            variant="secondary"
            onClick={() => {
              onClose(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="primary">
            <a target="_blank" rel="noopener noreferrer" href={`mailto:${helpDeskEmailAddress}`}>
              Get in Touch
            </a>
          </Button>
        </Styles.Footer>
      </Styles.Wrapper>
    </Modal>
  );
};
