import { Children, cloneElement, FC, useId } from "react";

import { FloatingPortal } from "@floating-ui/react";

import { TooltipContext } from "./Tooltip.context";
import * as Styles from "./Tooltip.styles";
import { ITooltipProps } from "./Tooltip.types";
import { useTooltip } from "./useTooltip";

export const Tooltip: FC<ITooltipProps> = ({
  children,
  content,
  enableTooltip = true,
  className,
}) => {
  const key = useId();
  const tooltip = useTooltip();
  const { refs, x, y, strategy, isOpen, getReferenceProps, getFloatingProps } = tooltip;
  const element = Children.only(children);

  return (
    <>
      {cloneElement(element, {
        ref: refs.setReference,
        ...getReferenceProps(),
        style: { cursor: "pointer" },
        // NOTE: This is a hack to resolve the issue explained here
        // https://github.com/vitejs/vite-plugin-react/issues/4
        key: element.key ?? key,
      })}

      {isOpen && enableTooltip && (
        <FloatingPortal>
          <TooltipContext.Provider value={tooltip}>
            <Styles.Tooltip
              $displayState={typeof content === "string"}
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                zIndex: 15,
              }}
              {...getFloatingProps()}
              className={className}
            >
              {content}
            </Styles.Tooltip>
          </TooltipContext.Provider>
        </FloatingPortal>
      )}
    </>
  );
};
