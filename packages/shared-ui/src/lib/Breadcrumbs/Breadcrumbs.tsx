import { Children, FC } from "react";

import { ChevronRightIcon } from "../Icons";
import * as Styles from "./Breadcrumbs.styles";
import { IBreadcrumbsProps } from "./Breadcrumbs.types";

export const Breadcrumbs: FC<IBreadcrumbsProps> = ({ children }: IBreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb">
      <Styles.Breadcrumbs>
        {Children.map(children, (child, index) => (
          <>
            {index !== 0 && (
              <Styles.BreadcrumbItem>
                <Styles.BreadCrumbIcon>
                  <ChevronRightIcon />
                </Styles.BreadCrumbIcon>
              </Styles.BreadcrumbItem>
            )}

            <Styles.BreadcrumbItem>{child}</Styles.BreadcrumbItem>
          </>
        ))}
      </Styles.Breadcrumbs>
    </nav>
  );
};
