import { FC } from "react";

import * as Styles from "./QuestionnaireItems.styles";
import { IQuestionnaireItemsProps } from "./QuestionnaireItems.types";

export const QuestionnaireItems: FC<IQuestionnaireItemsProps> = ({ children }) => {
  return <Styles.QuestionnaireItems>{children}</Styles.QuestionnaireItems>;
};
