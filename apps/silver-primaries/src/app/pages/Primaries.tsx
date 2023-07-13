import { FC } from "react";

import { PrimariesComponent } from "./Primaries.component";
import { PrimariesProvider } from "./Primaries.provider";
import { IPrimariesProps } from "./Primaries.types";

export const Primaries: FC<IPrimariesProps> = ({}: IPrimariesProps) => {
  return (
    <PrimariesProvider>
      <PrimariesComponent />
    </PrimariesProvider>
  );
};
