import { FC } from "react";

import { ensureNotNull } from "~/utils";

import { KYCForm } from "../../components/KYCForm";
import { useKYCSupportingDocumentsContext } from "./KYCSupportingDocuments.provider";
import { IKYCSupportingDocumentsProps } from "./KYCSupportingDocuments.types";

export const KYCSupportingDocumentsComponent: FC<
  IKYCSupportingDocumentsProps
> = ({}: IKYCSupportingDocumentsProps) => {
  const { onSubmit, typeFormId, entityId } = ensureNotNull(useKYCSupportingDocumentsContext());

  return <KYCForm id={typeFormId} entityId={entityId} onSubmit={onSubmit} />;
};
