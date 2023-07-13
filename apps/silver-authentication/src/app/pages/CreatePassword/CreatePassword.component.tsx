import { FC } from "react";
import { useParams } from "react-router-dom";

import { Button, Checkbox, Input, Logo, useToast } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { useMutation } from "@tanstack/react-query";

import { Heading, OneCol, OneColCheck, SubHeading } from "../../components/Form";
import { useCreatePasswordContext } from "./CreatePassword.provider";
import { createPassword } from "./CreatePassword.services";
import * as Styles from "./CreatePassword.styles";
import { ICreatePasswordProps } from "./CreatePassword.types";

export const CreatePasswordComponent: FC<ICreatePasswordProps> = ({}: ICreatePasswordProps) => {
  const { form, showPassword, setShowPassword } = ensureNotNull(useCreatePasswordContext());
  return (
    <Styles.CreatePasswordForm onSubmit={form.handleSubmit}>
      <Logo />

      <div>
        <Heading>Create your password</Heading>
        <SubHeading>Keep your Emrgo account safe with a secure password.</SubHeading>
      </div>

      <OneCol>
        <Input
          label="Password"
          id="password"
          type={showPassword ? "text" : "password"}
          helperText="Use 8 or more characters with a mix of letters, numbers & symbols."
          {...form.getFieldProps("password")}
          error={form.touched.password && form.errors.password}
          // TODO: FIX this
        />
      </OneCol>

      <OneCol>
        <Input
          label="Confirm Password"
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          {...form.getFieldProps("confirmPassword")}
          error={form.touched.confirmPassword && form.errors.confirmPassword}
        />
      </OneCol>

      <OneColCheck>
        <Checkbox onChange={({ target }) => setShowPassword(target.checked)}>
          Show password
        </Checkbox>
      </OneColCheck>

      <OneCol>
        <Button size="large" disabled={!form.isValid}>
          Next
        </Button>
      </OneCol>
    </Styles.CreatePasswordForm>
  );
};
