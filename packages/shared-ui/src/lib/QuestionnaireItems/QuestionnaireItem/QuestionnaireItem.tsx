import { FC } from "react";

import * as Styles from "./QuestionnaireItem.styles";
import { IQuestionnaireItemProps } from "./QuestionnaireItem.types";

export const QuestionnaireItem: FC<IQuestionnaireItemProps> = ({
  children,
  timeRemaining,
  variant = "default",
  completed,
}) => {
  return (
    <Styles.QuestionnaireItem $variant={variant}>
      {children}
      {!completed && <Styles.RemainingTime>{timeRemaining}</Styles.RemainingTime>}
      {completed && <Styles.CompletedIcon />}
    </Styles.QuestionnaireItem>
  );
};
