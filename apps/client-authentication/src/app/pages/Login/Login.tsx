import { FC } from "react";

import { AuthWrapper } from "../../components/AuthWrapper";
import { LoginComponent } from "./Login.component";
import { LoginProvider } from "./Login.provider";
import { ILoginProps } from "./Login.types";

export const Login: FC<ILoginProps> = (props: ILoginProps) => {
  return (
    <AuthWrapper>
      <LoginProvider>
        <LoginComponent />
      </LoginProvider>
    </AuthWrapper>
  );
};
