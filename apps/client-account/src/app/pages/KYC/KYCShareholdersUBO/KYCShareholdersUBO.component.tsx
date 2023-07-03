import { FC } from "react";

import { ensureNotNull } from "~/utils";

import { KYCForm } from "../../components/KYCForm";
import { useKYCShareholdersUBOContext } from "./KYCShareholdersUBO.provider";
import { IKYCShareholdersUBOProps } from "./KYCShareholdersUBO.types";

export const KYCShareholdersUBOComponent: FC<
  IKYCShareholdersUBOProps
> = ({}: IKYCShareholdersUBOProps) => {
  const { onSubmit, typeFormId, entityId } = ensureNotNull(useKYCShareholdersUBOContext());

  return <KYCForm id={typeFormId} entityId={entityId} onSubmit={onSubmit} />;
};
