import { useState } from "react";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";

export const useTooltip = () => {
  const [isOpen, setIsOpen] = useState(false);

  const floating = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "right-start",
    middleware: [offset(4), shift(), flip({ fallbackAxisSideDirection: "start" })],
  });

  const click = useClick(floating.context);
  const dismiss = useDismiss(floating.context);
  const role = useRole(floating.context, { role: "tooltip" });

  const interactions = useInteractions([click, dismiss, role]);

  return { ...floating, ...interactions, isOpen, setIsOpen };
};
