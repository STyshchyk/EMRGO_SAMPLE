import { FC } from "react";

import { Button, Checkbox, FormikInput, Logo } from "@emrgo-frontend/shared-ui";
import { ensureNotNull, processAPIErrors } from "@emrgo-frontend/utils";

import { Heading, OneCol, OneColCheck, SubHeading } from "../../components/Form";
import { LoginHelp } from "../../components/LoginHelp";
import { useLoginContext } from "./Login.provider";
import * as Styles from "./Login.styles";
import { ILoginFormValues, ILoginProps } from "./Login.types";

export const LoginComponent: FC<ILoginProps> = (props: ILoginProps) => {
  const { form, showPassword, setShowPassword, isError, error } = ensureNotNull(useLoginContext());

  return (
    <Styles.LoginForm onSubmit={form.handleSubmit}>
      <Logo />

      <div>
        <Heading>Login</Heading>
        <SubHeading>You&apos;re now ready to access Emrgo.</SubHeading>
      </div>

      <OneCol>
        <FormikInput<ILoginFormValues>
          label="Email Address"
          maxWidth={458}
          form={form}
          id="email"
        />
      </OneCol>

      <OneCol>
        <FormikInput<ILoginFormValues>
          label="Password"
          maxWidth={458}
          form={form}
          id="password"
          type={showPassword ? "text" : "password"}
        />
      </OneCol>

      <OneColCheck>
        <Checkbox
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowPassword(e.target.checked)}
        >
          Show password
        </Checkbox>
      </OneColCheck>

      <OneCol>
        <Button size="large" disabled={!form.isValid} type="submit">
          Submit
        </Button>
      </OneCol>
      {isError && (
        <Styles.Error>
          <Styles.ErrorIcon />
          <span>{processAPIErrors(error)}</span>
        </Styles.Error>
      )}

      <Styles.Spacer />

      <LoginHelp />
    </Styles.LoginForm>
  );
};
