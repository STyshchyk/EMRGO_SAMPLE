import { FC } from "react";

import * as Styles from "./OnboardUser.styles";
import { IOnboardUserProps } from "./OnboardUser.types";

export const OnboardUserComponent: FC< IOnboardUserProps> = ({children}: IOnboardUserProps) => {
  return <Styles.OnboardUser>OnboardUser</Styles.OnboardUser>
};
