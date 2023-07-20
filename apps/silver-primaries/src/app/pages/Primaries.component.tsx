import * as React from "react";
import { FC } from "react";
import { Outlet } from "react-router-dom";

import { ensureNotNull } from "@emrgo-frontend/utils";

import { usePrimariesContext } from "./Primaries.provider";
import * as Styles from "./Primaries.styles";
import { IPrimariesProps } from "./Primaries.types";

export const PrimariesComponent: FC<IPrimariesProps> = ({}: IPrimariesProps) => {
  const { numberOfNewTradeOpportunities } = ensureNotNull(usePrimariesContext());
  return (
    <Styles.Primaries>
      <Outlet />
    </Styles.Primaries>
  );
};
