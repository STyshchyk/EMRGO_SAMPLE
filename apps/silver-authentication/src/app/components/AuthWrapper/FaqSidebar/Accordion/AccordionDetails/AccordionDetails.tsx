import { FC } from "react";

import { useAccordion } from "../Accordion.provider";
import { useAccordionPanel } from "../AccordionPanel";
import * as Styles from "./AccordionDetails.styles";
import { IAccordionDetailsProps } from "./AccordionDetails.types";

export const AccordionDetails: FC<IAccordionDetailsProps> = ({ children }) => {
  const { panel } = useAccordion();
  const { id } = useAccordionPanel();

  if (panel !== id) {
    return null;
  }

  return (
    <Styles.AccordionDetails aria-labelledby={`${id}-title`} id={`${id}-details`} role="region">
      {children}
    </Styles.AccordionDetails>
  );
};
