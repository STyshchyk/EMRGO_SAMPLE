import { FC } from "react";
import { useNavigate } from "react-router-dom";

import * as Styles from "./BackButton.styles";
import { IBackButtonProps } from "./BackButton.types";

export const BackButton: FC<IBackButtonProps> = ({ url }: IBackButtonProps) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(url);
  };

  return (
    <Styles.BackButton onClick={goBack}>
      <Styles.ArrowBackwardIcon />
    </Styles.BackButton>
  );
};
