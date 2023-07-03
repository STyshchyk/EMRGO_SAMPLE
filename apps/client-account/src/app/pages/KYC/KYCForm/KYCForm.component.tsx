import { FC } from "react";

import { ensureNotNull } from "@emrgo-frontend/utils";

import { IdentificationForm } from "../../../components/IdentificationForm";
import { useKYCFormContext } from "./KYCForm.provider";
import { IKYCFormProps } from "./KYCForm.types";

export const KYCFormComponent: FC<IKYCFormProps> = (props: IKYCFormProps) => {
  const { onSubmit, typeFormId, sessionId } = ensureNotNull(useKYCFormContext());

  return <IdentificationForm id={typeFormId} sessionId={sessionId} onSubmit={onSubmit} />;
};
