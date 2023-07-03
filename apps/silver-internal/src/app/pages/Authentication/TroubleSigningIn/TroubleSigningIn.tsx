import { FC } from "react";

import { TroubleSigningInComponent } from "./TroubleSigningIn.component";
import { TroubleSigningInProvider } from "./TroubleSigningIn.provider";
import { ITroubleSigningInProps } from "./TroubleSigningIn.types";
import { AuthWrapper } from "../../../components/AuthWrapper";

export const TroubleSigningIn: FC<ITroubleSigningInProps> = ({}: ITroubleSigningInProps) => {
  const parentUrl = "/login";

  return (
    <TroubleSigningInProvider>
      <AuthWrapper backUrl={parentUrl} hideFAQ>
        <TroubleSigningInComponent />
      </AuthWrapper>
    </TroubleSigningInProvider>
  );
};
