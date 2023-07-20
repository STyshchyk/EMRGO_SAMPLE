import { FC } from "react";

import { TooltipContent, TooltipHeader, TooltipTitle } from "@emrgo-frontend/shared-ui";

import { ISilverDashboardTemporaryTooltipContentProps } from "./SilverDashboardTemporaryTooltipContent.types";

// TODO: This is a temporary component used purely for demo purposes in order to show
// some content in application tooltips. When the real content available this component
// should be replaced with appropriate implementations
export const SilverDashboardTemporaryTooltipContent: FC<
  ISilverDashboardTemporaryTooltipContentProps
> = ({ header, children }) => {
  return (
    <>
      {header && (
        <TooltipHeader>
          <TooltipTitle>{header}</TooltipTitle>
        </TooltipHeader>
      )}
      <TooltipContent>{children}</TooltipContent>
    </>
  );
};
