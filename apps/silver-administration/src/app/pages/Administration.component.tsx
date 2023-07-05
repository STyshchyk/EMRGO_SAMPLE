import * as React from "react";
import { FC } from "react";
import { Link, Outlet } from "react-router-dom";

import { ensureNotNull } from "@emrgo-frontend/utils";

import { useAdministrationContext } from "./Administration.provider";
import * as Styles from "./Administration.styles";
import { IAdministrationProps } from "./Administration.types";


export const AdministrationComponent: FC<IAdministrationProps> = ({}: IAdministrationProps) => {
  return (
    <Styles.Administration>
      <Outlet />
    </Styles.Administration>
  );
};
