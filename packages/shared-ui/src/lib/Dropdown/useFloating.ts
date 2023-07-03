import { autoUpdate, flip, offset, shift, useFloating as useFloatingUi } from "@floating-ui/react";

export const useFloating = () => {
  return useFloatingUi({
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
  });
};
