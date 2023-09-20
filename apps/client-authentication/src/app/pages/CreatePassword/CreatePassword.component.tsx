import { FC } from "react";

import { Button, Checkbox, Input, Logo } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { Heading, OneCol, OneColCheck, SubHeading } from "../../components/Form";
import { useCreatePasswordContext } from "./CreatePassword.provider";
import * as Styles from "./CreatePassword.styles";
import { ICreatePasswordProps } from "./CreatePassword.types";

export const CreatePasswordComponent: FC<ICreatePasswordProps> = (props: ICreatePasswordProps) => {
  const { form, showPassword, setShowPassword, type } = ensureNotNull(useCreatePasswordContext());

  return (
    <Styles.CreatePasswordForm onSubmit={form.handleSubmit}>
      <Logo />

      <div>
        <Heading>{type === "reset" ? "Reset" : "Create"} your password</Heading>
        <SubHeading>Keep your Emrgo account safe with a secure password.</SubHeading>
      </div>

      <OneCol>
        <Input
          label="Password"
          id="password"
          type={showPassword ? "text" : "password"}
          valid={form.touched.password && !form.errors.password}
          helperText="Use 10 or more characters with a mix of letters, numbers & symbols."
          {...form.getFieldProps("password")}
          error={form.touched.password && form.errors.password}
        />
      </OneCol>

      <OneCol>
        <Input
          label="Confirm Password"
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          valid={form.touched.confirmPassword && !form.errors.confirmPassword}
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
