import { FC } from "react";

import { TroubleSigningInThanksComponent } from "./TroubleSigningInThanks.component";
import { TroubleSigningInThanksProvider } from "./TroubleSigningInThanks.provider";
import { ITroubleSigningInThanksProps } from "./TroubleSigningInThanks.types";
import { AuthWrapper } from "../../../components/AuthWrapper";

export const TroubleSigningInThanks: FC<
  ITroubleSigningInThanksProps
> = ({}: ITroubleSigningInThanksProps) => {
  const parentUrl = "/trouble-signing-in";

  return (
    <TroubleSigningInThanksProvider>
      <AuthWrapper backUrl={parentUrl} hideFAQ>
        <TroubleSigningInThanksComponent />
      </AuthWrapper>
    </TroubleSigningInThanksProvider>
  );
};
