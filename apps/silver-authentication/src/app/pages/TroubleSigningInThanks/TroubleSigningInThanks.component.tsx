import { FC } from "react";

import { Disclaimer, Logo } from "@emrgo-frontend/shared-ui";

import { SubHeading } from "../../components/Form";
import * as Styles from "./TroubleSigningInThanks.styles";
import { ITroubleSigningInThanksProps } from "./TroubleSigningInThanks.types";

export const TroubleSigningInThanksComponent: FC<
  ITroubleSigningInThanksProps
> = ({}: ITroubleSigningInThanksProps) => {
  return (
    <Styles.TroubleSigningInThanks>
      <Logo />

      <SubHeading>Thank you for your submission.</SubHeading>

      <SubHeading>We will review your ticket and get back to you within 24 hours.</SubHeading>

      <Styles.Spacer />

      <Disclaimer />
    </Styles.TroubleSigningInThanks>
  );
};
