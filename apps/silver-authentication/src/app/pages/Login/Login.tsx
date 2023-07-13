import { FC } from "react";

import { AuthWrapper } from "../../components/AuthWrapper";
import { LoginComponent } from "./Login.component";
import { LoginProvider } from "./Login.provider";
import { ILoginProps } from "./Login.types";

export const Login: FC<ILoginProps> = ({}: ILoginProps) => {
  return (
    <LoginProvider>
      <AuthWrapper>
        <LoginComponent />
      </AuthWrapper>
    </LoginProvider>
  );
};
