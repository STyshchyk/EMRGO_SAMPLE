import { FC } from "react";

import { TooltipContent, TooltipHeader, TooltipTitle } from "@emrgo-frontend/shared-ui";

import { IDashboardTemporaryTooltipContentProps } from "./DashboardTemporaryTooltipContent.types";

// TODO: This is a temporary component used purely for demo purposes in order to show
// some content in application tooltips. When the real content available this component
// should be replaced with appropriate implementations
export const DashboardTemporaryTooltipContent: FC<IDashboardTemporaryTooltipContentProps> = ({
  header,
  children,
}) => {
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
