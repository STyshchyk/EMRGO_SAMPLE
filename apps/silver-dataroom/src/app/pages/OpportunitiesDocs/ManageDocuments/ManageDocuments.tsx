import { FC } from "react";

import { ManageDocumentsComponent } from "./ManageDocuments.component";
import { IManageDocumentsProps } from "./ManageDocuments.types";

export const ManageDocuments: FC<IManageDocumentsProps> = ({}: IManageDocumentsProps) => {
  return <ManageDocumentsComponent />;
};
