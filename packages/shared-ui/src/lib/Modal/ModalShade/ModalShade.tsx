import { FC, useEffect, useState } from "react";

import { StyledModalShade } from "./ModalShade.styles";
import { IModalShadeProps } from "./ModalShade.types";

export const ModalShade: FC<IModalShadeProps> = ({
  children,
  onClick,
  shaded,
}: IModalShadeProps) => {
  /* Adds a small reveal animation */
  const [reveal, setReveal] = useState(false);
  useEffect(() => {
    setReveal(true);
  }, []);

  const handleOnClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (!(evt.target === evt.currentTarget)) return;

    onClick();
  };

  return (
    <StyledModalShade $reveal={reveal} onClick={handleOnClick} $shaded={shaded}>
      {children}
    </StyledModalShade>
  );
};
