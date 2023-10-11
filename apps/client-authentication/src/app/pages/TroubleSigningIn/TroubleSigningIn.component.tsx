import { FC } from "react";

import { Button, Input,Logo } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { Heading, OneCol, SubHeading } from "../../components/Form";
import { useTroubleSigningInContext } from "./TroubleSigningIn.provider";
import * as Styles from "./TroubleSigningIn.styles";
import { ITroubleSigningInProps } from "./TroubleSigningIn.types";

export const TroubleSigningInComponent: FC<ITroubleSigningInProps> = (
  props: ITroubleSigningInProps
) => {
  const { form } = ensureNotNull(useTroubleSigningInContext());

  return (
    <Styles.TroubleSigningIn onSubmit={form.handleSubmit}>
      <Logo />

      <div>
        <Heading>Trouble signing in?</Heading>

        <SubHeading>
          Describe your issue with logging in below and click to raise a support ticket. We will
          contact you on your registered email address.
        </SubHeading>
      </div>

      <OneCol>
        <Input
          label="Email Address"
          id="email"
          valid={form.touched.email && !form.errors.email}
          {...form.getFieldProps("email")}
          error={form.touched.email && form.errors.email}
        />
      </OneCol>

      <OneCol>
        <Styles.TextBox 
          id="desc"           
          {...form.getFieldProps("desc")}
          rows={9}
          placeholder="Describe your login issue in a few words here..." 
        />
      </OneCol>

      <OneCol>
        <Button type='submit' size="large">Raise support ticket</Button>
      </OneCol>
    </Styles.TroubleSigningIn>
  );
};
