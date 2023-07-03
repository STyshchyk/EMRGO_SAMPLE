import { FC, useRef } from "react";
import useScroll from "react-use/lib/useScroll";

import * as Styles from "./TicketContent.styles";
import { ITicketContentProps } from "./TicketContent.types";

export const TicketContent: FC<ITicketContentProps> = ({ children }: ITicketContentProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { y } = useScroll(ref);
  const isScrolled = y > 0;

  return (
    <Styles.TicketContent ref={ref} $isScrolled={isScrolled}>
      {children}
    </Styles.TicketContent>
  );
};
