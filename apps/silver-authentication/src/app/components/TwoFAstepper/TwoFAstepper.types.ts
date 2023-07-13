import { IMFA } from "../../services";

export interface ITwoFAstepperProps extends IMFA {
  mode: MFATYPE;
}
export enum MFATYPE {
  verify,
  enable,
}
