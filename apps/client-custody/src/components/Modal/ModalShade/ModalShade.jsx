import React, { FC, useEffect, useState } from "react";

import StyledModalShade from "./ModalShade.styles";

const ModalShade = ({ children, onClick, shaded }) => {
  /* Adds a small reveal animation */
  const [reveal, setReveal] = useState(false);
  useEffect(() => {
    setReveal(true);
  }, []);

  const handleOnClick = (evt) => {
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

export default ModalShade;
