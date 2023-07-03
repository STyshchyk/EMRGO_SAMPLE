import { PropsWithChildren } from "react";

import { TAsComponentProps } from "@emrgo-frontend/types";

export type TTabProps<AsComponent> = PropsWithChildren &
  TAsComponentProps<AsComponent> & {
    value: string;
  };
