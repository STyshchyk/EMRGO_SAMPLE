import { FC } from "react";

import { AuthWrapper } from "../../components/AuthWrapper";
import { CreatePasswordComponent } from "./CreatePassword.component";
import { CreatePasswordProvider } from "./CreatePassword.provider";
import { ICreatePasswordProps } from "./CreatePassword.types";

export const CreatePassword: FC<ICreatePasswordProps> = ({}: ICreatePasswordProps) => {
  return (
    <CreatePasswordProvider>
      <AuthWrapper>
        <CreatePasswordComponent />
      </AuthWrapper>
    </CreatePasswordProvider>
  );
};
