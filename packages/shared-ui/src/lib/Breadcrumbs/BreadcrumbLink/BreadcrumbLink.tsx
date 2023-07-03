import { ComponentType } from "react";

import * as Styles from "./BreadcrumbLink.styles";
import { TBreadcrumbLinkProps } from "./BreadcrumbLink.types";

export const BreadcrumbLink = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AsComponent extends JSX.IntrinsicElements | ComponentType<any> | undefined = undefined
>({
  isCurrent,
  ...linkProps
}: TBreadcrumbLinkProps<AsComponent>) => {
  const ariaCurrent = isCurrent ? "page" : undefined;

  return <Styles.BreadcrumbLink {...linkProps} $isCurrent={isCurrent} aria-current={ariaCurrent} />;
};
