import { FC } from "react";

import { ensureNotNull } from "~/utils";

import { KYCForm } from "../../components/KYCForm";
import { useKYCKeyIndividualsContext } from "./KYCKeyIndividuals.provider";
import { IKYCKeyIndividualsProps } from "./KYCKeyIndividuals.types";

export const KYCKeyIndividualsComponent: FC<
  IKYCKeyIndividualsProps
> = ({}: IKYCKeyIndividualsProps) => {
  const { onSubmit, typeFormId, entityId } = ensureNotNull(useKYCKeyIndividualsContext());

  return <KYCForm id={typeFormId} entityId={entityId} onSubmit={onSubmit} />;
};
