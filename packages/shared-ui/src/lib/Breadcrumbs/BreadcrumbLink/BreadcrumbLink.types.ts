import { AnchorHTMLAttributes } from "react";

import { TAsComponentProps } from "@emrgo-frontend/types";

export type TBreadcrumbLinkProps<AsComponent> = (AsComponent extends undefined
  ? AnchorHTMLAttributes<HTMLAnchorElement>
  : TAsComponentProps<AsComponent>) & {
  isCurrent?: boolean;
};
