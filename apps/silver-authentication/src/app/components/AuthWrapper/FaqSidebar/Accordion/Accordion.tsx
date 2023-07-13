import { FC } from "react";

import { AccordionProvider } from "./Accordion.provider";
import * as Styles from "./Accordion.styles";
import { IAccordionProps } from "./Accordion.types";

export const Accordion: FC<IAccordionProps> = ({ children }) => {
  return (
    <AccordionProvider>
      <Styles.Container>{children}</Styles.Container>
    </AccordionProvider>
  );
};
