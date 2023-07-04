import { IMFA } from "../../services";
import { ITwoFAstepperProps } from "../TwoFAstepper";

export interface ITwoFactorAuthProps extends IMFA, ITwoFAstepperProps {
  position?: string;
}
