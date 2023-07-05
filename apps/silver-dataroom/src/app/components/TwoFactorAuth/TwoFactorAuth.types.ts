import { ITwoFAstepperProps } from "../TwoFAstepper";
import { IMFA } from "../../services";

export interface ITwoFactorAuthProps extends IMFA, ITwoFAstepperProps {
  position?: string;
}
