import { FC } from "react";

import { AuthWrapper } from "../AuthWrapper";
import * as Styles from "./IdentificationForm.styles";
import { IIdentificationFormProps } from "./IdentificationForm.types";

export const IdentificationForm: FC<IIdentificationFormProps> = ({ onSubmit, id, sessionId }) => {
  return (
    <AuthWrapper hideFAQ>
      <Styles.IdentificationForm>
        <Styles.FormWidget
          id={id}
          hidden={{ sessionId }}
          onSubmit={onSubmit}
          autoFocus
        />
      </Styles.IdentificationForm>
    </AuthWrapper>
  );
};
