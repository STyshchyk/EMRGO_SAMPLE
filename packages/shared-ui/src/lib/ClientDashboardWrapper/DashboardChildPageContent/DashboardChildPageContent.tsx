import { FC, useRef } from "react";
import { useScroll } from "react-use";

import * as Styles from "./DashboardChildPageContent.styles";
import { IDashboardChildPageContentProps } from "./DashboardChildPageContent.types";

export const DashboardChildPageContent: FC<IDashboardChildPageContentProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { y } = useScroll(ref);
  const isScrolled = y > 0;

  return (
    <Styles.DashboardChildPageContent ref={ref} $isScrolled={isScrolled}>
      {children}
    </Styles.DashboardChildPageContent>
  );
};
