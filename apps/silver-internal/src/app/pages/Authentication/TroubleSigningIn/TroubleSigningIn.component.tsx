import { FC } from "react";

import { Button, Logo, TextBox } from "@emrgo-frontend/shared-ui";

import { ensureNotNull } from "@emrgo-frontend/utils";

import { Heading, OneCol, SubHeading } from "../../../components/Form";
import { useTroubleSigningInContext } from "./TroubleSigningIn.provider";
import * as Styles from "./TroubleSigningIn.styles";
import { ITroubleSigningInProps } from "./TroubleSigningIn.types";

export const TroubleSigningInComponent: FC<
  ITroubleSigningInProps
> = ({}: ITroubleSigningInProps) => {
  const { onSubmit } = ensureNotNull(useTroubleSigningInContext());

  return (
    <Styles.TroubleSigningIn onSubmit={onSubmit}>
      <Logo />

      <div>
        <Heading>Trouble signing in?</Heading>

        <SubHeading>
          Describe your issue with logging in below and click to raise a support ticket. We will
          contact you on your registered email address.
        </SubHeading>
      </div>

      <Styles.TextBox rows={9} placeholder="Describe your login issue in a few words here..." />

      <OneCol>
        <Button size="large">Raise support ticket</Button>
      </OneCol>
    </Styles.TroubleSigningIn>
  );
};
