import { FC } from "react";

import { ensureNotNull } from "@emrgo-frontend/utils";

import { IdentificationForm } from "../../../components/IdentificationForm";
import { useInvestmentProfileFormContext } from "./InvestmentProfileForm.provider";
import { IInvestmentProfileFormProps } from "./InvestmentProfileForm.types";

export const InvestmentProfileFormComponent: FC<IInvestmentProfileFormProps> = (
  props: IInvestmentProfileFormProps
) => {
  const { onSubmit, typeFormId, sessionId } = ensureNotNull(useInvestmentProfileFormContext());

  return <IdentificationForm id={typeFormId} sessionId={sessionId} onSubmit={onSubmit} />;
};
