import { FC } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@emrgo-frontend/shared-ui";

import { useAccordion } from "../Accordion.provider";
import { useAccordionPanel } from "../AccordionPanel";
import * as Styles from "./AccordionTitle.styles";
import { IAccordionTitleProps } from "./AccordionTitle.types";

export const AccordionTitle: FC<IAccordionTitleProps> = ({ children }) => {
  const { panel, setPanel } = useAccordion();
  const { id } = useAccordionPanel();
  const isPanelExpanded = panel === id;

  const toggle = () => {
    if (isPanelExpanded) {
      return setPanel("");
    }

    setPanel(id);
  };

  return (
    <Styles.ToggleButton
      onClick={toggle}
      aria-expanded={isPanelExpanded}
      aria-controls={`${id}-details`}
      id={`${id}-title`}
    >
      <Styles.Title>{children}</Styles.Title>
      <Styles.Icon>
        {isPanelExpanded && <ChevronUpIcon />}
        {!isPanelExpanded && <ChevronDownIcon />}
      </Styles.Icon>
    </Styles.ToggleButton>
  );
};
