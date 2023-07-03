import { FC } from "react";



import { CreatePasswordComponent } from "./CreatePassword.component";
import { CreatePasswordProvider } from "./CreatePassword.provider";
import { ICreatePasswordProps } from "./CreatePassword.types";
import { AuthWrapper } from "../../../components/AuthWrapper";

export const CreatePassword: FC<ICreatePasswordProps> = ({}: ICreatePasswordProps) => {
  return (
    <CreatePasswordProvider>
      <AuthWrapper>
        <CreatePasswordComponent />
      </AuthWrapper>
    </CreatePasswordProvider>
  );
};
