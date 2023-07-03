import { FC } from "react";

import { CloseIcon } from "../../Icons";
import { useTooltipContext } from "../Tooltip.context";
import * as Styles from "./TooltipHeader.styles";
import { ITooltipHeaderProps } from "./TooltipHeader.types";

export const TooltipHeader: FC<ITooltipHeaderProps> = ({ children }: ITooltipHeaderProps) => {
  const { setIsOpen } = useTooltipContext();

  return (
    <Styles.TooltipHeader>
      {children}

      <Styles.CloseButton onClick={() => setIsOpen(false)}>
        <CloseIcon />
      </Styles.CloseButton>
    </Styles.TooltipHeader>
  );
};
