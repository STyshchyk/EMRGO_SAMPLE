import { FC } from "react";

import { AccordionPanelProvider } from "./AccordionPanel.provider";
import * as Styles from "./AccordionPanel.styles";
import { IAccordionPanelProps } from "./AccordionPanel.types";

export const AccordionPanel: FC<IAccordionPanelProps> = ({ children, id }) => {
  return (
    <AccordionPanelProvider id={id}>
      <Styles.Container>{children}</Styles.Container>
    </AccordionPanelProvider>
  );
};
