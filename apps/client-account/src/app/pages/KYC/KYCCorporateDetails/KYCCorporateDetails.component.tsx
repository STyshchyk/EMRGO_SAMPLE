import { FC } from "react";

import { ensureNotNull } from "~/utils";

import { KYCForm } from "../../components/KYCForm";
import { useKYCCorporateDetailsContext } from "./KYCCorporateDetails.provider";
import { IKYCCorporateDetailsProps } from "./KYCCorporateDetails.types";

export const KYCCorporateDetailsComponent: FC<
  IKYCCorporateDetailsProps
> = ({}: IKYCCorporateDetailsProps) => {
  const { onSubmit, typeFormId, entityId } = ensureNotNull(useKYCCorporateDetailsContext());

  return <KYCForm id={typeFormId} entityId={entityId} onSubmit={onSubmit} />;
};
