import { FC } from "react";

import { TooltipContent, TooltipHeader, TooltipTitle } from "../../Tooltip";
import { IDashboardTemporaryTooltipContentProps } from "./DashboardTemporaryTooltipContent.types";

// TODO: This is a temporary component used purely for demo purposes in order to show
// some content in application tooltips. When the real content available this component
// should be replaced with appropriate implementations
export const DashboardTemporaryTooltipContent: FC<IDashboardTemporaryTooltipContentProps> = (
  props
) => {
  return (
    <>
      <TooltipHeader>
        <TooltipTitle>Header</TooltipTitle>
      </TooltipHeader>
      <TooltipContent>
        Lorem ipsum dolor sit amet, consectetur adip elit. Quisque consequat ipsum quis nibh
        feugiat, at pretium ante feugiat.
      </TooltipContent>
    </>
  );
};
